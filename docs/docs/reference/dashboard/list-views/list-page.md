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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="158" packageName="@vendure/dashboard" since="3.3.0" />

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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/list-page.tsx" sourceLine="31" packageName="@vendure/dashboard" since="3.3.0" />

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

<MemberInfo kind="property" type={`<a href='/reference/dashboard/list-views/data-table#bulkaction'>BulkAction</a>[]`}   />


### registerRefresher

<MemberInfo kind="property" type={`PaginatedListRefresherRegisterFn`}   />

Register a function that allows you to assign a refresh function for
this list. The function can be assigned to a ref and then called when
the list needs to be refreshed.


</div>
