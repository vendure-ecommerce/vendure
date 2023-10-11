import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * Defines how user passwords get hashed when using the {@link NativeAuthenticationStrategy}.
 *
 * :::info
 *
 * This is configured via the `authOptions.passwordHashingStrategy` property of
 * your VendureConfig.
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
