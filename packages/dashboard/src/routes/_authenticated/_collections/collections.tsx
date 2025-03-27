import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarLeft, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { collectionListDocument, deleteCollectionDocument } from './collections.graphql.js';
import { CollectionContentsSheet } from './components/collection-contents-sheet.js';

export const Route = createFileRoute('/_authenticated/_collections/collections')({
    component: CollectionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Collections</Trans> }),
});

function CollectionListPage() {
    return (
        <ListPage
            pageId="collection-list"
            title="Collections"
            listQuery={collectionListDocument}
            deleteMutation={deleteCollectionDocument}
            customizeColumns={{
                name: {
                    header: 'Collection Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                breadcrumbs: {
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!Array.isArray(value)) return null;
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
            }}
            defaultVisibility={{
                id: false,
                createdAt: false,
                updatedAt: false,
                position: false,
                parentId: false,
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            route={Route}
        >
            <PageActionBar>
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
            </PageActionBar>
        </ListPage>
    );
}
