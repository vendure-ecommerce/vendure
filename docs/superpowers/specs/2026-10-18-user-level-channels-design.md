# User-level channel assignment — design

## Intent
Today a Role carries both permissions and Channels. To give two businesses the same permissions on
different Channels, you must clone the Role (`Business_1`, `Business_2`). Reusing one Role means adding
Channels to it, which silently grants every holder of that Role access to all of them. For multi-vendor /
multi-tenant setups this is a design flaw.

Goal: let a Role describe *what* a user can do, and let the User describe *where*.

## Rule (decided)
- A User gets a new many-to-many relation to Channel (`User.channels`).
- **If a user has one or more user-level channels, those channels are the user's only channels.** Role
  channels are ignored for that user.
- **If a user has none, role channels apply exactly as today.**
- Permissions on each accessible channel = union of the permissions of all the user's roles.

## Scope (decided)
Everywhere: database, services, auth/permission checks, GraphQL Admin API, dashboard, legacy admin-ui, tests.

## Goals
- Reuse one Role across many Channels without cross-channel leakage.
- Fully backward compatible: no behaviour change for users with no user-level channels. No data migration
  of existing rows.

## Non-goals
- Removing or deprecating Role.channels.
- Per-channel permission differences for the same Role (a Role's permissions apply on every channel the
  user has).

## Anti-goals
- Any path where a user with user-level channels can still reach a channel through a role-level channel
  (session cache, auth guard, request context, order entity resolver channel checks).

## Findings from the code
- Single chokepoint: `getChannelPermissions(roles)` / `getUserChannelsPermissions(user)` in
  `packages/core/src/service/helpers/utils/get-user-channels-permissions.ts`. Used by `session.service.ts`,
  `role.service.ts`, `request-context.service.ts`, `base-auth.resolver.ts`.
- Places that eager-load `roles.channels` and must also load `channels`: `session.service.ts`,
  `auth.service.ts`, `api/middleware/auth-guard.ts`, `user.service.ts`, `role.service.ts`.
- `User` entity: `packages/core/src/entity/user/user.entity.ts` (has `roles` ManyToMany + JoinTable).
- Downstream consumers of `ctx.session.user.channelPermissions` (e.g. `order-entity.resolver.ts`,
  `request-context.ts`) need no logic change if the chokepoint is correct.

## My calls (not decided by you — please check)
- Many channels per user (many-to-many).
- Administrator create/update inputs gain `channelIds`; the actor may only assign channels they can
  themselves access (mirrors role assignment). Exposed on `Administrator`/`User` GraphQL types.
- New join table via a TypeORM migration; empty = legacy behaviour.
- A user with user-level channels but no roles has no permissions (unchanged).
- Superadmin behaviour unchanged.

## Left to the builder
Exact GraphQL field/input names, migration mechanics, dashboard/admin-ui component placement, and the test
split between unit tests (chokepoint) and e2e tests (isolation across channels).
