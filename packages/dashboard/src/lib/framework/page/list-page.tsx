import {
    AdditionalColumns,
    CustomFieldKeysOfItem,
    CustomizeColumnConfig,
    FacetedFilterConfig,
    ListQueryFields,
    ListQueryOptionsShape,
    ListQueryShape,
    PaginatedListDataTable,
    PaginatedListRefresherRegisterFn,
    RowAction,
} from '@/vdb/components/shared/paginated-list-data-table.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRoute, AnyRouter, useNavigate } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';

import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { addCustomFields } from '../document-introspection/add-custom-fields.js';
import { FullWidthPageBlock, Page, PageActionBar, PageLayout, PageTitle } from '../layout-engine/page-layout.js';

/**
 * @description
 * Props to configure the {@link ListPage} component.
 *
 * @docsCategory list-views
 * @docsPage ListPage
 * @since 3.3.0
 */
export interface ListPageProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
    AC extends AdditionalColumns<T>,
> {
    pageId?: string;
    route: AnyRoute | (() => AnyRoute);
    title: string | React.ReactElement;
    listQuery: T;
    /**
     * @description
     * Providing the `deleteMutation` will automatically add a "delete" menu item to the
     * actions column dropdown. Note that if this table already has a "delete" bulk action,
     * you don't need to additionally provide a delete mutation, because the bulk action
     * will be added to the action column dropdown already.
     */
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
    /**
     * @description
     * Register a function that allows you to assign a refresh function for
     * this list. The function can be assigned to a ref and then called when
     * the list needs to be refreshed.
     */
    registerRefresher?: PaginatedListRefresherRegisterFn;
}

/**
 * @description
 * Auto-generates a list page with columns generated based on the provided query document fields.
 *
 * @example
 * ```tsx
 * import {
 *     Button,
 *     DashboardRouteDefinition,
 *     ListPage,
 *     PageActionBarRight,
 *     DetailPageButton,
 * } from '@vendure/dashboard';
 * import { Link } from '@tanstack/react-router';
 * import { PlusIcon } from 'lucide-react';
 *
 * // This function is generated for you by the `vendureDashboardPlugin` in your Vite config.
 * // It uses gql-tada to generate TypeScript types which give you type safety as you write
 * // your queries and mutations.
 * import { graphql } from '@/gql';
 *
 * // The fields you select here will be automatically used to generate the appropriate columns in the
 * // data table below.
 * const getArticleList = graphql(`
 *     query GetArticles($options: ArticleListOptions) {
 *         articles(options: $options) {
 *             items {
 *                 id
 *                 createdAt
 *                 updatedAt
 *                 isPublished
 *                 title
 *                 slug
 *                 body
 *                 customFields
 *             }
 *         }
 *     }
 * `);
 *
 * const deleteArticleDocument = graphql(`
 *     mutation DeleteArticle($id: ID!) {
 *         deleteArticle(id: $id) {
 *             result
 *         }
 *     }
 * `);
 *
 * export const articleList: DashboardRouteDefinition = {
 *     navMenuItem: {
 *         sectionId: 'catalog',
 *         id: 'articles',
 *         url: '/articles',
 *         title: 'CMS Articles',
 *     },
 *     path: '/articles',
 *     loader: () => ({
 *         breadcrumb: 'Articles',
 *     }),
 *     component: route => (
 *         <ListPage
 *             pageId="article-list"
 *             title="Articles"
 *             listQuery={getArticleList}
 *             deleteMutation={deleteArticleDocument}
 *             route={route}
 *             customizeColumns={{
 *                 title: {
 *                     cell: ({ row }) => {
 *                         const post = row.original;
 *                         return <DetailPageButton id={post.id} label={post.title} />;
 *                     },
 *                 },
 *             }}
 *         >
 *             <PageActionBarRight>
 *                 <Button asChild>
 *                     <Link to="./new">
 *                         <PlusIcon className="mr-2 h-4 w-4" />
 *                         New article
 *                     </Link>
 *                 </Button>
 *             </PageActionBarRight>
 *         </ListPage>
 *     ),
 * };
 * ```
 * @docsCategory list-views
 * @docsPage ListPage
 * @docsWeight 0
 * @since 3.3.0
 */
export function ListPage<
    T extends TypedDocumentNode<U, V>,
    U extends Record<string, any> = any,
    V extends ListQueryOptionsShape = ListQueryOptionsShape,
    AC extends AdditionalColumns<T> = AdditionalColumns<T>,
