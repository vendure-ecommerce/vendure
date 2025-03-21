import { Link, createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { ListPage } from '@/framework/page/list-page.js';
import { shippingMethodListQuery } from './shipping-methods.graphql.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TestShippingMethodDialog } from './components/test-shipping-method-dialog.js';

export const Route = createFileRoute('/_authenticated/_shipping-methods/shipping-methods')({
    component: ShippingMethodListPage,
    loader: () => ({ breadcrumb: () => <Trans>Shipping Methods</Trans> }),
});

function ShippingMethodListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(shippingMethodListQuery)}
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
                <PermissionGuard requires={['CreateShippingMethod']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Shipping Method
                        </Link>
                    </Button>
                </PermissionGuard>
                <TestShippingMethodDialog />
            </PageActionBar>
        </ListPage>
    );
}
