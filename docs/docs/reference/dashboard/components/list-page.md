---
title: "ListPage"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ListPage

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="76" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Auto-generates a list page with columns generated based on the provided query document fields.

```ts title="Signature"
function ListPage<T extends TypedDocumentNode<U, V>, U extends Record<string, any> = any, V extends ListQueryOptionsShape = ListQueryOptionsShape, AC extends AdditionalColumns<T> = AdditionalColumns<T>>(props: Readonly<ListPageProps<T, U, V, AC>>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/components/list-page#listpageprops'>ListPageProps</a>&#60;T, U, V, AC&#62;&#62;`} />



## ListPageProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="31" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
interface ListPageProps<T extends TypedDocumentNode<U, V>, U extends ListQueryShape, V extends ListQueryOptionsShape, AC extends AdditionalColumns<T>> {
    pageId?: string;
    route: AnyRoute | (() => AnyRoute);
    title: string | React.ReactElement;
    listQuery: T;
    deleteMutation?: TypedDocumentNode<any, { id: string }>;
    transformVariables?: (variables: V) => V;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    customizeColumns?: CustomizeColumnConfig<T>;
    additionalColumns?: AC;
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>)[];
    defaultSort?: SortingState;
    defaultVisibility?: Partial<
        Record<keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>, boolean>
    >;
    children?: React.ReactNode;
    facetedFilters?: FacetedFilterConfig<T>;
    rowActions?: RowAction<ListQueryFields<T>>[];
    transformData?: (data: any[]) => any[];
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
    bulkActions?: BulkAction[];
    registerRefresher?: PaginatedListRefresherRegisterFn;
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />


### route

<MemberInfo kind="property" type={`AnyRoute | (() =&#62; AnyRoute)`}   />


### title

<MemberInfo kind="property" type={`string | React.ReactElement`}   />


### listQuery

<MemberInfo kind="property" type={`T`}   />


### deleteMutation

<MemberInfo kind="property" type={`TypedDocumentNode&#60;any, { id: string }&#62;`}   />


### transformVariables

<MemberInfo kind="property" type={`(variables: V) =&#62; V`}   />


### onSearchTermChange

<MemberInfo kind="property" type={`(searchTerm: string) =&#62; NonNullable&#60;V['options']&#62;['filter']`}   />


### customizeColumns

<MemberInfo kind="property" type={`CustomizeColumnConfig&#60;T&#62;`}   />


### additionalColumns

<MemberInfo kind="property" type={`AC`}   />


### defaultColumnOrder

<MemberInfo kind="property" type={`(keyof ListQueryFields&#60;T&#62; | keyof AC | CustomFieldKeysOfItem&#60;ListQueryFields&#60;T&#62;&#62;)[]`}   />


### defaultSort

<MemberInfo kind="property" type={`SortingState`}   />


### defaultVisibility

<MemberInfo kind="property" type={`Partial&#60;         Record&#60;keyof ListQueryFields&#60;T&#62; | keyof AC | CustomFieldKeysOfItem&#60;ListQueryFields&#60;T&#62;&#62;, boolean&#62;     &#62;`}   />


### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### facetedFilters

<MemberInfo kind="property" type={`FacetedFilterConfig&#60;T&#62;`}   />


### rowActions

<MemberInfo kind="property" type={`RowAction&#60;ListQueryFields&#60;T&#62;&#62;[]`}   />


### transformData

<MemberInfo kind="property" type={`(data: any[]) =&#62; any[]`}   />


### setTableOptions

<MemberInfo kind="property" type={`(table: TableOptions&#60;any&#62;) =&#62; TableOptions&#60;any&#62;`}   />


### bulkActions

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions/data-table#bulkaction'>BulkAction</a>[]`}   />


### registerRefresher

<MemberInfo kind="property" type={`PaginatedListRefresherRegisterFn`}   />




</div>
