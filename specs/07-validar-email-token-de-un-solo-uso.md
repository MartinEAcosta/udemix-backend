# SPEC 07 — Validar email con token de un solo uso

> **Status:** Draft
> **Depende de:** SPEC 06
> **Fecha:** 2026-11-16
> **Objetivo:** Reusar `SingleUseToken` (SPEC 06) para que `validate-email` también invalide su token tras un solo uso, en vez de depender solo de la expiración del JWT.

## Por qué existe este spec

`send-email-validation-link.ts` tiene hoy el mismo gap que tenía `forgot-password.ts` antes de SPEC 06: firma un JWT (`generateToken({email})`, línea 27) y lo manda por mail, sin persistir nada. Peor aún, no pasa `duration`, así que cae al default oculto de `'2h'` del adapter (`jwt.adapter.ts`) — nadie que lea el use case ve ese número.

`validate-email.ts` solo verifica la firma/expiración del JWT y decodifica `email` — no hay lookup de ningún token guardado, ni forma de invalidar un link ya usado. Además tiene un bug independiente: no rechequea `user.isEmailVerified` antes de volver a marcarlo verificado, a pesar de que `SendEmailValidationLink` sí rechaza emitir un link nuevo si el usuario ya está verificado (línea 25).

Como SPEC 06 ya deja `SingleUseToken` diseñado con un campo `purpose` genérico para este caso exacto, este spec no duplica infraestructura: solo agrega el valor `'email_verification'` y cablea los dos use cases existentes.

## Scope

**Incluye:**

- Agregar `'email_verification'` al union type `SingleUseTokenPurpose` (`src/domain/entities/single-use-token.entity.ts`, de SPEC 06) y al `enum` del esquema Mongoose (`single-use-token.model.ts`).
- `send-email-validation-link.ts`: inyectar `singleUseTokenRepository`, generar `jti` (`crypto.randomUUID()`), pasar `duration: '2h'` **explícito** a `generateToken` (hoy es implícito), llamar a `create()` con `user_id`/`jti`/`purpose: 'email_verification'`/`expires_at` antes de mandar el mail, y embeber el `jti` en el payload del token.
- `validate-email.ts`: inyectar `singleUseTokenRepository`, `validateToken<{email, jti}>` → `findValidByJti(jti, 'email_verification')` (si no existe: 401 token inválido/ya usado) → `findUserByEmail(payload.email)` → **guarda nueva**: si `user.isEmailVerified` ya es `true`, responder 400 sin volver a actualizar ni consumir el token → si no, `updateUser(markEmailVerified)` + `consume(id)` → devuelve `true`.
- `email-controller.ts`: agregar `singleUseTokenRepository` al constructor, pasarlo a `new SendEmailValidationLink(...)` y `new ValidateEmail(...)`.
- `dependency-container.ts`: pasar la instancia de `SingleUseTokenRepositoryImpl` (ya creada por SPEC 06) también al construir `EmailController`.

**Fuera de alcance (para otro spec si hace falta):**

- Duración de los tokens de password-reset (ver SPEC 06).
- Cambiar la ruta `POST /validate-email/:token` o el formato del link (`/auth/verify-email/:token`).
- Rate limiting de reenvío de `send-validation-email`.
- Tests automatizados — sin pedido explícito, mismo precedente que SPEC 04/05/06.
- Invalidar tokens de verificación previos no usados al pedir un reenvío (mismo criterio que SPEC 06 para password-reset).

## Modelo de datos

No se agrega ninguna colección nueva. Se reusa `SingleUseToken` de SPEC 06; el único cambio de esquema es agregar `'email_verification'` al union type y al `enum` de `purpose`:

```ts
// src/domain/entities/single-use-token.entity.ts (ajuste sobre SPEC 06)
export type SingleUseTokenPurpose = 'password_reset' | 'email_verification';
```

El payload del JWT que firma `SendEmailValidationLink` pasa de `{ email }` a `{ email, jti }`, con `duration: '2h'` explícito en la llamada a `generateToken`.

## Plan de implementación

