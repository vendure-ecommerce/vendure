import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { FacetValueSelector, FacetValue } from '@/components/shared/facet-value-selector.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { updateProductsDocument } from '../products.graphql.js';

interface AssignFacetValuesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productIds: string[];
    onSuccess?: () => void;
}

export function AssignFacetValuesDialog({ open, onOpenChange, productIds, onSuccess }: AssignFacetValuesDialogProps) {
    const { i18n } = useLingui();
    const [selectedFacetValueIds, setSelectedFacetValueIds] = useState<string[]>([]);

    const { mutate, isPending } = useMutation({
        mutationFn: api.mutate(updateProductsDocument),
        onSuccess: (result: ResultOf<typeof updateProductsDocument>) => {
            toast.success(i18n.t(`Successfully updated facet values for ${productIds.length} products`));
            onSuccess?.();
            onOpenChange(false);
        },
        onError: () => {
            toast.error(`Failed to update facet values for ${productIds.length} products`);
        },
    });

    const handleAssign = () => {
        if (selectedFacetValueIds.length === 0) {
            toast.error('Please select at least one facet value');
            return;
        }

        mutate({
            input: productIds.map(productId => ({
                id: productId,
                facetValueIds: selectedFacetValueIds,
            })),
        });
    };

    const handleFacetValueSelect = (facetValue: FacetValue) => {
        setSelectedFacetValueIds(prev => [...new Set([...prev, facetValue.id])]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle><Trans>Edit facet values</Trans></DialogTitle>
                    <DialogDescription>
                        <Trans>Select facet values to assign to {productIds.length} products</Trans>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">
                            <Trans>Facet values</Trans>
                        </label>
                        <FacetValueSelector
                            onValueSelect={handleFacetValueSelect}
                            placeholder="Search facet values..."
                        />
                    </div>
                    {selectedFacetValueIds.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            <Trans>{selectedFacetValueIds.length} facet value(s) selected</Trans>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button onClick={handleAssign} disabled={selectedFacetValueIds.length === 0 || isPending}>
                        <Trans>Update</Trans>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 