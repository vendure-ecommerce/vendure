import { Money } from '@/vdb/components/data-display/money.js';
import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { StockLevelLabel } from '@/vdb/components/shared/stock-level-label.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';
import {
    AssignFacetValuesToProductVariantsBulkAction,
    AssignProductVariantsToChannelBulkAction,
    DeleteProductVariantsBulkAction,
    RemoveProductVariantsFromChannelBulkAction,
} from './components/product-variant-bulk-actions.js';
import { productVariantListDocument } from './product-variants.graphql.js';

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
            bulkActions={[
                {
                    component: AssignProductVariantsToChannelBulkAction,
                    order: 100,
                },
                {
                    component: RemoveProductVariantsFromChannelBulkAction,
                    order: 200,
                },
                {
                    component: AssignFacetValuesToProductVariantsBulkAction,
                    order: 300,
                },
                {
                    component: DeleteProductVariantsBulkAction,
                    order: 400,
                },
            ]}
            customizeColumns={{
                name: {
                    header: 'Product Name',
                    cell: ({ row: { original } }) => (
                        <DetailPageButton id={original.id} label={original.name} />
                    ),
                },
                currencyCode: {
                    cell: ({ row: { original } }) => formatCurrencyName(original.currencyCode, 'full'),
                },
                price: {
                    cell: ({ row: { original } }) => (
                        <Money value={original.price} currency={original.currencyCode} />
                    ),
                },
                priceWithTax: {
                    cell: ({ row: { original } }) => (
                        <Money value={original.priceWithTax} currency={original.currencyCode} />
                    ),
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
