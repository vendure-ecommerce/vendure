import {
    BulkAction,
    DashboardActionBarItem,
    DashboardPageBlockDefinition,
    DashboardWidgetDefinition,
} from '@/vdb/framework/extension-api/types/index.js';
import { DocumentNode } from 'graphql';
import React from 'react';

import { DataDisplayComponent, DataInputComponent } from '../component-registry/component-registry.js';
import { DashboardAlertDefinition } from '../extension-api/types/alerts.js';
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
