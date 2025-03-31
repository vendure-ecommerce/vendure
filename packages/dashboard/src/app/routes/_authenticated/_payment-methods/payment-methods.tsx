import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { deletePaymentMethodDocument, paymentMethodListQuery } from './payment-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_payment-methods/payment-methods')({
    component: PaymentMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Payment Methods</Trans> }),
});

function PaymentMethodListPage() {
    return (
        <ListPage
            pageId="payment-method-list"
            listQuery={paymentMethodListQuery}
            deleteMutation={deletePaymentMethodDocument}
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
        >
            {' '}
            <PageActionBar>
                <PermissionGuard requires={['CreatePaymentMethod']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Payment Method
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
