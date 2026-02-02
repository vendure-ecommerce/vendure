import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { Button } from '@/vdb/components/ui/button.js';
import { ActionBarItem } from '@/vdb/framework/layout-engine/action-bar-item-wrapper.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { FetchQueryOptions, useQueries, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ExpandedState, getExpandedRowModel } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import { ResultOf } from 'gql.tada';
import { Folder, FolderOpen, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    calculateDragTargetPosition,
    calculateSiblingIndex,
    getItemParentId,
    isCircularReference,
} from '@/vdb/components/data-table/data-table-utils.js';
import { RichTextDescriptionCell } from '@/vdb/components/shared/table-cell/order-table-cell-components.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { collectionListDocument, moveCollectionDocument } from './collections.graphql.js';
import {
    AssignCollectionsToChannelBulkAction,
    DeleteCollectionsBulkAction,
    DuplicateCollectionsBulkAction,
    MoveCollectionsBulkAction,
    RemoveCollectionsFromChannelBulkAction,
} from './components/collection-bulk-actions.js';
import { CollectionContentsSheet } from './components/collection-contents-sheet.js';

export const Route = createFileRoute('/_authenticated/_collections/collections')({
    component: CollectionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Collections</Trans> }),
});

type Collection = ResultOf<typeof collectionListDocument>['collections']['items'][number];

const CHILDREN_PAGE_SIZE = 20;

type LoadMoreRow = {
    _isLoadMore: true;
    _parentId: string;
    _totalItems: number;
    _loadedItems: number;
    id: string;
    breadcrumbs: { id: string; name: string; slug: string }[];
};

type CollectionOrLoadMore = Collection | LoadMoreRow;

function isLoadMoreRow(row: CollectionOrLoadMore): row is LoadMoreRow {
    return '_isLoadMore' in row && row._isLoadMore === true;
}

