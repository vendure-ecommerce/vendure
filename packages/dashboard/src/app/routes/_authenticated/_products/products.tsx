import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
    AssignFacetValuesToProductsBulkAction,
    AssignProductsToChannelBulkAction,
    DeleteProductsBulkAction,
    DuplicateProductsBulkAction,
    RemoveProductsFromChannelBulkAction,
} from './components/product-bulk-actions.js';
import { productListDocument, reindexDocument } from './products.graphql.js';

export const Route = createFileRoute('/_authenticated/_products/products')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: () => <Trans>Products</Trans> }),
});

function ProductListPage() {
    const { t } = useLingui();
    const reindexMutation = useMutation({
        mutationFn: () => api.mutate(reindexDocument, {}),
        onSuccess: () => {
            toast.success(t`Search index rebuild started`);
        },
        onError: () => {
            toast.error(t`Search index rebuild could not be started`);
        },
    });

    const handleRebuildSearchIndex = () => {
        reindexMutation.mutate();
    };

    return (
        <ListPage
            pageId="product-list"
            listQuery={productListDocument}
            title={<Trans>Products</Trans>}
            customizeColumns={{
                name: {
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            defaultVisibility={{
                name: true,
                featuredAsset: true,
                slug: true,
                enabled: true,
            }}
            route={Route}
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
                    component: AssignFacetValuesToProductsBulkAction,
                    order: 300,
                },
                {
                    component: DuplicateProductsBulkAction,
                    order: 400,
                },
                {
                    component: DeleteProductsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['UpdateCatalog']}>
                    <Button variant="outline" onClick={handleRebuildSearchIndex}>
                        <RefreshCwIcon />
                        <Trans>Rebuild search index</Trans>
                    </Button>
                </PermissionGuard>
                <PermissionGuard requires={['CreateProduct', 'CreateCatalog']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Product</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
