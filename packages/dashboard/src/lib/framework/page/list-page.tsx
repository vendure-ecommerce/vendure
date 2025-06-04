import {
    AdditionalColumns,
    CustomizeColumnConfig,
    FacetedFilterConfig,
    ListQueryOptionsShape,
    ListQueryShape,
    PaginatedListDataTable,
    RowAction,
} from '@/components/shared/paginated-list-data-table.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRoute, AnyRouter, useNavigate } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { ResultOf } from 'gql.tada';

import { addCustomFields } from '../document-introspection/add-custom-fields.js';
import {
    FullWidthPageBlock,
    Page,
    PageActionBar,
    PageLayout,
    PageTitle,
} from '../layout-engine/page-layout.js';

type ListQueryFields<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

/**
 * @description
 * **Status: Developer Preview**
 *
 * @docsCategory components
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
    deleteMutation?: TypedDocumentNode<any, { id: string }>;
    transformVariables?: (variables: V) => V;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    customizeColumns?: CustomizeColumnConfig<T>;
    additionalColumns?: AC;
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC)[];
    defaultSort?: SortingState;
    defaultVisibility?: Partial<Record<keyof ListQueryFields<T> | keyof AC, boolean>>;
    children?: React.ReactNode;
    facetedFilters?: FacetedFilterConfig<T>;
    rowActions?: RowAction<ListQueryFields<T>>[];
    transformData?: (data: any[]) => any[];
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * Auto-generates a list page with columns generated based on the provided query document fields.
 *
 * @docsCategory components
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
}: ListPageProps<T, U, V, AC>) {
    const route = typeof routeOrFn === 'function' ? routeOrFn() : routeOrFn;
    const routeSearch = route.useSearch();
    const navigate = useNavigate<AnyRouter>({ from: route.fullPath });
    const { setTableSettings, settings } = useUserSettings();
    const tableSettings = pageId ? settings.tableSettings?.[pageId] : undefined;

    const pagination = {
        page: routeSearch.page ? parseInt(routeSearch.page) : 1,
        itemsPerPage: routeSearch.perPage ? parseInt(routeSearch.perPage) : tableSettings?.pageSize ?? 10,
    };

    const columnVisibility = pageId ? tableSettings?.columnVisibility ?? defaultVisibility : defaultVisibility;
    const columnOrder = pageId ? tableSettings?.columnOrder : defaultColumnOrder;
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
                        setTableOptions={setTableOptions}
                        transformData={transformData}
                    />
                </FullWidthPageBlock>
            </PageLayout>
        </Page>
    );
}
