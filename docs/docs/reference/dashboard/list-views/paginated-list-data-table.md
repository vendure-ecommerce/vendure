---
title: "PaginatedListDataTable"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaginatedListDataTable

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/paginated-list-data-table.tsx" sourceLine="334" packageName="@vendure/dashboard" since="3.4.0" />

A wrapper around the <a href='/reference/dashboard/list-views/data-table#datatable'>DataTable</a> component, which automatically configures functionality common to
list queries that implement the `PaginatedList` interface, which is the common way of representing lists
of data in Vendure.

Given a GraphQL query document node, the component will automatically configure the required columns
with sorting & filtering functionality.

The automatic features can be further customized and enhanced using the many options available in the props.

*Example*

```tsx
import { Money } from '@/vdb/components/data-display/money.js';
import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { customerOrderListDocument } from '../customers.graphql.js';

interface CustomerOrderTableProps {
    customerId: string;
}

export function CustomerOrderTable({ customerId }: Readonly<CustomerOrderTableProps>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'orderPlacedAt', desc: true }]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    return (
        <PaginatedListDataTable
            listQuery={customerOrderListDocument}
            transformVariables={variables => {
                return {
                    ...variables,
                    customerId,
                };
            }}
            defaultVisibility={{
                id: false,
                createdAt: false,
                updatedAt: false,
                type: false,
                currencyCode: false,
                total: false,
            }}
            customizeColumns={{
                total: {
                    header: 'Total',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        return <Money value={value} currency={currencyCode} />;
                    },
                },
                totalWithTax: {
                    header: 'Total with Tax',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        return <Money value={value} currency={currencyCode} />;
                    },
                },
                state: {
                    header: 'State',
                    cell: ({ cell }) => {
                        const value = cell.getValue() as string;
                        return <Badge variant="outline">{value}</Badge>;
                    },
                },
                code: {
                    header: 'Code',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue() as string;
                        const id = row.original.id;
                        return (
                            <Button asChild variant="ghost">
                                <Link to={`/orders/${id}`}>{value}</Link>
                            </Button>
                        );
                    },
                },
            }}
            page={page}
            itemsPerPage={pageSize}
            sorting={sorting}
            columnFilters={filters}
            onPageChange={(_, page, perPage) => {
                setPage(page);
                setPageSize(perPage);
            }}
            onSortChange={(_, sorting) => {
                setSorting(sorting);
            }}
            onFilterChange={(_, filters) => {
                setFilters(filters);
            }}
        />
    );
}
```

```ts title="Signature"
function PaginatedListDataTable<T extends TypedDocumentNode<U, V>, U extends Record<string, any> = any, V extends ListQueryOptionsShape = any, AC extends AdditionalColumns<T> = AdditionalColumns<T>>(props: Readonly<PaginatedListDataTableProps<T, U, V, AC>>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/list-views/paginated-list-data-table#paginatedlistdatatableprops'>PaginatedListDataTableProps</a>&#60;T, U, V, AC&#62;&#62;`} />



## PaginatedListDataTableProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/paginated-list-data-table.tsx" sourceLine="185" packageName="@vendure/dashboard" since="3.4.0" />

Props to configure the <a href='/reference/dashboard/list-views/paginated-list-data-table#paginatedlistdatatable'>PaginatedListDataTable</a> component.

