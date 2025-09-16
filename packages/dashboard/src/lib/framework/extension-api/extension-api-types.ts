// Import types for the main interface
import {
    DashboardActionBarItem,
    DashboardAlertDefinition,
    DashboardCustomFormComponents,
    DashboardDataTableExtensionDefinition,
    DashboardDetailFormExtensionDefinition,
    DashboardLoginExtensions,
    DashboardNavSectionDefinition,
    DashboardPageBlockDefinition,
    DashboardRouteDefinition,
    DashboardWidgetDefinition,
} from './types/index.js';

/**
 * @description
 * This is the main interface for defining _all_ extensions to the dashboard.
 *
 * Every type of customisation of the dashboard can be defined here, including:
 *
 * - Navigation (nav sections and routes)
 * - Layout (action bar items and page blocks)
 * - Widgets for the Insights page
 * - Form components
 * - Data tables
 * - Detail forms
 * - Login page customisation
 *
 * @docsCategory extensions-api
 * @docsPage defineDashboardExtension
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
     * Unified registration for custom form custom field components.
     */
    customFormComponents?: DashboardCustomFormComponents;
    /**
     * @description
     * Allows you to customize aspects of existing data tables in the dashboard.
     */
    dataTables?: DashboardDataTableExtensionDefinition[];
    /**
     * @description
     * Allows you to customize the detail form for any page in the dashboard.
     */
    detailForms?: DashboardDetailFormExtensionDefinition[];
    /**
     * @description
     * Allows you to customize the login page with custom components.
     */
    login?: DashboardLoginExtensions;
}
