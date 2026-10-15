import { createContext, ReactNode } from 'react';

/**
 * @description
 * The plan facts that the Plans page shows next to the public capability catalog.
 *
 * @docsCategory extensions-api
 * @docsPage Plan Capabilities
 * @since 3.8.1
 */
export interface PlanCapabilities {
    /**
     * @description
     * The capability keys that this application has, for example `'org.accounts'`.
     * The keys are the `key` values of the public Vendure Console catalog.
     */
    grantedCapabilities: string[];
    /**
     * @description
     * The ID of the Vendure Console Project that this application is linked to.
     * When it is set, the "Open Vendure Console" button opens the subscription page of that Project.
     */
    consoleProjectId?: string;
}

export const PlanCapabilitiesContext = createContext<PlanCapabilities | undefined>(undefined);

/**
 * @description
 * Gives the granted plan capabilities to the Plans page. Without this provider,
 * the Plans page shows all capabilities as locked.
 *
 * Mount it from a dashboard extension with the `customProviders` extension point:
 *
 * @example
 * ```tsx
 * import { defineDashboardExtension, PlanCapabilitiesProvider } from '\@vendure/dashboard';
 *
 * function GrantedCapabilities({ children }: { children: React.ReactNode }) {
 *     const granted = useMyGrantedCapabilities();
 *     return (
 *         <PlanCapabilitiesProvider value={{ grantedCapabilities: granted }}>
 *             {children}
 *         </PlanCapabilitiesProvider>
 *     );
 * }
 *
 * defineDashboardExtension({
 *     customProviders: [{ id: 'my-granted-capabilities', component: GrantedCapabilities }],
 * });
 * ```
 *
 * @docsCategory extensions-api
 * @docsPage Plan Capabilities
 * @since 3.8.1
 */
export function PlanCapabilitiesProvider({
    value,
    children,
}: Readonly<{ value: PlanCapabilities; children: ReactNode }>) {
    return <PlanCapabilitiesContext.Provider value={value}>{children}</PlanCapabilitiesContext.Provider>;
}
