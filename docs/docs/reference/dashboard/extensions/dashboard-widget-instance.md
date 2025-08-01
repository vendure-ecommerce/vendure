---
title: "DashboardWidgetInstance"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardWidgetInstance

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/widgets.ts" sourceLine="25" packageName="@vendure/dashboard" since="3.3.0" />

Represents an instance of a dashboard widget with its layout and configuration.

```ts title="Signature"
type DashboardWidgetInstance = {
    id: string;
    widgetId: string;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    config?: Record<string, unknown>;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the widget instance.
### widgetId

<MemberInfo kind="property" type={`string`}   />

The ID of the widget definition this instance is based on.
### layout

<MemberInfo kind="property" type={`{         x: number;         y: number;         w: number;         h: number;     }`}   />

The layout configuration for the widget.
### config

<MemberInfo kind="property" type={`Record&#60;string, unknown&#62;`}   />

Optional configuration data for the widget.


</div>
