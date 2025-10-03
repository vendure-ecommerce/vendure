import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import {
    AssignFacetValuesToProductsBulkAction,
    AssignProductsToChannelBulkAction,
    DeleteProductsBulkAction,
    DuplicateProductsBulkAction,
    RemoveProductsFromChannelBulkAction,
} from './components/product-bulk-actions.js';
import { productListDocument } from './products.graphql.js';

export const Route = createFileRoute('/_authenticated/_products/products')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: () => <Trans>Products</Trans> }),
});

function ProductListPage() {
    return (
        <ListPage
            pageId="product-list"
            listQuery={productListDocument}
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
