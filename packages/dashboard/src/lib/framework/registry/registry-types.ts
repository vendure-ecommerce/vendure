import { DashboardAlertDefinition } from '../alert/types.js';
import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';
import { DashboardActionBarItem } from '../extension-api/extension-api-types.js';
import { DashboardPageBlockDefinition } from '../extension-api/extension-api-types.js';
import { NavMenuConfig } from '../nav-menu/nav-menu-extensions.js';

export interface GlobalRegistryContents {
    extensionSourceChangeCallbacks: Set<() => void>;
    registerDashboardExtensionCallbacks: Set<() => void>;
    navMenuConfig: NavMenuConfig;
    dashboardActionBarItemRegistry: Map<string, DashboardActionBarItem[]>;
    dashboardPageBlockRegistry: Map<string, DashboardPageBlockDefinition[]>;
    dashboardWidgetRegistry: Map<string, DashboardWidgetDefinition>;
    dashboardAlertRegistry: Map<string, DashboardAlertDefinition>;
}

export type GlobalRegistryKey = keyof GlobalRegistryContents;