```ts title="Signature"
interface PaginatedListDataTableProps<T extends TypedDocumentNode<U, V>, U extends ListQueryShape, V extends ListQueryOptionsShape, AC extends AdditionalColumns<T>> {
    listQuery: T;
    deleteMutation?: TypedDocumentNode<any, any>;
    transformQueryKey?: (queryKey: any[]) => any[];
    transformVariables?: (variables: V) => V;
    customizeColumns?: CustomizeColumnConfig<T>;
    additionalColumns?: AC;
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>)[];
    defaultVisibility?: Partial<Record<AllItemFieldKeys<T>, boolean>>;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    page: number;
    itemsPerPage: number;
    sorting: SortingState;
    columnFilters?: ColumnFiltersState;
    onPageChange: (table: Table<any>, page: number, perPage: number) => void;
    onSortChange: (table: Table<any>, sorting: SortingState) => void;
    onFilterChange: (table: Table<any>, filters: ColumnFiltersState) => void;
    onColumnVisibilityChange?: (table: Table<any>, columnVisibility: VisibilityState) => void;
    facetedFilters?: FacetedFilterConfig<T>;
    rowActions?: RowAction<PaginatedListItemFields<T>>[];
    bulkActions?: BulkAction[];
    disableViewOptions?: boolean;
    transformData?: (data: PaginatedListItemFields<T>[]) => PaginatedListItemFields<T>[];
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
    registerRefresher?: PaginatedListRefresherRegisterFn;
}
```

<div className="members-wrapper">

### listQuery

<MemberInfo kind="property" type={`T`}   />


### deleteMutation

<MemberInfo kind="property" type={`TypedDocumentNode&#60;any, any&#62;`}   />


### transformQueryKey

<MemberInfo kind="property" type={`(queryKey: any[]) =&#62; any[]`}   />


### transformVariables

<MemberInfo kind="property" type={`(variables: V) =&#62; V`}   />


### customizeColumns

<MemberInfo kind="property" type={`CustomizeColumnConfig&#60;T&#62;`}   />


### additionalColumns

<MemberInfo kind="property" type={`AC`}   />


### defaultColumnOrder

<MemberInfo kind="property" type={`(keyof ListQueryFields&#60;T&#62; | keyof AC | CustomFieldKeysOfItem&#60;ListQueryFields&#60;T&#62;&#62;)[]`}   />


### defaultVisibility

<MemberInfo kind="property" type={`Partial&#60;Record&#60;AllItemFieldKeys&#60;T&#62;, boolean&#62;&#62;`}   />


### onSearchTermChange

<MemberInfo kind="property" type={`(searchTerm: string) =&#62; NonNullable&#60;V['options']&#62;['filter']`}   />


### page

<MemberInfo kind="property" type={`number`}   />


### itemsPerPage

<MemberInfo kind="property" type={`number`}   />


### sorting

<MemberInfo kind="property" type={`SortingState`}   />


### columnFilters

<MemberInfo kind="property" type={`ColumnFiltersState`}   />


### onPageChange

<MemberInfo kind="property" type={`(table: Table&#60;any&#62;, page: number, perPage: number) =&#62; void`}   />


### onSortChange

<MemberInfo kind="property" type={`(table: Table&#60;any&#62;, sorting: SortingState) =&#62; void`}   />


### onFilterChange

<MemberInfo kind="property" type={`(table: Table&#60;any&#62;, filters: ColumnFiltersState) =&#62; void`}   />


### onColumnVisibilityChange

<MemberInfo kind="property" type={`(table: Table&#60;any&#62;, columnVisibility: VisibilityState) =&#62; void`}   />


### facetedFilters

<MemberInfo kind="property" type={`FacetedFilterConfig&#60;T&#62;`}   />


### rowActions

<MemberInfo kind="property" type={`RowAction&#60;PaginatedListItemFields&#60;T&#62;&#62;[]`}   />


### bulkActions

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#bulkaction'>BulkAction</a>[]`}   />


### disableViewOptions

<MemberInfo kind="property" type={`boolean`}   />


### transformData

<MemberInfo kind="property" type={`(data: PaginatedListItemFields&#60;T&#62;[]) =&#62; PaginatedListItemFields&#60;T&#62;[]`}   />


### setTableOptions

<MemberInfo kind="property" type={`(table: TableOptions&#60;any&#62;) =&#62; TableOptions&#60;any&#62;`}   />


### registerRefresher

<MemberInfo kind="property" type={`PaginatedListRefresherRegisterFn`}   />




</div>
