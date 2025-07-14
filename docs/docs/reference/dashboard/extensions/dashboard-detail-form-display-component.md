---
title: "DashboardDetailFormDisplayComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDetailFormDisplayComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/detail-forms.ts" sourceLine="42" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom display components for specific fields in detail forms.
The pageId is already defined in the detail form extension, so only the blockId and field are needed.

```ts title="Signature"
interface DashboardDetailFormDisplayComponent {
    blockId: string;
    field: string;
    component: DataDisplayComponent;
}
```

<div className="members-wrapper">

### blockId

<MemberInfo kind="property" type={`string`}   />

The ID of the block where this display component should be used.
### field

<MemberInfo kind="property" type={`string`}   />

The name of the field where this display component should be used.
### component

<MemberInfo kind="property" type={`DataDisplayComponent`}   />

The React component that will be rendered as the display.
It should accept `value` and other standard display props.


</div>
