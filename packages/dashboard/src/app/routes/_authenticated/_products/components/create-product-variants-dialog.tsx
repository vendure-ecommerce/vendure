import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/vdb/components/ui/dialog.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans } from '@/vdb/lib/trans.js';
import { normalizeString } from '@/vdb/lib/utils.js';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { CreateProductVariants, VariantConfiguration } from './create-product-variants.js';

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

const createProductOptionMutationDocument = graphql(`
    mutation CreateProductOption($input: CreateProductOptionInput!) {
        createProductOption(input: $input) {
            id
            code
            name
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

    const createProductOptionMutation = useMutation({
        mutationFn: api.mutate(createProductOptionMutationDocument),
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
            // Keep track of all option groups (both created and existing)
            const allOptionGroups: Array<{ id: string; name: string; options: Array<{ id: string; name: string }> }> = [];

            // 1. Separate groups by creation need (based on ID presence)
            const groupsToCreate = variantData.optionGroups.filter(g => !g.id);
            const existingGroups = variantData.optionGroups.filter(g => g.id);

            // 2. Create new option groups with their new options
            if (groupsToCreate.length > 0) {
                const createdGroups = await Promise.all(
                    groupsToCreate.map(async group => {
                        const newOptions = group.options.filter(o => !o.id);
                        const result = await createOptionGroupMutation.mutateAsync({
                            input: {
                                code: group.code || normalizeString(group.name, '-'),
                                translations: [
                                    {
                                        languageCode: activeChannel.defaultLanguageCode,
                                        name: group.name,
                                    },
                                ],
                                options: newOptions.map(option => ({
                                    code: option.code || normalizeString(option.name, '-'),
                                    translations: [
                                        {
                                            languageCode: activeChannel.defaultLanguageCode,
                                            name: option.name,
                                        },
                                    ],
                                })),
                            },
                        });
                        return result.createProductOptionGroup;
                    }),
                );
                allOptionGroups.push(...createdGroups);
            }

            // 3. Handle existing groups - create new options if needed
            for (const group of existingGroups) {
                const newOptions = group.options.filter(o => !o.id);
                const existingOptions = group.options.filter(o => o.id);

                const createdOptions = [];
                if (newOptions.length > 0) {
                    // Create new options in existing group
                    const results = await Promise.all(
                        newOptions.map(option =>
                            createProductOptionMutation.mutateAsync({
                                input: {
                                    productOptionGroupId: group.id!,
                                    code: option.code || normalizeString(option.name, '-'),
                                    translations: [
                                        {
                                            languageCode: activeChannel.defaultLanguageCode,
                                            name: option.name,
                                        },
                                    ],
                                },
                            })
                        )
                    );
                    createdOptions.push(...results.map(r => r.createProductOption));
                }

                allOptionGroups.push({
                    id: group.id!,
                    name: group.name,
                    options: [...existingOptions as any, ...createdOptions],
                });
            }

            // 4. Assign all option groups to product
            await Promise.all(
                allOptionGroups.map(group =>
                    addOptionGroupToProductMutation.mutateAsync({
                        productId,
                        optionGroupId: group.id,
                    }),
                ),
            );

            // 5. Create variants with proper option mapping
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
                        optionIds: variant.options.map(variantOption => {
                            const optionGroup = allOptionGroups.find(g => g.name === variantOption.name);
                            if (!optionGroup) {
                                throw new Error(`Could not find option group ${variantOption.name}`);
                            }
                            const option = optionGroup.options.find(o =>
                                o.name === variantOption.value || o.id === variantOption.id
                            );
                            if (!option) {
                                throw new Error(
                                    `Could not find option ${variantOption.value} in group ${variantOption.name}`,
                                );
                            }
                            return option.id;
                        }),
                        translations: [
                            {
                                languageCode: activeChannel.defaultLanguageCode,
                                name,
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
