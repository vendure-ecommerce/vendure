---
title: "ReactDataTableComponentConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ReactDataTableComponentConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-data-table-component.ts" sourceLine="19" packageName="@vendure/admin-ui" />

Configures a <a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a> to be placed in the given location.

```ts title="Signature"
interface ReactDataTableComponentConfig {
    tableId: DataTableLocationId;
    columnId: DataTableColumnId;
    component: ElementType;
    props?: Record<string, any>;
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

<MemberInfo kind="property" type={`ElementType`}   />

The component to render in the table cell. This component will receive the `rowItem` prop
which is the data object for the row, e.g. the `Product` object if used in the `product-list` table.
### props

<MemberInfo kind="property" type={`Record&#60;string, any&#62;`}   />

Optional props to pass to the React component.


</div>
