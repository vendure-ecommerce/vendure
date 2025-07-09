import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { DropdownMenuItem } from '@/vdb/components/ui/dropdown-menu.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { api } from '@/vdb/graphql/api.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { AddManualPaymentDialog } from './components/add-manual-payment-dialog.js';
import { FulfillOrderDialog } from './components/fulfill-order-dialog.js';
import { FulfillmentDetails } from './components/fulfillment-details.js';
import { OrderAddress } from './components/order-address.js';
import { OrderHistoryContainer } from './components/order-history/order-history-container.js';
import { orderHistoryQueryKey } from './components/order-history/use-order-history.js';
import { OrderTable } from './components/order-table.js';
import { OrderTaxSummary } from './components/order-tax-summary.js';
import { PaymentDetails } from './components/payment-details.js';
import { useTransitionOrderToState } from './components/use-transition-order-to-state.js';
import { orderDetailDocument, transitionOrderToStateDocument } from './orders.graphql.js';
import { canAddFulfillment, shouldShowAddManualPaymentButton } from './utils/order-utils.js';

const pageId = 'order-detail';

export const Route = createFileRoute('/_authenticated/_orders/orders_/$id')({
    component: OrderDetailPage,
    loader: async ({ context, params }) => {
        if (!params.id) {
            throw new Error('ID param is required');
        }

        const result: ResultOf<typeof orderDetailDocument> = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(addCustomFields(orderDetailDocument), { id: params.id }),
            { id: params.id },
        );

        if (!result.order) {
            throw new Error(`Order with the ID ${params.id} was not found`);
        }

        if (result.order.state === 'Draft') {
            throw redirect({
                to: `/orders/draft/${params.id}`,
            });
        }

        if (result.order.state === 'Modifying') {
            throw redirect({
                to: `/orders/${params.id}/modify`,
            });
        }

        return {
            breadcrumb: [{ path: '/orders', label: 'Orders' }, result.order.code],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function OrderDetailPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        pageId,
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
    const { ManuallySelectNextState, selectNextState } = useTransitionOrderToState(entity?.id);
    const transitionOrderToStateMutation = useMutation({
        mutationFn: api.mutate(transitionOrderToStateDocument),
    });

    if (!entity) {
        return null;
    }

    const handleModifyClick = async () => {
        await transitionOrderToStateMutation.mutateAsync({
            id: entity.id,
            state: 'Modifying',
        });
        const queryKey = getDetailQueryOptions(orderDetailDocument, { id: entity.id }).queryKey;
        await queryClient.invalidateQueries({ queryKey });
        await navigate({ to: `/orders/$id/modify`, params: { id: entity.id } });
    };

    const nextStates = entity.nextStates;
    const showAddPaymentButton = shouldShowAddManualPaymentButton(entity);
    const showFulfillButton = canAddFulfillment(entity);

    function refreshOrderAndHistory() {
        refreshEntity();
        if (entity) {
            queryClient.refetchQueries({ queryKey: orderHistoryQueryKey(entity.id) });
        }
    }

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{entity?.code ?? ''}</PageTitle>
            <PageActionBar>
                <PageActionBarRight
                    dropdownMenuItems={[
                        {
                            component: () => (
                                <DropdownMenuItem onClick={() => selectNextState({ onSuccess: () => refreshOrderAndHistory() })}>
                                    <Trans>Transition to state...</Trans>
                                </DropdownMenuItem>
                            ),
                        },
                    ]}
                >
                    {showAddPaymentButton && (
                        <PermissionGuard requires={['UpdateOrder']}>
                            <AddManualPaymentDialog
                                order={entity}
                                onSuccess={() => {
                                    refreshEntity();
                                }}
                            />
                        </PermissionGuard>
                    )}
                    {showFulfillButton && (
                        <PermissionGuard requires={['UpdateOrder']}>
                            <FulfillOrderDialog
                                order={entity}
                                onSuccess={() => {
                                    refreshOrderAndHistory();
                                }}
                            />
                        </PermissionGuard>
                    )}
                    {nextStates.includes('Modifying') && (
                        <Button variant="secondary" onClick={handleModifyClick}>
                            <Trans>Modify</Trans>
                        </Button>
                    )}
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

                <PageBlock
                    column="side"
                    blockId="fulfillment-details"
                    title={<Trans>Fulfillment details</Trans>}
                >
                    {entity?.fulfillments?.length && entity.fulfillments.length > 0 ? (
                        <div className="space-y-2">
                            {entity?.fulfillments?.map(fulfillment => (
                                <FulfillmentDetails
                                    key={fulfillment.id}
                                    order={entity}
                                    fulfillment={fulfillment}
                                    onSuccess={() => {
                                        refreshEntity();
                                        queryClient.refetchQueries({
                                            queryKey: orderHistoryQueryKey(entity.id),
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground text-xs font-medium p-3 border rounded-md">
                            <Trans>No fulfillments</Trans>
                        </div>
                    )}
                </PageBlock>
            </PageLayout>
            <ManuallySelectNextState availableStates={nextStates} />
        </Page>
    );
}
