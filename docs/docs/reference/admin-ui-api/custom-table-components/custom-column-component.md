---
title: "CustomColumnComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomColumnComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table-2/data-table-custom-component.service.ts" sourceLine="44" packageName="@vendure/admin-ui" />

Components which are to be used to render custom cells in a data table should implement this interface.

The `rowItem` property is the data object for the row, e.g. the `Product` object if used
in the `product-list` table.

```ts title="Signature"
interface CustomColumnComponent {
    rowItem: any;
}
```

<div className="members-wrapper">

### rowItem

<MemberInfo kind="property" type={`any`}   />




</div>
