import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { Link, createFileRoute } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { OrderAddress } from './components/order-address.js';
import { OrderHistoryContainer } from './components/order-history/order-history-container.js';
import { OrderTable } from './components/order-table.js';
import { OrderTaxSummary } from './components/order-tax-summary.js';
import { PaymentDetails } from './components/payment-details.js';
import { orderDetailDocument } from './orders.graphql.js';

export const Route = createFileRoute('/_authenticated/_orders/orders_/$id')({
    component: OrderDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: orderDetailDocument,
        breadcrumb(_isNew, entity) {
            return [{ path: '/orders', label: 'Orders' }, entity?.code];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function OrderDetailPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: orderDetailDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async () => {
            toast(i18n.t('Successfully updated order'));
            form.reset(form.getValues());
        },
        onError: err => {
            toast(i18n.t('Failed to update order'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    if (!entity) {
        return null;
    }

    return (
        <Page pageId="order-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>{entity?.code ?? ''}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            <Trans>Update</Trans>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="order-table">
                    <OrderTable order={entity} />
                </PageBlock>
                <PageBlock column="main" blockId="tax-summary" title={<Trans>Tax summary</Trans>}>
                    <OrderTaxSummary order={entity} />
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Order" control={form.control} />
                <PageBlock column="main" blockId="order-history" title={<Trans>Order history</Trans>}>
                    <OrderHistoryContainer orderId={entity.id} />
                </PageBlock>
                <PageBlock column="side" blockId="state" title={<Trans>State</Trans>}>
                    <Badge variant="outline">{entity?.state}</Badge>
                </PageBlock>
                <PageBlock column="side" blockId="customer" title={<Trans>Customer</Trans>}>
                    <Button variant="ghost" asChild>
                        <Link to={`/customers/${entity?.customer?.id}`}>
                            <User className="w-4 h-4" />
                            {entity?.customer?.firstName} {entity?.customer?.lastName}
                        </Link>
                    </Button>
                    <div className="mt-4 divide-y">
                        {entity?.shippingAddress && (
                            <div className="pb-6">
                                <div className="font-medium">
                                    <Trans>Shipping address</Trans>
                                </div>
                                <OrderAddress address={entity.shippingAddress} />
                            </div>
                        )}
                        {entity?.billingAddress && (
                            <div className="pt-4">
                                <div className="font-medium">
                                    <Trans>Billing address</Trans>
                                </div>
                                <OrderAddress address={entity.billingAddress} />
                            </div>
                        )}
                    </div>
                </PageBlock>
                <PageBlock column="side" blockId="payment-details" title={<Trans>Payment details</Trans>}>
                    {entity?.payments?.map(payment => (
                        <PaymentDetails
                            key={payment.id}
                            payment={payment}
                            currencyCode={entity.currencyCode}
                        />
                    ))}
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
