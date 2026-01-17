import { VendureImage } from '@/vdb/components/shared/vendure-image.js';
import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/vdb/components/ui/select.js';
import { api } from '@/vdb/graphql/api.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { cancelOrderDocument, refundOrderDocument } from '../orders.graphql.js';
import {
    getRefundablePayments,
    getTotalRefundableAmount,
    getTotalAmountToRefund,
    RefundablePayment,
} from '../utils/get-refundable-payments.js';
import { Order } from '../utils/order-types.js';
import { getMaxRefundableQuantity, lineCanBeRefunded } from '../utils/order-utils.js';

interface RefundOrderDialogProps {
    order: Order;
    onSuccess?: () => void;
}

type LineSelection = { quantity: number; cancel: boolean };

const REFUND_REASONS = [
    { value: 'customer-request', label: 'Customer request' },
    { value: 'not-available', label: 'Item not available' },
    { value: 'damaged-shipping', label: 'Damaged in shipping' },
    { value: 'wrong-item', label: 'Wrong item shipped' },
    { value: 'other', label: 'Other' },
];

export function RefundOrderDialog({ order, onSuccess }: Readonly<RefundOrderDialogProps>) {
    const { t } = useLingui();
    const { formatCurrency, toMajorUnits, toMinorUnits } = useLocalFormat();

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lineSelections, setLineSelections] = useState<Record<string, LineSelection>>({});
    const [refundShippingLineIds, setRefundShippingLineIds] = useState<string[]>([]);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState('');
    const [manuallySetRefundTotal, setManuallySetRefundTotal] = useState(false);
    const [refundTotal, setRefundTotal] = useState(0);
    const [refundablePayments, setRefundablePayments] = useState<RefundablePayment[]>([]);

    const reason = selectedReason === 'other' ? customReason : selectedReason;

    const cancelOrderMutation = useMutation({
        mutationFn: api.mutate(cancelOrderDocument),
    });

    const refundOrderMutation = useMutation({
        mutationFn: api.mutate(refundOrderDocument),
    });

    const initializeState = useCallback(() => {
        const selections: Record<string, LineSelection> = {};
        order.lines.forEach(line => {
            selections[line.id] = { quantity: 0, cancel: false };
        });
        setLineSelections(selections);
        setRefundShippingLineIds([]);
        setSelectedReason('');
        setCustomReason('');
        setManuallySetRefundTotal(false);
        setRefundTotal(0);
        setRefundablePayments(getRefundablePayments(order.payments));
    }, [order]);

    const totalRefundableAmount = useMemo(
        () => getTotalRefundableAmount(refundablePayments),
        [refundablePayments],
    );

    const amountToRefundTotal = useMemo(
        () => getTotalAmountToRefund(refundablePayments),
        [refundablePayments],
    );

    const calculateRefundTotal = useCallback(() => {
        const itemTotal = order.lines.reduce((total, line) => {
            const lineRef = lineSelections[line.id];
            const refundCount = lineRef?.quantity || 0;
            return total + line.proratedUnitPriceWithTax * refundCount;
        }, 0);

        const shippingTotal = order.shippingLines.reduce((total, line) => {
            if (refundShippingLineIds.includes(line.id)) {
                return total + line.discountedPriceWithTax;
            }
            return total;
        }, 0);

        return itemTotal + shippingTotal;
    }, [order, lineSelections, refundShippingLineIds]);

    const allocateRefundsToPayments = useCallback(
        (total: number) => {
            setRefundablePayments(prev => {
                const selectedPayments = prev.filter(p => p.selected);
                let refundsAllocated = 0;

                return prev.map(payment => {
                    if (!payment.selected) {
                        return { ...payment, amountToRefund: 0 };
                    }
                    const amountToRefund = Math.min(
                        payment.refundableAmount,
                        total - refundsAllocated,
                    );
                    refundsAllocated += amountToRefund;
                    return { ...payment, amountToRefund };
                });
            });
        },
        [],
    );

    const updateRefundTotal = useCallback(() => {
        if (!manuallySetRefundTotal) {
            const calculatedTotal = calculateRefundTotal();
            setRefundTotal(calculatedTotal);
            allocateRefundsToPayments(calculatedTotal);
        } else {
            allocateRefundsToPayments(refundTotal);
        }
    }, [manuallySetRefundTotal, calculateRefundTotal, allocateRefundsToPayments, refundTotal]);

    useEffect(() => {
        if (open) {
            updateRefundTotal();
        }
    }, [lineSelections, refundShippingLineIds, open]);

    const onRefundQuantityChange = useCallback((lineId: string, quantity: number) => {
        setManuallySetRefundTotal(false);
        setLineSelections(prev => {
            const prevLine = prev[lineId];
            if (!prevLine) return prev;

            const previousQuantity = prevLine.quantity;
            let cancel = prevLine.cancel;

            if (quantity === 0) {
                cancel = false;
            } else if (previousQuantity === 0 && quantity > 0) {
                cancel = true;
            }

            return {
                ...prev,
                [lineId]: { quantity, cancel },
            };
        });
    }, []);

    const onCancelChange = useCallback((lineId: string, cancel: boolean) => {
        setLineSelections(prev => ({
            ...prev,
            [lineId]: { ...prev[lineId], cancel },
        }));
    }, []);

    const toggleShippingRefund = useCallback((lineId: string) => {
        setManuallySetRefundTotal(false);
        setRefundShippingLineIds(prev => {
            if (prev.includes(lineId)) {
                return prev.filter(id => id !== lineId);
            }
            return [...prev, lineId];
        });
    }, []);

    const onPaymentSelected = useCallback(
        (paymentId: string, selected: boolean) => {
            setRefundablePayments(prev => {
                const updatedPayments = prev.map(p =>
                    p.id === paymentId ? { ...p, selected } : p,
                );

                if (selected) {
                    const payment = updatedPayments.find(p => p.id === paymentId);
                    if (payment) {
                        const otherAllocated = updatedPayments
                            .filter(p => p.id !== paymentId && p.selected)
                            .reduce((sum, p) => sum + p.amountToRefund, 0);
                        const outstanding = refundTotal - otherAllocated;
                        if (outstanding > 0) {
                            payment.amountToRefund = Math.min(outstanding, payment.refundableAmount);
                        }
                    }
                } else {
                    const payment = updatedPayments.find(p => p.id === paymentId);
                    if (payment) {
                        payment.amountToRefund = 0;
                    }
                }

                return updatedPayments;
            });
        },
        [refundTotal],
    );

    const onPaymentAmountChange = useCallback((paymentId: string, amount: number) => {
        setRefundablePayments(prev =>
            prev.map(p => (p.id === paymentId ? { ...p, amountToRefund: amount } : p)),
        );
    }, []);

    const onManualRefundTotalChange = useCallback(
        (value: number) => {
            setRefundTotal(value);
            allocateRefundsToPayments(value);
        },
        [allocateRefundsToPayments],
    );

    const validationErrors = useMemo(() => {
        const errors: string[] = [];

        if (refundTotal < 0) {
            errors.push(t`Refund total cannot be negative`);
        }

        if (refundTotal > totalRefundableAmount) {
            errors.push(
                t`Refund total exceeds maximum refundable amount of ${formatCurrency(totalRefundableAmount, order.currencyCode)}`,
            );
        }

        if (amountToRefundTotal !== refundTotal && refundTotal > 0) {
            errors.push(t`Allocated payment amount must equal refund total`);
        }

        if (refundTotal > 0 && !reason) {
            errors.push(t`A reason for the refund is required`);
        }

        return errors;
    }, [refundTotal, totalRefundableAmount, amountToRefundTotal, reason, formatCurrency, order.currencyCode, t]);

    const canSubmit = useMemo(() => {
        return refundTotal > 0 && amountToRefundTotal === refundTotal && !!reason;
    }, [refundTotal, amountToRefundTotal, reason]);

    const isCancelling = useMemo(() => {
        return Object.values(lineSelections).some(line => line.quantity > 0 && line.cancel);
    }, [lineSelections]);

    const getOrderLineInput = useCallback(
        (filterFn: (line: LineSelection) => boolean) => {
            return Object.entries(lineSelections)
                .filter(([, line]) => line.quantity > 0 && filterFn(line))
                .map(([orderLineId, line]) => ({
                    orderLineId,
                    quantity: line.quantity,
                }));
        },
        [lineSelections],
    );

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const refundLines = getOrderLineInput(() => true);
            const cancelLines = getOrderLineInput(line => line.cancel);

            if (isCancelling && cancelLines.length > 0) {
                const cancelResult = await cancelOrderMutation.mutateAsync({
                    input: {
                        orderId: order.id,
                        lines: cancelLines,
                        reason,
                        cancelShipping: refundShippingLineIds.length > 0,
                    },
                });

                if (cancelResult.cancelOrder.__typename !== 'Order') {
                    toast.error(t`Failed to cancel order items`, {
                        description: (cancelResult.cancelOrder as any).message,
                    });
                    setIsSubmitting(false);
                    return;
                }
            }

            const paymentsToRefund = refundablePayments.filter(
                p => p.selected && p.amountToRefund > 0,
            );

            for (const payment of paymentsToRefund) {
                const refundResult = await refundOrderMutation.mutateAsync({
                    input: {
                        lines: refundLines,
                        reason,
                        paymentId: payment.id,
                        amount: payment.amountToRefund,
                        shipping: 0,
                        adjustment: 0,
                    },
                });

                if (refundResult.refundOrder.__typename !== 'Refund') {
                    toast.error(t`Failed to process refund`, {
                        description: (refundResult.refundOrder as any).message,
                    });
                    setIsSubmitting(false);
                    return;
                }
            }

            toast.success(t`Refund processed successfully`);
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            toast.error(t`Failed to process refund`, {
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        initializeState();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={e => {
                    e.stopPropagation();
                    handleOpen();
                }}
                variant="outline"
            >
                <Trans>Refund</Trans>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <Trans>Refund and cancel order</Trans>
                        </DialogTitle>
                        <DialogDescription>
                            <Trans>Select items to refund and optionally return to stock</Trans>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Order Lines Table */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">
                                <Trans>Order lines</Trans>
                            </Label>
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="p-2 text-left w-16">
                                                <Trans>Image</Trans>
                                            </th>
                                            <th className="p-2 text-left">
                                                <Trans>Product</Trans>
                                            </th>
                                            <th className="p-2 text-right">
                                                <Trans>Unit price</Trans>
                                            </th>
                                            <th className="p-2 text-center">
                                                <Trans>Qty</Trans>
                                            </th>
                                            <th className="p-2 text-center w-24">
                                                <Trans>Refund</Trans>
                                            </th>
                                            <th className="p-2 text-center">
                                                <Trans>Return to stock</Trans>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.lines.map(line => {
                                            const canRefund = lineCanBeRefunded(order, line);
                                            const maxRefundable = getMaxRefundableQuantity(order, line);
                                            const selection = lineSelections[line.id];

                                            if (!canRefund) return null;

                                            return (
                                                <tr key={line.id} className="border-t">
                                                    <td className="p-2">
                                                        <VendureImage
                                                            asset={line.featuredAsset}
                                                            preset="tiny"
                                                            className="w-10 h-10 object-cover"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="font-medium">
                                                            {line.productVariant.name}
                                                        </div>
                                                        <div className="text-muted-foreground text-xs">
                                                            SKU: {line.productVariant.sku}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {formatCurrency(
                                                            line.proratedUnitPriceWithTax,
                                                            order.currencyCode,
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        {line.orderPlacedQuantity}
                                                        {maxRefundable < line.orderPlacedQuantity && (
                                                            <div className="text-xs text-muted-foreground">
                                                                ({maxRefundable} refundable)
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={maxRefundable}
                                                            value={selection?.quantity ?? 0}
                                                            onChange={e => {
                                                                const value = Math.min(
                                                                    Math.max(0, parseInt(e.target.value, 10) || 0),
                                                                    maxRefundable,
                                                                );
                                                                onRefundQuantityChange(line.id, value);
                                                            }}
                                                            className="w-20 text-center"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <Checkbox
                                                                checked={selection?.cancel ?? false}
                                                                disabled={!selection?.quantity}
                                                                onCheckedChange={checked =>
                                                                    onCancelChange(line.id, !!checked)
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Shipping Refund */}
                        {order.shippingLines.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-base font-medium">
                                    <Trans>Shipping</Trans>
                                </Label>
                                <div className="space-y-2">
                                    {order.shippingLines.map(shippingLine => (
                                        <div key={shippingLine.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={refundShippingLineIds.includes(shippingLine.id)}
                                                onCheckedChange={() => toggleShippingRefund(shippingLine.id)}
                                            />
                                            <Label className="font-normal">
                                                <Trans>Refund shipping</Trans>:{' '}
                                                {shippingLine.shippingMethod?.name} -{' '}
                                                {formatCurrency(
                                                    shippingLine.discountedPriceWithTax,
                                                    order.currencyCode,
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reason Selection */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">
                                <Trans>Reason</Trans>
                            </Label>
                            <Select value={selectedReason} onValueChange={setSelectedReason}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t`Select a reason...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {REFUND_REASONS.map(reasonOption => (
                                        <SelectItem key={reasonOption.value} value={reasonOption.value}>
                                            {reasonOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedReason === 'other' && (
                                <Input
                                    placeholder={t`Enter custom reason...`}
                                    value={customReason}
                                    onChange={e => setCustomReason(e.target.value)}
                                    className="mt-2"
                                />
                            )}
                        </div>

                        {/* Refund Total */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-medium">
                                    <Trans>Refund total</Trans>
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={manuallySetRefundTotal}
                                        onCheckedChange={checked => {
                                            setManuallySetRefundTotal(!!checked);
                                            if (!checked) {
                                                const calculated = calculateRefundTotal();
                                                setRefundTotal(calculated);
                                                allocateRefundsToPayments(calculated);
                                            }
                                        }}
                                    />
                                    <Label className="font-normal text-sm text-muted-foreground">
                                        <Trans>Override</Trans>
                                    </Label>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={toMajorUnits(refundTotal)}
                                    onChange={e =>
                                        onManualRefundTotalChange(
                                            toMinorUnits(parseFloat(e.target.value) || 0),
                                        )
                                    }
                                    disabled={!manuallySetRefundTotal}
                                    className="w-32"
                                />
                                <span className="text-muted-foreground">{order.currencyCode}</span>
                                <span className="text-muted-foreground text-sm">
                                    (max: {formatCurrency(totalRefundableAmount, order.currencyCode)})
                                </span>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">
                                <Trans>Select payments to refund</Trans>
                            </Label>
                            <div className="space-y-3">
                                {refundablePayments.map(payment => (
                                    <div
                                        key={payment.id}
                                        className="border rounded-md p-3 space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={payment.selected}
                                                    onCheckedChange={checked =>
                                                        onPaymentSelected(payment.id, !!checked)
                                                    }
                                                />
                                                <div>
                                                    <div className="font-medium">{payment.method}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <Trans>Available</Trans>:{' '}
                                                        {formatCurrency(
                                                            payment.refundableAmount,
                                                            order.currencyCode,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {payment.selected && (
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">
                                                        <Trans>Amount</Trans>:
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={toMajorUnits(payment.amountToRefund)}
                                                        onChange={e =>
                                                            onPaymentAmountChange(
                                                                payment.id,
                                                                toMinorUnits(parseFloat(e.target.value) || 0),
                                                            )
                                                        }
                                                        className="w-24"
                                                        max={toMajorUnits(payment.refundableAmount)}
                                                    />
                                                    <span className="text-muted-foreground text-sm">
                                                        {order.currencyCode}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Validation Errors */}
                        {validationErrors.length > 0 && (
                            <div className="space-y-2">
                                {validationErrors.map((error, index) => (
                                    <Alert key={index} variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                            <Trans>Cancel</Trans>
                        </Button>
                        <Button onClick={() => void handleSubmit()} disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? (
                                <Trans>Processing...</Trans>
                            ) : (
                                <Trans>
                                    Refund {formatCurrency(amountToRefundTotal, order.currencyCode)}
                                </Trans>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
