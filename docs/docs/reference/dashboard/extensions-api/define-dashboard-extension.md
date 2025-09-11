---
title: "DefineDashboardExtension"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## defineDashboardExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/define-dashboard-extension.ts" sourceLine="60" packageName="@vendure/dashboard" since="3.3.0" />

The main entry point for extensions to the React-based dashboard. Every dashboard extension
must contain a call to this function, usually in the entry point file that is referenced by
the `dashboard` property of the plugin decorator.

Every type of customisation of the dashboard can be defined here, including:

- Navigation (nav sections and routes)
- Layout (action bar items and page blocks)
- Widgets
- Form components (custom form components, input components, and display components)
- Data tables
- Detail forms
- Login

*Example*

```tsx
defineDashboardExtension({
 navSections: [],
 routes: [],
 pageBlocks: [],
 actionBarItems: [],
});
```

```ts title="Signature"
function defineDashboardExtension(extension: DashboardExtension): void
```
Parameters

### extension

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/extensions-api/define-dashboard-extension#dashboardextension'>DashboardExtension</a>`} />



## DashboardExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/extension-api-types.ts" sourceLine="33" packageName="@vendure/dashboard" since="3.3.0" />

This is the main interface for defining _all_ extensions to the dashboard.

Every type of customisation of the dashboard can be defined here, including:

- Navigation (nav sections and routes)
- Layout (action bar items and page blocks)
- Widgets for the Insights page
- Form components
- Data tables
- Detail forms
- Login page customisation

```ts title="Signature"
interface DashboardExtension {
    routes?: DashboardRouteDefinition[];
    navSections?: DashboardNavSectionDefinition[];
    pageBlocks?: DashboardPageBlockDefinition[];
    actionBarItems?: DashboardActionBarItem[];
    alerts?: DashboardAlertDefinition[];
    widgets?: DashboardWidgetDefinition[];
    customFormComponents?: DashboardCustomFormComponents;
    dataTables?: DashboardDataTableExtensionDefinition[];
    detailForms?: DashboardDetailFormExtensionDefinition[];
    login?: DashboardLoginExtensions;
}
```

<div className="members-wrapper">

### routes

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/routes#dashboardroutedefinition'>DashboardRouteDefinition</a>[]`}   />

Allows you to define custom routes such as list or detail views.
### navSections

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/navigation#dashboardnavsectiondefinition'>DashboardNavSectionDefinition</a>[]`}   />

Allows you to define custom nav sections for the dashboard.
### pageBlocks

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/page-blocks#dashboardpageblockdefinition'>DashboardPageBlockDefinition</a>[]`}   />

Allows you to define custom page blocks for any page in the dashboard.
### actionBarItems

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/action-bar#dashboardactionbaritem'>DashboardActionBarItem</a>[]`}   />

Allows you to define custom action bar items for any page in the dashboard.
### alerts

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/alerts#dashboardalertdefinition'>DashboardAlertDefinition</a>[]`}   />

Allows you to define custom alerts that can be displayed in the dashboard.
### widgets

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/widgets#dashboardwidgetdefinition'>DashboardWidgetDefinition</a>[]`}   />

Allows you to define custom routes for the dashboard, which will render the
given components and optionally also add a nav menu item.
### customFormComponents

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/form-components#dashboardcustomformcomponents'>DashboardCustomFormComponents</a>`}   />

Unified registration for custom form custom field components.
### dataTables

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#dashboarddatatableextensiondefinition'>DashboardDataTableExtensionDefinition</a>[]`}   />

Allows you to customize aspects of existing data tables in the dashboard.
### detailForms

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/detail-forms#dashboarddetailformextensiondefinition'>DashboardDetailFormExtensionDefinition</a>[]`}   />

Allows you to customize the detail form for any page in the dashboard.
### login

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/login#dashboardloginextensions'>DashboardLoginExtensions</a>`}   />

Allows you to customize the login page with custom components.


</div>
