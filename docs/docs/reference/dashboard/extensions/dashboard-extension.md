---
title: "DashboardExtension"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardExtension

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/extension-api-types.ts" sourceLine="24" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

This is used to define the routes, widgets, etc. that will be displayed in the dashboard.

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

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/navigation#dashboardroutedefinition'>DashboardRouteDefinition</a>[]`}   />

Allows you to define custom routes such as list or detail views.
### navSections

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/navigation#dashboardnavsectiondefinition'>DashboardNavSectionDefinition</a>[]`}   />

Allows you to define custom nav sections for the dashboard.
### pageBlocks

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/layout#dashboardpageblockdefinition'>DashboardPageBlockDefinition</a>[]`}   />

Allows you to define custom page blocks for any page in the dashboard.
### actionBarItems

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/layout#dashboardactionbaritem'>DashboardActionBarItem</a>[]`}   />

Allows you to define custom action bar items for any page in the dashboard.
### alerts

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/dashboard-alert-definition#dashboardalertdefinition'>DashboardAlertDefinition</a>[]`}   />

Allows you to define custom alerts that can be displayed in the dashboard.
### widgets

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/dashboard-widget-definition#dashboardwidgetdefinition'>DashboardWidgetDefinition</a>[]`}   />

Allows you to define custom routes for the dashboard, which will render the
given components and optionally also add a nav menu item.
### customFormComponents

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/form-components#dashboardcustomformcomponents'>DashboardCustomFormComponents</a>`}   />

Unified registration for custom form custom field components.
### dataTables

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/data-table#dashboarddatatableextensiondefinition'>DashboardDataTableExtensionDefinition</a>[]`}   />

Allows you to customize aspects of existing data tables in the dashboard.
### detailForms

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/detail-forms#dashboarddetailformextensiondefinition'>DashboardDetailFormExtensionDefinition</a>[]`}   />

Allows you to customize the detail form for any page in the dashboard.
### login

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/login#dashboardloginextensions'>DashboardLoginExtensions</a>`}   />

Allows you to customize the login page with custom components.


</div>
