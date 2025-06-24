import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { 
    DeleteProductsBulkAction, 
    AssignProductsToChannelBulkAction, 
    RemoveProductsFromChannelBulkAction, 
    AssignFacetValuesToProductsBulkAction, 
    DuplicateProductsBulkAction 
} from './components/product-bulk-actions.js';
import { deleteProductDocument, productListDocument } from './products.graphql.js';

export const Route = createFileRoute('/_authenticated/_products/products')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: () => <Trans>Products</Trans> }),
});

function ProductListPage() {
    return (
        <ListPage
            pageId="product-list"
            listQuery={productListDocument}
            deleteMutation={deleteProductDocument}
            title="Products"
            customizeColumns={{
                name: {
                    header: 'Product Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            route={Route}
            bulkActions={[
                {
                    requiresPermission: ['UpdateCatalog', 'UpdateProduct'],
                    component: AssignProductsToChannelBulkAction,
                    order: 100,
                },
                {
                    requiresPermission: ['UpdateCatalog', 'UpdateProduct'],
                    component: RemoveProductsFromChannelBulkAction,
                    order: 200,
                },
                {
                    requiresPermission: ['UpdateCatalog', 'UpdateProduct'],
                    component: AssignFacetValuesToProductsBulkAction,
                    order: 300,
                },
                {
                    requiresPermission: ['CreateProduct', 'CreateCatalog'],
                    component: DuplicateProductsBulkAction,
                    order: 400,
                },
                {
                    requiresPermission: ['DeleteProduct', 'DeleteCatalog'],
                    component: DeleteProductsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
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
