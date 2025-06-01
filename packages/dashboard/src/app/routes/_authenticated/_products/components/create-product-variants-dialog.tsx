import { useCallback, useMemo, useState } from 'react';
import { CreateProductVariants, VariantConfiguration } from './create-product-variants.js';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import { Button } from '@/components/ui/button.js';
import { Plus } from 'lucide-react';
import { useChannel } from '@/hooks/use-channel.js';
import { Trans } from '@/lib/trans.js';
import { graphql } from '@/graphql/graphql.js';
import { api } from '@/graphql/api.js';
import { useMutation } from '@tanstack/react-query';
import { normalizeString } from '@/lib/utils.js';

const createProductOptionsMutation = graphql(`
    mutation CreateOptionGroups($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            id
            name
            options {
                id
                code
                name
            }
        }
    }
`);

export const addOptionGroupToProductDocument = graphql(`
    mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`);

export const createProductVariantsDocument = graphql(`
    mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
            id
            name
        }
    }
`);

export function CreateProductVariantsDialog({
    productId,
    productName,
    onSuccess,
}: {
    productId: string;
    productName: string;
    onSuccess?: () => void;
}) {
    const { activeChannel } = useChannel();
    const [variantData, setVariantData] = useState<VariantConfiguration | null>(null);
    const [open, setOpen] = useState(false);

    const createOptionGroupMutation = useMutation({
        mutationFn: api.mutate(createProductOptionsMutation),
    });

    const addOptionGroupToProductMutation = useMutation({
        mutationFn: api.mutate(addOptionGroupToProductDocument),
    });

    const createProductVariantsMutation = useMutation({
        mutationFn: api.mutate(createProductVariantsDocument),
    });

    async function handleCreateVariants() {
        if (!variantData || !activeChannel?.defaultLanguageCode) return;

        try {
            // 1. Create option groups and their options
            const createdOptionGroups = await Promise.all(
                variantData.optionGroups.map(async optionGroup => {
                    const result = await createOptionGroupMutation.mutateAsync({
                        input: {
                            code: normalizeString(optionGroup.name, '-'),
                            translations: [
                                {
                                    languageCode: activeChannel.defaultLanguageCode,
                                    name: optionGroup.name,
                                },
                            ],
                            options: optionGroup.values.map(value => ({
                                code: normalizeString(value.value, '-'),
                                translations: [
                                    {
                                        languageCode: activeChannel.defaultLanguageCode,
                                        name: value.value,
                                    },
                                ],
                            })),
                        },
                    });
                    return result.createProductOptionGroup;
                }),
            );

            // 2. Add option groups to product
            await Promise.all(
                createdOptionGroups.map(group =>
                    addOptionGroupToProductMutation.mutateAsync({
                        productId,
                        optionGroupId: group.id,
                    }),
                ),
            );

            // 3. Create variants
            const variantsToCreate = variantData.variants
                .filter(variant => variant.enabled)
                .map(variant => {
                    const name = variant.options.length
                        ? `${productName} ${variant.options.map(option => option.value).join(' ')}`
                        : productName;
                    return {
                        productId,
                        sku: variant.sku,
                        price: Number(variant.price),
                        stockOnHand: Number(variant.stock),
                        optionIds: variant.options.map(option => {
                            const optionGroup = createdOptionGroups.find(g => g.name === option.name);
                            if (!optionGroup) {
                                throw new Error(`Could not find option group ${option.name}`);
                            }
                            const createdOption = optionGroup.options.find(o => o.name === option.value);
                            if (!createdOption) {
                                throw new Error(
                                    `Could not find option ${option.value} in group ${option.name}`,
                                );
                            }
                            return createdOption.id;
                        }),
                        translations: [
                            {
                                languageCode: activeChannel.defaultLanguageCode,
                                name: name,
                            },
                        ],
                    };
                });

            await createProductVariantsMutation.mutateAsync({ input: variantsToCreate });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating variants:', error);
            // Handle error (show toast notification, etc.)
        }
    }

    const handleOnChange = useCallback(
        ({ data }: { data: VariantConfiguration }) => setVariantData(data),
        [],
    );

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type="button">
                        <Plus className="mr-2 h-4 w-4" /> Create Variants
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Trans>Create Variants</Trans>
                        </DialogTitle>
                        <DialogDescription>
                            <Trans>Create variants for your product</Trans>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <CreateProductVariants
                            onChange={handleOnChange}
                            currencyCode={activeChannel?.defaultCurrencyCode}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleCreateVariants}
                            disabled={
                                !variantData ||
                                createOptionGroupMutation.isPending ||
                                addOptionGroupToProductMutation.isPending ||
                                createProductVariantsMutation.isPending
                            }
                        >
                            {createOptionGroupMutation.isPending ||
                            addOptionGroupToProductMutation.isPending ||
                            createProductVariantsMutation.isPending ? (
                                <Trans>Creating...</Trans>
                            ) : (
                                <Trans>
                                    Create{' '}
                                    {variantData
                                        ? Object.values(variantData.variants).filter(v => v.enabled).length
                                        : 0}{' '}
                                    variants
                                </Trans>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
