import { DashboardExtension } from '@/framework/extension-api/extension-api-types.js';
import { addNavMenuItem, NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { registerRoute } from '@/framework/page/page-api.js';

const extensionSourceChangeCallbacks = new Set<() => void>();

export function onExtensionSourceChange(callback: () => void) {
    extensionSourceChangeCallbacks.add(callback);
}

export function defineDashboardExtension(extension: DashboardExtension) {
    if (extension.routes) {
        for (const route of extension.routes) {
            if (route.navMenuItem) {
                // Add the nav menu item
                const item: NavMenuItem = {
                    url: route.navMenuItem.url ?? route.path,
                    id: route.navMenuItem.id ?? route.id,
                    title: route.navMenuItem.title,
                };
                addNavMenuItem(item, route.navMenuItem.sectionId);
            }
            if (route.path) {
                // Configure a list page
                registerRoute(route);
            }
        }
    }
    if (extensionSourceChangeCallbacks.size) {
        for (const callback of extensionSourceChangeCallbacks) {
            callback();
        }
    }
}
