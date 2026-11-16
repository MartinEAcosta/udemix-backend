# SPEC 06 — Reset password con token de un solo uso

> **Status:** Aprobado
> **Depende de:** SPEC 04
> **Fecha:** 2026-11-14
> **Objetivo:** Completar el flujo de restablecimiento de contraseña iniciado por `ForgotPassword`, validando un token de un solo uso persistido en una colección dedicada.

## Por qué existe este spec

`forgot-password.ts` ya genera y envía un JWT de 15 minutos por mail, pero es completamente stateless: no hay forma de invalidarlo antes de que expire ni de detectar que ya fue usado. Además, `auth-controller.ts` tiene un stub roto (`resetPassword`) que referencia `ResetPasswordDto` y `ResetPassword`, ninguno de los cuales existe, y `auth-routes.ts` tiene una ruta `/forgot-password/:token` sin handler. El build no compila hasta que esto se resuelva.

## Scope

**Incluye:**

- `ResetPasswordDto` (`src/domain/dtos/auth/reset-password.dto.ts`): valida `token` y `password` (`password` ≥ 6 caracteres), mismo patrón que `SetPasswordDto`/`UpdatePasswordDto`.
- `ResetPassword` use case (`src/domain/use-cases/auth/reset-password.ts`): valida el JWT, verifica que el `jti` embebido siga vigente contra la nueva colección de tokens, busca al usuario por email, hashea y persiste la password nueva, consume (borra) el token, y devuelve éxito genérico sin loguear al usuario.
- Mecanismo de invalidación de un solo uso vía **colección dedicada** `SingleUseToken`: entidad, abstracciones (`repository`/`datasource`) e implementaciones de infraestructura, separada de `User`. La entidad se diseña genérica desde ahora (campo `purpose`) para que SPEC 07 la reuse sin migración, aunque este spec solo emite el valor `'password_reset'`.
- Ajuste a `forgot-password.ts` (ya en este branch) para generar un `jti` random, persistirlo junto al `user_id`, `purpose: 'password_reset'` y la expiración, y embeberlo en el payload del JWT.
- Terminar el stub de `AuthController.resetPassword` y ajustar `AuthController.forgotPassword` para pasar la nueva dependencia; agregar `singleUseTokenRepository` al constructor de `AuthController`.
- `auth-routes.ts`: sacar la ruta vacía `/forgot-password/:token` y agregar `POST /reset-password`.
- Registrar `SingleUseTokenDatasourceImpl`/`SingleUseTokenRepositoryImpl` en `dependency-container.ts`.

**Fuera de alcance (para otro spec si hace falta):**

- Rate limiting de cuántas veces se puede pedir un reset por email/tiempo.
- Invalidar automáticamente tokens previos no usados del mismo usuario al pedir uno nuevo — pueden coexistir varios links válidos hasta que cada uno expire o se consuma.
- Email de confirmación al usuario cuando su password cambió exitosamente.
- Tests automatizados — sin pedido explícito, mismo precedente que SPEC 04/05.
- Auto-login / token de sesión tras el reset exitoso — decidido explícitamente como respuesta genérica, sin JWT nuevo.
- Mover el token de la URL al body o viceversa — se mantiene en el body (`{ token, password }`), tal como ya estaba en el stub; el link generado por `ForgotPassword` sigue siendo informativo para el frontend, no se parsea server-side.
- Aplicar este mismo mecanismo a `validate-email` → **SPEC 07** (depende de este spec).

## Modelo de datos

Entidad nueva, sin tocar `User`/`UserEntity`/`UserModel`:

```ts
// src/domain/entities/single-use-token.entity.ts
export type SingleUseTokenPurpose = 'password_reset'; // SPEC 07 agrega 'email_verification'

{
  id         : string,
  user_id    : string,
  jti        : string,
  purpose    : SingleUseTokenPurpose,
  expires_at : Date,
}
```

Esquema Mongoose (`src/data/mongo/models/single-use-token.model.ts`):

- `user_id`: ObjectId, ref `User`, required.
- `jti`: String, required, `unique`.
- `purpose`: String, required, `enum: ['password_reset']` (SPEC 07 agrega `'email_verification'` al enum).
- `expires_at`: Date, required, con TTL index (`expireAfterSeconds: 0`) para que Mongo borre solo los documentos abandonados tras su expiración.

El payload del JWT que firma `ForgotPassword` pasa de `{ email, duration }` a `{ email, jti, duration }`. El `jti` viaja embebido en el token, nunca se expone en el body de ninguna request. El `purpose` no viaja en el JWT: se pasa explícito como argumento en cada llamada a `create()`/`findValidByJti()`, para que el lookup filtre por `jti` **y** `purpose` a la vez.

## Plan de implementación