1. **`single-use-token.entity.ts`** (SPEC 06): agregar `'email_verification'` al union type `SingleUseTokenPurpose`. Paso autocontenido, no cambia comportamiento hasta que se use.
2. **`single-use-token.model.ts`** (SPEC 06): agregar `'email_verification'` al `enum` de Mongoose del campo `purpose`.
3. **`send-email-validation-link.ts`**: inyectar `singleUseTokenRepository` en el constructor, generar `jti`, llamar a `create(user.id, jti, 'email_verification', expiresAt)` antes de armar el link, pasar `duration: '2h'` explícito y el `jti` en el payload de `generateToken`.
4. **`validate-email.ts`**: inyectar `singleUseTokenRepository`, agregar el flujo `validateToken` → `findValidByJti(jti, 'email_verification')` → guarda de `isEmailVerified` → `updateUser` → `consume(id)`.
5. **`email-controller.ts`**: agregar `singleUseTokenRepository` al constructor, pasarlo a ambos use cases en `sendValidationEmail` y `validateEmail`.
6. **`dependency-container.ts`**: pasar `this.singleUseTokenRepository` (instanciado en SPEC 06) también al construir `this.emailController`.
7. **Verificación**: `npm run build` compila sin errores de tipos.

## Criterios de aceptación

- [ ] `POST /api/auth/send-validation-email` (JWT) crea un documento en `SingleUseToken` con `purpose: 'email_verification'`, `jti` y `expires_at` a 2 horas, y el link del mail contiene un JWT cuyo payload incluye ese `jti`.
- [ ] `POST /api/auth/validate-email/:token` con token válido de un usuario no verificado responde 200, marca `isEmailVerified: true`, y el `SingleUseToken` correspondiente ya no existe en la colección.
- [ ] Reusar el mismo token de verificación una segunda vez responde 401 (token inválido/ya usado).
- [ ] Token expirado (pasadas las 2 horas) responde 401, mismo mensaje genérico que un token inválido.
- [ ] Usuario que ya está verificado y reintenta `validate-email` con un token (viejo o nuevo) responde 400, sin volver a actualizar el usuario ni consumir el token.
- [ ] Un token de `purpose: 'password_reset'` (de SPEC 06) no es aceptado por `validate-email`, y viceversa un token de `email_verification` no es aceptado por `reset-password` — el lookup filtra por `jti` y `purpose` a la vez.
- [ ] `npm run build` compila sin errores de tipos.

## Decisiones

- **Sí:** reusar `SingleUseToken` con un segundo valor de `purpose` en vez de crear una colección separada para email-verification — es exactamente el motivo por el que SPEC 06 dejó el campo genérico.
- **Sí:** hacer explícita la duración `'2h'` en `generateToken` en vez de seguir dependiendo del default oculto del adapter — necesario además para que `expires_at` del `SingleUseToken` sea consistente con la expiración real del JWT.
- **Sí:** agregar la guarda de `isEmailVerified` en `validate-email.ts` — bug preexistente que se corrige aquí porque el archivo se toca igual para la unificación; evita un update y un consumo de token innecesarios si el usuario ya está verificado.
- **No:** rate limiting de reenvío de verificación.
- **No:** tests automatizados — sin pedido explícito, mismo precedente que SPEC 04/05/06.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Pueden existir varios links de verificación activos simultáneos para el mismo usuario (no se invalidan los previos al reenviar) | Mismo riesgo aceptado que SPEC 06 para password-reset |
| Usuarios con un link de verificación ya enviado antes de este spec (JWT sin `jti`) quedan con un token que `validate-email` ya no puede resolver contra `SingleUseToken` | Esos links simplemente fallan como "token inválido" (401) tras el deploy; el usuario pide uno nuevo con `send-validation-email`. Aceptado, no hay ventana de downtime crítica porque no hay cuentas que dependan de verificarse en ese instante exacto |

## Lo que **no** está en este spec

- Duración de password-reset (ver SPEC 06).
- Cambiar la ruta o el formato del link de verificación.
- Rate limiting de reenvío de verificación.
- Tests automatizados.
- Invalidación de tokens de verificación previos al reenviar.

Cada uno de estos, si hace falta, va en su propio spec.
