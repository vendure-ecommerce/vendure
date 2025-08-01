---
title: "DashboardBaseWidgetProps"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardBaseWidgetProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/widgets.ts" sourceLine="10" packageName="@vendure/dashboard" since="3.3.0" />

Base props interface for dashboard widgets.

```ts title="Signature"
type DashboardBaseWidgetProps = PropsWithChildren<{
    id: string;
    title?: string;
    description?: string;
    config?: Record<string, unknown>;
    actions?: React.ReactNode;
}>
```
