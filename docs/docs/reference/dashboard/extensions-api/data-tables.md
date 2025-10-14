---
title: "DataTables"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardDataTableExtensionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="129" packageName="@vendure/dashboard" since="3.4.0" />

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

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/bulk-actions#bulkaction'>BulkAction</a>[]`}   />

An array of additional bulk actions that will be available on the data table.
### extendListDocument

<MemberInfo kind="property" type={`string | DocumentNode | (() =&#62; DocumentNode | string)`}   />

Allows you to extend the list document for the data table.
### displayComponents

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#dashboarddatatabledisplaycomponent'>DashboardDataTableDisplayComponent</a>[]`}   />

Custom display components for specific columns in the data table.


</div>
