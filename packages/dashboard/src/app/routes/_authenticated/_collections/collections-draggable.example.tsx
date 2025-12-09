/**
 * Example implementation of collections page with drag-and-drop reordering.
 *
 * This file demonstrates how to use the DraggableListPage component with the collections table.
 * To use this implementation:
 * 1. Replace the contents of collections.tsx with this file
 * 2. Rename this file to collections.tsx
 * 3. Implement the mutation for updating collection positions
 */

import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { DraggableListPage } from '@/vdb/framework/page/draggable-list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@lingui/react/macro';
import { FetchQueryOptions, useQueries } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ExpandedState, getExpandedRowModel } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import { ResultOf } from 'gql.tada';
import { Folder, FolderOpen, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { RichTextDescriptionCell } from '@/vdb/components/shared/table-cell/order-table-cell-components.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { collectionListDocument } from './collections.graphql.js';
import {
    AssignCollectionsToChannelBulkAction,
    DeleteCollectionsBulkAction,
    DuplicateCollectionsBulkAction,
    MoveCollectionsBulkAction,
    RemoveCollectionsFromChannelBulkAction,
} from './components/collection-bulk-actions.js';
import { CollectionContentsSheet } from './components/collection-contents-sheet.js';

export const Route = createFileRoute('/_authenticated/_collections/collections-draggable/example')({
    component: CollectionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Collections</Trans> }),
});

type Collection = ResultOf<typeof collectionListDocument>['collections']['items'][number];

// TODO: Create this mutation in collections.graphql.ts
// Example mutation:
// export const updateCollectionPositionDocument = graphql(`
//     mutation UpdateCollectionPosition($id: ID!, $position: Int!) {
//         updateCollection(input: { id: $id, position: $position }) {
//             id
//             position
//         }
//     }
// `);

function CollectionListPage() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    const childrenQueries = useQueries({
        queries: Object.entries(expanded).map(([collectionId, isExpanded]) => {
            return {
                queryKey: ['childCollections', collectionId],
                queryFn: () =>
                    api.query(collectionListDocument, {
                        options: {
                            filter: {
                                parentId: { eq: collectionId },
                            },
                        },
                    }),
                staleTime: 1000 * 60 * 5,
            } satisfies FetchQueryOptions;
        }),
    });

    const childCollectionsByParentId = childrenQueries.reduce(
        (acc, query, index) => {
            const collectionId = Object.keys(expanded)[index];
            if (query.data) {
                acc[collectionId] = query.data.collections.items;
            }
            return acc;
        },
        {} as Record<string, any[]>,
    );

    const addSubCollections = (data: Collection[]) => {
        const allRows = [] as Collection[];
        const addSubRows = (row: Collection) => {
            const subRows = childCollectionsByParentId[row.id] || [];
            if (subRows.length) {
                for (const subRow of subRows) {
                    allRows.push(subRow);
                    addSubRows(subRow);
                }
            }
        };
        data.forEach(row => {
            allRows.push(row);
            addSubRows(row);
        });
        return allRows;
    };

    // Callback to handle collection reordering
    const handleReorder = async (oldIndex: number, newIndex: number, item: Collection) => {
        console.log('Reordering collection:', { oldIndex, newIndex, item });

        // TODO: Implement the actual mutation to update the collection position
        // Example:
        // try {
        //     await api.mutate(updateCollectionPositionDocument, {
        //         id: item.id,
        //         position: newIndex,
        //     });
        //     // Optionally show a success toast
        // } catch (error) {
        //     console.error('Failed to reorder collection:', error);
        //     // Optionally show an error toast
        //     throw error; // Re-throw to trigger the revert in DraggableDataTable
        // }
    };

    // Determine if drag-and-drop should be disabled
    // We disable it when:
    // 1. There's a search term (which shows nested items)
    // 2. Any rows are expanded (showing nested items)
    const isFiltering = !!searchTerm;
    const hasExpandedRows = Object.keys(expanded).length > 0;
    const isDragDisabled = isFiltering || hasExpandedRows;

    return (
        <>
            <DraggableListPage
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
                            dependencies: ['children', 'breadcrumbs'],
                        },
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
                    productVariants: {
                        header: () => <Trans>Contents</Trans>,
                        cell: ({ row }) => {
                            return (
                                <CollectionContentsSheet
                                    collectionId={row.original.id}
                                    collectionName={row.original.name}
                                >
                                    <Trans>{row.original.productVariants?.totalItems} variants</Trans>
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
                    'productVariants',
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
                    options.getRowId = row => {
                        return row.id;
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
                // Drag and drop configuration
                onReorder={handleReorder}
                disableDragAndDrop={isDragDisabled}
            >
                <PageActionBarRight>
                    <PermissionGuard requires={['CreateCollection', 'CreateCatalog']}>
                        <Button asChild>
                            <Link to="./new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                <Trans>New Collection</Trans>
                            </Link>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </DraggableListPage>
        </>
    );
}
