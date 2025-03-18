import { Button } from '@/components/ui/button.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { productVariantListDocument } from './product-variants.graphql.js';

export const Route = createFileRoute('/_authenticated/_product-variants/product-variants')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: 'Products' }),
});

export function ProductListPage() {
    return (
        <ListPage
            title="Products"
            customizeColumns={{
               /*  name: {
                    header: 'Product Name',
                    cell: ({ row }) => {
                        return (
                            <Link to={`./${row.original.id}`}>
                                <Button variant="ghost">{row.original.name}</Button>
                            </Link>
                        );
                    },
                }, */
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            listQuery={productVariantListDocument}
            route={Route}
        >
            <PageActionBar>
                <div></div>
            </PageActionBar>
        </ListPage>
    );
}
