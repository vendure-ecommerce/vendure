import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * Strategy for generating and fingerprinting Admin API keys.
 * Allows customization of key length/format and lookup fingerprinting without changing the data model.
 * @since 3.5.0
 */
export interface ApiKeyGenerationStrategy extends InjectableStrategy {
    /** Generate a new raw API key string. Should be URL-safe if used in headers. */
    generate(): Promise<string> | string;
    /**
     * Return a stable fingerprint for fast DB lookup. Should be deterministic and collision-resistant.
     * Default implementations may use SHA-256 over the raw key.
     */
    fingerprint(rawKey: string): string;
}
