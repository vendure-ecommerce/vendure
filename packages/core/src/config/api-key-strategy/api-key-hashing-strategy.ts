import { PasswordHashingStrategy } from '../auth/password-hashing-strategy';

/**
 * @description
 * Defines a custom strategy for how API-Keys get hashed.
 *
 * :::important Performance Consideration
 *
 * Vendure does not store API-Keys in plain text, but rather a hashed version of the key,
 * similar to how passwords are handled. This means that when a request comes in with an API-Key,
 * Vendure needs to hash the provided key and compare it with the stored hash. This means your hashing
 * strategy must preferably be as fast as possible to avoid performance issues since hashing happens
 * on every request that uses API-Key authentication.
 *
 * :::
 *
 * :::info Config
 *
 * This is configured via the `ApiKeyAuthorizationOptions` in either:
 *
 * - `authOptions.adminApiKeyAuthorizationOptions`
 * - `authOptions.shopApiKeyAuthorizationOptions`
 *
 * of your VendureConfig.
 *
 * :::
 *
 * @docsCategory auth
 * @since // TODO
 */
export interface ApiKeyHashingStrategy extends PasswordHashingStrategy {}
