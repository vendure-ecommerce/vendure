---
title: "DataTableBulkActions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BulkAction

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="45" packageName="@vendure/dashboard" since="3.4.0" />

**Status: Developer Preview**

A bulk action is a component that will be rendered in the bulk actions dropdown.

```ts title="Signature"
type BulkAction = {
    order?: number;
    component: BulkActionComponent<any>;
}
```

<div className="members-wrapper">

### order

<MemberInfo kind="property" type={`number`}   />


### component

<MemberInfo kind="property" type={`BulkActionComponent&#60;any&#62;`}   />




</div>
