import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { FacetValueChip } from '@/components/shared/facet-value-chip.js';
import { FacetValue, FacetValueSelector } from '@/components/shared/facet-value-selector.js';
import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { getDetailQueryOptions } from '@/framework/page/use-detail-page.js';
import {
    getProductsWithFacetValuesByIdsDocument,
    productDetailDocument,
    updateProductsDocument,
} from '../products.graphql.js';

interface ProductWithFacetValues {
    id: string;
    name: string;
    facetValues: Array<{
        id: string;
        name: string;
        code: string;
        facet: {
            id: string;
            name: string;
            code: string;
        };
    }>;
}

interface AssignFacetValuesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productIds: string[];
    onSuccess?: () => void;
}

export function AssignFacetValuesDialog({
    open,
    onOpenChange,
    productIds,
    onSuccess,
}: AssignFacetValuesDialogProps) {
    const { i18n } = useLingui();
    const [selectedValues, setSelectedValues] = useState<FacetValue[]>([]);
    const [facetValuesRemoved, setFacetValuesRemoved] = useState(false);
    const [removedFacetValues, setRemovedFacetValues] = useState<Set<string>>(new Set());
    const queryClient = useQueryClient();

    // Fetch existing facet values for the products
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['productsWithFacetValues', productIds],
        queryFn: () => api.query(getProductsWithFacetValuesByIdsDocument, { ids: productIds }),
        enabled: open && productIds.length > 0,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: api.mutate(updateProductsDocument),
        onSuccess: (result: ResultOf<typeof updateProductsDocument>) => {
            toast.success(i18n.t(`Successfully updated facet values for ${productIds.length} products`));
            onSuccess?.();
            onOpenChange(false);
            // Reset state
            setSelectedValues([]);
            setFacetValuesRemoved(false);
            setRemovedFacetValues(new Set());
            productIds.forEach(id => {
                const { queryKey } = getDetailQueryOptions(productDetailDocument, { id });
                queryClient.removeQueries({ queryKey });
            });
        },
        onError: () => {
            toast.error(`Failed to update facet values for ${productIds.length} products`);
        },
    });

    const handleAssign = () => {
        if (selectedValues.length === 0 && !facetValuesRemoved) {
            toast.error('Please select at least one facet value or make changes to existing ones');
            return;
        }

        if (!productsData?.products.items) {
            return;
        }

        const selectedFacetValueIds = selectedValues.map(sv => sv.id);

        mutate({
            input: productsData.products.items.map(product => ({
                id: product.id,
                facetValueIds: [
                    ...new Set([
                        ...product.facetValues.filter(fv => !removedFacetValues.has(fv.id)).map(fv => fv.id),
                        ...selectedFacetValueIds,
                    ]),
                ],
            })),
        });
    };

    const handleFacetValueSelect = (facetValue: FacetValue) => {
        setSelectedValues(prev => [...prev, facetValue]);
    };

    const removeFacetValue = (productId: string, facetValueId: string) => {
        setRemovedFacetValues(prev => new Set([...prev, facetValueId]));
        setFacetValuesRemoved(true);
    };

    const handleCancel = () => {
        onOpenChange(false);
        // Reset state
        setSelectedValues([]);
        setFacetValuesRemoved(false);
        setRemovedFacetValues(new Set());
    };

    // Filter out removed facet values for display
    const getDisplayFacetValues = (product: ProductWithFacetValues) => {
        return product.facetValues.filter(fv => !removedFacetValues.has(fv.id));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Edit facet values</Trans>
                    </DialogTitle>
                    <DialogDescription>
                        <Trans>Add or remove facet values for {productIds.length} products</Trans>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {/* Add new facet values section */}
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                            <Trans>Add facet value</Trans>
                        </div>
                        <FacetValueSelector
                            onValueSelect={handleFacetValueSelect}
                            placeholder="Search facet values..."
                        />
                    </div>

                    {/* Products table */}
                    <div className="flex-1 overflow-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-sm text-muted-foreground">Loading...</div>
                            </div>
                        ) : productsData?.products.items ? (
                            <div className="border rounded-md">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-3 text-sm font-medium">
                                                <Trans>Product</Trans>
                                            </th>
                                            <th className="text-left p-3 text-sm font-medium">
                                                <Trans>Current facet values</Trans>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productsData.products.items.map(product => {
                                            const displayFacetValues = getDisplayFacetValues(product);
                                            return (
                                                <tr key={product.id} className="border-t">
                                                    <td className="p-3 align-top">
                                                        <div className="font-medium">{product.name}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            {displayFacetValues.map(facetValue => (
                                                                <FacetValueChip
                                                                    key={facetValue.id}
                                                                    facetValue={facetValue}
                                                                    removable={true}
                                                                    onRemove={() =>
                                                                        removeFacetValue(
                                                                            product.id,
                                                                            facetValue.id,
                                                                        )
                                                                    }
                                                                />
                                                            ))}
                                                            {displayFacetValues.length === 0 && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    <Trans>No facet values</Trans>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </div>

                    {/* Selected values summary */}
                    {selectedValues.length > 0 && (
                        <div className="border-t pt-4">
                            <div className="text-sm font-medium mb-2">
                                <Trans>New facet values to add:</Trans>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedValues.map(facetValue => (
                                    <FacetValueChip
                                        key={facetValue.id}
                                        facetValue={facetValue}
                                        removable={false}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={(selectedValues.length === 0 && !facetValuesRemoved) || isPending}
                    >
                        <Trans>Update</Trans>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
