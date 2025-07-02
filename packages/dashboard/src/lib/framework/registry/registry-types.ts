import { DocumentNode } from 'graphql';
import React from 'react';

import { DashboardAlertDefinition } from '../alert/types.js';
import { DataDisplayComponent, DataInputComponent } from '../component-registry/component-registry.js';
import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';
import { BulkAction } from '../data-table/data-table-types.js';
import {
    DashboardActionBarItem,
    DashboardPageBlockDefinition,
} from '../extension-api/extension-api-types.js';
import { CustomFormComponentInputProps } from '../form-engine/custom-form-component.js';
import { NavMenuConfig } from '../nav-menu/nav-menu-extensions.js';

export interface GlobalRegistryContents {
    extensionSourceChangeCallbacks: Set<() => void>;
    registerDashboardExtensionCallbacks: Set<() => void>;
    navMenuConfig: NavMenuConfig;
    dashboardActionBarItemRegistry: Map<string, DashboardActionBarItem[]>;
    dashboardPageBlockRegistry: Map<string, DashboardPageBlockDefinition[]>;
    dashboardWidgetRegistry: Map<string, DashboardWidgetDefinition>;
    dashboardAlertRegistry: Map<string, DashboardAlertDefinition>;
    customFormComponents: Map<string, React.FunctionComponent<CustomFormComponentInputProps>>;
    inputComponents: Map<string, DataInputComponent>;
    displayComponents: Map<string, DataDisplayComponent>;
    bulkActionsRegistry: Map<string, BulkAction[]>;
    listQueryDocumentRegistry: Map<string, DocumentNode[]>;
    detailQueryDocumentRegistry: Map<string, DocumentNode[]>;
}
