# Udemix Backend

API REST para plataforma de cursos online (estilo Udemy). Maneja usuarios, cursos, módulos, lecciones, inscripciones (enrollments), progreso de lecciones, pagos con MercadoPago, categorías y subida de archivos (Cloudinary).

Arquitectura Clean/Hexagonal: capas `domain` (núcleo, sin dependencias de framework), `infraestructure`/`data` (implementación Mongoose), `presentation` (Express: controllers + routes). Ver detalle en `CLAUDE.md`.

## Tecnologías

**Runtime / Lenguaje**
- Node.js + TypeScript

**Framework / servidor**
- Express 5
- CORS
- express-fileupload (subida archivos, límite 50MB)

**Base de datos**
- MongoDB + Mongoose (ODM, incluye transacciones vía `ClientSession` / Unit of Work)

**Auth / seguridad**
- JSON Web Tokens (jsonwebtoken)
- bcrypt (hash de contraseñas)

**Servicios externos**
- Cloudinary (almacenamiento de archivos/imágenes)
- MercadoPago (pagos + webhooks de notificación)
- Nodemailer (envío de emails, validación de cuenta)

**Config / utilidades**
- dotenv + env-var (validación de variables de entorno al arrancar)
- uuid

**Testing**
- Jest + ts-jest
- Supertest

**Build / tooling**
- ts-node-dev (dev con auto-restart)
- tsc (compilación a `dist/`)
- rimraf

**Infra**
- Docker (build multi-stage, corre como usuario `node` no-root, puerto 4201)

## Requisitos

- Node.js
- MongoDB accesible (`DB_CON`)
- Cuentas/credenciales: Cloudinary, MercadoPago, servicio de mailing (Gmail u otro SMTP soportado por Nodemailer)

## Variables de entorno

Copiar `.env.template` a `.env` (dev) y completar. Tests usan `.env.test`.

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default 4201) |
| `DB_CON` | Connection string de MongoDB |
| `DB_NAME` | Nombre de la base de datos |
| `SECRET_JWT_SEED` | Semilla pa firmar JWT |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciales Cloudinary |
| `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET_KEY` | Credenciales MercadoPago |
| `MAILER_SERVICE`, `MAILER_EMAIL`, `MAILER_SECRET_KEY` | Credenciales del mailer |
| `WEBSERVICE_URL` | URL pública del backend |

## Instalación y uso

```bash
npm install

npm run dev             # dev, auto-restart (src/app.ts)
npm run build            # compila a dist/
npm start                # corre build compilado (dist/app.js)

npm test                 # suite completa con coverage
npm run test:watch
npm run test:coverage

npx jest tests/domain/auth/register-user.test.ts   # un archivo
npx jest -t "should do X"                           # por nombre
```

Al arrancar (`app.ts`), conecta a MongoDB con reintento (5 intentos, backoff 2s) y luego levanta el servidor Express.

### Docker

Build multi-stage: stage `builder` compila (`npm run build`), stage `runner` copia solo `dist/` y corre como usuario no-root `node`, expone puerto 4201.

## Rutas de la API

Todas montadas bajo `/api`. Endpoints marcados con 🔒 requieren JWT (`Authorization: Bearer <token>`); algunos además exigen rol específico (`teacher`/`admin`).

### Auth — `/api/auth`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register` | Registro de usuario |
| POST | `/login` | Login |
| GET | `/renew` 🔒 | Renueva JWT |
| GET | `/send-validation-email` 🔒 | Envía email de validación de cuenta |
| GET | `/validate-email/:token` | Valida email con token |

### Categories — `/api/categories`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista categorías |
| POST | `/new` 🔒 | Crea categoría |
| DELETE | `/:id` 🔒 | Elimina categoría |

### Courses — `/api/courses`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista cursos (filtros por query params) |
| GET | `/bulk` | Cursos por lista de IDs |
| GET | `/paginated` | Cursos paginados |
| GET | `/:id` | Curso por ID |
| GET | `/category/:slug` | Cursos por categoría (slug) |
| POST | `/new` 🔒 (teacher/admin) | Crea curso (owner asignado automático) |
| PUT | `/update/:id` 🔒 | Edita curso |
| DELETE | `/delete/:id` 🔒 | Elimina curso |

### Modules — `/api/modules`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` 🔒 (admin) | Lista todos los módulos |
| GET | `/:id` 🔒 | Módulo por ID |
| GET | `/course/:id_course` | Módulos de un curso |
| GET | `/course/detailed/:id_course` | Módulos de un curso, populados |
| POST | `/new` 🔒 | Crea módulo |
| POST | `/update/:id` 🔒 | Edita módulo |
| DELETE | `/delete/:id` 🔒 | Elimina módulo |

### Lessons — `/api/lessons`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/new` 🔒 | Crea lección |
| PUT | `/update/:id` 🔒 | Edita lección |
| DELETE | `/delete/:id` 🔒 | Elimina lección |
| GET | `/course/:course_id` | Lecciones de un curso |
| GET | `/populated/course/:course_id` | Lecciones de un curso, populadas |
| GET | `/:id` | Lección por ID |
| GET | `/populated/:id` | Lección por ID, populada |
| GET | `/next/:id_enrollment` 🔒 | Siguiente lección pendiente de un enrollment |

### Enrollments — `/api/enrollments`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los enrollments |
| GET | `/:id_enrollment` | Enrollment por ID, populado |
| GET | `/user/:id_user` | Enrollments de un usuario |
| GET | `/user/:id_user/course/:id_course` 🔒 | Enrollment de un usuario en un curso |
| POST | `/new` 🔒 | Inscribe usuario en curso |
| POST | `/mark-lesson-completed` 🔒 | Marca lección como completada (transaccional) |

### Payments — `/api/payments`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/` 🔒 | Inicia pago (MercadoPago) |
| POST | `/notifications` | Webhook de notificación MercadoPago |
| GET | `/methods` | Métodos de pago disponibles |
| GET | `/identification-types` | Tipos de identificación (pa checkout) |
| POST | `/total` | Calcula total a pagar |

### Files — `/api/file`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/upload/single/:folder/:id_entity` | Sube un archivo (Cloudinary) |
| POST | `/multiple/:folder` | Sube varios archivos |
| GET | `/:id` | Archivo por ID |
| DELETE | `/:id` | Elimina archivo |
| DELETE | `/course-thumbnail/:course_id` | Elimina thumbnail de curso |

## Notas importantes

- Roles de usuario: `student` (default), `teacher`, `admin`.
- Balance de usuario arranca en 0 (usado pa sistema de pagos/créditos).
- Operaciones multi-paso atómicas (enrollment, completar lección) usan `UnitOfWork` con transacciones Mongoose.
- Errores de dominio usan `CustomError` con factories estáticas (`badRequest`, `unauthorized`, `forbidden`, `notFound`, `internalServer`); `HandlerResponses` es el único punto que decide status/JSON de respuesta.
- No hay path aliases: imports en tests son relativos a `src/`.
