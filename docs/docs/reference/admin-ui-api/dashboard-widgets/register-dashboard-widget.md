---
title: "RegisterDashboardWidget"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerDashboardWidget

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-dashboard-widget.ts" sourceLine="16" packageName="@vendure/admin-ui" />

Registers a dashboard widget. Once registered, the widget can be set as part of the default
(using <a href='/reference/admin-ui-api/dashboard-widgets/set-dashboard-widget-layout#setdashboardwidgetlayout'>setDashboardWidgetLayout</a>).

```ts title="Signature"
function registerDashboardWidget(id: string, config: DashboardWidgetConfig): FactoryProvider
```
Parameters

### id

<MemberInfo kind="parameter" type={`string`} />

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/dashboard-widgets/dashboard-widget-config#dashboardwidgetconfig'>DashboardWidgetConfig</a>`} />

