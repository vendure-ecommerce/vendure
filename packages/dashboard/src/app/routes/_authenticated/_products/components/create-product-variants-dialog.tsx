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
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans } from '@lingui/react/macro';
import { normalizeString } from '@/vdb/lib/utils.js';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
    addOptionGroupToProductDocument,
    createProductOptionDocument,
    createProductOptionGroupDocument,
    createProductVariantsDocument,
} from '../products.graphql.js';
import { CreateProductVariants, ExistingOptionGroup, ExistingVariant, VariantConfiguration } from './create-product-variants.js';

interface VariantDataWithExisting {
    data: VariantConfiguration;
    existingGroupIds: string[];
}

export function CreateProductVariantsDialog({
    productId,
    productName,
    existingOptionGroups = [],
    existingVariants = [],
    onSuccess,
}: {
    productId: string;
    productName: string;
    existingOptionGroups?: ExistingOptionGroup[];
    existingVariants?: ExistingVariant[];
    onSuccess?: () => void;
}) {
    const { activeChannel } = useChannel();
    const [variantData, setVariantData] = useState<VariantDataWithExisting | null>(null);
    const [open, setOpen] = useState(false);

    const createOptionGroupMutation = useMutation({
        mutationFn: api.mutate(createProductOptionGroupDocument),
    });

    const createOptionMutation = useMutation({
        mutationFn: api.mutate(createProductOptionDocument),
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
            const { data } = variantData;

            // Build a map of existing option groups for lookup
            const existingGroupsMap = new Map(
                existingOptionGroups.map(g => [g.name, g]),
            );

            // Separate new option groups from existing ones
            const newOptionGroups = data.optionGroups.filter(
                group => !existingGroupsMap.has(group.name),
            );

            // 1. Create only NEW option groups and their options
            const createdOptionGroups = await Promise.all(
                newOptionGroups.map(async optionGroup => {
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

            // 2. Add only NEW option groups to product
            await Promise.all(
                createdOptionGroups.map(group =>
                    addOptionGroupToProductMutation.mutateAsync({
                        productId,
                        optionGroupId: group.id,
                    }),
                ),
            );

            // 3. Build a set of existing option IDs for quick lookup
            const existingOptionIds = new Set<string>();
            existingOptionGroups.forEach(group => {
                group.options?.forEach(opt => existingOptionIds.add(opt.id));
            });

            // 4. Find and create new options that were added to EXISTING groups
            const newOptionsInExistingGroups: Array<{ groupId: string; groupName: string; optionName: string }> = [];
            data.optionGroups.forEach(group => {
                const existingGroup = existingGroupsMap.get(group.name);
                if (existingGroup) {
                    // This is an existing group - check for new options
                    group.values.forEach(value => {
                        // Check if this option exists by looking for its ID in existingOptionIds
                        // If the value.id is not in existingOptionIds, it's a new option
                        if (!existingOptionIds.has(value.id)) {
                            newOptionsInExistingGroups.push({
                                groupId: existingGroup.id,
                                groupName: group.name,
                                optionName: value.value,
                            });
                        }
                    });
                }
            });

            // Create the new options in existing groups
            const createdOptionsInExistingGroups = await Promise.all(
                newOptionsInExistingGroups.map(async ({ groupId, groupName, optionName }) => {
                    const result = await createOptionMutation.mutateAsync({
                        input: {
                            productOptionGroupId: groupId,
                            code: normalizeString(optionName, '-'),
                            translations: [
                                {
                                    languageCode: activeChannel.defaultLanguageCode,
                                    name: optionName,
                                },
                            ],
                        },
                    });
                    return {
                        groupName,
                        optionName,
                        optionId: result.createProductOption.id,
                    };
                }),
            );

            // 5. Build a map of newly created options by group name + option name
            // This includes options from new groups AND new options in existing groups
            const newOptionMap = new Map<string, string>(); // "groupName:optionName" -> optionId
            createdOptionGroups.forEach(group => {
                group.options.forEach(opt => {
                    newOptionMap.set(`${group.name}:${opt.name}`, opt.id);
                });
            });
            createdOptionsInExistingGroups.forEach(({ groupName, optionName, optionId }) => {
                newOptionMap.set(`${groupName}:${optionName}`, optionId);
            });

            // 6. Create variants using the correct option IDs
            const variantsToCreate = data.variants
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
                            // If the option ID is an existing database ID, use it directly
                            if (existingOptionIds.has(option.id)) {
                                return option.id;
                            }
                            // Otherwise, look up the newly created option by group name + option name
                            const newOptionId = newOptionMap.get(`${option.name}:${option.value}`);
                            if (!newOptionId) {
                                throw new Error(
                                    `Could not find option ${option.value} in group ${option.name}`,
                                );
                            }
                            return newOptionId;
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
        ({ data, existingGroupIds }: { data: VariantConfiguration; existingGroupIds: string[] }) =>
            setVariantData({ data, existingGroupIds }),
        [],
    );
    const createCount = Object.values(variantData?.data.variants ?? {}).filter(v => v.enabled).length;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type="button">
                        <Plus className="mr-2 h-4 w-4" /> <Trans>Variant Assistant</Trans>
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-[80vw] sm:max-w-[80vw]">
                    <DialogHeader>
                        <DialogTitle>
                            <Trans>Variant Assistant</Trans>
                        </DialogTitle>
                        <DialogDescription>
                            <Trans>Create variants for your product</Trans>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <CreateProductVariants
                            onChange={handleOnChange}
                            currencyCode={activeChannel?.defaultCurrencyCode}
                            existingOptionGroups={existingOptionGroups}
                            existingVariants={existingVariants}
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
                                createProductVariantsMutation.isPending ||
                                createCount === 0
                            }
                        >
                            {createOptionGroupMutation.isPending ||
                            addOptionGroupToProductMutation.isPending ||
                            createProductVariantsMutation.isPending ? (
                                <Trans>Creating...</Trans>
                            ) : (
                                <Trans>Create {createCount} variants</Trans>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
