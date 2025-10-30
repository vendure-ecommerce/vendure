---
title: "Widgets"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardWidgetDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/widgets.ts" sourceLine="70" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Defines a dashboard widget that can be added to the dashboard.

```ts title="Signature"
type DashboardWidgetDefinition = {
    id: string;
    name: string;
    component: React.ComponentType<DashboardBaseWidgetProps>;
    defaultSize: { w: number; h: number; x?: number; y?: number };
    minSize?: { w: number; h: number };
    maxSize?: { w: number; h: number };
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the widget.
### name

<MemberInfo kind="property" type={`string`}   />

The display name of the widget.
### component

<MemberInfo kind="property" type={`React.ComponentType&#60;<a href='/reference/dashboard/extensions-api/widgets#dashboardbasewidgetprops'>DashboardBaseWidgetProps</a>&#62;`}   />

The React component that renders the widget.
### defaultSize

<MemberInfo kind="property" type={`{ w: number; h: number; x?: number; y?: number }`}   />

The default size and position of the widget.
### minSize

<MemberInfo kind="property" type={`{ w: number; h: number }`}   />

The minimum size constraints for the widget.
### maxSize

<MemberInfo kind="property" type={`{ w: number; h: number }`}   />

The maximum size constraints for the widget.


</div>
