import {
    PlatformCapabilities,
    PlatformCapabilitiesContext,
} from '@/vdb/framework/platform/platform-capabilities.js';
import { useContext } from 'react';

/**
 * @description
 * Returns the facts that a {@link PlatformCapabilitiesProvider} gives, or `undefined` when no
 * extension mounts one.
 *
 * @docsCategory hooks
 * @docsPage usePlatformCapabilities
 * @since 3.8.1
 */
export function usePlatformCapabilities(): PlatformCapabilities | undefined {
    return useContext(PlatformCapabilitiesContext);
}
