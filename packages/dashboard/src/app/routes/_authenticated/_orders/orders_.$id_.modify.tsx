import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { Button } from '@/vdb/components/ui/button.js';
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
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { ResultOf, VariablesOf } from 'gql.tada';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CustomerAddressSelector } from './components/customer-address-selector.js';
import { EditOrderTable } from './components/edit-order-table.js';
import { OrderAddress } from './components/order-address.js';
import { OrderModificationPreviewDialog } from './components/order-modification-preview-dialog.js';
import { OrderModificationSummary } from './components/order-modification-summary.js';
import { useTransitionOrderToState } from './components/use-transition-order-to-state.js';
import {
    draftOrderEligibleShippingMethodsDocument,
    modifyOrderDocument,
    orderDetailDocument,
} from './orders.graphql.js';
import { AddressFragment, Order } from './utils/order-types.js';

const pageId = 'order-modify';
type ModifyOrderInput = VariablesOf<typeof modifyOrderDocument>['input'];

export const Route = createFileRoute('/_authenticated/_orders/orders_/$id_/modify')({
    component: ModifyOrderPage,
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
        if (result.order.state !== 'Modifying') {
            throw redirect({
                to: `/orders/${params.id}`,
            });
        }

        return {
            breadcrumb: [
                { path: '/orders', label: <Trans>Orders</Trans> },
                result.order.code,
                { label: <Trans>Modify</Trans> },
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

// --- AddedLine type for added items ---
interface AddedLine {
    id: string;
    featuredAsset?: any;
    productVariant: {
        id: string;
        name: string;
        sku: string;
    };
    unitPrice: number;
    unitPriceWithTax: number;
    quantity: number;
    linePrice: number;
    linePriceWithTax: number;
}

// --- ProductVariantInfo type ---
type ProductVariantInfo = {
    productVariantId: string;
    productVariantName: string;
    sku: string;
    productAsset: {
        preview: string;
    };
    price?: number;
    priceWithTax?: number;
};

function ModifyOrderPage() {
    const params = Route.useParams();
    const navigate = useNavigate({ from: '/orders/$id/modify' });
    const { i18n } = useLingui();
    const queryClient = useQueryClient();
    const { form, submitHandler, entity } = useDetailPage({
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

    const { data: eligibleShippingMethods } = useQuery({
        queryKey: ['eligibleShippingMethods', entity?.id],
        queryFn: () => api.query(draftOrderEligibleShippingMethodsDocument, { orderId: entity?.id ?? '' }),
        enabled: !!entity?.shippingAddress?.streetLine1,
    });

    const { transitionToPreModifyingState, ManuallySelectNextState, selectNextState, transitionToState } =
        useTransitionOrderToState(entity?.id ?? '');

    // --- Modification intent state ---

    const [modifyOrderInput, setModifyOrderInput] = useState<ModifyOrderInput>({
        orderId: '',
        addItems: [],
        adjustOrderLines: [],
        surcharges: [],
        note: '',
        couponCodes: [],
        options: {
            recalculateShipping: true,
        },
        dryRun: true,
    } satisfies ModifyOrderInput);

    useEffect(() => {
        setModifyOrderInput(prev => ({
            ...prev,
            orderId: entity?.id ?? '',
            couponCodes: entity?.couponCodes ?? [],
        }));
    }, [entity?.id]);

    // --- Added variants info state ---
    const [addedVariants, setAddedVariants] = useState<Map<string, ProductVariantInfo>>(new Map());

    // --- Handlers update modifyOrderInput ---
    function handleAddItem(variant: ProductVariantInfo) {
        setModifyOrderInput(prev => ({
            ...prev,
            addItems: [...(prev.addItems ?? []), { productVariantId: variant.productVariantId, quantity: 1 }],
        }));
        setAddedVariants(prev => {
            const newMap = new Map(prev);
            newMap.set(variant.productVariantId, variant);
            return newMap;
        });
    }

    function handleAdjustLine({
        lineId,
        quantity,
        customFields,
    }: {
        lineId: string;
        quantity: number;
        customFields: Record<string, any>;
    }) {
        // Check if this is an added line
        if (lineId.startsWith('added-')) {
            const productVariantId = lineId.replace('added-', '');
            setModifyOrderInput(prev => ({
                ...prev,
                addItems: (prev.addItems ?? []).map(item =>
                    item.productVariantId === productVariantId ? { ...item, quantity } : item,
                ),
            }));
        } else {
            let normalizedCustomFields: any = customFields;
            delete normalizedCustomFields.__entityId__;
            if (Object.keys(normalizedCustomFields).length === 0) {
                normalizedCustomFields = undefined;
            }
            setModifyOrderInput(prev => {
                const existing = (prev.adjustOrderLines ?? []).find(l => l.orderLineId === lineId);
                const adjustOrderLines = existing
                    ? (prev.adjustOrderLines ?? []).map(l =>
                          l.orderLineId === lineId
                              ? { ...l, quantity, customFields: normalizedCustomFields }
                              : l,
                      )
                    : [
                          ...(prev.adjustOrderLines ?? []),
                          { orderLineId: lineId, quantity, customFields: normalizedCustomFields },
                      ];
                return { ...prev, adjustOrderLines };
            });
        }
    }

    function handleRemoveLine({ lineId }: { lineId: string }) {
        if (lineId.startsWith('added-')) {
            const productVariantId = lineId.replace('added-', '');
            setModifyOrderInput(prev => ({
                ...prev,
                addItems: (prev.addItems ?? []).filter(item => item.productVariantId !== productVariantId),
            }));
            setAddedVariants(prev => {
                const newMap = new Map(prev);
                newMap.delete(productVariantId);
                return newMap;
            });
        } else {
            setModifyOrderInput(prev => {
                const existingAdjustment = (prev.adjustOrderLines ?? []).find(l => l.orderLineId === lineId);
                const adjustOrderLines = existingAdjustment
                    ? (prev.adjustOrderLines ?? []).map(l =>
                          l.orderLineId === lineId ? { ...l, quantity: 0 } : l,
                      )
                    : [...(prev.adjustOrderLines ?? []), { orderLineId: lineId, quantity: 0 }];
                return {
                    ...prev,
                    adjustOrderLines,
                };
            });
        }
    }

    function handleSetShippingMethod({ shippingMethodId }: { shippingMethodId: string }) {
        setModifyOrderInput(prev => ({
            ...prev,
            shippingMethodIds: [shippingMethodId],
        }));
    }

    function handleApplyCouponCode({ couponCode }: { couponCode: string }) {
        setModifyOrderInput(prev => ({
            ...prev,
            couponCodes: prev.couponCodes?.includes(couponCode)
                ? prev.couponCodes
                : [...(prev.couponCodes ?? []), couponCode],
        }));
    }

    function handleRemoveCouponCode({ couponCode }: { couponCode: string }) {
        setModifyOrderInput(prev => ({
            ...prev,
            couponCodes: (prev.couponCodes ?? []).filter(code => code !== couponCode),
        }));
    }

    // --- Address editing state ---
    const [editingShippingAddress, setEditingShippingAddress] = useState(false);
    const [editingBillingAddress, setEditingBillingAddress] = useState(false);

    function orderAddressToModifyOrderInput(
        address: AddressFragment,
    ): ModifyOrderInput['updateShippingAddress'] {
        return {
            streetLine1: address.streetLine1,
            streetLine2: address.streetLine2,
            city: address.city,
            countryCode: address.country.code,
            fullName: address.fullName,
            postalCode: address.postalCode,
            province: address.province,
            company: address.company,
            phoneNumber: address.phoneNumber,
        };
    }

    // --- Address selection handlers ---
    function handleSelectShippingAddress(address: AddressFragment) {
        setModifyOrderInput(prev => ({
            ...prev,
            updateShippingAddress: orderAddressToModifyOrderInput(address),
        }));
        setEditingShippingAddress(false);
    }

    function handleSelectBillingAddress(address: AddressFragment) {
        setModifyOrderInput(prev => ({
            ...prev,
            updateBillingAddress: orderAddressToModifyOrderInput(address),
        }));
        setEditingBillingAddress(false);
    }

    // --- Utility: compute pending order for display ---
    function computePendingOrder(input: ModifyOrderInput): Order | null {
        if (!entity) {
            return null;
        }
        // Adjust lines
        const lines = entity.lines.map(line => {
            const adjust = input.adjustOrderLines?.find(l => l.orderLineId === line.id);
            return adjust
                ? { ...line, quantity: adjust.quantity, customFields: (adjust as any).customFields }
                : line;
        });
        // Add new items (as AddedLine)
        const addedLines = input.addItems
            ?.map(item => {
                const variantInfo = addedVariants.get(item.productVariantId);
                return variantInfo
                    ? ({
                          id: `added-${item.productVariantId}`,
                          featuredAsset: variantInfo.productAsset ?? null,
                          productVariant: {
                              id: variantInfo.productVariantId,
                              name: variantInfo.productVariantName,
                              sku: variantInfo.sku,
                          },
                          unitPrice: variantInfo.price ?? 0,
                          unitPriceWithTax: variantInfo.priceWithTax ?? 0,
                          quantity: item.quantity,
                          linePrice: (variantInfo.price ?? 0) * item.quantity,
                          linePriceWithTax: (variantInfo.priceWithTax ?? 0) * item.quantity,
                      } as unknown as Order['lines'][number])
                    : null;
            })
            .filter(x => x != null);
        return {
            ...entity,
            lines: [...lines, ...(addedLines ?? [])],
            couponCodes: input.couponCodes ?? [],
            shippingLines: input.shippingMethodIds
                ? input.shippingMethodIds
                      .map(shippingMethodId => {
                          const shippingMethod =
                              eligibleShippingMethods?.eligibleShippingMethodsForDraftOrder.find(
                                  method => method.id === shippingMethodId,
                              );
                          if (!shippingMethod) {
                              return;
                          }
                          return {
                              shippingMethod: {
                                  ...shippingMethod,
                                  fulfillmentHandlerCode: 'manual',
                              },
                              discountedPriceWithTax: shippingMethod?.priceWithTax ?? 0,
                              id: shippingMethodId,
                          };
                      })
                      .filter(x => x !== undefined)
                : entity.shippingLines,
        };
    }

    const [previewOpen, setPreviewOpen] = useState(false);

    if (!entity) {
        return null;
    }

    const pendingOrder = computePendingOrder(modifyOrderInput);
    const hasModifications =
        (modifyOrderInput.addItems?.length ?? 0) > 0 ||
        (modifyOrderInput.adjustOrderLines?.length ?? 0) > 0 ||
        (modifyOrderInput.couponCodes?.length ?? 0) > 0 ||
        (modifyOrderInput.shippingMethodIds?.length ?? 0) > 0 ||
        modifyOrderInput.updateShippingAddress ||
        modifyOrderInput.updateBillingAddress;

    if (!pendingOrder) {
        return null;
    }

    // On successful state transition, invalidate the order detail query and navigate to the order detail page
    const onSuccess = () => {
        const queryKey = getDetailQueryOptions(orderDetailDocument, { id: entity.id }).queryKey;
        queryClient.invalidateQueries({ queryKey });
        navigate({ to: `/orders/$id`, params: { id: entity?.id } });
    };

    const handleCancelModificationClick = async () => {
        const transitionError = await transitionToPreModifyingState();
        if (!transitionError) {
            onSuccess();
        } else {
            selectNextState({ onSuccess });
        }
    };

    const handleModificationSubmit = async (priceDifference?: number) => {
        const transitionError =
            priceDifference && priceDifference > 0
                ? await transitionToState('ArrangingAdditionalPayment')
                : await transitionToPreModifyingState();
        if (!transitionError) {
            const queryKey = getDetailQueryOptions(orderDetailDocument, { id: entity.id }).queryKey;
            await queryClient.invalidateQueries({ queryKey });
            setPreviewOpen(false);
            await navigate({ to: `/orders/$id`, params: { id: entity?.id } });
        } else {
            selectNextState({ onSuccess });
        }
    };

    const shippingAddress = modifyOrderInput.updateShippingAddress ?? entity.shippingAddress;
    const billingAddress = modifyOrderInput.updateBillingAddress ?? entity.billingAddress;

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                <Trans>Modify order</Trans>
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button type="button" variant="secondary" onClick={handleCancelModificationClick}>
                        <Trans>Cancel modification</Trans>
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="order-lines" title={<Trans>Order lines</Trans>}>
                    <EditOrderTable
                        order={pendingOrder}
                        eligibleShippingMethods={
                            eligibleShippingMethods?.eligibleShippingMethodsForDraftOrder ?? []
                        }
                        onAddItem={handleAddItem}
                        onAdjustLine={handleAdjustLine}
                        onRemoveLine={handleRemoveLine}
                        onSetShippingMethod={handleSetShippingMethod}
                        onApplyCouponCode={handleApplyCouponCode}
                        onRemoveCouponCode={handleRemoveCouponCode}
                        displayTotals={false}
                    />
                </PageBlock>
                <PageBlock
                    column="side"
                    blockId="modification-summary"
                    title={<Trans>Summary of modifications</Trans>}
                >
                    <OrderModificationSummary
                        originalOrder={entity}
                        modifyOrderInput={modifyOrderInput}
                        addedVariants={addedVariants}
                        eligibleShippingMethods={
                            eligibleShippingMethods?.eligibleShippingMethodsForDraftOrder?.map(m => ({
                                id: m.id,
                                name: m.name,
                            })) ?? []
                        }
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="button"
                            onClick={() => setPreviewOpen(true)}
                            disabled={!hasModifications}
                        >
                            <Trans>Preview changes</Trans>
                        </Button>
                    </div>
                    <OrderModificationPreviewDialog
                        open={previewOpen}
                        onOpenChange={setPreviewOpen}
                        orderSnapshot={entity}
                        modifyOrderInput={modifyOrderInput}
                        onResolve={handleModificationSubmit}
                    />
                </PageBlock>
                <PageBlock column="side" blockId="customer" title={<Trans>Customer</Trans>}>
                    {entity.customer ? (
                        <Button variant="ghost" asChild>
                            <Link to={`/customers/${entity?.customer?.id}`}>
                                <User className="w-4 h-4" />
                                {entity?.customer?.firstName} {entity?.customer?.lastName}
                            </Link>
                        </Button>
                    ) : (
                        <div className="text-muted-foreground text-xs font-medium p-3 border rounded-md">
                            <Trans>No customer</Trans>
                        </div>
                    )}
                </PageBlock>
                <PageBlock column="side" blockId="addresses" title={<Trans>Addresses</Trans>}>
                    <div className="mb-4">
                        <div className="mb-1">
                            <Trans>Shipping address</Trans>:
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => setEditingShippingAddress(true)}
                            >
                                <Trans>Edit</Trans>
                            </Button>
                        </div>
                        {editingShippingAddress ? (
                            <CustomerAddressSelector
                                customerId={entity.customer?.id}
                                onSelect={handleSelectShippingAddress}
                            />
                        ) : null}
                        {shippingAddress && !editingShippingAddress ? (
                            <OrderAddress address={shippingAddress} />
                        ) : (
                            <div className="text-muted-foreground text-xs font-medium">
                                <Trans>No shipping address</Trans>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="mb-1">
                            <Trans>Billing address</Trans>:
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => setEditingBillingAddress(true)}
                            >
                                <Trans>Edit</Trans>
                            </Button>
                        </div>
                        {editingBillingAddress ? (
                            <CustomerAddressSelector
                                customerId={entity.customer?.id}
                                onSelect={handleSelectBillingAddress}
                            />
                        ) : null}
                        {billingAddress && !editingBillingAddress ? (
                            <OrderAddress address={billingAddress} />
                        ) : (
                            <div className="text-muted-foreground text-xs font-medium">
                                <Trans>No billing address</Trans>
                            </div>
                        )}
                    </div>
                </PageBlock>
            </PageLayout>
            <ManuallySelectNextState availableStates={entity.nextStates} />
        </Page>
    );
}
