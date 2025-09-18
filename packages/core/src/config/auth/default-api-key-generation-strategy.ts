import crypto from 'crypto';

import { ApiKeyGenerationStrategy } from './api-key-generation-strategy';

/**
 * Default API key generator: 32 random bytes, base64url-encoded (43 chars) prefixed with `vk_`.
 * Fingerprint uses SHA-256 hex digest for O(1) lookup.
 * @since 3.5.0
 */
export class DefaultApiKeyGenerationStrategy implements ApiKeyGenerationStrategy {
    async init() {
        return;
    }
    async destroy() {
        return;
    }

    generate(): string {
        return `vk_${crypto.randomBytes(32).toString('base64url')}`;
    }

    fingerprint(rawKey: string): string {
        return crypto.createHash('sha256').update(rawKey).digest('hex');
    }
}
