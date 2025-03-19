import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { collectionListDocument } from './collections.graphql.js';
import { CollectionContentsSheet } from './components/collection-contents-sheet.js';
import { Badge } from '@/components/ui/badge.js';

export const Route = createFileRoute('/_authenticated/_collections/collections')({
    component: CollectionListPage,
    loader: () => ({ breadcrumb: () => <Trans>Collections</Trans> }),
});

export function CollectionListPage() {
    return (
        <ListPage
            title="Collections"
            customizeColumns={{
                name: {
                    header: 'Collection Name',
                    cell: ({ row }) => {
                        return (
                            <Link to={`./${row.original.id}`}>
                                <Button variant="ghost">{row.original.name}</Button>
                            </Link>
                        );
                    },
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
                            <Badge variant="outline">
                                <div><Trans>{row.original.productVariants.totalItems} variants</Trans></div>
                                <CollectionContentsSheet
                                    collectionId={row.original.id}
                                    collectionName={row.original.name}
                                />
                            </Badge>
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
            listQuery={addCustomFields(collectionListDocument)}
            route={Route}
        >
            <PageActionBar>
                <div></div>
                <PermissionGuard requires={['CreateCollection', 'CreateCatalog']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Collection</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
