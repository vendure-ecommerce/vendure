import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { TestShippingMethodDialog } from './components/test-shipping-method-dialog.js';
import { deleteShippingMethodDocument, shippingMethodListQuery } from './shipping-methods.graphql.js';

export const Route = createFileRoute('/_authenticated/_shipping-methods/shipping-methods')({
    component: ShippingMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Shipping Methods</Trans> }),
});

function ShippingMethodListPage() {
    return (
        <ListPage
            listQuery={shippingMethodListQuery}
            deleteMutation={deleteShippingMethodDocument}
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
        >
            <PageActionBar>
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
            </PageActionBar>
        </ListPage>
    );
}
