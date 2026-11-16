# SPEC 04 — Login y seteo de password para usuarios creados vía Google

> **Status:** Implementado
> **Depende de:** ninguno
> **Fecha:** 2026-11-11
> **Objetivo:** Evitar que el login con email/password explote para usuarios creados vía Google (sin password local) y darles un endpoint para establecer una password inicial, sin revelar que la cuenta es solo-Google.

## Por qué existe este spec

`social-login-with-google.ts` crea un `User` sin `password` cuando el email no existe. Pero el resto del flujo de auth asume que `password` siempre existe:

- `login-user.ts` hace `this.encrypter.compare(password, userExists.password!)`. El `!` es falso: si ese usuario intenta `/login` con email+password, `userExists.password` es `null` y `bcrypt.compareSync` explota en runtime en vez de devolver un error controlado.
- El flujo de `update-password` (ya en progreso, sin commitear) bloquea correctamente si `password` es `null`, pero no da ningún camino para que ese usuario lo setee por primera vez.
- `auth-datasource-impl.ts` → `updateUserPassword` no pasa `{ new: true }` a `findByIdAndUpdate`, así que devuelve el documento viejo (pre-update) — bug compartido por `update-password` y por el nuevo flujo de seteo inicial.

## Scope

**Incluye:**

- Guarda en `login-user.ts` para que un usuario con `password === null` falle con el mismo error genérico que una password incorrecta (sin distinguir que la cuenta es solo-Google).
- Fix de `{ new: true }` en `updateUserPassword` (`auth-datasource-impl.ts`), que corrige también el retorno stale del `update-password` ya existente.
- Endpoint nuevo `POST /api/auth/password/set` (JWT) para que un usuario sin password establezca una por primera vez: nuevo DTO `SetPasswordDto`, nuevo use-case `SetPassword`, método en `AuthController`, ruta en `AuthRouter`.
- El nuevo endpoint rechaza (400) si el usuario ya tiene password seteada (no es un bypass de `update-password`).

**Fuera de alcance (para otro spec si hace falta):**

- Campo `provider`/`authProvider` en `User`, o entidad dedicada `AuthIdentity`/`Account` para múltiples métodos de auth por usuario. Se evaluó y se descarta: hoy hay un solo provider social (Google), agregar esa abstracción es sobre-ingeniería para la necesidad actual. Si en el futuro se suman más providers, se revisita con info real.
- Cualquier cambio a `social-login-with-google.ts`, `user.model.ts`, `user.entity.ts`, `register-user.dto.ts` — su comportamiento actual (crear usuario sin password) es correcto y no se toca.
- Cualquier cambio al `update-password.ts`/`update-password.dto.ts` ya existente (WIP del usuario): sigue exigiendo siempre `current_password` y sigue bloqueando si `password` es `null`. El nuevo flujo de seteo inicial es un endpoint separado, no una modificación de ese.
- Tests automatizados nuevos (no existe cobertura previa de `login-user.ts` ni de `update-password`; agregar tests queda fuera salvo pedido explícito).

## Modelo de datos

No se agregan colecciones ni campos nuevos. Se reutiliza `UserModel`/`UserEntity` existentes; la única señal de "usuario sin password local" sigue siendo `password === null`.

## Plan de implementación

1. **`src/domain/use-cases/auth/login-user.ts`** — agregar guarda antes del compare, reusando el mensaje/status exacto de la rama de password incorrecta:
   ```ts
   const { password } = loginUserDto;
   if( !userExists.password ) throw CustomError.badRequest('Chequee las credenciales e intente nuevamente.');

   const isMatching = this.encrypter.compare( password , userExists.password );
   if( !isMatching ) throw CustomError.badRequest('Chequee las credenciales e intente nuevamente.');
   ```
   Se elimina el `!` de `userExists.password!` (ya innecesario). Paso autocontenido y commiteable: corrige el crash sin tocar nada más.

2. **`src/infraestructure/datasources/auth-datasource-impl.ts`** — agregar `{ new: true }` en `updateUserPassword`, mismo patrón que `updateUser` en el mismo archivo:
   ```ts
   const updatedUser = await UserModel.findByIdAndUpdate( userId , { password : hashedPassword } , { new : true })
                                         .populate<IUserPopulateModel>('id_file', 'url');
   ```

3. **`src/domain/dtos/auth/set-password.dto.ts`** (nuevo) — mismo estilo que `update-password.dto.ts`, sin `current_password`:
   ```ts
   export class SetPasswordDto {
       private constructor(
           public readonly id : string,
           public readonly new_password : string,
       ) { }

       static create ( props : { [key:string] : any } ) : [string? , SetPasswordDto?] {
           const { id , new_password } = props;

           if( !id ) return ['El ID es requerido.' , undefined];
           if( !new_password ) return ['La nueva contraseña es requerida.' , undefined];
           if( new_password.length < 6 ) return ['La longitud de la nueva contraseña debe ser mayor a 6.' , undefined];

           return [undefined, new SetPasswordDto( id , new_password )];
       }
   }
   ```

