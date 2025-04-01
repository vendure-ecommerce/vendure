import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { api } from '@/graphql/api.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { taxCategoryListQuery } from '../_tax-categories/tax-categories.graphql.js';
import { zoneListQuery } from '../_zones/zones.graphql.js';
import { deleteTaxRateDocument, taxRateListQuery } from './tax-rates.graphql.js';

export const Route = createFileRoute('/_authenticated/_tax-rates/tax-rates')({
    component: TaxRateListPage,
    loader: () => ({ breadcrumb: () => <Trans>Tax Rates</Trans> }),
});

function TaxRateListPage() {
    return (
        <ListPage
            pageId="tax-rate-list"
            listQuery={taxRateListQuery}
            deleteMutation={deleteTaxRateDocument}
            route={Route}
            title="Tax Rates"
            defaultVisibility={{
                name: true,
                enabled: true,
                category: true,
                zone: true,
                value: true,
            }}
            onSearchTermChange={searchTerm => {
                if (searchTerm === '') {
                    return {};
                }

                return {
                    name: { contains: searchTerm },
                };
            }}
            facetedFilters={{
                enabled: {
                    title: 'Enabled',
                    options: [
                        { label: 'Enabled', value: true },
                        { label: 'Disabled', value: false },
                    ],
                },
                category: {
                    title: 'Category',
                    optionsFn: async () => {
                        const { taxCategories } = await api.query(taxCategoryListQuery);
                        return taxCategories.items.map(category => ({
                            label: category.name,
                            value: category.id,
                        }));
                    },
                },
                zone: {
                    title: 'Zone',
                    optionsFn: async () => {
                        const { zones } = await api.query(zoneListQuery);
                        return zones.items.map(zone => ({
                            label: zone.name,
                            value: zone.id,
                        }));
                    },
                },
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                enabled: {
                    header: 'Enabled',
                    cell: ({ row }) => <BooleanDisplayBadge value={row.original.enabled} />,
                },
                category: {
                    header: 'Category',
                    cell: ({ row }) => row.original.category?.name,
                },
                zone: {
                    header: 'Zone',
                    cell: ({ row }) => row.original.zone?.name,
                },
                value: {
                    header: 'Value',
                    cell: ({ row }) => `${row.original.value}%`,
                },
            }}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateTaxRate']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Tax Rate</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
