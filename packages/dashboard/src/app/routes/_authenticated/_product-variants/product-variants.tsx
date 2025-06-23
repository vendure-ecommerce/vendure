import { Money } from '@/components/data-display/money.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { StockLevelLabel } from '@/components/shared/stock-level-label.js';
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
                    cell: ({ row: { original } }) => <DetailPageButton id={original.id} label={original.name} />,
                },
                currencyCode: {
                    cell: ({ row: { original } }) => formatCurrencyName(original.currencyCode, 'full'),
                },
                price: {
                    cell: ({ row: { original } }) => <Money value={original.price} currency={original.currencyCode} />,
                },
                priceWithTax: {
                    cell: ({ row: { original } }) => <Money value={original.priceWithTax} currency={original.currencyCode} />,
                },
                stockLevels: {
                    cell: ({ row: { original } }) => <StockLevelLabel stockLevels={original.stockLevels} />,
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            route={Route}
        ></ListPage>
    );
}
