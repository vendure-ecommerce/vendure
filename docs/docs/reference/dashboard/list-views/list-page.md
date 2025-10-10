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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="459" packageName="@vendure/dashboard" since="3.3.0" />

Auto-generates a list page with columns generated based on the provided query document fields.

*Example*

```tsx
import {
    Button,
    DashboardRouteDefinition,
    ListPage,
    PageActionBarRight,
    DetailPageButton,
} from '@vendure/dashboard';
import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

// This function is generated for you by the `vendureDashboardPlugin` in your Vite config.
// It uses gql-tada to generate TypeScript types which give you type safety as you write
// your queries and mutations.
import { graphql } from '@/gql';

// The fields you select here will be automatically used to generate the appropriate columns in the
// data table below.
const getArticleList = graphql(`
    query GetArticles($options: ArticleListOptions) {
        articles(options: $options) {
            items {
                id
                createdAt
                updatedAt
                isPublished
                title
                slug
                body
                customFields
            }
            totalItems
        }
    }
`);

const deleteArticleDocument = graphql(`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            result
        }
    }
`);

export const articleList: DashboardRouteDefinition = {
    navMenuItem: {
        sectionId: 'catalog',
        id: 'articles',
        url: '/articles',
        title: 'CMS Articles',
    },
    path: '/articles',
    loader: () => ({
        breadcrumb: 'Articles',
    }),
    component: route => (
        <ListPage
            pageId="article-list"
            title="Articles"
            listQuery={getArticleList}
            deleteMutation={deleteArticleDocument}
            route={route}
            customizeColumns={{
                title: {
                    cell: ({ row }) => {
                        const post = row.original;
                        return <DetailPageButton id={post.id} label={post.title} />;
                    },
                },
            }}
        >
            <PageActionBarRight>
                <Button asChild>
                    <Link to="./new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New article
                    </Link>
                </Button>
            </PageActionBarRight>
        </ListPage>
    ),
};
```

```ts title="Signature"
function ListPage<T extends TypedDocumentNode<U, V>, U extends Record<string, any> = any, V extends ListQueryOptionsShape = ListQueryOptionsShape, AC extends AdditionalColumns<T> = AdditionalColumns<T>>(props: Readonly<ListPageProps<T, U, V, AC>>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/list-views/list-page#listpageprops'>ListPageProps</a>&#60;T, U, V, AC&#62;&#62;`} />



## ListPageProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="36" packageName="@vendure/dashboard" since="3.3.0" />

Props to configure the <a href='/reference/dashboard/list-views/list-page#listpage'>ListPage</a> component.

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

A unique identifier for the list page. This is important to support
customization functionality that relies on page IDs and makes your
component extensible.
### route

<MemberInfo kind="property" type={`AnyRoute | (() =&#62; AnyRoute)`}   />

* The Tanstack Router `Route` object, which will be defined in the component file.
### title

<MemberInfo kind="property" type={`string | React.ReactElement`}   />

* The page title, which will display in the header area.
### listQuery

<MemberInfo kind="property" type={`T`}   />

This DocumentNode of the list query, i.e. a query that fetches
PaginatedList data with "items" and "totalItems", such as:

*Example*

```tsx
export const collectionListDocument = graphql(`
  query CollectionList($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        slug
        breadcrumbs {
          id
          name
          slug
        }
        children {
          id
          name
        }
        # ... etc
      }
      totalItems
    }
  }
`);
// ...
<ListPage
  pageId="collection-list"
  listQuery={collectionListDocument}
  // ...
/>
```
### deleteMutation

<MemberInfo kind="property" type={`TypedDocumentNode&#60;any, { id: string }&#62;`}   />

Providing the `deleteMutation` will automatically add a "delete" menu item to the
actions column dropdown. Note that if this table already has a "delete" bulk action,
you don't need to additionally provide a delete mutation, because the bulk action
will be added to the action column dropdown already.
### transformVariables

<MemberInfo kind="property" type={`(variables: V) =&#62; V`}   />

This prop can be used to intercept and transform the list query variables before they are
sent to the Admin API.

This allows you to implement specific logic that differs from the standard filter/sort
handling.

*Example*

```tsx
<ListPage
  pageId="collection-list"
  title="Collections"
  listQuery={collectionListDocument}
  transformVariables={input => {
      const filterTerm = input.options?.filter?.name?.contains;
      // If there is a filter term set
      // we want to return all results. Else
      // we only want top-level Collections
      const isFiltering = !!filterTerm;
      return {
          options: {
              ...input.options,
              topLevelOnly: !isFiltering,
          },
      };
  }}
/>
```
### onSearchTermChange

<MemberInfo kind="property" type={`(searchTerm: string) =&#62; NonNullable&#60;V['options']&#62;['filter']`}   />

Allows you to customize how the search term is used in the list query options.
For instance, when you want the term to filter on specific fields.

*Example*

```tsx
 <ListPage
   pageId="administrator-list"
   title="Administrators"
   listQuery={administratorListDocument}
   onSearchTermChange={searchTerm => {
     return {
       firstName: { contains: searchTerm },
       lastName: { contains: searchTerm },
       emailAddress: { contains: searchTerm },
     };
   }}
 />
### customizeColumns

<MemberInfo kind="property" type={`CustomizeColumnConfig&#60;T&#62;`}   />

Allows you to customize the rendering and other aspects of individual columns.

By default, an appropriate component will be chosen to render the column data
based on the data type of the field. However, in many cases you want to have
more control over how the column data is rendered.

*Example*

