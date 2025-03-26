import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { productListDocument } from './products.graphql.js';

export const Route = createFileRoute('/_authenticated/_products/products')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: () => <Trans>Products</Trans> }),
});

export function ProductListPage() {
    return (
        <ListPage
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
            listQuery={productListDocument}
            route={Route}
        >
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['CreateProduct', 'CreateCatalog']}>
                        <Button asChild>
                            <Link to="./new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Product
                            </Link>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
        </ListPage>
    );
}
