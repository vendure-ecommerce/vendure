import { ConfirmationDialog } from '@/components/shared/confirmation-dialog.js';
import { CustomerSelector } from '@/components/shared/customer-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Form } from '@/components/ui/form.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { useGeneratedForm } from '@/framework/form-engine/use-generated-form.js';
import { CustomFieldsPageBlock, Page, PageActionBar, PageActionBarRight, PageBlock, PageLayout, PageTitle } from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { api } from '@/graphql/api.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { ResultOf } from 'gql.tada';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { CustomerAddressSelector } from './components/customer-address-selector.js';
import { EditOrderTable } from './components/edit-order-table.js';
import { OrderAddress } from './components/order-address.js';
import { addItemToDraftOrderDocument, adjustDraftOrderLineDocument, applyCouponCodeToDraftOrderDocument, deleteDraftOrderDocument, draftOrderEligibleShippingMethodsDocument, orderDetailDocument, removeCouponCodeFromDraftOrderDocument, removeDraftOrderLineDocument, setBillingAddressForDraftOrderDocument, setCustomerForDraftOrderDocument, setDraftOrderCustomFieldsDocument, setDraftOrderShippingMethodDocument, setShippingAddressForDraftOrderDocument, transitionOrderToStateDocument, unsetBillingAddressForDraftOrderDocument, unsetShippingAddressForDraftOrderDocument } from './orders.graphql.js';
import { CustomFieldsForm } from '@/components/shared/custom-fields-form.js';

