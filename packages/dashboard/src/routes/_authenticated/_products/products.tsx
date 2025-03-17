import { Button } from '@/components/ui/button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { productListDocument } from './products.graphql.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { PlusIcon } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/_products/products')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: 'Products' }),
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
            listQuery={productListDocument}
            route={Route}
        >
            <PageActionBar>
                <div></div>
                <Button asChild>
                    <Link to="./new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New Product
                    </Link>
                </Button>
            </PageActionBar>
        </ListPage>
    );
}
