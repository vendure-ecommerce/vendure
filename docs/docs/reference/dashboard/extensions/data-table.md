---
title: "DataTable"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDataTableDisplayComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="13" packageName="@vendure/dashboard" since="3.4.0" />

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


## BulkAction

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="46" packageName="@vendure/dashboard" since="3.4.0" />

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

Optional order number to control the position of this bulk action in the dropdown.
A larger number will appear lower in the list.
### component

<MemberInfo kind="property" type={`BulkActionComponent&#60;any&#62;`}   />

The React component that will be rendered as the bulk action item.


</div>


## DashboardDataTableExtensionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="68" packageName="@vendure/dashboard" since="3.4.0" />

This allows you to customize aspects of existing data tables in the dashboard.

```ts title="Signature"
interface DashboardDataTableExtensionDefinition {
    pageId: string;
    blockId?: string;
    bulkActions?: BulkAction[];
    extendListDocument?: string | DocumentNode | (() => DocumentNode | string);
    displayComponents?: DashboardDataTableDisplayComponent[];
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

The ID of the page where the data table is located, e.g. `'product-list'`, `'order-list'`.
### blockId

<MemberInfo kind="property" type={`string`}   />

The ID of the data table block. Defaults to `'list-table'`, which is the default blockId
for the standard list pages. However, some other pages may use a different blockId,
such as `'product-variants-table'` on the `'product-detail'` page.
### bulkActions

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/data-table#bulkaction'>BulkAction</a>[]`}   />

An array of additional bulk actions that will be available on the data table.
### extendListDocument

<MemberInfo kind="property" type={`string | DocumentNode | (() =&#62; DocumentNode | string)`}   />

Allows you to extend the list document for the data table.
### displayComponents

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/data-table#dashboarddatatabledisplaycomponent'>DashboardDataTableDisplayComponent</a>[]`}   />

Custom display components for specific columns in the data table.


</div>
