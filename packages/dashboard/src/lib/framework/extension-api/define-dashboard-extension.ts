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
