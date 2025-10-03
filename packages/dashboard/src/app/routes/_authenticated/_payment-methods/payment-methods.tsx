import { BooleanDisplayBadge } from '@/vdb/components/data-display/boolean.js';
import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import {
    AssignPaymentMethodsToChannelBulkAction,
    DeletePaymentMethodsBulkAction,
    RemovePaymentMethodsFromChannelBulkAction,
} from './components/payment-method-bulk-actions.js';
import { paymentMethodListQuery } from './payment-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_payment-methods/payment-methods')({
    component: PaymentMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Payment Methods</Trans> }),
});

function PaymentMethodListPage() {
    return (
        <ListPage
            pageId="payment-method-list"
            listQuery={paymentMethodListQuery}
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
                    cell: ({ row }) => <BooleanDisplayBadge value={row.original.enabled} />,
                },
            }}
            bulkActions={[
                {
                    component: AssignPaymentMethodsToChannelBulkAction,
                    order: 100,
                },
                {
                    component: RemovePaymentMethodsFromChannelBulkAction,
                    order: 200,
                },
                {
                    component: DeletePaymentMethodsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreatePaymentMethod']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Payment Method
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
