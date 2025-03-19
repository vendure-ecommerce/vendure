import { Button } from '@/components/ui/button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { productListDocument } from './products.graphql.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { PlusIcon } from 'lucide-react';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { Trans } from '@lingui/react/macro';

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
                    cell: ({ row }) => {
                        return (
                            <Link to={`./${row.original.id}`}>
                                <Button variant="ghost">{row.original.name}</Button>
                            </Link>
                        );
                    },
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            listQuery={addCustomFields(productListDocument)}
            route={Route}
        >
            <PageActionBar>
                <div></div>
                <PermissionGuard requires={['CreateProduct', 'CreateCatalog']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                        New Product
                    </Link>
                </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
