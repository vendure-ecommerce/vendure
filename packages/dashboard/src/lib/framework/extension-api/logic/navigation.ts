import { addNavMenuItem, addNavMenuSection, NavMenuItem } from '../../nav-menu/nav-menu-extensions.js';
import { registerRoute } from '../../page/page-api.js';
import { DashboardNavSectionDefinition, DashboardRouteDefinition } from '../types/navigation.js';

export function registerNavigationExtensions(
    navSections?: DashboardNavSectionDefinition[],
    routes?: DashboardRouteDefinition[],
) {
    if (navSections) {
        for (const section of navSections) {
            addNavMenuSection({
                ...section,
                placement: 'top',
                order: section.order ?? 999,
                items: [],
            });
        }
    }

    if (routes) {
        for (const route of routes) {
            if (route.navMenuItem) {
                // Add the nav menu item
                const item: NavMenuItem = {
                    url: route.navMenuItem.url ?? route.path,
                    id: route.navMenuItem.id ?? route.path,
                    title: route.navMenuItem.title ?? route.path,
                    order: route.navMenuItem.order,
                };
                addNavMenuItem(item, route.navMenuItem.sectionId);
            }
            if (route.path) {
                // Configure a list page
                registerRoute(route);
            }
        }
    }
}
