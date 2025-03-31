import { Money } from '@/components/data-display/money.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';
import { deleteProductVariantDocument, productVariantListDocument } from './product-variants.graphql.js';

export const Route = createFileRoute('/_authenticated/_product-variants/product-variants')({
    component: ProductListPage,
    loader: () => ({ breadcrumb: () => <Trans>Product Variants</Trans> }),
});

function ProductListPage() {
    const { formatCurrencyName } = useLocalFormat();
    return (
        <ListPage
            pageId="product-variant-list"
            title={<Trans>Product Variants</Trans>}
            listQuery={productVariantListDocument}
            deleteMutation={deleteProductVariantDocument}
            customizeColumns={{
                name: {
                    header: 'Product Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                currencyCode: {
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        return formatCurrencyName(value as string, 'full');
                    },
                },
                price: {
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        if (typeof value === 'number') {
                            return <Money value={value} currency={currencyCode} />;
                        }
                        return value;
                    },
                },
                priceWithTax: {
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        if (typeof value === 'number') {
                            return <Money value={value} currency={currencyCode} />;
                        }
                        return value;
                    },
                },
                stockLevels: {
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        if (Array.isArray(value)) {
                            const totalOnHand = value.reduce((acc, curr) => acc + curr.stockOnHand, 0);
                            const totalAllocated = value.reduce((acc, curr) => acc + curr.stockAllocated, 0);
                            return (
                                <span>
                                    {totalOnHand} / {totalAllocated}
                                </span>
                            );
                        }
                        return value;
                    },
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            route={Route}
        >
            <PageActionBar>
                <div></div>
            </PageActionBar>
        </ListPage>
    );
}
