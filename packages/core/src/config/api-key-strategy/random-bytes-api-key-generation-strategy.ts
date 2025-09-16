import { randomBytes } from 'node:crypto';

import { RequestContext } from '../../api';

import { ApiKeyGenerationStrategy } from './api-key-generation-strategy';

export interface RandomBytesApiKeyGenerationStrategyOptions {
    /**
     * The number of bytes to generate. The size must not be larger than 2**31 - 1.
     * This is the input size for `crypto.randomBytes`
     *
     * @default 32
     * @see {@link RANDOM_BYTES_API_KEY_GENERATION_STRATEGY_DEFAULT_SIZE}
     */
    size?: number;
}

export const RANDOM_BYTES_API_KEY_GENERATION_STRATEGY_DEFAULT_SIZE = 32;

/**
 * @description
 * A generation strategy that uses `node:crypto` to generate random hex strings for API-Keys via `randomBytes`.
 *
 * @docsCategory auth
 * @since // TODO
 */
export class RandomBytesApiKeyGenerationStrategy implements ApiKeyGenerationStrategy {
    readonly size: number;

    constructor(input?: RandomBytesApiKeyGenerationStrategyOptions) {
        this.size = input?.size ?? RANDOM_BYTES_API_KEY_GENERATION_STRATEGY_DEFAULT_SIZE;
    }

    generateApiKey(_ctx: RequestContext): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(this.size, (err, buf) => {
                if (err) reject(err);
                else resolve(buf.toString('hex'));
            });
        });
    }
}