>({
    pageId,
    title,
    listQuery,
    deleteMutation,
    transformVariables,
    customizeColumns,
    additionalColumns,
    defaultColumnOrder,
    defaultSort,
    route: routeOrFn,
    defaultVisibility,
    onSearchTermChange,
    facetedFilters,
    children,
    rowActions,
    transformData,
    setTableOptions,
    bulkActions,
    registerRefresher,
}: Readonly<ListPageProps<T, U, V, AC>>) {
    const route = typeof routeOrFn === 'function' ? routeOrFn() : routeOrFn;
    const routeSearch = route.useSearch();
    const navigate = useNavigate<AnyRouter>({ from: route.fullPath });
    const { setTableSettings, settings } = useUserSettings();
    const tableSettings = pageId ? settings.tableSettings?.[pageId] : undefined;

    const pagination = {
        page: routeSearch.page ? parseInt(routeSearch.page) : 1,
        itemsPerPage: routeSearch.perPage ? parseInt(routeSearch.perPage) : (tableSettings?.pageSize ?? 10),
    };

    const columnVisibility = pageId
        ? (tableSettings?.columnVisibility ?? defaultVisibility)
        : defaultVisibility;
    const columnOrder = pageId ? (tableSettings?.columnOrder ?? defaultColumnOrder) : defaultColumnOrder;
    const columnFilters = pageId ? tableSettings?.columnFilters : routeSearch.filters;

    const sorting: SortingState = (routeSearch.sort ?? '')
        .split(',')
        .filter((s: string) => s.length)
        .map((s: string) => {
            return {
                id: s.replace(/^-/, ''),
                desc: s.startsWith('-'),
            };
        });

    if (defaultSort && !sorting.length) {
        sorting.push(...defaultSort);
    }

    function sortToString(sortingStates?: SortingState) {
        return sortingStates?.map(s => `${s.desc ? '-' : ''}${s.id}`).join(',');
    }

    function persistListStateToUrl(
        table: Table<any>,
        listState: {
            page?: number;
            perPage?: number;
            sort?: SortingState;
            filters?: ColumnFiltersState;
        },
    ) {
        const tableState = table.getState();
        const page = listState.page || tableState.pagination.pageIndex + 1;
        const perPage = listState.perPage || tableState.pagination.pageSize;
        const sort = sortToString(listState.sort ?? tableState.sorting);
        const filters = listState.filters ?? tableState.columnFilters;
        navigate({
            search: () => ({ sort, page, perPage, filters: filters.length ? filters : undefined }) as never,
        });
    }

    const listQueryWithCustomFields = addCustomFields(listQuery);

    return (
        <Page pageId={pageId}>
            <PageTitle>{title}</PageTitle>
            <PageActionBar>{children}</PageActionBar>
            <PageLayout>
                <FullWidthPageBlock blockId="list-table">
                    <PaginatedListDataTable
                        listQuery={listQueryWithCustomFields}
                        deleteMutation={deleteMutation}
                        transformVariables={transformVariables}
                        customizeColumns={customizeColumns as any}
                        additionalColumns={additionalColumns as any}
                        defaultColumnOrder={columnOrder as any}
                        defaultVisibility={columnVisibility as any}
                        onSearchTermChange={onSearchTermChange}
                        page={pagination.page}
                        itemsPerPage={pagination.itemsPerPage}
                        sorting={sorting}
                        columnFilters={columnFilters}
                        onPageChange={(table, page, perPage) => {
                            persistListStateToUrl(table, { page, perPage });
                            if (pageId) {
                                setTableSettings(pageId, 'pageSize', perPage);
                            }
                        }}
                        onSortChange={(table, sorting) => {
                            persistListStateToUrl(table, { sort: sorting });
                        }}
                        onFilterChange={(table, filters) => {
                            persistListStateToUrl(table, { filters });
                            if (pageId) {
                                setTableSettings(pageId, 'columnFilters', filters);
                            }
                        }}
                        onColumnVisibilityChange={(table, columnVisibility) => {
                            if (pageId) {
                                setTableSettings(pageId, 'columnVisibility', columnVisibility);
                            }
                        }}
                        facetedFilters={facetedFilters}
                        rowActions={rowActions}
                        bulkActions={bulkActions}
                        setTableOptions={setTableOptions}
                        transformData={transformData}
                        registerRefresher={registerRefresher}
                    />
                </FullWidthPageBlock>
            </PageLayout>
        </Page>
    );
}
