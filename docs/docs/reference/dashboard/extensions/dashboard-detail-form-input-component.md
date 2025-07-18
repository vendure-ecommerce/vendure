---
title: "DashboardDetailFormInputComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDetailFormInputComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/detail-forms.ts" sourceLine="15" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom input components for specific fields in detail forms.
The pageId is already defined in the detail form extension, so only the blockId and field are needed.

```ts title="Signature"
interface DashboardDetailFormInputComponent {
    blockId: string;
    field: string;
    component: DataInputComponent;
}
```

<div className="members-wrapper">

### blockId

<MemberInfo kind="property" type={`string`}   />

The ID of the block where this input component should be used.
### field

<MemberInfo kind="property" type={`string`}   />

The name of the field where this input component should be used.
### component

<MemberInfo kind="property" type={`DataInputComponent`}   />

The React component that will be rendered as the input.
It should accept `value`, `onChange`, and other standard input props.


</div>
