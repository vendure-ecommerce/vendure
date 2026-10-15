import { PlanCapabilities, PlanCapabilitiesContext } from '@/vdb/framework/plan/plan-capabilities.js';
import { useContext } from 'react';

/**
 * @description
 * Returns the facts that a {@link PlanCapabilitiesProvider} gives, or `undefined` when no
 * extension mounts one.
 *
 * @docsCategory hooks
 * @docsPage usePlanCapabilities
 * @since 3.8.1
 */
export function usePlanCapabilities(): PlanCapabilities | undefined {
    return useContext(PlanCapabilitiesContext);
}