4. **`src/domain/use-cases/auth/set-password.ts`** (nuevo) — mismo patrón que `update-password.ts`, sin comparar `current_password`, rechazando si ya existe password:
   ```ts
   export class SetPassword implements SetPasswordUseCase {
       constructor(
           private readonly authRepository : AuthRepository,
           private readonly tokenManager : TokenManager,
           private readonly encrypter : Encrypter,
       ) {}

       async execute( setPasswordDto : SetPasswordDto ) : Promise<AuthSuccessResponseDto> {
           const user = await this.authRepository.findUserById( setPasswordDto.id );
           if( !user ) throw CustomError.notFound('Usuario no encontrado.');
           if( user.password ) throw CustomError.badRequest('El usuario ya tiene una contraseña establecida. Utilice la actualización de contraseña.');

           const hashedNewPassword = await this.encrypter.hash( setPasswordDto.new_password );
           const hasUpdated = await this.authRepository.updateUserPassword( setPasswordDto.id , hashedNewPassword );
           if( !hasUpdated ) throw CustomError.internalServer('Error al establecer la contraseña.');

           const token = await this.tokenManager.generateToken({
               id: user.id, 
               email: user.email, 
               isEmailVerified: user.isEmailVerified, 
               role: user.role,
           });
           if( !token ) throw CustomError.internalServer('Error al generar el token.');

           const { password: hashedOfDB , ...userWithoutPass } = user;
           return { user: { ...userWithoutPass }, token };
       }
   }
   ```
   Reusa `AuthRepository.updateUserPassword` existente — sin cambios de contrato.

5. **`src/presentation/auth/auth-controller.ts`** — importar `SetPasswordDto`/`SetPassword` y agregar método `setPassword`, mismo patrón que `updatePassword`:
   ```ts
   public setPassword = ( req : AuthenticatedRequest , res : Response ) => {
       const user = req.user;
       if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para establecer su contraseña.') , res );

       const { newPassword } = req.body;
       const [ error , setPasswordDto ] = SetPasswordDto.create( { id: user.id, new_password: newPassword } );
       if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

       new SetPassword( this.authRepository , this.tokenManager , this.encrypter )
           .execute( setPasswordDto! )
           .then( updatedUser => HandlerResponses.handleAuthSuccess( res , updatedUser , 200 ) )
           .catch( error => HandlerResponses.handleError( error , res ) );
   }
   ```
   No hace falta tocar el constructor de `AuthController` ni `dependency-container.ts`.

6. **`src/presentation/auth/auth-routes.ts`** — agregar ruta después de `/password`:
   ```ts
   router.post(
       '/password/set',
       [authMiddleware.validateJWT],
       authController.setPassword
   );
   ```
   Endpoint final: `POST /api/auth/password/set` (JWT, body `{ newPassword }`).

## Criterios de aceptación

- [ ] `POST /api/auth/login` con email de un usuario creado vía Google (password `null`) y cualquier password responde 400 `'Chequee las credenciales e intente nuevamente.'` — no crashea ni devuelve 500.
- [ ] Ese mismo mensaje/status es idéntico al que ya devuelve una password incorrecta para un usuario normal (no hay forma de distinguir por la respuesta si la cuenta es Google-only o si la password está mal).
- [ ] `POST /api/auth/password/set` con JWT de un usuario sin password y `newPassword` válida (≥6 caracteres) responde 200 y persiste la password hasheada.
- [ ] Repetir `POST /api/auth/password/set` sobre el mismo usuario (ya con password seteada) responde 400 `'El usuario ya tiene una contraseña establecida...'`.
- [ ] Tras setear la password, `POST /api/auth/login` con esa password responde 200 con JWT válido.
- [ ] `PUT /api/auth/password` (update-password existente) sobre un usuario sin password sigue respondiendo 400 `'El usuario no tiene contraseña establecida.'` — comportamiento intacto.
- [ ] `updateUserPassword` en `auth-datasource-impl.ts` devuelve el documento actualizado (no el viejo) tras el fix de `{ new: true }`.
- [ ] `npm run build` compila sin errores de tipos.

## Decisiones

- **Sí:** reusar el mensaje/status exacto de password incorrecta para el caso `password === null` en login. Evita exponer que la cuenta es solo-Google (decisión explícita del usuario, no se reabre).
- **Sí:** endpoint nuevo y separado `set-password`, en vez de hacer `current_password` opcional en `update-password`. Mantiene `update-password` simple (siempre requiere contraseña actual) y evita que `set-password` se use como bypass de cambio de password sin conocer la actual (se guarda con el chequeo `if(user.password) throw badRequest`).
- **No:** campo `provider`/`authProvider` o entidad `AuthIdentity` dedicada. Sobre-ingeniería para un solo provider social hoy; la señal `password === null` es suficiente. Revisitar si se agregan más providers.
- **No:** tocar `social-login-with-google.ts` — crear usuarios Google sin password es el comportamiento correcto, el problema está en el resto del flujo que no lo tenía en cuenta.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Alguien llama `set-password` pensando que es para cambiar una password existente | Use-case rechaza explícitamente con 400 si `user.password` ya existe, indicando usar `update-password` |
| Mensaje de error de login revela indirectamente el estado de la cuenta por timing (side-channel) | Fuera de alcance de este spec — no se introduce ninguna diferencia de timing nueva respecto al flujo actual, pero no se audita explícitamente |

## Lo que **no** está en este spec

- Campo `provider` o entidad `AuthIdentity` para múltiples métodos de auth por usuario.
- Cambios a `social-login-with-google.ts`, `user.model.ts`, `user.entity.ts`, `register-user.dto.ts`.
- Cambios al flujo existente de `update-password.ts`/`update-password.dto.ts`.
- Tests automatizados nuevos.

Cada uno de estos, si hace falta, va en su propio spec.