```tsx
<ListPage
  pageId="collection-list"
  listQuery={collectionListDocument}
  customizeColumns={{
    // The key "name" matches one of the top-level fields of the
    // list query type (Collection, in this example)
    name: {
      meta: {
          // The Dashboard optimizes the list query `collectionListDocument` to
          // only select field that are actually visible in the ListPage table.
          // However, sometimes you want to render data from other fields, i.e.
          // this column has a data dependency on the "children" and "breadcrumbs"
          // fields in order to correctly render the "name" field.
          // In this case, we can declare those data dependencies which means whenever
          // the "name" column is visible, it will ensure the "children" and "breadcrumbs"
          // fields are also selected in the query.
          dependencies: ['children', 'breadcrumbs'],
      },
      header: 'Collection Name',
      cell: ({ row }) => {
        const isExpanded = row.getIsExpanded();
        const hasChildren = !!row.original.children?.length;
        return (
          <div
            style={{ marginLeft: (row.original.breadcrumbs?.length - 2) * 20 + 'px' }}
            className="flex gap-2 items-center"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={row.getToggleExpandedHandler()}
              disabled={!hasChildren}
              className={!hasChildren ? 'opacity-20' : ''}
            >
              {isExpanded ? <FolderOpen /> : <Folder />}
            </Button>
            <DetailPageButton id={row.original.id} label={row.original.name} />
          </div>
          );
      },
    },
```
### additionalColumns

<MemberInfo kind="property" type={`AC`}   />

Allows you to define extra columns that are not related to actual fields returned in
the query result.

For example, in the Administrator list, we define an additional "name" column composed
of the `firstName` and `lastName` fields.

*Example*

```tsx
<ListPage
  pageId="administrator-list"
  title="Administrators"
  listQuery={administratorListDocument}
  additionalColumns={{
    name: {
        header: 'Name',
        cell: ({ row }) => (
            <DetailPageButton
                id={row.original.id}
                label={`${row.original.firstName} ${row.original.lastName}`}
            />
        ),
  },
/>
```
### defaultColumnOrder

<MemberInfo kind="property" type={`(keyof ListQueryFields&#60;T&#62; | keyof AC | CustomFieldKeysOfItem&#60;ListQueryFields&#60;T&#62;&#62;)[]`}   />

Allows you to specify the default order of columns in the table. When not defined, the
order of fields in the list query document will be used.
### defaultSort

<MemberInfo kind="property" type={`SortingState`}   />

Allows you to specify the default sorting applied to the table.

*Example*

```tsx
defaultSort={[{ id: 'orderPlacedAt', desc: true }]}
```
### defaultVisibility

<MemberInfo kind="property" type={`Partial&#60;         Record&#60;keyof ListQueryFields&#60;T&#62; | keyof AC | CustomFieldKeysOfItem&#60;ListQueryFields&#60;T&#62;&#62;, boolean&#62;     &#62;`}   />

Allows you to specify the default columns that are visible in the table.
If you set them to `true`, then only those will show by default. If you set them to `false`,
then _all other_ columns will be visible by default.

*Example*

```tsx
 <ListPage
   pageId="country-list"
   listQuery={countriesListQuery}
   title="Countries"
   defaultVisibility={{
       name: true,
       code: true,
       enabled: true,
   }}
 />
 ```
### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### facetedFilters

<MemberInfo kind="property" type={`FacetedFilterConfig&#60;T&#62;`}   />

Allows you to define pre-set filters based on an array of possible selections

*Example*

```tsx
<ListPage
  pageId="payment-method-list"
  listQuery={paymentMethodListQuery}
  title="Payment Methods"
  facetedFilters={{
      enabled: {
          title: 'Enabled',
          options: [
              { label: 'Enabled', value: true },
              { label: 'Disabled', value: false },
          ],
      },
  }}
/>
```
### rowActions

<MemberInfo kind="property" type={`RowAction&#60;ListQueryFields&#60;T&#62;&#62;[]`}   />

Allows you to specify additional "actions" that will be made available in the "actions" column.
By default, the actions column includes all bulk actions defined in the `bulkActions` prop.
### transformData

<MemberInfo kind="property" type={`(data: any[]) =&#62; any[]`}   />

Allows the returned list query data to be transformed in some way. This is an advanced feature
that is not often required.
### setTableOptions

<MemberInfo kind="property" type={`(table: TableOptions&#60;any&#62;) =&#62; TableOptions&#60;any&#62;`}   />

Allows you to directly manipulate the Tanstack Table `TableOptions` object before the
table is created. And advanced option that is not often required.
### bulkActions

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/bulk-actions#bulkaction'>BulkAction</a>[]`}   />

Bulk actions are actions that can be applied to one or more table rows, and include things like

- Deleting the rows
- Assigning the rows to another channel
- Bulk editing some aspect of the rows

See the <a href='/reference/dashboard/list-views/bulk-actions#bulkaction'>BulkAction</a> docs for an example of how to build the component.

*Example*

```tsx
<ListPage
  pageId="product-list"
  listQuery={productListDocument}
  title="Products"
  bulkActions={[
    {
      component: AssignProductsToChannelBulkAction,
      order: 100,
    },
    {
      component: RemoveProductsFromChannelBulkAction,
      order: 200,
    },
    {
      component: DeleteProductsBulkAction,
      order: 300,
    },
  ]}
/>
```
### registerRefresher

<MemberInfo kind="property" type={`PaginatedListRefresherRegisterFn`}   />

Register a function that allows you to assign a refresh function for
this list. The function can be assigned to a ref and then called when
the list needs to be refreshed.


</div>
