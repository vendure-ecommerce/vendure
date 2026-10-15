import { createContext, ReactNode } from 'react';

/**
 * @description
 * The Vendure Platform facts that the Platform page shows next to the public capability catalog.
 *
 * @docsCategory extensions-api
 * @docsPage Platform Capabilities
 * @since 3.8.1
 */
export interface PlatformCapabilities {
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

export const PlatformCapabilitiesContext = createContext<PlatformCapabilities | undefined>(undefined);

/**
 * @description
 * Gives the granted Vendure Platform capabilities to the Platform page. Without this provider,
 * the Platform page shows all capabilities as locked.
 *
 * Mount it from a dashboard extension with the `customProviders` extension point:
 *
 * @example
 * ```tsx
 * import { defineDashboardExtension, PlatformCapabilitiesProvider } from '\@vendure/dashboard';
 *
 * function GrantedCapabilities({ children }: { children: React.ReactNode }) {
 *     const granted = useMyGrantedCapabilities();
 *     return (
 *         <PlatformCapabilitiesProvider value={{ grantedCapabilities: granted }}>
 *             {children}
 *         </PlatformCapabilitiesProvider>
 *     );
 * }
 *
 * defineDashboardExtension({
 *     customProviders: [{ id: 'my-granted-capabilities', component: GrantedCapabilities }],
 * });
 * ```
 *
 * @docsCategory extensions-api
 * @docsPage Platform Capabilities
 * @since 3.8.1
 */
export function PlatformCapabilitiesProvider({
    value,
    children,
}: Readonly<{ value: PlatformCapabilities; children: ReactNode }>) {
    return (
        <PlatformCapabilitiesContext.Provider value={value}>{children}</PlatformCapabilitiesContext.Provider>
    );
}
