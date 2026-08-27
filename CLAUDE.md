# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills

Use the /frontend-desing command when implementing changes to the user interface.

Env vars are required (see `src/config/envs.ts`, validated via `env-var`, throws on startup if missing). Local dev reads `.env`; tests read `.env.test` (loaded by `setupTests.ts`, wired via `jest.config.ts` `setupFiles`). `.env.template` lists required keys: `PORT`, `DB_CON`, `DB_NAME`, `SECRET_JWT_SEED`, Cloudinary creds, MercadoPago creds, mailer creds, `WEBSERVICE_URL`.

Docker build is a two-stage build (`Dockerfile`): builder stage runs `npm run build`, runner stage copies `dist/` only and runs as non-root `node` user on port 4201.

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
    services/          # abstract service contracts (Encrypter, TokenManager, FileStorage, EmailValidator, PaymentService, UnitOfWork)
    errors/custom-error.ts   # CustomError — static factories (badRequest/unauthorized/forbidden/notFound/internalServer), the only error type controllers translate to HTTP
    helpers/            # query builders, regex constants

  infraestructure/     # implements domain contracts against Mongoose
    datasources/<feature>-datasource-impl.ts   # talks to Mongoose models directly
    repositories/<feature>-repository-impl.ts  # implements domain/repository/*, delegates to a datasource, maps raw docs to entities via mappers
    mappers/            # raw Mongo doc -> domain entity mapping

  data/
    mongo/models/       # Mongoose schemas/models
    init.ts             # MongoDatabase.connect() (mongoose connection)
    mongoose-unit-of-work.ts   # UnitOfWork impl using Mongoose ClientSession for multi-step transactions (used by enrollment/lesson-completion flows)

  presentation/         # Express layer
    <feature>/<feature>-controller.ts   # thin: extracts req data, builds DTO, calls use-case, calls HandlerResponses
    <feature>/<feature>-routes.ts       # express.Router() wiring middlewares + controller methods
    middlewares/          # AuthMiddleware (JWT validation, role checks, owner-assignment), CourseMiddleware, FileMiddleware, PaymentMiddleware, PaginationMiddleware
    helpers/handler-responses.ts   # HandlerResponses.handleSuccess/handleError/handleAuthSuccess — the only place HTTP status/JSON shape is decided
    dependency-container.ts   # manual DI, singleton (DependencyContainer.getInstance()) — wires adapters -> repositories -> middlewares -> controllers by hand; this is where new features get registered
    routes.ts              # AppRoutes.routes mounts each feature router under /api/<feature>
    server.ts              # Server class: express app setup (json body parser, cors, express-fileupload 50MB limit, static /public), listens on configured port

  config/
    envs.ts                # single source of truth for env vars, validated at import time
    adapters/               # concrete implementations of domain/services contracts (BcryptAdapter, JwtAdapter, CloudinaryAdapter, EmailSenderAdapter, MercadoPagoAdapter)

  app.ts                  # entrypoint: connects to Mongo with retry (5 attempts, 2s backoff), then starts Server with AppRoutes.routes
```

### Adding a new feature end-to-end

Follow the existing pattern for e.g. `course` or `lesson`: entity + DTOs in `domain`, abstract `repository`/`datasource` in `domain`, use-case(s) in `domain/use-cases/<feature>`, then `infraestructure/datasources/<feature>-datasource-impl.ts` + `infraestructure/repositories/<feature>-repository-impl.ts` + a mapper, a Mongoose model in `data/mongo/models`, and finally a controller + routes in `presentation`. Register everything in `dependency-container.ts` and mount the router in `presentation/routes.ts`.

### Error handling

Use-cases and repositories throw `CustomError` (or let underlying errors propagate); repositories generally `try/catch` and rethrow. Controllers catch at the boundary and call `HandlerResponses.handleError(error, res)`, which maps `CustomError` to its `statusCode`/`message` and anything else to a generic 500.

### Auth

`AuthMiddleware.validateJWT` reads `Authorization: Bearer <token>`, validates via `TokenManager` (JWT adapter), loads the user via `AuthRepository`, and attaches it as `req.user`. `validatePermissions(roles)` gates by `user.role`. `validateAndAssignOwner` stamps `req.body.id_owner` from the authenticated user for create endpoints.

### Transactions

Multi-step domain operations that must be atomic (e.g. enrolling a user, marking a lesson complete) take a `UnitOfWork` dependency and run through `unitOfWork.startTransaction(async (ts) => { ... })`, which wraps a Mongoose `ClientSession` (commit/abort handled in `MongooseUnitOfWork`).

## Testing

Tests live under `tests/`, mirroring `src/` structure (`tests/domain/...`, `tests/infraestructure/...`, `tests/presentation/...`). Jest uses `ts-jest` preset, `jest-environment-node`, coverage collection on by default. No path alias config — imports in tests use relative paths into `src/`.
