import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import {
    AssignShippingMethodsToChannelBulkAction,
    DeleteShippingMethodsBulkAction,
    RemoveShippingMethodsFromChannelBulkAction,
} from './components/shipping-method-bulk-actions.js';
import { TestShippingMethodDialog } from './components/test-shipping-method-dialog.js';
import { shippingMethodListQuery } from './shipping-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_shipping-methods/shipping-methods')({
    component: ShippingMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Shipping Methods</Trans> }),
});

function ShippingMethodListPage() {
    return (
        <ListPage
            pageId="shipping-method-list"
            listQuery={shippingMethodListQuery}
            route={Route}
            title="Shipping Methods"
            defaultVisibility={{
                name: true,
                code: true,
                fulfillmentHandlerCode: true,
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            bulkActions={[
                {
                    component: AssignShippingMethodsToChannelBulkAction,
                    order: 100,
                },
                {
                    component: RemoveShippingMethodsFromChannelBulkAction,
                    order: 200,
                },
                {
                    component: DeleteShippingMethodsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateShippingMethod']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Shipping Method</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
                <TestShippingMethodDialog />
            </PageActionBarRight>
        </ListPage>
    );
}
