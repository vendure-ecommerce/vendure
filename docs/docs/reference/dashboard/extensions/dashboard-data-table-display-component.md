---
title: "DashboardDataTableDisplayComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDataTableDisplayComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="12" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom display components for specific columns in data tables.
The pageId is already defined in the data table extension, so only the column name is needed.

```ts title="Signature"
interface DashboardDataTableDisplayComponent {
    column: string;
    component: React.ComponentType<{ value: any; [key: string]: any }>;
}
```

<div className="members-wrapper">

### column

<MemberInfo kind="property" type={`string`}   />

The name of the column where this display component should be used.
### component

<MemberInfo kind="property" type={`React.ComponentType&#60;{ value: any; [key: string]: any }&#62;`}   />

The React component that will be rendered as the display.
It should accept `value` and other standard display props.


</div>
