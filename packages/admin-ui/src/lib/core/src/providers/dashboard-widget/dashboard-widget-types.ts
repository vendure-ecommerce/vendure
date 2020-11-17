import { Type } from '@angular/core';

export interface DashboardWidgetConfig {
    /**
     * Used to specify the widget component. Supports both eager- and lazy-loading.
     * @example
     * ```TypeScript
     * // eager-loading
     * loadComponent: () => MyWidgetComponent,
     *
     * // lazy-loading
     * loadComponent: () => import('./path-to/widget.component').then(m => m.MyWidgetComponent),
     * ```
     */
    loadComponent: () => Promise<Type<any>> | Type<any>;
    /**
     * The title of the widget. Can be a translation token as it will get passed
     * through the `translate` pipe.
     */
    title?: string;
    /**
     * The width of the widget, in terms of a Bootstrap-style 12-column grid.
     */
    width: 3 | 4 | 6 | 12;
    /**
     * If set, the widget will only be displayed if the current user has all the
     * specified permissions.
     */
    requiresPermissions?: string[];
}