1. **Dominio — entidad y contratos**: `domain/entities/single-use-token.entity.ts` (incluye el union type `SingleUseTokenPurpose`), `domain/repository/single-use-token-repository.ts` (abstract class con `create(userId, jti, purpose, expiresAt)`, `findValidByJti(jti, purpose)`, `consume(id)`), `domain/datasources/single-use-token-datasource.ts` (mismo shape). No cambia comportamiento existente.
2. **Modelo Mongoose**: `data/mongo/models/single-use-token.model.ts` con el TTL index y el enum de `purpose`.
3. **Infraestructura**: `infraestructure/datasources/single-use-token-datasource-impl.ts` (habla directo con el modelo), `infraestructure/repositories/single-use-token-repository-impl.ts` + `infraestructure/mappers/single-use-token.mapper.ts` (doc Mongo → entidad).
4. **`dependency-container.ts`**: instanciar `SingleUseTokenDatasourceImpl`/`SingleUseTokenRepositoryImpl`, pasar la nueva propiedad al constructor de `AuthController`.
5. **`ResetPasswordDto`**: `domain/dtos/auth/reset-password.dto.ts`, valida `token` requerido y `password` requerido ≥ 6 caracteres.
6. **Modificar `forgot-password.ts`**: inyectar `singleUseTokenRepository`, generar `jti` (`crypto.randomUUID()`), llamar a `create()` con `user_id`/`jti`/`purpose: 'password_reset'`/`expires_at` (consistente con la duración de 15 minutos del token) antes de armar el link y mandar el mail, y embeber el `jti` en el payload del `generateToken`.
7. **`reset-password.ts` use case**: `validateToken<{email, jti}>` → `findValidByJti(jti, 'password_reset')` (si no existe: token inválido o ya usado) → `findUserByEmail(payload.email)` (si no existe: usuario no encontrado) → hash + `updateUserPassword` → `consume(id)` → devuelve `true`.
8. **`AuthController`**: agregar `singleUseTokenRepository` al constructor, pasarlo a `new ForgotPassword(...)`, terminar `resetPassword` instanciando `ResetPassword` y respondiendo con `HandlerResponses.handleSuccess`/`handleError`.
9. **`auth-routes.ts`**: sacar la ruta vacía, agregar `router.post('/reset-password', authController.resetPassword)`.
10. **Verificación**: `npm run build` compila sin errores de tipos.

## Criterios de aceptación

- [ ] `POST /api/auth/forgot-password` con un email existente crea un documento en `SingleUseToken` (`purpose: 'password_reset'`) con `jti` + `expires_at`, y el link del mail contiene un JWT cuyo payload incluye ese `jti`.
- [ ] `POST /api/auth/reset-password` con token válido + password nueva (≥ 6 caracteres) responde 200 con mensaje genérico de éxito, sin token de sesión en el body.
- [ ] Tras ese reset, el `SingleUseToken` correspondiente ya no existe en la colección.
- [ ] Reusar el mismo token una segunda vez responde 401 (token inválido/ya usado).
- [ ] Token expirado (pasados los 15 minutos) responde 401, con el mismo mensaje genérico que un token inválido.
- [ ] Token válido pero cuyo usuario fue borrado mientras tanto responde 404.
- [ ] `password` menor a 6 caracteres responde 400 desde `ResetPasswordDto.create`, sin tocar el token ni la DB.
- [ ] `npm run build` compila sin errores de tipos.

## Decisiones

- **Sí:** colección dedicada `SingleUseToken` en vez de un campo en `User` o un hash del JWT completo — elegida explícitamente por el usuario tras comparar las tres opciones (jti en User / hash en User / colección separada); deja la lógica de un-solo-uso auditable y separada del aggregate `User`.
- **Sí:** nombre y campo `purpose` genéricos desde ahora (no `PasswordResetToken`) — decisión posterior del usuario para poder reusar la misma colección en SPEC 07 (`validate-email`) sin migrar nada; este spec solo emite y consulta `purpose: 'password_reset'`.
- **Sí:** borrar el documento al consumir el token (en vez de marcar `consumed_at`) — simplifica "válido" a "existe", sin tener que distinguir expirado vs. consumido en la lógica de negocio.
- **Sí:** TTL index en `expires_at` — limpieza automática de tokens abandonados, sin cron job manual.
- **Sí:** `jti` viaja como claim estándar dentro del JWT, nunca por fuera.
- **Sí:** el token sigue viniendo en el body de la request (no en la URL) — igual que el stub ya escrito en `auth-controller.ts`; no se toca el formato del link que ya genera `ForgotPassword`.
- **Sí:** respuesta de éxito genérica sin auto-login — consistente con el patrón ya usado por `ForgotPassword`; el usuario hace login manual después de resetear.
- **No:** rate limiting de intentos de forgot-password.
- **No:** invalidar tokens previos no usados al pedir uno nuevo — pueden coexistir, cada uno expira o se consume independiente.
- **No:** email de confirmación post-reset.
- **No:** tests automatizados — sin pedido explícito, mismo precedente que SPEC 04/05.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Pueden existir varios links de reset activos simultáneos para el mismo usuario (no se invalidan los previos al pedir uno nuevo) | Cada uno expira a los 15 minutos vía TTL index; aceptado como riesgo menor, documentado como fuera de alcance |
| Si la creación del `SingleUseToken` fallara después de enviar el mail, el link enviado quedaría sin respaldo en DB | El plan crea el registro en DB antes de armar el link y enviar el mail (mismo orden pending-first que ya usa el flujo de payments) |

## Lo que **no** está en este spec

- Rate limiting de `forgot-password`.
- Invalidación de tokens previos no usados al pedir uno nuevo.
- Email de confirmación post-reset.
- Tests automatizados.
- Auto-login / token de sesión tras el reset.
- Cambiar el token de body a URL.
- Aplicar el mecanismo a `validate-email` (ver SPEC 07).

Cada uno de estos, si hace falta, va en su propio spec.
