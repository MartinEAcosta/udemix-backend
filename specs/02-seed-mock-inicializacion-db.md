# 02 - Seed de mockeo para inicializar la base de datos

**Estado:** Aprobado
**Depende de:** ninguno
**Fecha:** 2026-10-16

**Objetivo:** Crear un script standalone (`npm run seed`) que limpie y pueble todas las colecciones de Mongo con datos de mock fijos y consistentes entre sí, para poder levantar un entorno de desarrollo o pruebas manuales con datos realistas sin pasar por los endpoints uno por uno.

## Alcance

**Incluye:**
- Script `src/data/mongo/seed.ts` que:
  - Se conecta a Mongo usando `MongoDatabase.connect` y `envs` (mismo mecanismo que `app.ts`).
  - Bloquea la ejecución si `process.env.NODE_ENV === 'production'` (el único entorno donde hoy se define esa variable, vía `Dockerfile:19`), evitando correr el seed contra una base productiva por error.
  - Limpia (`deleteMany({})`) todas las colecciones mockeadas antes de insertar: `CategoryModel`, `UserModel`, `CourseModel`, `ModuleModel`, `LessonModel`, `EnrollmentModel`, `PaymentModel`, `FileModel`.
  - Inserta datos fijos (sin librería de datos random/faker) para las 8 colecciones, respetando las relaciones entre ellas (ids reales de Mongo, no placeholders).
  - Hashea la contraseña de los usuarios con `BcryptAdapter.hash` antes de insertar (nunca texto plano en `UserModel.password`).
  - Loguea por consola un resumen de lo insertado y cierra el proceso (`process.exit(0)` en éxito, `process.exit(1)` si algo falla).
- Nuevo script `"seed": "ts-node src/data/mongo/seed.ts"` en `package.json` (usando `ts-node`, ya presente en el proyecto como dependencia transitiva de `ts-node-dev`; si no resuelve en `devDependencies`, se agrega `ts-node` explícito).
- Datos de mock para las 8 colecciones, con volumen fijo:
  - **Category (3):** categorías base, ej. `Programación`, `Diseño`, `Negocios`, con `slug` derivado (`programacion`, `diseno`, `negocios`).
  - **User (6):** 1 `admin`, 2 `teacher`, 3 `student`. Todos con `password` hasheado = `Password123!`, `isEmailVerified: true`, `balance` fijo (ej. `0` para students, algún valor para probar pagos con `balance`), `id_file` apuntando a un `FileModel` de avatar (folder `user`).
  - **Course (4):** 2 cursos por teacher (2 teachers x 2 cursos), cada uno con `id_category` real, `category_name` consistente con la categoría, `id_owner` apuntando al teacher dueño, `price` fijo, `id_file`/`thumbnail_url` apuntando a un `FileModel` de thumbnail (folder `course`), `current_enrolled` recalculado según las enrollments seed de ese curso.
  - **Module (2 por curso, 8 en total):** `unit` secuencial (1, 2) por curso, `id_course` real.
  - **Lesson (2 por módulo, 16 en total):** `lesson_number` secuencial dentro del curso (no reinicia por módulo, respeta el índice único `{ id_course, lesson_number }`), `id_module`/`id_course` reales, `id_file` apuntando a un `FileModel` de video (folder `lesson`, `resource_type: 'video'`).
  - **Enrollment (variable, cubriendo los 3 students):** cada student inscripto en 1 o 2 cursos reales, `completed_lessons` con algunas lecciones reales marcadas para que `progress` no sea siempre 0 (al menos un enrollment con progreso parcial y uno con progreso 0, para cubrir estados UX distintos).
  - **Payment (uno por enrollment):** `id_user`/`id_courses` coherentes con la enrollment correspondiente, `id_payment` mock único (ej. `seed-payment-<n>`), `method` variando entre `'balance'` y `'card'`, `status` mayormente `'approved'` (al menos un `'rejected'` o `'in_process'` para cubrir estados).
  - **File (uno por avatar de user, uno por thumbnail de course, uno por video de lesson):** `public_id`/`url` mock (no se sube nada real a Cloudinary), `folder` correspondiente (`user`/`course`/`lesson`), `size`/`extension`/`resource_type` con valores plausibles fijos.
- Documentar en el propio script (comentario corto) la contraseña fija de los usuarios seed (`Password123!`) para que quien lo corra sepa con qué loguearse.

**No incluye:**
- Generación de datos aleatorios o con librerías tipo `faker` — todo el dataset es fijo y determinístico.
- Subida real de archivos a Cloudinary — los `FileModel` insertados son documentos Mongo con URLs/`public_id` mock, no hay llamada al `CloudinaryAdapter`.
- Ejecución automática del seed al levantar `npm run dev` o `app.ts` — es un script manual, separado del arranque normal del servidor.
- Un modo "solo insertar si está vacío" o merge incremental — el script siempre limpia las colecciones mockeadas antes de insertar.
- Tests automatizados del script de seed (no hay convención previa en el repo para testear scripts de infraestructura de este tipo).
- Seed para entornos de CI/tests (`.env.test`) — el script usa el mismo `envs`/`.env` que `npm run dev`; si se quiere correr contra la base de test se setea `DB_NAME`/`DB_CON` acordemente, pero no se crea un flujo separado.

## Modelo de datos

No se agregan colecciones ni campos nuevos. El script reutiliza los modelos Mongoose existentes (`CategoryModel`, `UserModel`, `CourseModel`, `ModuleModel`, `LessonModel`, `EnrollmentModel`, `PaymentModel`, `FileModel`) insertando documentos que ya cumplen los `required`/`enum`/índices únicos definidos en cada `*.model.ts`.

