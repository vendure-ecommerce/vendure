import { Link, createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { ListPage } from '@/framework/page/list-page.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { taxRateListQuery } from './tax-rates.graphql.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Badge } from '@/components/ui/badge.js';
import { api } from '@/graphql/api.js';
import { taxCategoryListQuery } from '../_tax-categories/tax-categories.graphql.js';
import { zoneListQuery } from '../_zones/zones.graphql.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';

export const Route = createFileRoute('/_authenticated/_tax-rates/tax-rates')({
    component: TaxRateListPage,
    loader: () => ({ breadcrumb: () => <Trans>Tax Rates</Trans> }),
});

function TaxRateListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(taxRateListQuery)}
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
                    cell: ({ row }) => (
                        <BooleanDisplayBadge value={row.original.enabled} />
                    ),
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
            <PageActionBar>
                <PermissionGuard requires={['CreateTaxRate']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Tax Rate</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
