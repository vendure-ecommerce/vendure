import {
    AdditionalColumns,
    CustomFieldKeysOfItem,
    CustomizeColumnConfig,
    FacetedFilterConfig,
    ListQueryFields,
    ListQueryOptionsShape,
    ListQueryShape,
    PaginatedListRefresherRegisterFn,
    RowAction,
} from '@/vdb/components/shared/paginated-list-data-table.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRoute, AnyRouter, useNavigate } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';

import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import {
    FullWidthPageBlock,
    Page,
    PageActionBar,
    PageLayout,
    PageTitle,
} from '../layout-engine/page-layout.js';
import { DraggablePaginatedListDataTable } from '@/vdb/components/shared/draggable-paginated-list-data-table.js';

/**
 * @description
 * Props to configure the {@link DraggableListPage} component.
 *
 * @docsCategory list-views
 * @docsPage DraggableListPage
 * @since 3.3.0
 */
export interface DraggableListPageProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
    AC extends AdditionalColumns<T>,
> {
    /**
     * @description
     * A unique identifier for the list page.
     */
    pageId?: string;
    /**
     @description
     * The Tanstack Router `Route` object.
     */
    route: AnyRoute | (() => AnyRoute);
    /**
     @description
     * The page title.
     */
    title: string | React.ReactElement;
    /**
     * @description
     * The DocumentNode of the list query.
     */
    listQuery: T;
    /**
     * @description
     * Providing the `deleteMutation` will automatically add a "delete" menu item.
     */
    deleteMutation?: TypedDocumentNode<any, { id: string }>;
    /**
     * @description
     * Transform list query variables before sending to the API.
     */
    transformVariables?: (variables: V) => V;
    /**
     * @description
     * Customize how the search term is used in the list query options.
     */
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    /**
     * @description
     * Customize column rendering and behavior.
     */
    customizeColumns?: CustomizeColumnConfig<T>;
    /**
     * @description
     * Define extra columns not related to query fields.
     */
    additionalColumns?: AC;
    /**
     * @description
     * Default column order.
     */
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>)[];
    /**
     * @description
     * Default sorting.
     */
    defaultSort?: SortingState;
    /**
     * @description
     * Default column visibility.
     */
    defaultVisibility?: Partial<
        Record<keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>, boolean>
    >;
    children?: React.ReactNode;
    /**
     * @description
     * Pre-set filters.
     */
    facetedFilters?: FacetedFilterConfig<T>;
    /**
     * @description
     * Additional row actions.
     */
    rowActions?: RowAction<ListQueryFields<T>>[];
    /**
     * @description
     * Transform returned list data.
     */
    transformData?: (data: any[]) => any[];
    /**
     * @description
     * Directly manipulate TableOptions.
     */
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
    /**
     * @description
     * Bulk actions.
     */
    bulkActions?: BulkAction[];
    /**
     * @description
     * Register a refresh function.
     */
    registerRefresher?: PaginatedListRefresherRegisterFn;
    /**
     * @description
     * Callback when items are reordered via drag and drop.
     * Only applies to top-level items.
     *
     * @param oldIndex - The original index of the dragged item
     * @param newIndex - The new index where the item was dropped
     * @param item - The data of the item that was moved
     */
    onReorder?: (oldIndex: number, newIndex: number, item: any) => void | Promise<void>;
    /**
     * @description
     * When true, drag and drop will be disabled. Useful when filtering or searching.
     * Defaults to false.
     */
    disableDragAndDrop?: boolean;
}

/**
 * @description
 * Auto-generates a list page with drag-and-drop functionality for reordering items.
 * Extends the functionality of {@link ListPage} with drag-and-drop capabilities
 * for top-level items only.
 *
 * @example
 * ```tsx
 * import { DraggableListPage } from '@vendure/dashboard';
 *
 * function CollectionListPage() {
 *     const handleReorder = async (oldIndex: number, newIndex: number, item: any) => {
 *         // Call your mutation to update the order
 *         await api.mutate(updateCollectionPositionMutation, {
 *             id: item.id,
 *             position: newIndex,
 *         });
 *     };
 *
 *     return (
 *         <DraggableListPage
 *             pageId="collection-list"
 *             title="Collections"
 *             listQuery={collectionListDocument}
 *             route={Route}
 *             onReorder={handleReorder}
 *             disableDragAndDrop={isFiltering} // Disable when filtering/searching
 *         >
 *             // Action bar content
 *         </DraggableListPage>
 *     );
 * }
 * ```
 * @docsCategory list-views
 * @docsPage DraggableListPage
 * @docsWeight 0
 * @since 3.3.0
 */
export function DraggableListPage<
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
    onReorder,
    disableDragAndDrop = false,
}: Readonly<DraggableListPageProps<T, U, V, AC>>) {
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

    return (
        <Page pageId={pageId}>
            <PageTitle>{title}</PageTitle>
            <PageActionBar>{children}</PageActionBar>
            <PageLayout>
                <FullWidthPageBlock blockId="list-table">
                    <DraggablePaginatedListDataTable
                        listQuery={listQuery}
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
                        onReorder={onReorder}
                        disableDragAndDrop={disableDragAndDrop}
                    />
                </FullWidthPageBlock>
            </PageLayout>
        </Page>
    );
}
