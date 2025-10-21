import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * Defines how sensitive user credentials like passwords and API-Keys get hashed.
 *
 * :::info Config
 *
 * Hashing for passwords when using the {@link NativeAuthenticationStrategy} can be
 * configured via the `authOptions.passwordHashingStrategy` property of
 * your VendureConfig.
 *
 * Hashing for API-Keys can be configured via the {@link ApiKeyAuthorizationOptions},
 * more specifically `authOptions.adminApiKeyAuthorizationOptions.hashingStrategy` and
 * `authOptions.shopApiKeyAuthorizationOptions.hashingStrategy`.
 *
 * :::
 *
 * @docsCategory auth
 * @since 1.3.0
 */
export interface PasswordHashingStrategy extends InjectableStrategy {
    hash(plaintext: string): Promise<string>;
    check(plaintext: string, hash: string): Promise<boolean>;
}