function CollectionListPage() {
    const { t } = useLingui();
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [accumulatedChildren, setAccumulatedChildren] = useState<
        Record<string, { items: Collection[]; totalItems: number }>
    >({});
    const [nextPageToFetch, setNextPageToFetch] = useState<Record<string, number>>({});

    useQueries({
        queries: expanded === true ? [] : Object.entries(expanded)
            .filter(([collectionId]) => !accumulatedChildren[collectionId])
            .map(([collectionId]) => {
                return {
                    queryKey: ['childCollections', collectionId, 'page', 0],
                    queryFn: async () => {
                        const result = await api.query(collectionListDocument, {
                            options: {
                                filter: {
                                    parentId: { eq: collectionId },
                                },
                                take: CHILDREN_PAGE_SIZE,
                                skip: 0,
                            },
                        });
                        setAccumulatedChildren(prev => ({
                            ...prev,
                            [collectionId]: {
                                items: result.collections.items,
                                totalItems: result.collections.totalItems,
                            },
                        }));
                        return result;
                    },
                    staleTime: 1000 * 60 * 5,
                } satisfies FetchQueryOptions;
            }),
    });

    useQueries({
        queries: Object.entries(nextPageToFetch)
            .filter(([_, page]) => page > 0)
            .map(([collectionId, page]) => {
                return {
                    queryKey: ['childCollections', collectionId, 'page', page],
                    queryFn: async () => {
                        const result = await api.query(collectionListDocument, {
                            options: {
                                filter: {
                                    parentId: { eq: collectionId },
                                },
                                take: CHILDREN_PAGE_SIZE,
                                skip: page * CHILDREN_PAGE_SIZE,
                            },
                        });
                        setAccumulatedChildren(prev => {
                            const existing = prev[collectionId];
                            if (!existing) return prev;
                            return {
                                ...prev,
                                [collectionId]: {
                                    items: [...existing.items, ...result.collections.items],
                                    totalItems: result.collections.totalItems,
                                },
                            };
                        });
                        setNextPageToFetch(prev => {
                            const { [collectionId]: _, ...rest } = prev;
                            return rest;
                        });
                        return result;
                    },
                    staleTime: 1000 * 60 * 5,
                } satisfies FetchQueryOptions;
            }),
    });

    const addSubCollections = (data: Collection[]): CollectionOrLoadMore[] => {
        const allRows: CollectionOrLoadMore[] = [];
        const addSubRows = (row: Collection) => {
            const isExpanded = expanded === true || (typeof expanded === 'object' && expanded[row.id]);
            if (!isExpanded) {
                return;
            }
            const childData = accumulatedChildren[row.id];
            if (childData?.items.length) {
                for (const subRow of childData.items) {
                    allRows.push(subRow);
                    addSubRows(subRow);
                }
                if (childData.totalItems > childData.items.length) {
                    allRows.push({
                        _isLoadMore: true,
                        _parentId: row.id,
                        _totalItems: childData.totalItems,
                        _loadedItems: childData.items.length,
                        id: `load-more-${row.id}`,
                        breadcrumbs: [...(row.breadcrumbs || []), { id: row.id, name: row.name, slug: row.slug }],
                    });
                }
            }
        };
        data.forEach(row => {
            allRows.push(row);
            addSubRows(row);
        });
        return allRows;
    };

    const handleLoadMoreChildren = (parentId: string) => {
        const currentItems = accumulatedChildren[parentId]?.items.length ?? 0;
        const nextPage = Math.floor(currentItems / CHILDREN_PAGE_SIZE);
        setNextPageToFetch(prev => ({
            ...prev,
            [parentId]: nextPage,
        }));
    };

    const handleReorder = async (oldIndex: number, newIndex: number, item: Collection, allItems?: Collection[]) => {
        if (isLoadMoreRow(item as CollectionOrLoadMore)) {
            return;
        }
        try {
            const rawItems = (allItems || []) as CollectionOrLoadMore[];

            // Filter out LoadMoreRows - they shouldn't affect position calculations
            const items = rawItems.filter((i): i is Collection => !isLoadMoreRow(i));

            // Recalculate indices in the filtered array
            const adjustedOldIndex = items.findIndex(i => i.id === item.id);
            const targetItem = rawItems[newIndex];
            const adjustedNewIndex = isLoadMoreRow(targetItem)
                ? items.findIndex(i => i.id === targetItem._parentId)
                : items.findIndex(i => i.id === (targetItem as Collection).id);

            const sourceParentId = getItemParentId(item);

            if (!sourceParentId) {
                throw new Error('Unable to determine parent collection ID');
            }

            const { targetParentId, adjustedIndex: initialIndex } = calculateDragTargetPosition({
                item,
                oldIndex: adjustedOldIndex,
                newIndex: adjustedNewIndex,
                items,
                sourceParentId,
                expanded,
            });

            if (targetParentId !== sourceParentId && isCircularReference(item, targetParentId, items)) {
                toast.error(t`Cannot move a collection into its own descendant`);
                throw new Error('Circular reference detected');
            }

            const adjustedIndex = targetParentId === sourceParentId
                ? calculateSiblingIndex({ item, oldIndex: adjustedOldIndex, newIndex: adjustedNewIndex, items, parentId: sourceParentId })
                : initialIndex;

            await api.mutate(moveCollectionDocument, {
                input: {
                    collectionId: item.id,
                    parentId: targetParentId,
                    index: adjustedIndex,
                },
            });

            setAccumulatedChildren(prev => {
                const newState = { ...prev };
                delete newState[sourceParentId];
                if (targetParentId !== sourceParentId) {
                    delete newState[targetParentId];
                }
                return newState;
            });

            const queriesToInvalidate = [
                queryClient.invalidateQueries({ queryKey: ['childCollections', sourceParentId] }),
                queryClient.invalidateQueries({ queryKey: ['PaginatedListDataTable'] }),
            ];

            if (targetParentId === sourceParentId) {
                await Promise.all(queriesToInvalidate);
                toast.success(t`Collection position updated`);
            } else {
                queriesToInvalidate.push(
                    queryClient.invalidateQueries({ queryKey: ['childCollections', targetParentId] }),
                );
                await Promise.all(queriesToInvalidate);
                toast.success(t`Collection moved to new parent`);
            }
        } catch (error) {
            console.error('Failed to reorder collection:', error);
            if (error instanceof Error && error.message !== 'Circular reference detected') {
                toast.error(t`Failed to update collection position`);
            }
            throw error;
        }
    };

    return (
        <ListPage
            pageId="collection-list"
            title={<Trans>Collections</Trans>}
            listQuery={collectionListDocument}
            transformVariables={input => {
                const filterTerm = input.options?.filter?.name?.contains;
                const isFiltering = !!filterTerm;
                return {
                    options: {
                        ...input.options,
                        topLevelOnly: !isFiltering,
                    },
                };
            }}
            customizeColumns={{
                name: {
                    meta: {
                        // This column needs the following fields to always be available
                        // in order to correctly render.
                        dependencies: ['children', 'breadcrumbs'],
                    },
                    cell: ({ row }) => {
                        const original = row.original as Collection;
                        const isExpanded = row.getIsExpanded();
                        const hasChildren = !!original.children?.length;
                        return (
                            <div
                                style={{ marginLeft: (original.breadcrumbs?.length - 2) * 20 + 'px' }}
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
                                <DetailPageButton id={original.id} label={original.name} />
                            </div>
                        );
                    },
                },
                description: {
                    cell: RichTextDescriptionCell,
                },
                breadcrumbs: {
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!Array.isArray(value)) {
                            return null;
                        }
                        return (
                            <div>
                                {value
                                    .slice(1)
                                    .map(breadcrumb => breadcrumb.name)
                                    .join(' / ')}
                            </div>
                        );
                    },
                },
                productVariantCount: {
                    header: () => <Trans>Contents</Trans>,
                    cell: ({ row }) => {
                        return (
                            <CollectionContentsSheet
                                collectionId={row.original.id}
                                collectionName={row.original.name}
                            >
                                <Trans>{row.original.productVariantCount as number} variants</Trans>
                            </CollectionContentsSheet>
                        );
                    },
                },
                children: {
                    cell: ({ row }) => {
                        const children = row.original.children ?? [];
                        const count = children.length;
                        const maxDisplay = 5;
                        const leftOver = Math.max(count - maxDisplay, 0);
                        return (
                            <div className="flex flex-wrap gap-2">
                                {children.slice(0, maxDisplay).map(child => (
                                    <Badge key={child.id} variant="outline">{child.name}</Badge>
                                ))}
                                {leftOver > 0 ? (
                                    <Badge variant="outline">
                                        <Trans>+ {leftOver} more</Trans>
                                    </Badge>
                                ) : null}
                            </div>
                        );
                    },
                },
            }}
            defaultColumnOrder={[
                'featuredAsset',
                'children',
                'name',
                'slug',
                'breadcrumbs',
                'productVariantCount',
            ]}
            transformData={data => {
                return addSubCollections(data);
            }}
            setTableOptions={(options: TableOptions<any>) => {
                options.state = {
                    ...options.state,
                    expanded: expanded,
                };
                options.onExpandedChange = setExpanded;
                options.getExpandedRowModel = getExpandedRowModel();
                options.getRowCanExpand = () => true;
                options.getRowId = row => row.id;
                options.enableRowSelection = row => !isLoadMoreRow(row.original);
                options.meta = {
                    ...options.meta,
                    resetExpanded: () => setExpanded({}),
                    isUtilityRow: (row: { original: CollectionOrLoadMore }) => isLoadMoreRow(row.original),
                    renderUtilityRow: (row: { original: CollectionOrLoadMore }) => {
                        const original = row.original as LoadMoreRow;
                        const remaining = original._totalItems - original._loadedItems;
                        return (
                            <div
                                style={{ paddingLeft: (original.breadcrumbs?.length - 1) * 20 + 'px' }}
                                className="flex justify-center py-2"
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleLoadMoreChildren(original._parentId)}
                                >
                                    <Trans>Load {Math.min(remaining, CHILDREN_PAGE_SIZE)} more ({remaining} remaining)</Trans>
                                </Button>
                            </div>
                        );
                    },
                };
                return options;
            }}
            defaultVisibility={{
                id: false,
                createdAt: false,
                updatedAt: false,
                position: false,
                parentId: false,
                children: false,
                description: false,
                isPrivate: false,
            }}
            onSearchTermChange={searchTerm => {
                setSearchTerm(searchTerm);
                return {
                    name: { contains: searchTerm },
                };
            }}
            route={Route}
            bulkActions={[
                {
                    component: AssignCollectionsToChannelBulkAction,
                    order: 100,
                },
                {
                    component: RemoveCollectionsFromChannelBulkAction,
                    order: 200,
                },
                {
                    component: DuplicateCollectionsBulkAction,
                    order: 300,
                },
                {
                    component: MoveCollectionsBulkAction,
                    order: 400,
                },
                {
                    component: DeleteCollectionsBulkAction,
                    order: 500,
                },
            ]}
            onReorder={handleReorder}
            disableDragAndDrop={!!searchTerm}
        >
            <ActionBarItem itemId="create-button" requiresPermission={['CreateCollection', 'CreateCatalog']}>
                <Button asChild>
                    <Link to="./new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        <Trans>New Collection</Trans>
                    </Link>
                </Button>
            </ActionBarItem>
        </ListPage>
    );
}
