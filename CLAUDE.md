# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment

Env vars are required (see `src/config/envs.ts`, validated via `env-var`, throws at import time if missing). Local dev reads `.env`; tests read `.env.test` (loaded by `setupTests.ts`, wired via `jest.config.ts` `setupFiles`). Full required set:

`PORT`, `DB_CON`, `DB_NAME`, `SECRET_JWT_SEED`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET_KEY`, `MAILER_SERVICE`, `MAILER_EMAIL`, `MAILER_SECRET_KEY`, `FRONTEND_BASE_URL`, `WEBSERVICE_URL`, `GOOGLE_AUTH_CLIENT_ID`, `GOOGLE_AUTH_SECRET`.

Note: `.env.template` is out of date — it is missing `DB_NAME`, `GOOGLE_AUTH_CLIENT_ID` and `GOOGLE_AUTH_SECRET`, which `envs.ts` requires. Copying the template alone will not boot the app.

Docker build is a two-stage build (`Dockerfile`): builder stage runs `npm run build`, runner stage copies `dist/` only and runs as non-root `node` user on port 4201.

## Working agreement: resolve open questions before building on them

Do not keep building work that a later answer could invalidate. When something is unresolved — an ambiguous requirement, a missing decision, a half-finished piece of work, an assumption you cannot verify in the code — stop at that point and either:

1. **Hand it over.** Deliver what is already complete and usable, and state plainly what is unfinished and why.
2. **Interview me.** Ask the specific question(s) needed to unblock, one decision at a time, with the options and the trade-off for each.

Rules:

- Never silently pick an interpretation and build a large amount of code on top of it. Small, reversible judgment calls are fine — state the assumption and move on.
- If different readings of the request would produce materially different code, that is a blocking question: ask before writing the code, not after.
- Finish every part of the task that does **not** depend on the open question first. Only the dependent part waits.
- When reporting back, be explicit: what is done, what is blocked, what question unblocks it.
- Partial work that is about to be thrown away is worse than no work. Prefer asking.

## Architecture

Clean/hexagonal architecture with strict layering. Dependencies point inward — `presentation` → `domain` ← `infraestructure`/`data`. Domain layer has zero framework/DB imports.

```
src/
  domain/            # framework-agnostic core
    entities/        # plain classes, private constructor + static fromObject() factory that validates and throws plain strings on bad input
    dtos/             # request/response shape validators, same private-constructor + static create()/fromObject() pattern
    repository/       # abstract classes (not interfaces) — the contracts controllers/use-cases depend on
    datasources/       # abstract classes — contracts implemented by infraestructure/datasources
    use-cases/<feature>/   # one class per use case, `execute()` method, injected with repositories via constructor
                           # features: auth, category, course, enrollment, file, lesson, module, order, payment
    services/          # abstract service contracts (Encrypter, TokenManager, FileStorage, EmailValidator,
                       # SocialAuthProvider, PaymentService, UnitOfWork)
    errors/custom-error.ts   # CustomError — static factories (badRequest/unauthorized/forbidden/notFound/internalServer), the only error type controllers translate to HTTP
    helpers/            # query builders, regex constants

  infraestructure/     # implements domain contracts
    datasources/<feature>-datasource-impl.ts   # talks to Mongoose models directly — OR, when the feature's state lives in an
                                               # external system, delegates to a domain/services contract (see order below)
    repositories/<feature>-repository-impl.ts  # implements domain/repository/*, delegates to a datasource, maps raw docs to entities via mappers
    mappers/            # raw Mongo doc -> domain entity mapping; also domain DTO <-> third-party SDK types (see order.mapper.ts)

  data/
    mongo/models/       # Mongoose schemas/models: category, course, enrollment, file, lesson, module, payment, user
    mongo/seed.ts       # `npm run seed` — populates categories, users, courses, modules, lessons, enrollments, payments
    init.ts             # MongoDatabase.connect() (mongoose connection)
    mongoose-unit-of-work.ts   # UnitOfWork impl using Mongoose ClientSession for multi-step transactions (used by enrollment/lesson-completion flows)

  presentation/         # Express layer
    <feature>/<feature>-controller.ts   # thin: extracts req data, builds DTO, calls use-case, calls HandlerResponses
    <feature>/<feature>-routes.ts       # express.Router() wiring middlewares + controller methods
                                        # feature dirs: auth, category, course, enrollment, file, lesson, module, order, payment
    middlewares/          # AuthMiddleware (JWT validation, role checks, owner-assignment), CourseMiddleware, FileMiddleware, PaymentMiddleware, PaginationMiddleware
    helpers/handler-responses.ts   # HandlerResponses.handleSuccess/handleError/handleAuthSuccess — the only place HTTP status/JSON shape is decided
    dependency-container.ts   # manual DI, singleton (DependencyContainer.getInstance()) — wires adapters -> repositories -> middlewares -> controllers by hand; this is where new features get registered
    routes.ts              # AppRoutes.routes mounts each feature router under /api/<feature>
    server.ts              # Server class: express app setup (json body parser, cors, express-fileupload 50MB limit, static /public), listens on configured port

  config/
    envs.ts                # single source of truth for env vars, validated at import time
    adapters/               # concrete implementations of domain/services contracts
                            # (BcryptAdapter, JwtAdapter, CloudinaryAdapter, EmailSenderAdapter, GoogleAdapter, MercadoPagoAdapter)

  app.ts                  # entrypoint: connects to Mongo with retry (5 attempts, 2s backoff), then starts Server with AppRoutes.routes
