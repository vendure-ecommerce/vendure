import { Alert, AlertDescription, AlertTitle } from '@/vdb/components/ui/alert.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import { api } from '@/vdb/graphql/api.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { useMutation } from '@tanstack/react-query';
import { ResultOf, VariablesOf } from 'gql.tada';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { modifyOrderDocument, orderDetailDocument } from '../orders.graphql.js';
import { OrderTable } from './order-table.js';

// Types
export type OrderFragment = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;
export type ModifyOrderInput = VariablesOf<typeof modifyOrderDocument>['input'];

interface OrderModificationPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderSnapshot: OrderFragment;
    modifyOrderInput: ModifyOrderInput;
    onResolve: () => void;
}

export function OrderModificationPreviewDialog({
    open,
    onOpenChange,
    orderSnapshot,
    modifyOrderInput,
    onResolve,
}: Readonly<OrderModificationPreviewDialogProps>) {
    const { i18n } = useLingui();
    const { formatCurrency } = useLocalFormat();
    // Use a ref to track the last input sent to avoid duplicate calls
    const lastInputRef = useRef<ModifyOrderInput | null>(null);
    const previewMutation = useMutation({
        mutationFn: api.mutate(addCustomFields(modifyOrderDocument)),
    });
    const [showRefundForm, setShowRefundForm] = React.useState(false);
    const refundForm = useForm<{ paymentId: string; note: string }>({
        defaultValues: { paymentId: '', note: '' },
    });

    const confirmMutation = useMutation({
        mutationFn: (input: ModifyOrderInput) => api.mutate(addCustomFields(modifyOrderDocument))({ input }),
    });

    // Trigger preview when dialog opens or input changes (while open)
    useEffect(() => {
        if (open) {
            // Only trigger if input actually changed
            if (
                !lastInputRef.current ||
                JSON.stringify(lastInputRef.current) !== JSON.stringify(modifyOrderInput)
            ) {
                const input = { ...modifyOrderInput, dryRun: true };
                previewMutation.mutate({ input });
                lastInputRef.current = modifyOrderInput;
            }
        }
    }, [open, modifyOrderInput]);

    const previewOrder =
        previewMutation.data?.modifyOrder?.__typename === 'Order'
            ? (previewMutation.data.modifyOrder as OrderFragment)
            : null;
    const error =
        previewMutation.data && previewMutation.data.modifyOrder?.__typename !== 'Order'
            ? previewMutation.data.modifyOrder?.message || i18n.t('Unknown error')
            : previewMutation.error?.message || null;
    const loading = previewMutation.isPending;

    // Price difference
    const priceDifference = previewOrder ? previewOrder.totalWithTax - orderSnapshot.totalWithTax : 0;
    const formattedDiff = previewOrder
        ? formatCurrency(Math.abs(priceDifference), previewOrder.currencyCode)
        : '';

    // Confirm handler
    const handleConfirm = async () => {
        if (!previewOrder) return;
        if (priceDifference >= 0) {
            // No refund: just send mutation
            await confirmMutation.mutateAsync({ ...modifyOrderInput, dryRun: false });
            onResolve();
        } else {
            setShowRefundForm(true);
        }
    };
    // Refund form submit
    const handleRefundSubmit = refundForm.handleSubmit(({ paymentId, note }) => {
        confirmMutation.mutate(
            {
                ...modifyOrderInput,
                dryRun: false,
                refund: {
                    paymentId,
                    amount: Math.abs(priceDifference),
                    reason: note,
                },
            },
            {
                onSuccess: data => {
                    setShowRefundForm(false);
                    onResolve();
                },
            },
        );
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[80vw] p-8">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Preview order modifications</Trans>
                    </DialogTitle>
                    <DialogDescription>
                        <Trans>Review the changes before applying them to the order.</Trans>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {loading && (
                        <div className="text-center py-8">
                            <Trans>Loading preview…</Trans>
                        </div>
                    )}
                    {error && <div className="text-destructive py-2">{error}</div>}
                    {previewOrder && !loading && !error && (
                        <>
                            <OrderTable order={previewOrder} />
                            <div className="w-full flex justify-end">
                                <div className="max-w-lg">
                                    {/* Refund/payment UI using Alert */}
                                    {priceDifference < 0 && !showRefundForm && (
                                        <Alert variant="destructive">
                                            <AlertTitle>
                                                <Trans>Refund required</Trans>
                                            </AlertTitle>
                                            <AlertDescription>
                                                <Trans>
                                                    A refund of {formattedDiff} is required. Select payment
                                                    and enter a note to proceed.
                                                </Trans>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    {priceDifference < 0 && showRefundForm && (
                                        <FormProvider {...refundForm}>
                                            <form onSubmit={handleRefundSubmit} className="space-y-4 mt-4">
                                                <FormField
                                                    name="paymentId"
                                                    control={refundForm.control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                <Trans>Select payment to refund</Trans>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder={i18n.t(
                                                                                'Select payment',
                                                                            )}
                                                                        />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {orderSnapshot.payments?.map(
                                                                            payment => (
                                                                                <SelectItem
                                                                                    key={payment.id}
                                                                                    value={payment.id}
                                                                                >
                                                                                    {payment.method} (
                                                                                    {formatCurrency(
                                                                                        payment.amount,
                                                                                        orderSnapshot.currencyCode,
                                                                                    )}
                                                                                    )
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    name="note"
                                                    control={refundForm.control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                <Trans>Refund note</Trans>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder={i18n.t('Enter refund note')}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => setShowRefundForm(false)}
                                                    >
                                                        <Trans>Back</Trans>
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="default"
                                                        disabled={confirmMutation.isPending}
                                                    >
                                                        <Trans>Confirm refund</Trans>
                                                    </Button>
                                                </div>
                                            </form>
                                        </FormProvider>
                                    )}
                                    {priceDifference > 0 && (
                                        <Alert variant="destructive">
                                            <AlertTitle>
                                                <Trans>Additional payment required</Trans>
                                            </AlertTitle>
                                            <AlertDescription>
                                                <Trans>
                                                    An additional payment of {formattedDiff} is required.
                                                </Trans>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    {priceDifference === 0 && (
                                        <Alert variant="default">
                                            <AlertTitle>
                                                <Trans>No payment or refund required</Trans>
                                            </AlertTitle>
                                            <AlertDescription>
                                                <Trans>
                                                    No payment or refund is required for these changes.
                                                </Trans>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => onResolve()}>
                            <Trans>Cancel</Trans>
                        </Button>
                    </DialogClose>
                    {priceDifference < 0 ? (
                        !showRefundForm && (
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleConfirm}
                                disabled={loading || !!error || confirmMutation.isPending}
                            >
                                <Trans>Confirm</Trans>
                            </Button>
                        )
                    ) : (
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleConfirm}
                            disabled={loading || !!error || confirmMutation.isPending}
                        >
                            <Trans>Confirm</Trans>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
