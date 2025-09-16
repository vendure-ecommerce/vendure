---
title: "DataTable"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTable

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-table/data-table.tsx" sourceLine="85" packageName="@vendure/dashboard" since="3.4.0" />

A data table which includes sorting, filtering, pagination, bulk actions, column controls etc.

This is the building block of all data tables in the Dashboard.

```ts title="Signature"
function DataTable<TData>(props: Readonly<DataTableProps<TData>>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/list-views/data-table#datatableprops'>DataTableProps</a>&#60;TData&#62;&#62;`} />



## DataTableProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-table/data-table.tsx" sourceLine="46" packageName="@vendure/dashboard" since="3.4.0" />

Props for configuring the <a href='/reference/dashboard/list-views/data-table#datatable'>DataTable</a>.

```ts title="Signature"
interface DataTableProps<TData> {
    children?: React.ReactNode;
    columns: ColumnDef<TData, any>[];
    data: TData[];
    totalItems: number;
    isLoading?: boolean;
    page?: number;
    itemsPerPage?: number;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    onPageChange?: (table: TableType<TData>, page: number, itemsPerPage: number) => void;
    onSortChange?: (table: TableType<TData>, sorting: SortingState) => void;
    onFilterChange?: (table: TableType<TData>, columnFilters: ColumnFilter[]) => void;
    onColumnVisibilityChange?: (table: TableType<TData>, columnVisibility: VisibilityState) => void;
    onSearchTermChange?: (searchTerm: string) => void;
    defaultColumnVisibility?: VisibilityState;
    facetedFilters?: { [key: string]: FacetedFilter | undefined };
    disableViewOptions?: boolean;
    bulkActions?: BulkAction[];
    setTableOptions?: (table: TableOptions<TData>) => TableOptions<TData>;
    onRefresh?: () => void;
}
```

<div className="members-wrapper">

### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### columns

<MemberInfo kind="property" type={`ColumnDef&#60;TData, any&#62;[]`}   />


### data

<MemberInfo kind="property" type={`TData[]`}   />


### totalItems

<MemberInfo kind="property" type={`number`}   />


### isLoading

<MemberInfo kind="property" type={`boolean`}   />


### page

<MemberInfo kind="property" type={`number`}   />


### itemsPerPage

<MemberInfo kind="property" type={`number`}   />


### sorting

<MemberInfo kind="property" type={`SortingState`}   />


### columnFilters

<MemberInfo kind="property" type={`ColumnFiltersState`}   />


### onPageChange

<MemberInfo kind="property" type={`(table: TableType&#60;TData&#62;, page: number, itemsPerPage: number) =&#62; void`}   />


### onSortChange

<MemberInfo kind="property" type={`(table: TableType&#60;TData&#62;, sorting: SortingState) =&#62; void`}   />


### onFilterChange

<MemberInfo kind="property" type={`(table: TableType&#60;TData&#62;, columnFilters: ColumnFilter[]) =&#62; void`}   />


### onColumnVisibilityChange

<MemberInfo kind="property" type={`(table: TableType&#60;TData&#62;, columnVisibility: VisibilityState) =&#62; void`}   />


### onSearchTermChange

<MemberInfo kind="property" type={`(searchTerm: string) =&#62; void`}   />


### defaultColumnVisibility

<MemberInfo kind="property" type={`VisibilityState`}   />


### facetedFilters

<MemberInfo kind="property" type={`{ [key: string]: FacetedFilter | undefined }`}   />


### disableViewOptions

<MemberInfo kind="property" type={`boolean`}   />


### bulkActions

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#bulkaction'>BulkAction</a>[]`}   />


### setTableOptions

<MemberInfo kind="property" type={`(table: TableOptions&#60;TData&#62;) =&#62; TableOptions&#60;TData&#62;`}   />

This property allows full control over _all_ features of TanStack Table
when needed.
### onRefresh

<MemberInfo kind="property" type={`() =&#62; void`}   />




</div>


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

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#bulkaction'>BulkAction</a>[]`}   />

An array of additional bulk actions that will be available on the data table.
### extendListDocument

<MemberInfo kind="property" type={`string | DocumentNode | (() =&#62; DocumentNode | string)`}   />

Allows you to extend the list document for the data table.
### displayComponents

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#dashboarddatatabledisplaycomponent'>DashboardDataTableDisplayComponent</a>[]`}   />

Custom display components for specific columns in the data table.


</div>
