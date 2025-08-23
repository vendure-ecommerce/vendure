import { Trans } from '@/vdb/lib/trans.js';
import { ResultOf, VariablesOf } from 'gql.tada';
import { modifyOrderDocument, orderDetailDocument } from '../orders.graphql.js';

type OrderFragment = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;
type ModifyOrderInput = VariablesOf<typeof modifyOrderDocument>['input'];

type OrderLine = OrderFragment['lines'][number];

interface OrderModificationSummaryProps {
    originalOrder: OrderFragment;
    modifyOrderInput: ModifyOrderInput;
    addedVariants: Map<string, any>; // For displaying added line info
    eligibleShippingMethods: Array<{
        id: string;
        name: string;
    }>;
}

interface LineAdjustment {
    orderLineId: string;
    name: string;
    oldQuantity: number;
    newQuantity: number;
    oldCustomFields: Record<string, any>;
    newCustomFields: Record<string, any>;
}

export function OrderModificationSummary({
    originalOrder,
    modifyOrderInput,
    addedVariants,
    eligibleShippingMethods,
}: Readonly<OrderModificationSummaryProps>) {
    // Map by line id for quick lookup
    const originalLineMap = new Map(originalOrder.lines.map(line => [line.id, line]));

    // Adjusted lines: in both, but quantity changed
    const adjustedLines = (modifyOrderInput.adjustOrderLines ?? [])
        .map((adj: NonNullable<ModifyOrderInput['adjustOrderLines']>[number] & { customFields?: any }) => {
            const orig = originalLineMap.get(adj.orderLineId);
            if (
                orig &&
                (adj.quantity !== orig.quantity ||
                    JSON.stringify(adj.customFields) !== JSON.stringify((orig as any).customFields))
            ) {
                return {
                    orderLineId: adj.orderLineId,
                    name: orig.productVariant.name,
                    oldQuantity: orig.quantity,
                    newQuantity: adj.quantity,
                    oldCustomFields: (orig as any).customFields,
                    newCustomFields: adj.customFields,
                };
            }
            return null;
        })
        .filter(Boolean) as Array<LineAdjustment>;

    // Added lines: from addItems
    const addedLines = (modifyOrderInput.addItems ?? [])
        .map(item => {
            const variantInfo = addedVariants.get(item.productVariantId);
            return variantInfo
                ? {
                      id: `added-${item.productVariantId}`,
                      name: variantInfo.productVariantName,
                      quantity: item.quantity,
                  }
                : null;
        })
        .filter(Boolean) as Array<{ id: string; name: string; quantity: number }>;

    // Removed lines: quantity set to 0 in adjustOrderLines
    const removedLines = (modifyOrderInput.adjustOrderLines ?? [])
        .map(adj => {
            const orig = originalLineMap.get(adj.orderLineId);
            if (orig && adj.quantity === 0) {
                return orig;
            }
            return null;
        })
        .filter(Boolean) as OrderLine[];

    // Coupon code changes
    const originalCoupons = new Set(originalOrder.couponCodes ?? []);
    const modifiedCoupons = new Set(modifyOrderInput.couponCodes ?? []);
    const addedCouponCodes = Array.from(modifiedCoupons).filter(code => !originalCoupons.has(code));
    const removedCouponCodes = Array.from(originalCoupons).filter(code => !modifiedCoupons.has(code));

    // Shipping method change detection
    const originalShippingMethodId = originalOrder.shippingLines?.[0]?.shippingMethod?.id;
    const modifiedShippingMethodId = modifyOrderInput.shippingMethodIds?.[0];
    let shippingMethodChanged = false;
    let newShippingMethodName = '';
    if (modifiedShippingMethodId && modifiedShippingMethodId !== originalShippingMethodId) {
        shippingMethodChanged = true;
        newShippingMethodName =
            eligibleShippingMethods.find(m => m.id === modifiedShippingMethodId)?.name ||
            modifiedShippingMethodId;
    }

    return (
        <div className="text-sm">
            {/* Address changes */}
            {modifyOrderInput.updateShippingAddress && (
                <div className="mb-2">
                    <span className="font-medium">
                        <Trans>Shipping address changed</Trans>
                    </span>
                </div>
            )}
            {modifyOrderInput.updateBillingAddress && (
                <div className="mb-2">
                    <span className="font-medium">
                        <Trans>Billing address changed</Trans>
                    </span>
                </div>
            )}
            {shippingMethodChanged && (
                <div className="mb-2">
                    <span className="font-medium">
                        <Trans>Shipping method changed</Trans>: {newShippingMethodName}
                    </span>
                </div>
            )}
            {adjustedLines.length > 0 && (
                <div className="mb-2">
                    <div className="font-medium">
                        <Trans>Adjusting {adjustedLines.length} lines</Trans>
                    </div>
                    <ul className="list-disc ml-4">
                        {adjustedLines.map(line => (
                            <li key={line.orderLineId} className="">
                                <div className="flex items-center gap-2">
                                    {line.name}:{' '}
                                    {line.oldQuantity !== line.newQuantity && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                {line.oldQuantity} →{' '}
                                            </span>

                                            {line.newQuantity}
                                        </div>
                                    )}
                                </div>
                                {JSON.stringify(line.oldCustomFields) !==
                                    JSON.stringify(line.newCustomFields) && (
                                    <span className="text-muted-foreground">
                                        <Trans>Custom fields changed</Trans>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {addedLines.length > 0 && (
                <div className="mb-2">
                    <div className="font-medium">
                        <Trans>Adding {addedLines.length} item(s)</Trans>
                    </div>
                    <ul className="list-disc ml-4">
                        {addedLines.map(line => (
                            <li key={line.id}>
                                {line.name} x {line.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {removedLines.length > 0 && (
                <div className="mb-2">
                    <div className="font-medium">
                        <Trans>Removing {removedLines.length} item(s)</Trans>
                    </div>
                    <ul className="list-disc ml-4">
                        {removedLines.map(line => (
                            <li key={line.id}>{line.productVariant.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            {addedCouponCodes.length > 0 && (
                <div className="mb-2">
                    <div className="font-medium">
                        <Trans>Added coupon codes</Trans>
                    </div>
                    <ul className="list-disc ml-4">
                        {addedCouponCodes.map(code => (
                            <li key={code}>{code}</li>
                        ))}
                    </ul>
                </div>
            )}
            {removedCouponCodes.length > 0 && (
                <div className="mb-2">
                    <div className="font-medium">
                        <Trans>Removed coupon codes</Trans>
                    </div>
                    <ul className="list-disc ml-4">
                        {removedCouponCodes.map(code => (
                            <li key={code}>{code}</li>
                        ))}
                    </ul>
                </div>
            )}
            {adjustedLines.length === 0 &&
                addedLines.length === 0 &&
                removedLines.length === 0 &&
                addedCouponCodes.length === 0 &&
                removedCouponCodes.length === 0 &&
                !modifyOrderInput.updateShippingAddress &&
                !modifyOrderInput.updateBillingAddress &&
                !shippingMethodChanged && (
                    <div className="text-muted-foreground">
                        <Trans>No modifications made</Trans>
                    </div>
                )}
        </div>
    );
}
