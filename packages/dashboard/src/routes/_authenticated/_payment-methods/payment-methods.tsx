import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { ListPage } from '@/framework/page/list-page.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { paymentMethodListQuery } from './payment-methods.graphql.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Badge } from '@/components/ui/badge.js';
import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';

export const Route = createFileRoute('/_authenticated/_payment-methods/payment-methods')({
    component: PaymentMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Payment Methods</Trans> }),
});

function PaymentMethodListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(paymentMethodListQuery)}
            route={Route}
            title="Payment Methods"
            defaultVisibility={{
                name: true,
                code: true,
                enabled: true,
            }}
            onSearchTermChange={searchTerm => {
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
            }}
        />
    );
}
