import { randomBytes } from 'node:crypto';

import { RequestContext } from '../../api';

import { ApiKeyGenerationStrategy } from './api-key-generation-strategy';
import { ApiKeyLookupIdGenerationStrategy } from './api-key-lookup-id-generation-strategy';

export interface RandomBytesApiKeyGenerationStrategyOptions {
    /**
     * The number of bytes to generate. The size must not be larger than 2**31 - 1.
     * This is the input size for `crypto.randomBytes`
     *
     * @default 32
     * @see {@link DEFAULT_SIZE_RANDOM_BYTES_KEY}
     */
    sizeKey?: number;
    /**
     * The number of bytes to generate. The size must not be larger than 2**31 - 1.
     * This is the input size for `crypto.randomBytes`
     *
     * @default 12
     * @see {@link DEFAULT_SIZE_RANDOM_BYTES_LOOKUP}
     */
    sizeLookupId?: number;
}

export const DEFAULT_SIZE_RANDOM_BYTES_KEY = 32;
export const DEFAULT_SIZE_RANDOM_BYTES_LOOKUP = 12;

/**
 * @description
 * A generation strategy that uses `node:crypto` to generate random hex strings for API-Keys via `randomBytes`.
 *
 * @docsCategory auth
 * @since // TODO
 */
export class RandomBytesApiKeyGenerationStrategy
    implements ApiKeyGenerationStrategy, ApiKeyLookupIdGenerationStrategy
{
    readonly sizeKey: number;
    readonly sizeLookupId: number;

    constructor(input?: RandomBytesApiKeyGenerationStrategyOptions) {
        this.sizeKey = input?.sizeKey ?? DEFAULT_SIZE_RANDOM_BYTES_KEY;
        this.sizeLookupId = input?.sizeLookupId ?? DEFAULT_SIZE_RANDOM_BYTES_LOOKUP;
    }

    generateApiKey(_ctx: RequestContext): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(this.sizeKey, (err, buf) => {
                if (err) reject(err);
                else resolve(buf.toString('hex'));
            });
        });
    }

    generateLookupId(_ctx: RequestContext): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(this.sizeLookupId, (err, buf) => {
                if (err) reject(err);
                else resolve(buf.toString('hex'));
            });
        });
    }
}
