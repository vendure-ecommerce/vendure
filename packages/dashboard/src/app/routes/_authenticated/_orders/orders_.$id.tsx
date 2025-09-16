import { CustomFieldsForm } from '@/vdb/components/shared/custom-fields-form.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { DropdownMenuItem } from '@/vdb/components/ui/dropdown-menu.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import {
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
import { useCustomFieldConfig } from '@/vdb/hooks/use-custom-field-config.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { Pencil, User } from 'lucide-react';
import { useMemo } from 'react';
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
import { getTypeForState, StateTransitionControl } from './components/state-transition-control.js';
import { useTransitionOrderToState } from './components/use-transition-order-to-state.js';
import {
    orderDetailDocument,
    setOrderCustomFieldsDocument,
    transitionOrderToStateDocument,
} from './orders.graphql.js';
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
            breadcrumb: [{ path: '/orders', label: <Trans>Orders</Trans> }, result.order.code],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function OrderDetailPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { form, submitHandler, entity, refreshEntity } = useDetailPage({
        pageId,
        queryDocument: orderDetailDocument,
        updateDocument: setOrderCustomFieldsDocument,
        setValuesForUpdate: (entity: any) => {
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
    const { transitionToState } = useTransitionOrderToState(entity?.id);
    const transitionOrderToStateMutation = useMutation({
        mutationFn: api.mutate(transitionOrderToStateDocument),
    });
    const customFieldConfig = useCustomFieldConfig('Order');
    const stateTransitionActions = useMemo(() => {
        if (!entity) {
            return [];
        }
        return entity.nextStates.map(state => ({
            label: `Transition to ${state}`,
            type: getTypeForState(state),
            onClick: async () => {
                const transitionError = await transitionToState(state);
                if (transitionError) {
                    toast(i18n.t('Failed to transition order to state'), {
                        description: transitionError,
                    });
                } else {
                    refreshOrderAndHistory();
                }
            },
        }));
    }, [entity, transitionToState, i18n]);

    if (!entity) {
        return null;
    }

    const handleModifyClick = async () => {
        try {
            await transitionOrderToStateMutation.mutateAsync({
                id: entity.id,
                state: 'Modifying',
            });
            const queryKey = getDetailQueryOptions(orderDetailDocument, { id: entity.id }).queryKey;
            await queryClient.invalidateQueries({ queryKey });
            await navigate({ to: `/orders/$id/modify`, params: { id: entity.id } });
        } catch (error) {
            toast(i18n.t('Failed to modify order'), {
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    const nextStates = entity.nextStates;
    const showAddPaymentButton = shouldShowAddManualPaymentButton(entity);
    const showFulfillButton = canAddFulfillment(entity);

    async function refreshOrderAndHistory() {
        if (entity) {
            const queryKey = getDetailQueryOptions(orderDetailDocument, { id: entity.id }).queryKey;
            await queryClient.invalidateQueries({ queryKey });
            queryClient.refetchQueries({ queryKey: orderHistoryQueryKey(entity.id) });
        }
    }

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{entity?.code ?? ''}</PageTitle>
            <PageActionBar>
                <PageActionBarRight
                    dropdownMenuItems={[
                        ...(nextStates.includes('Modifying')
                            ? [
                                  {
                                      component: () => (
                                          <DropdownMenuItem onClick={handleModifyClick}>
                                              <Pencil className="w-4 h-4" />
                                              <Trans>Modify</Trans>
                                          </DropdownMenuItem>
                                      ),
                                  },
                              ]
                            : []),
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
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="order-table">
                    <OrderTable order={entity} pageId={pageId} />
                </PageBlock>
                <PageBlock column="main" blockId="tax-summary" title={<Trans>Tax summary</Trans>}>
                    <OrderTaxSummary order={entity} />
                </PageBlock>
                {customFieldConfig?.length ? (
                    <PageBlock column="main" blockId="custom-fields">
                        <CustomFieldsForm entityType="Order" control={form.control} />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid}
                            >
                                Save
                            </Button>
                        </div>
                    </PageBlock>
                ) : null}
                <PageBlock column="main" blockId="payment-details" title={<Trans>Payment details</Trans>}>
                    <div className="grid lg:grid-cols-2 gap-4">
                        {entity?.payments?.map(payment => (
                            <PaymentDetails
                                key={payment.id}
                                payment={payment}
                                currencyCode={entity.currencyCode}
                                onSuccess={() => refreshOrderAndHistory()}
                            />
                        ))}
                    </div>
                </PageBlock>
                <PageBlock column="main" blockId="order-history" title={<Trans>Order history</Trans>}>
                    <OrderHistoryContainer orderId={entity.id} />
                </PageBlock>
                <PageBlock column="side" blockId="state">
                    <StateTransitionControl
                        currentState={entity?.state}
                        actions={stateTransitionActions}
                        isLoading={transitionOrderToStateMutation.isPending}
                    />
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
        </Page>
    );
}
