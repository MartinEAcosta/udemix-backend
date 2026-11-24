# SPEC 08 — Refactor de filtros y paginación de Course

> **Status:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-11-24
> **Objetivo:** Dejar un único camino, paginado y combinable, para listar cursos con filtros (incluida la categoría vía `category_name`), y corregir los bugs de parseo y de links de paginación.

## Por qué existe este spec

El listado de cursos (`GET /api/courses`) arrastra varios problemas:

- **Bugs**
  - `PaginationDto.create` recibe `+limit`: `?limit=10.5` pasa la validación y llega a Mongo como `$limit`/`$skip` decimal → 500. El mensaje dice "menor a 100" pero acepta 100.
  - `CourseFilterDto` parsea precios con `Number()`, que convierte `''` en `0`: `?priceMax=` filtra `price <= 0` en silencio.
  - Los links `next`/`prev` de `buildPaginationResponse` sólo llevan `current_page` y `limit`: la página 2 de `?title=node` es otro listado.
  - `FindCoursesByCategory` no hace `await` del repositorio, así que el chequeo de "no encontrado" nunca se ejecuta.
  - `CourseFilterDto` acepta `category_name` pero el query builder lo ignora (y su mensaje de error dice "título").
- **Diseño**
  - El parseo está repartido en `CourseMiddleware` + `PaginationMiddleware`, que escriben props opcionales en `req`; el controller vuelve a chequearlas y responde un 500 con `CustomError.internalServer` (cuyo mensaje llega al cliente).
  - `CourseFilterDto` y `TeacherRequestFilterDto` repiten el mismo bloque `let/if` por campo.
  - `CourseQueryBuilder` es una clase con estado mutable que sólo se usa a través de `fromFilter`.
  - `buildPaginationResponse` arma URLs HTTP pero vive en `domain`.
  - Hay dos caminos para filtrar por categoría (`?id_category=` y `GET /category/:slug`), el segundo sin paginar ni combinar con otros filtros.

## Scope

**Incluye:**

- `src/domain/helpers/query-parsers.ts`: `optionalId`, `optionalText`, `optionalNumber`, `optionalBoolean` y `parseQueryParams`, que convierte el primer parámetro inválido en la tupla `[error, undefined]`.
- `CourseFilterDto` y `TeacherRequestFilterDto` reescritos sobre esos helpers. Los mensajes de error se mantienen (salvo el de `category_name`, que estaba mal).
- `PaginationDto.create( query )`: recibe la query cruda, usa `parseNonNegativeInteger`, defaults `current_page = 1`, `limit = 10`, rango de `limit` 1..100, y getter `skip`.
- `buildCourseQuery( filter )` (función pura) reemplaza a `CourseQueryBuilder`, y suma `category_name` (match exacto, sin distinguir mayúsculas).
- `buildPaginationResponse` se muda a `src/presentation/helpers/pagination-response.ts` y conserva los filtros en `next`/`prev`.
- `CourseController.findAllCourses` construye `CourseFilterDto` y `PaginationDto` directamente; se eliminan `CourseMiddleware` y `PaginationMiddleware`.
- **Se elimina `GET /api/courses/category/:slug`** junto con `FindCoursesByCategory`, `CourseRepository.findCoursesByCategory` y `CourseDatasource.findCoursesByCategoryId`. El reemplazo es `GET /api/courses?category_name=<nombre>`.
- Tests unitarios (sin base de datos) de los helpers, `CourseFilterDto`, `PaginationDto`, `buildCourseQuery` y `buildPaginationResponse`.

**Fuera de alcance:**

- Adaptar el frontend (seminario-angular) al reemplazo de `/category/:slug`.
- Implementar el listado de `teacher-request` (sólo se refactoriza su DTO de filtro).
- Propagar renombres de categoría a la copia `category_name` de los cursos.

## Decisiones

- **Filtrar por `category_name` y no por slug** (decidido por Martin): el nombre ya está desnormalizado en cada curso, así que no hace falta buscar la categoría primero.
- **Match de `category_name`**: exacto pero sin distinguir mayúsculas (`^…$` con `i`, con el texto escapado).
- **Parseo en el controller**: sigue el patrón de `saveCourse`/`updateCourse` y elimina el estado opcional en `req`.

## Criterios de aceptación

- `?limit=10.5`, `?limit=0`, `?limit=101`, `?current_page=0` → 400.
- `?priceMax=` → 400 (no filtra por 0).
- `?category_name=programación` devuelve los cursos con `category_name: 'Programación'`.
- `next`/`prev` incluyen los filtros aplicados.
- `GET /api/courses/category/:slug` deja de existir.
- `npx tsc --noEmit` sin errores y los tests nuevos pasan.

## Riesgos

- El frontend que use `/category/:slug` deja de funcionar hasta que migre a `?category_name=`.
