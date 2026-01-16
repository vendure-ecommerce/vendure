# Vendure Development Guide

## Project Overview

Vendure is a headless e-commerce framework built on NestJS, TypeORM, and GraphQL. This is a Lerna monorepo (fixed versioning) containing all official packages.

## Key Architecture

- **Backend**: NestJS + Apollo GraphQL + TypeORM
- **Admin UI (legacy)**: Angular 19 + Clarity UI
- **Dashboard (new)**: React 19 + Radix UI + Vite
- **Package Manager**: npm + Lerna v9
- **Testing**: Vitest
- **Node**: >= 20

## Package Structure

### Core Packages
- `@vendure/core` - Main server framework
- `@vendure/common` - Shared types/utilities
- `@vendure/testing` - E2E test utilities

### UI Packages
- `@vendure/admin-ui` - Angular admin (legacy)
- `@vendure/dashboard` - React admin (new, replacing Angular)
- `@vendure/admin-ui-plugin` - Serves admin UI
- `@vendure/ui-devkit` - UI extension authoring

### Plugins
- `@vendure/asset-server-plugin` - Asset serving + S3
- `@vendure/email-plugin` - Email notifications
- `@vendure/elasticsearch-plugin` - Search
- `@vendure/job-queue-plugin` - BullMQ/Pub-Sub jobs
- `@vendure/payments-plugin` - Stripe/Mollie
- `@vendure/graphiql-plugin` - GraphQL IDE
- `@vendure/harden-plugin` - Security hardening
- `@vendure/sentry-plugin` - Error tracking

### Development Only
- `dev-server` - Local dev environment (NOT published)
- `e2e-common` - Shared E2E config

## Development Workflow

### Standard Flow
1. Make changes to a package
2. Build that package: `cd packages/<name> && npm run build` (or `npm run watch` for continuous)
3. If needed, update `packages/dev-server/dev-config.ts` to test new features
4. Restart dev server: `cd packages/dev-server && npm run dev`
5. Run e2e tests `cd packages/<name> && npm run e2e <test-file>`

### Initial Setup
```bash
npm install
npm run build
docker-compose up -d mariadb
cd packages/dev-server
npm run populate
npm run dev
```

### Common Commands

**From root:**
```bash
npm run build              # Build all packages
npm run watch:core-common  # Watch core + common (most common during dev)
npm run test               # Run all unit tests (prefer targeted runs in package dirs)
npm run e2e                # Run all E2E tests (prefer targeted runs in package dirs)
npm run lint               # ESLint with auto-fix
npm run codegen            # Generate GraphQL types
```

**From packages/dev-server:**
```bash
npm run dev                # Start server + worker
npm run populate           # Seed database with test data
npm run dashboard:dev      # Vite dev for dashboard
```

### Database Options
```bash
# Default: MariaDB
docker-compose up -d mariadb

# PostgreSQL
docker-compose up -d postgres_16
DB=postgres npm run populate

# SQLite (no Docker needed)
DB=sqlite npm run populate
```

## Testing

- **Unit tests**: Co-located as `*.spec.ts`, run with `npm run test`
- **E2E tests**: In `packages/<name>/e2e/` as `*.e2e-spec.ts`, run with `npm run e2e <test-file>` from package dir
- **E2E cache**: Seed data gets cached in `packages/<name>/e2e/__data__` for speed. Delete to reset after schema changes.

## Code Style

- **Indentation**: 4 spaces
- **Quotes**: Single quotes
- **Line length**: 110 (Prettier), 170 (ESLint max)
- **Trailing commas**: Always
- **Semicolons**: Yes
- **Imports**: Alphabetically sorted with blank lines between groups

## Commit Format

Conventional commits enforced by commitlint:
```
type(scope): message

Types: feat, fix, docs, perf, style, refactor, test, chore
Scopes: core, common, admin-ui, dashboard, email-plugin, etc.
```

## GraphQL

- Two APIs: Admin API (`/admin-api`) and Shop API (`/shop-api`)
- Default port: 3000
- Schema files generated via `npm run codegen`
- Playground available at API paths when debug enabled

## Key Files

- `packages/dev-server/dev-config.ts` - Dev server configuration (plugins, DB, etc.)
- `packages/core/src/config/vendure-config.ts` - VendureConfig type definition
- `lerna.json` - Monorepo version (currently 3.5.2)
- `docker-compose.yml` - Dev infrastructure (DBs, Redis, Elasticsearch, Keycloak)

## Branches

- `master` - Bug fixes (default PR target)
- `minor` - New features
- `major` - Breaking changes

## Tips

- When editing `@vendure/core`, you usually need to watch `@vendure/common` too: `npm run watch:core-common`
- The dev-server imports packages via TypeScript paths, so rebuilds are picked up on restart
- Check `packages/dev-server/test-plugins/` for example plugin implementations
- Dashboard dev uses Vite with HMR, run separately with `npm run dashboard:dev`
