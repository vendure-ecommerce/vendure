---
title: "DashboardWidgetConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardWidgetConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/dashboard-widget/dashboard-widget-types.ts" sourceLine="11" packageName="@vendure/admin-ui" />

A configuration object for a dashboard widget.

```ts title="Signature"
interface DashboardWidgetConfig {
    loadComponent: () => Promise<Type<any>> | Type<any>;
    title?: string;
    supportedWidths?: DashboardWidgetWidth[];
    requiresPermissions?: string[];
}
```

<div className="members-wrapper">

### loadComponent

<MemberInfo kind="property" type={`() =&#62; Promise&#60;Type&#60;any&#62;&#62; | Type&#60;any&#62;`}   />

Used to specify the widget component. Supports both eager- and lazy-loading.

*Example*

```ts
// eager-loading
loadComponent: () => MyWidgetComponent,

// lazy-loading
loadComponent: () => import('./path-to/widget.component').then(m => m.MyWidgetComponent),
```
### title

<MemberInfo kind="property" type={`string`}   />

The title of the widget. Can be a translation token as it will get passed
through the `translate` pipe.
### supportedWidths

<MemberInfo kind="property" type={`DashboardWidgetWidth[]`}   />

The supported widths of the widget, in terms of a Bootstrap-style 12-column grid.
If omitted, then it is assumed the widget supports all widths.
### requiresPermissions

<MemberInfo kind="property" type={`string[]`}   />

If set, the widget will only be displayed if the current user has all the
specified permissions.


</div>
