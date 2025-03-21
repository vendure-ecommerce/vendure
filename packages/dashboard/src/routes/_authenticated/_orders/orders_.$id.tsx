import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import {
    Form
} from '@/components/ui/form.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { OrderHistoryContainer } from './components/order-history/order-history-container.js';
import { OrderTable } from './components/order-table.js';
import { OrderTaxSummary } from './components/order-tax-summary.js';
import { orderDetailDocument } from './orders.graphql.js';
import { OrderAddress } from './components/order-address.js';
import { PaymentDetails } from './components/payment-details.js';

export const Route = createFileRoute('/_authenticated/_orders/orders_/$id')({
    component: FacetDetailPage,
    loader: async ({ context, params }) => {
        const result = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(addCustomFields(orderDetailDocument), { id: params.id }),
            { id: params.id },
        );
        if (!result.order) {
            throw new Error(`Order with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [{ path: '/orders', label: 'Orders' }, result.order.code],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function FacetDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(orderDetailDocument),
        entityField: 'order',
        // updateDocument: updateOrderDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated facet'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
        },
        onError: err => {
            toast(i18n.t('Failed to update facet'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>{entity?.code ?? ''}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="main">
                            <OrderTable order={entity} />
                        </PageBlock>
                        <PageBlock column="main" title={<Trans>Tax summary</Trans>}>
                            <OrderTaxSummary order={entity} />
                        </PageBlock>
                        <CustomFieldsPageBlock column="main" entityType="Order" control={form.control} />
                        <PageBlock column="main" title={<Trans>Order history</Trans>}>
                            <OrderHistoryContainer orderId={entity.id} />
                        </PageBlock>
                        <PageBlock column="side" title={<Trans>State</Trans>}>
                            <Badge variant="outline">{entity?.state}</Badge>
                        </PageBlock>
                        <PageBlock column="side" title={<Trans>Customer</Trans>}>
                            <Button variant="ghost" asChild>
                                <Link to={`/customers/${entity?.customer?.id}`}>
                                    <User className="w-4 h-4" />
                                    {entity?.customer?.firstName} {entity?.customer?.lastName}
                                </Link>
                            </Button>
                            <div className="mt-4 divide-y">
                            {entity.shippingAddress && (
                                <div className="pb-6">
                                    <div className="font-medium">
                                        <Trans>Shipping address</Trans>
                                    </div>
                                    <OrderAddress address={entity.shippingAddress} />
                                </div>
                            )}
                            {entity.billingAddress && (
                                <div className="pt-4">
                                    <div className="font-medium">
                                        <Trans>Billing address</Trans>
                                    </div>
                                    <OrderAddress address={entity.billingAddress} />
                                </div>
                            )}
                            </div>
                        </PageBlock>
                        <PageBlock column="side" title={<Trans>Payment details</Trans>}>
                        {entity.payments.map(payment => (
                            <PaymentDetails key={payment.id} payment={payment} currencyCode={entity.currencyCode} />
                        ))}
                        </PageBlock>
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
