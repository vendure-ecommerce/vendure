import { registerDashboardWidget } from '../dashboard-widget/widget-extensions.js';
import {
    registerDashboardActionBarItem,
    registerDashboardPageBlock,
} from '../layout-engine/layout-extensions.js';
import { addNavMenuItem, NavMenuItem } from '../nav-menu/nav-menu-extensions.js';
import { registerRoute } from '../page/page-api.js';
import { globalRegistry } from '../registry/global-registry.js';

import { DashboardExtension } from './extension-api-types.js';

globalRegistry.register('extensionSourceChangeCallbacks', new Set<() => void>());
globalRegistry.register('registerDashboardExtensionCallbacks', new Set<() => void>());

export function onExtensionSourceChange(callback: () => void) {
    globalRegistry.get('extensionSourceChangeCallbacks').add(callback);
}

export function executeDashboardExtensionCallbacks() {
    for (const callback of globalRegistry.get('registerDashboardExtensionCallbacks') ?? []) {
        callback();
    }
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * The main entry point for extensions to the React-based dashboard.
 *
 *
 * @docsCategory extensions
 * @since 3.3.0
 */
export function defineDashboardExtension(extension: DashboardExtension) {
    globalRegistry.get('registerDashboardExtensionCallbacks').add(() => {
        if (extension.routes) {
            for (const route of extension.routes) {
                if (route.navMenuItem) {
                    // Add the nav menu item
                    const item: NavMenuItem = {
                        url: route.navMenuItem.url ?? route.path,
                        id: route.navMenuItem.id ?? route.path,
                        title: route.navMenuItem.title ?? route.path,
                    };
                    addNavMenuItem(item, route.navMenuItem.sectionId);
                }
                if (route.path) {
                    // Configure a list page
                    registerRoute(route);
                }
            }
        }
        if (extension.actionBarItems) {
            for (const item of extension.actionBarItems) {
                registerDashboardActionBarItem(item);
            }
        }
        if (extension.pageBlocks) {
            for (const block of extension.pageBlocks) {
                registerDashboardPageBlock(block);
            }
        }
        if (extension.widgets) {
            for (const widget of extension.widgets) {
                registerDashboardWidget(widget);
            }
        }
        const callbacks = globalRegistry.get('extensionSourceChangeCallbacks');
        if (callbacks.size) {
            for (const callback of callbacks) {
                callback();
            }
        }
    });
}
