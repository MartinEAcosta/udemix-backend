# 01 - Estandarizar nombres de carpetas de upload

**Estado:** Aprobado
**Depende de:** ninguno
**Fecha:** 2026-09-10

**Objetivo:** Unificar los valores válidos de carpeta de subida de archivos (`courses`/`lessons`/`users`, mezclados con `user` en algún punto) a una convención singular consistente (`course`/`lesson`/`user`) en todo el backend.

## Alcance

**Incluye:**
- Cambiar los valores de carpeta aceptados por el endpoint de upload de `courses`/`lessons`/`users` a `course`/`lesson`/`user`.
- Actualizar todos los tipos TypeScript, arrays de validación y el enum de Mongoose que referencian esos valores.
- Documentar el nuevo contrato para que el frontend (repo aparte) se adapte.

**No incluye:**
- Cambios en el proyecto frontend Angular (es otro repo; queda fuera de esta sesión/spec).
- Migración de los archivos ya subidos a Cloudinary bajo carpetas plurales (`courses/`, `lessons/`, `users/`). Quedan tal cual están; el campo `folder` persistido en los documentos `File` existentes conserva su valor histórico en plural y no se re-valida al leer (Mongoose solo valida el `enum` en `save`/`validate`, no en `find`).
- Compatibilidad temporal con los valores plurales antiguos: el cambio es un breaking change aceptado, a coordinar con el redeploy del frontend actualizado.

## Modelo de datos

Se centraliza la fuente de verdad de los valores válidos de carpeta en `src/domain/entities/file.entity.ts`, reemplazando el type `Folders` actual y los literales repetidos en cada archivo:

```typescript
export const FOLDERS = [ 'course', 'lesson', 'user' ] as const;

export type Folders = typeof FOLDERS[number];

export const isValidFolder = ( value : string ) : value is Folders => {
    return ( FOLDERS as readonly string[] ).includes( value );
}
```

Consumidores, todos importando desde `file.entity.ts` en vez de repetir el union literal:

- `src/domain/use-cases/file/upload-single.ts`: `UploadFileUseCase.execute`, `UploadSingle.execute`, `obtainSearchedEntity`, `assignNewIdFile` tipan `folder : Folders`. Claves del objeto `strategies`: `courses`/`lessons`/`users` → `course`/`lesson`/`user`.
- `src/presentation/file/file-controller.ts`: elimina el array local `validFolders`, usa `isValidFolder(fol)`. Tipo de retorno de `obtainFolder` y tipo de `folder` en `uploadFile` pasan a `Folders`.
- `src/data/mongo/models/file.model.ts`: enum del campo `folder` usa `FOLDERS` (import desde domain; permitido por la arquitectura, `data` puede depender de `domain`).

## Plan de implementación

1. En `src/domain/entities/file.entity.ts`: reemplazar el type `Folders` por `FOLDERS` (const array), `Folders` (type derivado) e `isValidFolder` (type guard), como en el bloque de arriba.
2. Actualizar `src/domain/use-cases/file/upload-single.ts`: importar `Folders` desde `file.entity.ts`, usarlo en la firma de `UploadFileUseCase`, `execute`, `obtainSearchedEntity`, `assignNewIdFile`; renombrar claves de `strategies` a `course`/`lesson`/`user`.
3. Actualizar `src/presentation/file/file-controller.ts`: importar `Folders` e `isValidFolder` desde `file.entity.ts`, eliminar `validFolders` local, usar `isValidFolder` en `obtainFolder`, tipar con `Folders`.
4. Actualizar `src/data/mongo/models/file.model.ts`: importar `FOLDERS` desde `file.entity.ts` y usarlo en el enum del campo `folder`.
5. Correr `npm test` y confirmar que la suite existente sigue pasando (no hay tests que referencien los nombres de carpeta actualmente).
6. Probar manualmente (Postman/curl) contra `POST /api/file/upload/single/:folder/:id_entity`:
   - `course`, `lesson`, `user` → 201, sube y actualiza la entidad correspondiente.
   - `courses`, `lessons`, `users` (valores viejos) → 404 `La carpeta ... no es valida`.

Cada paso deja el sistema compilando y funcional (los pasos 1-4 deben aplicarse juntos antes de recompilar, ya que son tipos acoplados entre sí; se listan por archivo para claridad de diff, no para commits separados).

## Criterios de aceptación

- [ ] `FOLDERS`, `Folders` e `isValidFolder` existen en `file.entity.ts` y son la única fuente de verdad de los valores de carpeta.
- [ ] `file-controller.ts` no tiene un array `validFolders` propio; usa `isValidFolder` importado.
- [ ] Ningún archivo (`file.entity.ts`, `upload-single.ts`, `file-controller.ts`, `file.model.ts`) repite el union literal `'course' | 'lesson' | 'user'` a mano; todos importan `Folders`/`FOLDERS`.
- [ ] El enum de Mongoose en `file.model.ts` usa `FOLDERS` y valida `["user", "course", "lesson"]`.
- [ ] `npm run build` compila sin errores de tipos.
- [ ] `npm test` pasa sin regresiones.
- [ ] `POST /api/file/upload/single/course/:id_entity` (y `lesson`, `user`) responden 201.
- [ ] `POST /api/file/upload/single/courses/:id_entity` (valor plural viejo) responde 404.

## Decisiones tomadas y descartadas

- **Convención elegida: singular (`course`/`lesson`/`user`).** Alinea con el resto de nombres de archivos/clases del repo (`course-controller`, `lesson-repository`, `auth-repository` usa `user` singular en sus métodos).
- **Sin migración de assets en Cloudinary.** Renombrar carpetas en Cloudinary y re-escribir `folder` en documentos `File` existentes es una operación aparte, de mayor riesgo, y no aporta valor inmediato: los archivos viejos siguen siendo servibles por su `url`/`public_id` sin importar el valor de `folder` guardado.
- **Sin capa de compatibilidad con valores plurales.** Se descarta aceptar ambos formatos en simultáneo para no dejar deuda técnica ni ambigüedad en `validFolders`; el usuario coordina el redeploy junto con el frontend.
- **Fuente única de verdad como `const` array + type derivado + type guard, no clase ni interfaz.** Una interfaz se borra en runtime y no puede aportar el array de valores que necesitan el enum de Mongoose y la validación (`includes`). Una clase con solo miembros `static` es forzar OOP en un repo que usa funciones arrow y objetos planos en todos lados; el patrón `as const` + `typeof X[number]` es el idiomático en TypeScript para este caso y evita repetir el union literal en 4 archivos.
- **Frontend fuera de este spec.** El repo del frontend Angular es un proyecto separado; este spec documenta el contrato nuevo para que se actualice ahí por fuera de esta sesión.

## Riesgos

- **Breaking change de API:** cualquier cliente que siga llamando al endpoint con `courses`/`lessons`/`users` en plural (incluido el frontend actual, antes de actualizarse) recibirá 404 hasta que se actualice. Mitigación: coordinar el deploy de backend y frontend en la misma ventana.
- **Documentos `File` históricos con `folder` en plural:** no se rompen al leerse (sin validación de enum en `find`), pero si en el futuro se llama a `.save()` sobre uno de esos documentos sin tocar `folder`, Mongoose podría re-validar el enum y fallar. No aplica a los flujos actuales (no hay un caso de uso que re-guarde un `File` existente sin pasar por upload).
