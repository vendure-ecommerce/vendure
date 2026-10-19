/**
 * @description
 * A Vendure Platform plan tier. A capability's `tier` is the lowest tier that grants it.
 *
 * @docsCategory extensions-api
 * @docsPage PlatformPromotion
 * @since 3.8.1
 */
export type PlatformTier = 'starter' | 'growth' | 'scale' | 'enterprise';

/**
 * @description
 * The commercial copy for one Platform capability, as served by the Vendure catalog.
 *
 * @docsCategory extensions-api
 * @docsPage PlatformPromotion
 * @since 3.8.1
 */
export interface DashboardPromotionCapabilityV1 {
    /**
     * @description
     * The capability key, for example `org.accounts`.
     */
    key: string;
    tier: PlatformTier;
    title: string;
    summary: string;
    /**
     * @description
     * Exactly 3 lines.
     */
    benefits: [string, string, string];
    /**
     * @description
     * `trial` for Starter, Growth and Scale. `sales` for Enterprise.
     */
    cta: 'trial' | 'sales';
}

/**
 * @description
 * Version 1 of the `dashboardPromotion` field of `GET https://api.vendure.io/v1/catalog`.
 * It holds the Dashboard placements of the Vendure Platform plugins, and the commercial
 * copy for each capability.
 *
 * @docsCategory extensions-api
 * @docsPage PlatformPromotion
 * @since 3.8.1
 */
export interface DashboardPromotionV1 {
    version: 1;
    navSections: Array<{
        id: string;
        label: string;
        /**
         * @description
         * The PascalCase name of a lucide-react icon, without the `Icon` suffix, for example `ShieldCheck`.
         */
        icon: string;
        placement: 'top' | 'bottom';
        order: number;
    }>;
    navItems: Array<{
        capability: string;
        sectionId: string;
        id: string;
        label: string;
        url: string;
        /**
         * @description
         * Items with no `order` sort after the ordered items, by title.
         */
        order?: number;
        page: { kind: 'list' | 'detail'; title: string; columns?: string[]; fields?: string[] };
        /**
         * @description
         * `true` on one navigation item per promoted capability. Only these
         * show in the Dashboard navigation as locked items.
         */
        promoted: boolean;
    }>;
    pageBlocks: Array<{
        capability: string;
        pageId: string;
        blockId: string;
        column: 'main' | 'side';
        position?: { blockId: string; order: 'before' | 'after' | 'replace' };
        title: string;
    }>;
    actions: Array<{ capability: string; pageId: string; label: string }>;
    /**
     * @description
     * The copy for each capability that a nav item, page block or action names.
     */
    capabilities: DashboardPromotionCapabilityV1[];
}
