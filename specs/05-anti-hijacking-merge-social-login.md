# SPEC 05 — Anti pre-hijacking en merge de social login con Google

> **Status:** Aprobado
> **Depende de:** SPEC 04
> **Fecha:** 2026-11-12
> **Objetivo:** Evitar que una cuenta plantada con el email de otra persona (registrada antes por un atacante) quede bajo control del atacante cuando la víctima la reclama vía login con Google.

## Por qué existe este spec

`register-user.ts` crea una cuenta con cualquier email + password sin exigir verificarlo antes. Si un atacante se registra con el email de una víctima (que no es suyo), queda una cuenta con `isEmailVerified: false` y password elegida por el atacante.

Cuando la víctima real usa "Iniciar sesión con Google" con ese mismo email, `social-login-with-google.ts` (líneas 26-29) hace `findUserByEmail`, encuentra la cuenta plantada, y la reutiliza directo para loguear a la víctima — sin chequear `isEmailVerified` ni invalidar el password que puso el atacante. El atacante sigue pudiendo loguearse por `/api/auth/login` con ese password mientras la víctima cree estar usando su propia cuenta. Es el patrón conocido como pre-account-hijacking, variante "classic federation merge".

Este spec cierra ese hueco reusando la máquina de "usuario sin password" que ya construyó SPEC 04: login rechaza con mensaje genérico cuando `password === null`, y `POST /api/auth/password/set` permite setear una password nueva.

## Scope

**Incluye:**

- En `social-login-with-google.ts`: cuando el merge encuentra una cuenta existente con `isEmailVerified === false`, "reclamarla" antes de emitir el token — anular el password plantado (`null`) y marcar `isEmailVerified: true`, ya que Google acaba de verificar la titularidad real del email.
- Nuevo factory estático `UpdateUserDto.reclaimUnverifiedAccount(id)` (mismo patrón que `UpdateUserDto.markEmailVerified`), para construir el DTO interno de ese update sin exponer `password`/`isEmailVerified` como input de usuario.

**Fuera de alcance (para otro spec si hace falta):**

- Campo `provider`/`authProvider` o entidad `AuthIdentity`. Se re-evaluó en esta conversación específicamente para este caso (cuenta registrada normal + login posterior con Google) y sigue sin ser necesario: el fix de este spec no depende de saber "qué proveedor creó la cuenta", solo de `isEmailVerified`. Se mantiene la decisión de SPEC 04 de no agregarlo.
- Flujo de recuperación de cuenta ("forgot password") para usuarios sin Google que quedaron con su email tomado por un atacante y no tienen forma de reclamarlo vía login social. Es una feature de recuperación de cuenta distinta, no un fix del merge de social login. Queda como riesgo residual documentado abajo.
- Tests automatizados — descartado explícitamente para este spec (decisión del usuario en esta conversación).
- Cualquier cambio al caso donde `isEmailVerified` ya es `true` (cuenta legítimamente verificada o creada originalmente por Google) — ese merge sigue exactamente igual que hoy, sin reclamo.

## Modelo de datos

No se agregan colecciones ni campos nuevos. Se reutilizan `UserModel`/`UserEntity`/`UpdateUserDto` existentes. La única pieza nueva es un factory estático sobre `UpdateUserDto`, no un campo nuevo en el schema.

## Plan de implementación

1. **`src/domain/dtos/auth/update-user-dto.ts`** — agregar factory estático, mismo patrón que `markEmailVerified`:
   ```ts
   // Uso interno (social login): reclama una cuenta plantada/no verificada, anulando
   // cualquier password previo ya que el dueño real recién se verificó vía Google.
   static reclaimUnverifiedAccount ( id : string ) : UpdateUserDto {
       return new UpdateUserDto( id, undefined, undefined, undefined, null, undefined, true );
   }
   ```
   Paso autocontenido: no cambia comportamiento hasta que se use en el paso 2.

2. **`src/domain/use-cases/auth/social-login-with-google.ts`** — tras el `findUserByEmail`, reclamar la cuenta si no está verificada, antes de generar el token:
   ```ts
   let userExists = await this.authRepository.findUserByEmail( socialResponseData.user.email );
   if( !userExists ) {
       // ... sin cambios: crea el usuario nuevo
   } else if( !userExists.isEmailVerified ) {
       userExists = await this.authRepository.updateUser(
           UpdateUserDto.reclaimUnverifiedAccount( userExists.id )
       );
   }
   ```
   Reusa `AuthRepository.updateUser` existente (ya hace `findByIdAndUpdate(..., { new: true })` con populate) — sin cambios de contrato en repositorio ni datasource.

## Criterios de aceptación

- [ ] Atacante se registra (`POST /api/auth/register`) con el email de la víctima + password propia → cuenta queda con `isEmailVerified: false`.
- [ ] Víctima hace login con Google (`POST /api/auth/google` o endpoint equivalente) con ese mismo email → responde 200, `isEmailVerified: true` en la respuesta, no se crea una cuenta duplicada.
- [ ] Tras ese login, el password original (el del atacante) queda invalidado: `POST /api/auth/login` con ese password responde 400 `'Chequee las credenciales e intente nuevamente.'` (mismo guard de SPEC 04), no 200.
- [ ] Víctima puede usar `POST /api/auth/password/set` con su JWT para setear su propia password.
- [ ] Caso normal sin regresión: usuario con cuenta ya verificada (`isEmailVerified: true`, con o sin password) hace login con Google con el mismo email → se loguea a la misma cuenta, password e `isEmailVerified` quedan intactos, sin reclamo.
- [ ] `npm run build` compila sin errores de tipos.

## Decisiones

- **Sí:** reusar `password === null` + `isEmailVerified` como única señal para detectar "cuenta plantada reclamable", en vez de agregar un campo nuevo. Consistente con la decisión de SPEC 04 de no introducir `provider`/`AuthIdentity`.
- **Sí:** el reclamo anula el password existente en vez de solo bloquear el login del atacante por otro medio. Es la forma más simple de cortar el acceso sin tocar el flujo de login ni agregar un nuevo estado — la cuenta reclamada queda idéntica a una cuenta Google-only normal (que SPEC 04 ya sabe manejar).
- **No:** flujo de recuperación de cuenta para víctimas sin Google. Queda fuera, es una feature distinta (ver Riesgos).
- **No:** tests automatizados para este spec — decisión explícita del usuario.
- **No:** campo `provider`/`AuthIdentity` — reconfirmado como innecesario para este caso puntual.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Víctima sin cuenta de Google cuyo email fue tomado por un atacante no tiene forma de reclamarlo (no existe flujo de "forgot password") | Fuera de alcance de este spec — requiere una feature de recuperación de cuenta aparte |
| Reclamo ocurre en cada login con Google mientras `isEmailVerified` sea `false`, no solo la primera vez — si por algún bug externo una cuenta quedara verificada en `false` después de un reclamo legítimo, se repetiría el nuleo de password | El reclamo siempre deja `isEmailVerified: true`, así que no se repite en logins subsecuentes salvo que algo externo la revierta a `false` (no hay código actual que haga eso) |

## Lo que **no** está en este spec

- Campo `provider` o entidad `AuthIdentity`.
- Flujo de recuperación de cuenta ("forgot password") para usuarios sin Google.
- Tests automatizados.
- Cualquier cambio al caso donde `isEmailVerified` ya es `true`.

Cada uno de estos, si hace falta, va en su propio spec.
