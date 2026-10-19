import { Plugin } from 'vite';

import { platformPromotionSnapshot } from './platform-promotion-snapshot.js';
import { getActivePluginNames } from './utils/get-active-plugin-info.js';
import { ConfigLoaderApi, getConfigLoaderApi } from './vite-plugin-config-loader.js';

const virtualModuleId = 'virtual:vendure-platform-promotion';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export const PLATFORM_CATALOG_URL = 'https://api.vendure.io/v1/catalog';
export const PLATFORM_CATALOG_TIMEOUT_MS = 2000;
/**
 * Set this environment variable to `true` to skip the catalog fetch. The build then uses
 * the snapshot that ships with `@vendure/dashboard`.
 */
export const SKIP_PLATFORM_CATALOG_FETCH_ENV = 'VENDURE_DASHBOARD_SKIP_PLATFORM_CATALOG_FETCH';
const LICENSE_GUARD_PLUGIN_NAME = 'LicenseGuardPlugin';

/**
 * Fetches the `dashboardPromotion` data from the Vendure catalog one time. If the fetch
 * is skipped, fails, takes longer than the timeout or returns an unknown version, it
 * returns the snapshot that ships with `@vendure/dashboard`. It never throws.
 */
export async function loadDashboardPromotion(
    log: (message: string) => void = () => undefined,
): Promise<object> {
    if (process.env[SKIP_PLATFORM_CATALOG_FETCH_ENV] === 'true') {
        return platformPromotionSnapshot;
    }
    try {
        const response = await fetch(PLATFORM_CATALOG_URL, {
            signal: AbortSignal.timeout(PLATFORM_CATALOG_TIMEOUT_MS),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const body = (await response.json()) as { dashboardPromotion?: unknown } | null;
        if (!isDashboardPromotionV1(body?.dashboardPromotion)) {
            throw new Error('the response has no valid dashboardPromotion with version 1');
        }
        return body.dashboardPromotion;
    } catch (e: unknown) {
        const reason = e instanceof Error ? e.message : String(e);
        log(`Could not fetch the Platform catalog (${reason}). Using the bundled snapshot.`);
        return platformPromotionSnapshot;
    }
}

const TIERS: readonly unknown[] = ['starter', 'growth', 'scale', 'enterprise'];
const isString = (value: unknown): value is string => typeof value === 'string';
const isArrayOf = (value: unknown, check: (item: any) => boolean): value is unknown[] =>
    Array.isArray(value) && value.every(item => item != null && typeof item === 'object' && check(item));

/**
 * Checks the required fields of `DashboardPromotionV1`. A payload that fails this check is not used.
 * The type is `DashboardPromotionV1` in `src/lib/framework/platform-promotion/platform-promotion-types.ts`.
 * The Vite plugin code cannot import from `src`, so it checks the shape at runtime.
 */
export function isDashboardPromotionV1(value: any): value is object {
    return (
        value?.version === 1 &&
        isArrayOf(
            value.navSections,
            s =>
                isString(s.id) &&
                isString(s.label) &&
                isString(s.icon) &&
                (s.placement === 'top' || s.placement === 'bottom') &&
                typeof s.order === 'number',
        ) &&
        isArrayOf(
            value.navItems,
            i =>
                isString(i.capability) &&
                isString(i.sectionId) &&
                isString(i.id) &&
                isString(i.label) &&
                isString(i.url) &&
                (i.order === undefined || typeof i.order === 'number') &&
                typeof i.promoted === 'boolean' &&
                (i.page?.kind === 'list' || i.page?.kind === 'detail') &&
                isString(i.page.title),
        ) &&
        isArrayOf(
            value.pageBlocks,
            b =>
                isString(b.capability) &&
                isString(b.pageId) &&
                isString(b.blockId) &&
                (b.column === 'main' || b.column === 'side') &&
                isString(b.title),
        ) &&
        isArrayOf(value.actions, a => isString(a.capability) && isString(a.pageId) && isString(a.label)) &&
        isArrayOf(
            value.capabilities,
            c =>
                isString(c.key) &&
                TIERS.includes(c.tier) &&
                isString(c.title) &&
                isString(c.summary) &&
                Array.isArray(c.benefits) &&
                c.benefits.length === 3 &&
                c.benefits.every(isString) &&
                (c.cta === 'trial' || c.cta === 'sales'),
        )
    );
}

/**
 * This Vite plugin supplies the `virtual:vendure-platform-promotion` module. It holds the
 * Platform catalog data (`dashboardPromotion`) that the Dashboard uses to show locked
 * Platform items, and `licenseGuardConfigured`, which is `true` when the Vendure config
 * contains the License Guard plugin.
 *
 * The data is read at build time (and at dev server start), so the browser makes no
 * request to `api.vendure.io`.
 */
export function platformPromotionPlugin(): Plugin {
    let configLoaderApi: ConfigLoaderApi;
    let dashboardPromotion: Promise<object> | undefined;
    return {
        name: 'vendure:platform-promotion',
        configResolved({ plugins }) {
            configLoaderApi = getConfigLoaderApi(plugins);
        },
        buildStart() {
            dashboardPromotion ??= loadDashboardPromotion(message => this.warn(message));
        },
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(id) {
            if (id === resolvedVirtualModuleId) {
                dashboardPromotion ??= loadDashboardPromotion(message => this.warn(message));
                const [promotion, { vendureConfig }] = await Promise.all([
                    dashboardPromotion,
                    configLoaderApi.getVendureConfig(),
                ]);
                const licenseGuardConfigured =
                    getActivePluginNames(vendureConfig).has(LICENSE_GUARD_PLUGIN_NAME);
                return [
                    `export const dashboardPromotion = ${JSON.stringify(promotion)};`,
                    `export const licenseGuardConfigured = ${JSON.stringify(licenseGuardConfigured)};`,
                ].join('\n');
            }
        },
    };
}
