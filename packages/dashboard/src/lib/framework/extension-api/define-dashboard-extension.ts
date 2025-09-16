import { globalRegistry } from '../registry/global-registry.js';

import { DashboardExtension } from './extension-api-types.js';
import {
    registerAlertExtensions,
    registerDataTableExtensions,
    registerDetailFormExtensions,
    registerFormComponentExtensions,
    registerLayoutExtensions,
    registerLoginExtensions,
    registerNavigationExtensions,
    registerWidgetExtensions,
} from './logic/index.js';

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
 * The main entry point for extensions to the React-based dashboard. Every dashboard extension
 * must contain a call to this function, usually in the entry point file that is referenced by
 * the `dashboard` property of the plugin decorator.
 *
 * Every type of customisation of the dashboard can be defined here, including:
 *
 * - Navigation (nav sections and routes)
 * - Layout (action bar items and page blocks)
 * - Widgets
 * - Form components (custom form components, input components, and display components)
 * - Data tables
 * - Detail forms
 * - Login
 *
 * @example
 * ```tsx
 * defineDashboardExtension({
 *  navSections: [],
 *  routes: [],
 *  pageBlocks: [],
 *  actionBarItems: [],
 * });
 * ```
 *
 *
 * @docsCategory extensions-api
 * @docsPage defineDashboardExtension
 * @docsWeight 0
 * @since 3.3.0
 */
export function defineDashboardExtension(extension: DashboardExtension) {
    globalRegistry.get('registerDashboardExtensionCallbacks').add(() => {
        // Register navigation extensions (nav sections and routes)
        registerNavigationExtensions(extension.navSections, extension.routes);

        // Register layout extensions (action bar items and page blocks)
        registerLayoutExtensions(extension.actionBarItems, extension.pageBlocks);

        // Register widget extensions
        registerWidgetExtensions(extension.widgets);

        // Register form component extensions (custom form components, input components, and display components)
        registerFormComponentExtensions(extension.customFormComponents);

        // Register data table extensions
        registerDataTableExtensions(extension.dataTables);

        // Register detail form extensions
        registerDetailFormExtensions(extension.detailForms);

        // Register alert extensions
        registerAlertExtensions(extension.alerts);

        // Register login extensions
        registerLoginExtensions(extension.login);

        // Execute extension source change callbacks
        const callbacks = globalRegistry.get('extensionSourceChangeCallbacks');
        if (callbacks.size) {
            for (const callback of callbacks) {
                callback();
            }
        }
    });
}
