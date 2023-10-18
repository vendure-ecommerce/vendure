---
title: "DataTableComponentConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTableComponentConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table-2/data-table-custom-component.service.ts" sourceLine="54" packageName="@vendure/admin-ui" />

Configures a <a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a> to be placed in the given location.

```ts title="Signature"
interface DataTableComponentConfig {
    tableId: DataTableLocationId;
    columnId: DataTableColumnId;
    component: Type<CustomColumnComponent>;
    providers?: Provider[];
}
```

<div className="members-wrapper">

### tableId

<MemberInfo kind="property" type={`DataTableLocationId`}   />

The location in the UI where the custom component should be placed.
### columnId

<MemberInfo kind="property" type={`DataTableColumnId`}   />

The column in the table where the custom component should be placed.
### component

<MemberInfo kind="property" type={`Type&#60;<a href='/reference/admin-ui-api/custom-table-components/custom-column-component#customcolumncomponent'>CustomColumnComponent</a>&#62;`}   />

The component to render in the table cell. This component should implement the
<a href='/reference/admin-ui-api/custom-table-components/custom-column-component#customcolumncomponent'>CustomColumnComponent</a> interface.
### providers

<MemberInfo kind="property" type={`Provider[]`}   />




</div>