export const Route = createFileRoute('/_authenticated/_orders/orders_/draft/$id')({
    component: DraftOrderPage,
    loader: async ({
        context,
        params,
    }) => {
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

        if (result.order.state !== 'Draft') {
            throw redirect({
                to: `/orders/${params.id}`,
            });
        }

        return {
            breadcrumb: [{ path: '/orders', label: 'Orders' }, result.order.code],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function DraftOrderPage() {
    const params = Route.useParams();
    const { i18n } = useLingui();
    const navigate = useNavigate();

    const { entity, refreshEntity, form } = useDetailPage({
        queryDocument: addCustomFields(orderDetailDocument),
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
    });

    const { form: orderLineForm } = useGeneratedForm({
        document: addCustomFields(adjustDraftOrderLineDocument),
        varName: undefined,
        entity: entity?.lines[0],
        setValues: entity => {
            return {
                orderId: entity.id,
                input: {
                    quantity: entity.quantity,
                    orderLineId: entity.id,
                    customFields: entity.customFields,
                }
            };
        },
    });

    const { form: orderCustomFieldsForm } = useGeneratedForm({
        document: setDraftOrderCustomFieldsDocument,
        varName: undefined,
        entity: entity,
        setValues: entity => {
            return {
                orderId: entity.id,
                input: {
                    id: entity.id,
                    customFields: entity.customFields,
                }
            };
        },
    });

    const { mutate: setDraftOrderCustomFields } = useMutation({
        mutationFn: api.mutate(setDraftOrderCustomFieldsDocument),
        onSuccess: (result: ResultOf<typeof setDraftOrderCustomFieldsDocument>) => {
            refreshEntity();
        },
    });

    const { data: eligibleShippingMethods } = useQuery({
        queryKey: ['eligibleShippingMethods', entity?.id],
        queryFn: () => api.query(draftOrderEligibleShippingMethodsDocument, { orderId: entity?.id ?? '' }),
        enabled: !!entity?.shippingAddress?.streetLine1,
    });

    const { mutate: addItemToDraftOrder } = useMutation({
        mutationFn: api.mutate(addItemToDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof addItemToDraftOrderDocument>) => {
            const order = result.addItemToDraftOrder;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Item added to order'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: adjustDraftOrderLine } = useMutation({
        mutationFn: api.mutate(adjustDraftOrderLineDocument),
        onSuccess: (result: ResultOf<typeof adjustDraftOrderLineDocument>) => {
            const order = result.adjustDraftOrderLine;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Order line updated'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: removeDraftOrderLine } = useMutation({
        mutationFn: api.mutate(removeDraftOrderLineDocument),
        onSuccess: (result: ResultOf<typeof removeDraftOrderLineDocument>) => {
            const order = result.removeDraftOrderLine;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Order line removed'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: setCustomerForDraftOrder } = useMutation({
        mutationFn: api.mutate(setCustomerForDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof setCustomerForDraftOrderDocument>) => {
            const order = result.setCustomerForDraftOrder;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Customer set for order'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: setShippingAddressForDraftOrder } = useMutation({
        mutationFn: api.mutate(setShippingAddressForDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof setShippingAddressForDraftOrderDocument>) => {
            toast.success(i18n.t('Shipping address set for order'));
            refreshEntity();
        },
    });

    const { mutate: setBillingAddressForDraftOrder } = useMutation({
        mutationFn: api.mutate(setBillingAddressForDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof setBillingAddressForDraftOrderDocument>) => {
            toast.success(i18n.t('Billing address set for order'));
            refreshEntity();
        },
    });

    const { mutate: unsetShippingAddressForDraftOrder } = useMutation({
        mutationFn: api.mutate(unsetShippingAddressForDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof unsetShippingAddressForDraftOrderDocument>) => {
            toast.success(i18n.t('Shipping address unset for order'));
            refreshEntity();
        },
    });

    const { mutate: unsetBillingAddressForDraftOrder } = useMutation({
        mutationFn: api.mutate(unsetBillingAddressForDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof unsetBillingAddressForDraftOrderDocument>) => {
            toast.success(i18n.t('Billing address unset for order'));
            refreshEntity();
        },
    });

    const { mutate: setShippingMethodForDraftOrder } = useMutation({
        mutationFn: api.mutate(setDraftOrderShippingMethodDocument),
        onSuccess: (result: ResultOf<typeof setDraftOrderShippingMethodDocument>) => {
            const order = result.setDraftOrderShippingMethod;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Shipping method set for order'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: setCouponCodeForDraftOrder } = useMutation({
        mutationFn: api.mutate(applyCouponCodeToDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof applyCouponCodeToDraftOrderDocument>) => {
            const order = result.applyCouponCodeToDraftOrder;
            switch (order.__typename) {
                case 'Order':
                    toast.success(i18n.t('Coupon code set for order'));
                    refreshEntity();
                    break;
                default:
                    toast.error(order.message);
                    break;
            }
        },
    });

    const { mutate: removeCouponCodeForDraftOrder } = useMutation({
        mutationFn: api.mutate(removeCouponCodeFromDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof removeCouponCodeFromDraftOrderDocument>) => {
            const order = result.removeCouponCodeFromDraftOrder;
            toast.success(i18n.t('Coupon code removed from order'));
            refreshEntity();
        },
    });

    const { mutate: completeDraftOrder } = useMutation({
        mutationFn: api.mutate(transitionOrderToStateDocument),
        onSuccess: async (result: ResultOf<typeof transitionOrderToStateDocument>) => {
            const order = result.transitionOrderToState;
            switch (order?.__typename) {
                case 'Order':
                    toast.success(i18n.t('Draft order completed'));
                    refreshEntity();
                    setTimeout(() => {
                        navigate({ to: `/orders/$id`, params: { id: order.id } });
                    }, 500);
                    break;
                default:
                    toast.error(order ? order.message : 'Unknown error');
                    break;
            }
        },
    });

    const { mutate: deleteDraftOrder } = useMutation({
        mutationFn: api.mutate(deleteDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof deleteDraftOrderDocument>) => {
            if (result.deleteDraftOrder.result === 'DELETED') {
                toast.success(i18n.t('Draft order deleted'));
                navigate({ to: '/orders' });
            } else {
                toast.error(result.deleteDraftOrder.message);
            }
        },
    });

    if (!entity) {
        return null;
    }

    const onSaveCustomFields = (values: any) => {
        setDraftOrderCustomFields({ input: { id: entity.id, customFields: values.input?.customFields }, orderId: entity.id });
    }

    return (
        <Page pageId="draft-order-detail" form={form}>
            <PageTitle><Trans>Draft order</Trans>: {entity?.code ?? ''}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['DeleteOrder']}>
                        <ConfirmationDialog
                            title={i18n.t('Delete draft order')}
                            description={i18n.t('Are you sure you want to delete this draft order?')}
                            onConfirm={() => {
                                deleteDraftOrder({ orderId: entity.id });
                            }}
                        >
                            <Button variant="destructive" type="button">
                                <Trans>Delete draft</Trans>
                            </Button>
                        </ConfirmationDialog>

                    </PermissionGuard>
                    <PermissionGuard requires={['UpdateOrder']}>
                        <Button type="button"
                            disabled={!entity.customer || entity.lines.length === 0 || entity.shippingLines.length === 0 || entity.state !== 'Draft'}
                            onClick={() => completeDraftOrder({ id: entity.id, state: 'ArrangingPayment' })}
                        >
                            <Trans>Complete draft</Trans>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="order-table">
                    <EditOrderTable order={entity}
                        eligibleShippingMethods={eligibleShippingMethods?.eligibleShippingMethodsForDraftOrder ?? []}
                        onSetShippingMethod={(e) => setShippingMethodForDraftOrder({ orderId: entity.id, shippingMethodId: e.shippingMethodId })}
                        onAddItem={(e) => addItemToDraftOrder({ orderId: entity.id, input: { productVariantId: e.productVariantId, quantity: 1 } })}
                        onAdjustLine={(e) => adjustDraftOrderLine({ orderId: entity.id, input: { orderLineId: e.lineId, quantity: e.quantity, customFields: e.customFields } as any })}
                        onRemoveLine={(e) => removeDraftOrderLine({ orderId: entity.id, orderLineId: e.lineId })}
                        onApplyCouponCode={(e) => setCouponCodeForDraftOrder({ orderId: entity.id, couponCode: e.couponCode })}
                        onRemoveCouponCode={(e) => removeCouponCodeForDraftOrder({ orderId: entity.id, couponCode: e.couponCode })}
                        orderLineForm={orderLineForm}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="order-custom-fields" title={<Trans>Custom fields</Trans>}>
                    <Form {...orderCustomFieldsForm}>
                        <CustomFieldsForm entityType="Order" control={orderCustomFieldsForm.control} formPathPrefix='input' />
                        <div className="mt-4">
                            <Button type="submit" className=""
                                disabled={!orderCustomFieldsForm.formState.isValid || !orderCustomFieldsForm.formState.isDirty}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    orderCustomFieldsForm.handleSubmit(onSaveCustomFields)();
                                }}>
                                <Trans>Set custom fields</Trans>
                            </Button>
                        </div>
                    </Form>
                </PageBlock>
                <PageBlock column="side" blockId="customer" title={<Trans>Customer</Trans>}>
                    {entity?.customer?.id ? <Button variant="ghost" asChild className="mb-4">
                        <Link to={`/customers/${entity?.customer?.id}`}>
                            <User className="w-4 h-4" />
                            {entity?.customer?.firstName} {entity?.customer?.lastName}
                        </Link>
                    </Button> : null}
                    <CustomerSelector onSelect={customer => {
                        setCustomerForDraftOrder({ orderId: entity.id, customerId: customer.id });
                    }} />
                </PageBlock>
                <PageBlock column="side" blockId="shipping-address" title={<Trans>Shipping address</Trans>}>
                    <div className="flex flex-col">
                        <OrderAddress address={entity.shippingAddress ?? undefined} />
                        {entity.shippingAddress?.streetLine1
                            ? <RemoveAddressButton onClick={() => unsetShippingAddressForDraftOrder({ orderId: entity.id })} />
                            : <CustomerAddressSelector customerId={entity.customer?.id} onSelect={address => {
                                setShippingAddressForDraftOrder({
                                    orderId: entity.id, input: {
                                        fullName: address.fullName,
                                        company: address.company,
                                        streetLine1: address.streetLine1,
                                        streetLine2: address.streetLine2,
                                        city: address.city,
                                        province: address.province,
                                        postalCode: address.postalCode,
                                        countryCode: address.country.code,
                                        phoneNumber: address.phoneNumber,
                                    }
                                });
                            }} />
                        }
                    </div>
                </PageBlock>
                <PageBlock column="side" blockId="billing-address" title={<Trans>Billing address</Trans>}>
                    <div className="flex flex-col">
                        <OrderAddress address={entity.billingAddress ?? undefined} />
                        {entity.billingAddress?.streetLine1
                            ? <RemoveAddressButton onClick={() => unsetBillingAddressForDraftOrder({ orderId: entity.id })} />
                            : <CustomerAddressSelector customerId={entity.customer?.id} onSelect={address => {
                                setBillingAddressForDraftOrder({
                                    orderId: entity.id, input: {
                                        fullName: address.fullName,
                                        company: address.company,
                                        streetLine1: address.streetLine1,
                                        streetLine2: address.streetLine2,
                                        city: address.city,
                                        province: address.province,
                                        postalCode: address.postalCode,
                                        countryCode: address.country.code,
                                        phoneNumber: address.phoneNumber,
                                    }
                                });
                            }} />
                        }
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}

function RemoveAddressButton(props: { onClick: () => void }) {
    return (<div className="">
        <Button variant="outline" className="mt-4" size="sm" onClick={props.onClick}>
            <Trans>Remove</Trans>
        </Button>
    </div>)
}