```

Routers mounted in `src/presentation/routes.ts`: `/api/auth`, `/api/categories`, `/api/courses`, `/api/enrollments`, `/api/file`, `/api/lessons`, `/api/modules`, `/api/payments`, `/api/orders`.

### Adding a new feature end-to-end

Follow the existing pattern for e.g. `course` or `lesson`: entity + DTOs in `domain`, abstract `repository`/`datasource` in `domain`, use-case(s) in `domain/use-cases/<feature>`, then `infraestructure/datasources/<feature>-datasource-impl.ts` + `infraestructure/repositories/<feature>-repository-impl.ts` + a mapper, a Mongoose model in `data/mongo/models`, and finally a controller + routes in `presentation`. Register everything in `dependency-container.ts` and mount the router in `presentation/routes.ts`.

### Gateway-backed features (deliberate exception to the pattern)

`order` is the first feature slice with **no entity and no Mongoose model** — an Order is a MercadoPago resource, not a local aggregate. Do not "fix" it to match the normal pattern:

- `src/infraestructure/datasources/order-datasource-impl.ts` delegates to the `PaymentService` contract (implemented by `MercadoPagoAdapter`), not to a model.
- `src/infraestructure/repositories/order-repository-impl.ts` returns the `OrderGatewayResult` DTO as-is — no `XEntity.fromObject` call.
- `src/infraestructure/mappers/order.mapper.ts` maps `OrderRequestAdapterDto` <-> `mercadopago/dist/clients/order/*` SDK types.

`PaymentModel` is the local projection of that external state.

### Payments and orders (MercadoPago Orders API)

The payment feature targets MercadoPago's **Orders API**, not the legacy v1 Payments API. `PaymentService` (`src/domain/services/PaymentService.ts`) exposes `createOrder` / `findOrderById` / `findPaymentsMethods` / `findIdentificationTypes`.

- **Pre-checkout** (`/api/payments`, no JWT): `GET /methods`, `GET /identification-types`, `POST /total` (cart preview via `CalculateTotal`).
- **Checkout** (`/api/orders`, JWT): `POST /` -> `OrderRequestAdapterDto.create(req.body)` -> `CreateOrder` -> creates a local `Payment` with `status: 'pending'`, `id_payment: null` -> `OrderRepository.createOrder` -> MP order created with `external_reference = <payment _id>` -> local payment updated with `id_payment = <MP order id>` + status. Item prices are recomputed server-side from `CourseRepository`; client-supplied prices are ignored.
- **Webhook** (`POST /api/orders/notifications`, no JWT): `PaymentMiddleware.validateMercadoPagoNotification` verifies HMAC-SHA256 over `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` using `MERCADOPAGO_WEBHOOK_SECRET_KEY`. The controller ACKs 200 immediately and dispatches `FulfillPayment` fire-and-forget. `FulfillPayment` **re-reads authoritative state from the gateway** instead of trusting the webhook body, then resolves the local row via `PaymentRepository.updatePaymentByIdPayment`.
- **Order read** (`GET /api/orders/:id`, JWT): straight gateway read-through.
- **Correlation keys**: `external_reference` = Mongo payment `_id` (outbound), `id_payment` = MP order id (inbound).
- **Status enum**: `['pending','in_process','processed','rejected']` (`src/data/mongo/models/payment.model.ts`). `'processed'` is the success state everywhere.
- **Pending-first persistence**: the payment row is created *before* the gateway call, so `id_payment` and `method` are nullable/optional across the model, `PaymentEntity` and `PaymentResponseDto`.
- **Known debt, not design**: there is no idempotency guard. `id_payment` no longer carries a `unique` index, and both `CreateOrder` and `FulfillPayment` create enrollments when they see `'processed'` — a webhook redelivery duplicates enrollments.

### DTO naming

Convention is `PascalCase` + `Dto` suffix (`PaymentUpdateDto`, `OrderRequestAdapterDto`). Pure response shapes are plain interfaces with no `create()` factory (`PaymentResponseDto`, `OrderGatewayResult`, `PaymentMethodsResponse`). `PaymentRequestDTO` (all-caps `DTO`) is a deviation to normalize, not a pattern to copy.

### Error handling

Use-cases and repositories throw `CustomError` (or let underlying errors propagate); repositories generally `try/catch` and rethrow. Controllers catch at the boundary and call `HandlerResponses.handleError(error, res)`, which maps `CustomError` to its `statusCode`/`message` and anything else to a generic 500.

### Auth

`AuthMiddleware.validateJWT` reads `Authorization: Bearer <token>`, validates via `TokenManager` (JWT adapter), loads the user via `AuthRepository`, and attaches it as `req.user`. `validatePermissions(roles)` gates by `user.role`. `validateAndAssignOwner` stamps `req.body.id_owner` from the authenticated user for create endpoints.

Social login goes through the `SocialAuthProvider` contract (`src/domain/services/SocialAuthProvider.ts`), implemented by `GoogleAdapter` (`src/config/adapters/google.adapter.ts`) using `google-auth-library` + `GOOGLE_AUTH_CLIENT_ID`/`GOOGLE_AUTH_SECRET`.

### Transactions

Multi-step domain operations that must be atomic (e.g. enrolling a user, marking a lesson complete) take a `UnitOfWork` dependency and run through `unitOfWork.startTransaction(async (ts) => { ... })`, which wraps a Mongoose `ClientSession` (commit/abort handled in `MongooseUnitOfWork`).

## Specs

`specs/*.md` holds versioned work specs (`01-standardize-upload-folder-names.md`, `02-seed-mock-inicializacion-db.md`). Workflow is spec -> branch -> PR (see commits `83b3be3`, `dd21905`). Check `specs/` before starting a numbered feature.

## Testing

Tests live under `tests/`, mirroring `src/` structure (`tests/domain/...`, `tests/infraestructure/...`, `tests/presentation/...`). Jest uses `ts-jest` preset, `jest-environment-node`, coverage collection on by default. No path alias config — imports in tests use relative paths into `src/`.

Coverage is partial, not mirrored: only `auth` (datasource, repository, register-user, user entity), `envs`, `server`, `init` and `user.model` are covered. There are no tests for payment, order, course, lesson, module, category, enrollment or file.
