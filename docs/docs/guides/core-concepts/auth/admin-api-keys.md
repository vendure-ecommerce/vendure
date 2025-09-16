---
title: "Admin API Keys"
---

Since v3.5.0

Admin API keys allow non-interactive, role-scoped access to the Admin API without a username/password. A key is bound to a specific Administrator and inherits that Administrator’s Roles and Channel permissions. Keys are stored securely (hash only) and can be rotated and revoked.

## Enabling ApiKeyAdminAuthStrategy

Add the strategy to your Admin API authentication strategies:

```ts
import { VendureConfig } from '@vendure/core';
import { ApiKeyAdminAuthStrategy } from '@vendure/core';

export const config: VendureConfig = {
  // ...
  authOptions: {
    adminAuthenticationStrategy: [
      // keep existing strategies if any
      new ApiKeyAdminAuthStrategy(),
    ],
    // Optional: configure key prefixes and session TTL for key-based sessions
    adminApiKeyPrefix: { live: 'vk_live_', test: 'vk_test_' },
    adminApiKeySessionDuration: '15m',
  },
};
```

Notes:
- Keys use environment-aware prefixes by default: `vk_live_` in production and `vk_test_` otherwise. You can override via `authOptions.adminApiKeyPrefix`.
- Sessions created via API key use a short TTL by default (`authOptions.adminApiKeySessionDuration`, default `15m`).

## Obtaining an admin session

Use the `authenticate` mutation with the `apiKey` strategy to mint an authenticated session:

```graphql
mutation AuthenticateWithApiKey($input: AuthenticationInput!) {
  authenticate(input: $input) {
    __typename
    ... on CurrentUser {
      id
      identifier
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}
```

Variables:

```json
{
  "input": {
    "apiKey": { "key": "vk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
  }
}
```

On success, a normal Admin session is created and behaves like any other authenticated session (cookie or bearer token depending on your configuration).

## Managing keys

GraphQL operations for keys are in the Admin API:

- `createApiKey(administratorId, name, expiresAt?, notes?)` → returns an `ApiKeyWithSecret` containing the raw key. The raw key is returned only once.
- `rotateApiKey(id)` → creates a new key and revokes the old one. Returns the new raw key.
- `revokeApiKey(id)` → revokes an active key.
- `invalidateApiKeySessions(id)` → invalidates all sessions that were created with the given key.
- `apiKeys(administratorId, options?)` → list keys for an Administrator (supports pagination and filtering).

Recommended practices:
- Prefer rotation over long-lived keys. E.g. rotate on a schedule and at signs of compromise.
- Use `expiresAt` for automatic expiry where feasible.
- Store the raw key in your secret manager at creation/rotation time; you cannot retrieve it later.

## Security guidelines

- Prefixes: Configure recognizable prefixes (e.g. `vk_live_`, `vk_test_`) via `authOptions.adminApiKeyPrefix` to help prevent cross-environment mix-ups.
- Hashing: Only a hash of the key is stored in the database; raw keys are never persisted.
- Logging: Do not log raw keys. Vendure does not log the raw secret at any time; ensure your application code and infrastructure logs don’t capture it either.
- Scope: Keys inherit the bound Administrator’s Roles & Channels. Create dedicated service accounts with the minimal required permissions.
- TTL: Keep `adminApiKeySessionDuration` short to limit the lifetime of non-interactive sessions.

## Administrators and service accounts

Service accounts are Administrators intended for non-interactive access using API keys.

- The `Administrator.isServiceAccount` flag marks a user as a service account.
- The Administrators list hides service accounts by default. SuperAdmins can include them explicitly (see Administrators & Roles guide).

## Permissions

New permission group: API Access

- CRUD: `CreateServiceAccount`, `ReadServiceAccount`, `UpdateServiceAccount`, `DeleteServiceAccount`.
- Use these permissions to manage API keys and service accounts.
