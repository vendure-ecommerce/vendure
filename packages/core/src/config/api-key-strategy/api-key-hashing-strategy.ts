import { InjectableStrategy } from '../../common/types/injectable-strategy';

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
 * on every request that uses API-Key authentication and it needs to be deterministic (i.e. hashing the same
 * input must always produce the same output). The latter is because otherwise it would be impossible to
 * quickly compare the incoming key with a stored hash.
 *
 * :::
 *
 * :::info Config
 *
 * This is configured via the `ApiKeyAuthenticationStrategy` in either:
 *
 * - `authOptions.adminAuthenticationStrategy`
 * - `authOptions.shopAuthenticationStrategy`
 *
 * of your VendureConfig.
 *
 * :::
 *
 * @docsCategory auth
 * @since // TODO
 */
export interface ApiKeyHashingStrategy extends InjectableStrategy {
    /**
     * @description
     * Hashes the given API-Key.
     *
     * @since // TODO
     */
    hash(plaintext: string): Promise<string> | string;
}
