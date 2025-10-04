import { Injectable } from '@nestjs/common';

import { ApiKeyHashingStrategy } from './api-key-hashing-strategy';

/**
 * A no-op API key hashing strategy that leaves the API keys in plain text.
 * Useful for development or testing environments only! Do not use this in production!
 *
 * @docsCategory auth
 */
@Injectable()
export class NoopApiKeyHashingStrategy implements ApiKeyHashingStrategy {
    /**
     * Returns the API key as-is, without hashing.
     */
    hash(apiKey: string): Promise<string> {
        return Promise.resolve(apiKey);
    }
}
