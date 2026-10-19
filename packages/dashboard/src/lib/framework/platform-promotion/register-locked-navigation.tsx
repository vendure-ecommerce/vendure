import { LockedCapabilityPage } from '@/vdb/components/platform-promotion/locked-capability-page.js';
import {
    ArrowLeftRight,
    FileText,
    LayoutGrid,
    LucideIcon,
    Search,
    ShieldCheck,
    Tag,
    Wrench,
} from 'lucide-react';

import {
    addNavMenuItem,
    addNavMenuSection,
    getNavMenuConfig,
    NavMenuConfig,
    NavMenuItem,
} from '../nav-menu/nav-menu-extensions.js';
import { extensionRoutes, registerRoute } from '../page/page-api.js';

import type { DashboardPromotionV1 } from './platform-promotion-types.js';

// The icons of the Platform nav sections. Importing only these keeps the other lucide icons
// out of the bundle. An unknown name falls back to a neutral icon.
const SECTION_ICONS: Record<string, LucideIcon> = {
    ArrowLeftRight,
    FileText,
    Search,
    ShieldCheck,
    Tag,
    Wrench,
};

/** Maps the id of each locked nav item which this module added to its capability key. */
const lockedNavItemCapabilities = new Map<string, string>();

export function getLockedNavItemCapability(itemId: string): string | undefined {
    return lockedNavItemCapabilities.get(itemId);
}

function navItems(config: NavMenuConfig): NavMenuItem[] {
    return config.sections.flatMap(section => ('url' in section ? [section] : (section.items ?? [])));
}

/**
 * Adds the promoted Platform nav items, and a locked page at the route of each one.
 * Call it after the extensions are registered: when a Platform plugin is installed, its own
 * nav item and route are already there, and the locked entry is not added.
 *
 * All promoted items are added, because the License Guard can report the granted set later.
 * The nav menu and the locked page hide an item while its capability is not locked.
 */
export function registerLockedNavigation(promotion: DashboardPromotionV1) {
    for (const item of promotion.navItems.filter(i => i.promoted)) {
        const config = getNavMenuConfig();
        if (navItems(config).some(existing => existing.id === item.id || existing.url === item.url)) {
            continue;
        }
        if (!config.sections.some(section => section.id === item.sectionId)) {
            const section = promotion.navSections.find(s => s.id === item.sectionId);
            if (!section) {
                continue;
            }
            addNavMenuSection({
                id: section.id,
                title: section.label,
                icon: SECTION_ICONS[section.icon] ?? LayoutGrid,
                order: section.order,
                placement: section.placement,
                items: [],
            });
        }
        addNavMenuItem({ id: item.id, title: item.label, url: item.url, order: item.order }, item.sectionId);
        lockedNavItemCapabilities.set(item.id, item.capability);
        if (!extensionRoutes.has(item.url)) {
            registerRoute({ path: item.url, component: () => <LockedCapabilityPage navItem={item} /> });
        }
    }
}
