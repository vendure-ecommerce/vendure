// Import all domain-specific types
export * from './types/index.js';

// Import types for the main interface
import {
    DashboardActionBarItem,
    DashboardAlertDefinition,
    DashboardCustomFormComponents,
    DashboardDataTableExtensionDefinition,
    DashboardDetailFormExtensionDefinition,
    DashboardDisplayComponent,
    DashboardNavSectionDefinition,
    DashboardPageBlockDefinition,
    DashboardRouteDefinition,
    DashboardWidgetDefinition,
} from './types/index.js';

/**
 * @description
 * **Status: Developer Preview**
 *
 * This is used to define the routes, widgets, etc. that will be displayed in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.3.0
 */
export interface DashboardExtension {
    /**
     * @description
     * Allows you to define custom routes such as list or detail views.
     */
    routes?: DashboardRouteDefinition[];
    /**
     * @description
     * Allows you to define custom nav sections for the dashboard.
     */
    navSections?: DashboardNavSectionDefinition[];
    /**
     * @description
     * Allows you to define custom page blocks for any page in the dashboard.
     */
    pageBlocks?: DashboardPageBlockDefinition[];
    /**
     * @description
     * Allows you to define custom action bar items for any page in the dashboard.
     */
    actionBarItems?: DashboardActionBarItem[];
    /**
     * @description
     * Allows you to define custom alerts that can be displayed in the dashboard.
     */
    alerts?: DashboardAlertDefinition[];
    /**
     * @description
     * Allows you to define custom routes for the dashboard, which will render the
     * given components and optionally also add a nav menu item.
     */
    widgets?: DashboardWidgetDefinition[];
    /**
     * @description
     * Unified registration for custom form components including custom field components
     * and input components.
     */
    customFormComponents?: DashboardCustomFormComponents;
    /**
     * @description
     * Allows you to define custom display components that can be used to render
     * data in tables, detail views, and other places in the dashboard.
     */
    displayComponents?: DashboardDisplayComponent[];
    /**
     * @description
     * Allows you to customize aspects of existing data tables in the dashboard.
     */
    dataTables?: DashboardDataTableExtensionDefinition[];
    detailForms?: DashboardDetailFormExtensionDefinition[];
}
