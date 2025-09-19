import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@/vdb/lib/trans.js';
import { FetchQueryOptions, useQueries } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ExpandedState, getExpandedRowModel } from '@tanstack/react-table';
import { TableOptions } from '@tanstack/table-core';
import { ResultOf } from 'gql.tada';
import { Folder, FolderOpen, PlusIcon } from 'lucide-react';
import { useState } from 'react';

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

export const Route = createFileRoute('/_authenticated/_collections/collections')({
    component: CollectionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Collections</Trans> }),
});

type Collection = ResultOf<typeof collectionListDocument>['collections']['items'][number];

function CollectionListPage() {
    const [expanded, setExpanded] = useState<ExpandedState>({});
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

    return (
        <>
            <ListPage
                pageId="collection-list"
                title="Collections"
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
                        header: 'Collection Name',
                        cell: ({ row }) => {
                            const isExpanded = row.getIsExpanded();
                            const hasChildren = !!row.original.children?.length;
                            return (
                                <div
                                    style={{ marginLeft: (row.original.breadcrumbs.length - 2) * 20 + 'px' }}
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
                        header: 'Contents',
                        cell: ({ row }) => {
                            return (
                                <CollectionContentsSheet
                                    collectionId={row.original.id}
                                    collectionName={row.original.name}
                                >
                                    <Trans>{row.original.productVariants.totalItems} variants</Trans>
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
                                        <Badge variant="outline">{child.name}</Badge>
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
                }}
                onSearchTermChange={searchTerm => {
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
            </ListPage>
        </>
    );
}
