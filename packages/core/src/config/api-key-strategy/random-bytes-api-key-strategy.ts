import { randomBytes } from 'node:crypto';

import { RequestContext } from '../../api';
import { BcryptPasswordHashingStrategy } from '../auth/bcrypt-password-hashing-strategy';
import { PasswordHashingStrategy } from '../auth/password-hashing-strategy';

import { ApiKeyStrategy, BaseApiKeyStrategy } from './api-key-strategy';

export const DEFAULT_SIZE_RANDOM_BYTES_KEY = 32;
export const DEFAULT_SIZE_RANDOM_BYTES_LOOKUP = 12;

/**
 * @see {@link RandomBytesApiKeyStrategy}
 * @since 3.6.0
 */
export interface RandomBytesApiKeyStrategyOptions {
    /**
     * @description
     * The number of bytes to generate. The size must not be larger than 2**31 - 1.
     * This is the input size for `crypto.randomBytes`
     *
     * @default 32
     * @see {@link DEFAULT_SIZE_RANDOM_BYTES_KEY}
     */
    sizeKey?: number;
    /**
     * @description
     * The number of bytes to generate. The size must not be larger than 2**31 - 1.
     * This is the input size for `crypto.randomBytes`
     *
     * @default 12
     * @see {@link DEFAULT_SIZE_RANDOM_BYTES_LOOKUP}
     */
    sizeLookupId?: number;
    /**
     * @description
     * Defines a custom strategy for how API-Keys get hashed and checked.
     * Performance considerations should be kept in mind, for more info see {@link ApiKeyStrategy}.
     *
     * @default {BcryptPasswordHashingStrategy}
     */
    hashingStrategy?: PasswordHashingStrategy;
}

/**
 * @description
 * A generation strategy that uses `node:crypto` to generate random hex strings for API-Keys via `randomBytes`.
 *
 * This strategy defines API-Keys where both parts are the aforementioned random bytes like so:
 *
 * ```text
 * <lookupId>:<apiKey>
 * ```
 *
 * Note the colon `':'` delimiter between the lookup ID and the api key.
 *
 * @docsCategory auth
 * @since 3.6.0
 */
export class RandomBytesApiKeyStrategy extends BaseApiKeyStrategy {
    readonly sizeKey: number;
    readonly sizeLookupId: number;
    readonly hashingStrategy: PasswordHashingStrategy;

    constructor(input?: RandomBytesApiKeyStrategyOptions) {
        super();
        this.sizeKey = input?.sizeKey ?? DEFAULT_SIZE_RANDOM_BYTES_KEY;
        this.sizeLookupId = input?.sizeLookupId ?? DEFAULT_SIZE_RANDOM_BYTES_LOOKUP;
        this.hashingStrategy = input?.hashingStrategy ?? new BcryptPasswordHashingStrategy();
    }

    generateSecret(ctx: RequestContext): Promise<string> {
        return this.promisifyRandomBytes(this.sizeKey);
    }

    generateLookupId(ctx: RequestContext): Promise<string> {
        return this.promisifyRandomBytes(this.sizeLookupId);
    }

    private promisifyRandomBytes(size: number): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(size, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf.toString('hex'));
                }
            });
        });
    }
}