## Plan de implementación

1. Agregar el script `"seed": "ts-node src/data/mongo/seed.ts"` a `package.json`. Confirmar que `ts-node` resuelve (si falla, agregar `ts-node` a `devDependencies`).
2. Crear `src/data/mongo/seed.ts`:
   - Guard de `NODE_ENV === 'production'` al inicio, aborta con `console.error` + `process.exit(1)` si aplica.
   - Conectar con `MongoDatabase.connect({ dbUrl: envs.DB_CON, dbName: envs.DB_NAME })`.
   - `deleteMany({})` en las 8 colecciones mockeadas, en un orden que no dependa de referencias (el borrado no valida FKs, así que el orden es libre).
3. Insertar `CategoryModel` (3 documentos) y guardar sus `_id` en variables locales.
4. Insertar `FileModel` de avatares (uno por user a crear) y `UserModel` (6 documentos, password hasheada con `BcryptAdapter.hash`), usando los `_id` de los files recién creados en `id_file`.
5. Insertar `FileModel` de thumbnails y `CourseModel` (4 documentos), usando `_id` reales de `Category` y de los `teacher` creados en el paso anterior.
6. Insertar `ModuleModel` (2 por curso) usando `_id` reales de `Course`.
7. Insertar `FileModel` de videos y `LessonModel` (2 por módulo) usando `_id` reales de `Module`/`Course`.
8. Insertar `EnrollmentModel` (cubriendo los 3 students) con `completed_lessons` apuntando a `_id` reales de `Lesson`, y recalcular/actualizar `current_enrolled` en los `CourseModel` afectados (`updateOne`/`save`).
9. Insertar `PaymentModel` (uno por enrollment) con `id_user`/`id_courses` coherentes.
10. Loguear resumen (cantidad insertada por colección) y cerrar conexión + proceso (`process.exit(0)`).
11. Correr `npm run seed` manualmente contra una base de desarrollo y verificar en Mongo (Compass/consola) que las 8 colecciones tienen los documentos esperados y las referencias cruzadas resuelven.
12. Probar login manual (`POST /api/auth/login`) con el email de un user `student` seed y `Password123!`, confirmar 200 y JWT válido.

Cada paso dentro de `seed.ts` corre en una única ejecución secuencial del script (no son commits ni deploys separados); se listan en orden de dependencia de datos (categories → users/files → courses/files → modules → lessons/files → enrollments → payments).

## Criterios de aceptación

- [ ] Existe `src/data/mongo/seed.ts` y el script `"seed"` en `package.json`.
- [ ] Ejecutar `npm run seed` con `NODE_ENV` sin definir (o distinto de `production`) conecta a Mongo, limpia las 8 colecciones mockeadas y las vuelve a poblar sin errores.
- [ ] Ejecutar `npm run seed` con `NODE_ENV=production` aborta antes de tocar la base, con mensaje de error claro y código de salida distinto de 0.
- [ ] Tras correr el seed: `CategoryModel` tiene 3 documentos, `UserModel` 6 (1 admin, 2 teacher, 3 student), `CourseModel` 4, `ModuleModel` 8, `LessonModel` 16, `FileModel` al menos 1 por avatar + 1 por thumbnail + 1 por video, `EnrollmentModel` cubre los 3 students, `PaymentModel` tiene un documento por enrollment.
- [ ] Todas las referencias (`id_category`, `id_owner`, `id_course`, `id_module`, `id_file`, `id_user`, `id_courses`, `completed_lessons`) apuntan a `_id` reales existentes en sus colecciones respectivas.
- [ ] `current_enrolled` de cada `Course` seed coincide con la cantidad de `Enrollment` seed que lo referencian.
- [ ] Login (`POST /api/auth/login`) con el email de cualquier user seed y la contraseña `Password123!` responde 200 con JWT.
- [ ] Ningún `UserModel.password` queda en texto plano (se verifica que el valor guardado es un hash bcrypt, no `Password123!` literal).
- [ ] `npm run build` sigue compilando sin errores tras agregar `seed.ts`.

## Decisiones tomadas y descartadas

- **Dataset fijo, sin `faker` ni random.** El usuario lo pidió explícitamente: datos reproducibles y legibles en el propio script, sin agregar una dependencia nueva solo para esto.
- **Script standalone en `src/data/mongo/seed.ts`, no integrado al boot de `app.ts`.** Mantiene el arranque normal del servidor sin efectos secundarios; el seed es una acción explícita del desarrollador (`npm run seed`), no algo que corra solo.
- **Limpieza total (`deleteMany`) antes de insertar, sin modo "solo si está vacío".** Prioriza previsibilidad: cada corrida dejai el mismo estado conocido, útil para reiniciar un entorno de pruebas manuales entre sesiones.
- **Guard por `NODE_ENV=production` en vez de otra variable dedicada.** Es la única variable de entorno ligada a entorno que ya existe en el repo (seteada en `Dockerfile:19`); no se agrega una env var nueva solo para este guard.
- **Documentos `File` mock sin tocar Cloudinary.** El objetivo es poblar la base rápido para desarrollo local; subir archivos reales agregaría dependencia de credenciales válidas de Cloudinary y lentitud al script sin aportar valor al propósito (probar flujos de negocio, no de upload).
- **Contraseña fija `Password123!` para todos los users seed.** Permite loguearse manualmente contra cualquier usuario mock sin tener que buscar una contraseña generada; se documenta en el script.
- **Seed vive en `src/data/mongo/` (no en una carpeta `src/seed/` nueva).** Es consistente con que esa capa ya habla directo con Mongoose (`init.ts`, `models/`); no amerita una carpeta nueva en la raíz de `src/` para un único archivo.
