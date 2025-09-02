import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/vdb/components/ui/dialog.js';
import { Form } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { addOptionGroupToProductDocument, createProductOptionGroupDocument } from '../products.graphql.js';

const getProductDocument = graphql(`
    query GetProduct($productId: ID!) {
        product(id: $productId) {
            id
            name
            variants {
                id
                name
                sku
                options {
                    id
                    code
                    name
                    groupId
                }
            }
            optionGroups {
                id
                code
                name
                options {
                    id
                    code
                    name
                }
            }
        }
    }
`);

const updateProductVariantDocument = graphql(`
    mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
        updateProductVariant(input: $input) {
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

const formSchema = z.object({
    optionGroups: z
        .array(
            z.object({
                name: z.string().min(1, 'Option group name is required'),
                options: z
                    .array(z.string().min(1, 'Option name is required'))
                    .min(1, 'At least one option is required'),
            }),
        )
        .min(1, 'At least one option group is required'),
    existingVariantOptionIds: z.array(z.string()).min(1, 'Must select an option for the existing variant'),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateProductOptionsDialog({
    productId,
    onSuccess,
}: {
    productId: string;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { i18n } = useLingui();

    const { data: productData } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => api.query(getProductDocument, { productId }),
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            optionGroups: [{ name: '', options: [''] }],
            existingVariantOptionIds: [],
        },
    });

    const createProductOptionGroupMutation = useMutation({
        mutationFn: api.mutate(createProductOptionGroupDocument),
    });

    const addOptionGroupToProductMutation = useMutation({
        mutationFn: api.mutate(addOptionGroupToProductDocument),
    });

    const updateProductVariantMutation = useMutation({
        mutationFn: api.mutate(updateProductVariantDocument),
        onSuccess: () => {
            toast.success(i18n.t('Successfully created product options'));
            setOpen(false);
            onSuccess?.();
        },
        onError: error => {
            toast.error(i18n.t('Failed to create product options'), {
                description: error instanceof Error ? error.message : i18n.t('Unknown error'),
            });
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (!productData?.product) return;

        try {
            // Create all option groups and their options
            const createdOptionGroups = await Promise.all(
                values.optionGroups.map(async group => {
                    const result = await createProductOptionGroupMutation.mutateAsync({
                        input: {
                            code: group.name.toLowerCase().replace(/\s+/g, '-'),
                            translations: [
                                {
                                    languageCode: 'en',
                                    name: group.name,
                                },
                            ],
                            options: group.options.map(option => ({
                                code: option.toLowerCase().replace(/\s+/g, '-'),
                                translations: [
                                    {
                                        languageCode: 'en',
                                        name: option,
                                    },
                                ],
                            })),
                        },
                    });

                    // Add the option group to the product
                    await addOptionGroupToProductMutation.mutateAsync({
                        productId,
                        optionGroupId: result.createProductOptionGroup.id,
                    });

                    return result.createProductOptionGroup;
                }),
            );

            // Combine existing and newly created option groups
            const allOptionGroups = [...(productData.product.optionGroups || []), ...createdOptionGroups];

            // Map the selected option names to their IDs
            const selectedOptionIds = values.existingVariantOptionIds.map((optionName, index) => {
                const group = allOptionGroups[index];
                const option = group.options.find(opt => opt.name === optionName);
                if (!option) {
                    throw new Error(`Option "${optionName}" not found in group "${group.name}"`);
                }
                return option.id;
            });

            // Update the existing variant with the selected options
            if (productData.product.variants[0]) {
                // Create a new name by appending the selected option names
                const selectedOptionNames = values.existingVariantOptionIds
                    .map((optionName, index) => {
                        const group = allOptionGroups[index];
                        const option = group.options.find(opt => opt.name === optionName);
                        return option?.name;
                    })
                    .filter(Boolean)
                    .join(' ');

                const newVariantName = `${productData.product.name} ${selectedOptionNames}`;

                await updateProductVariantMutation.mutateAsync({
                    input: {
                        id: productData.product.variants[0].id,
                        optionIds: selectedOptionIds,
                        translations: [
                            {
                                languageCode: 'en',
                                name: newVariantName,
                            },
                        ],
                    },
                });
            }
        } catch (error) {
            toast.error(i18n.t('Failed to create product options'), {
                description: error instanceof Error ? error.message : i18n.t('Unknown error'),
            });
        }
    };

    const addOptionGroup = () => {
        const currentGroups = form.getValues('optionGroups');
        form.setValue('optionGroups', [...currentGroups, { name: '', options: [''] }]);
    };

    const removeOptionGroup = (index: number) => {
        const currentGroups = form.getValues('optionGroups');
        form.setValue(
            'optionGroups',
            currentGroups.filter((_, i) => i !== index),
        );
    };

    const addOption = (groupIndex: number) => {
        const currentGroups = form.getValues('optionGroups');
        const updatedGroups = [...currentGroups];
        updatedGroups[groupIndex].options.push('');
        form.setValue('optionGroups', updatedGroups);
    };

    const removeOption = (groupIndex: number, optionIndex: number) => {
        const currentGroups = form.getValues('optionGroups');
        const updatedGroups = [...currentGroups];
        updatedGroups[groupIndex].options = updatedGroups[groupIndex].options.filter(
            (_, i) => i !== optionIndex,
        );
        form.setValue('optionGroups', updatedGroups);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans>Create options</Trans>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Create product options</Trans>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {form.watch('optionGroups').map((group, groupIndex) => (
                                <div key={groupIndex} className="space-y-4 p-4 border rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name={`optionGroups.${groupIndex}.name`}
                                            label={<Trans>Option group name</Trans>}
                                            render={({ field }) => (
                                                <Input {...field} placeholder={i18n.t('e.g. Size')} />
                                            )}
                                        />
                                        {groupIndex > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeOptionGroup(groupIndex)}
                                            >
                                                <Trans>Remove group</Trans>
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {group.options.map((_, optionIndex) => (
                                            <div key={optionIndex} className="flex gap-2 items-end">
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    name={`optionGroups.${groupIndex}.options.${optionIndex}`}
                                                    label={<Trans>Option name</Trans>}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder={i18n.t('e.g. Small')}
                                                        />
                                                    )}
                                                />
                                                {optionIndex > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeOption(groupIndex, optionIndex)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addOption(groupIndex)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            <Trans>Add option</Trans>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addOptionGroup}>
                                <Plus className="mr-2 h-4 w-4" />
                                <Trans>Add another option group</Trans>
                            </Button>
                        </div>

                        {productData?.product?.variants[0] && (
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-medium">
                                    <Trans>Assign options to existing variant</Trans>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    <Trans>
                                        Select which options should apply to the existing variant "
                                        {productData.product.variants[0].name}"
                                    </Trans>
                                </p>
                                {/* Show existing option groups first */}
                                {productData.product.optionGroups?.map((group, groupIndex) => (
                                    <FormFieldWrapper
                                        key={group.id}
                                        control={form.control}
                                        name={`existingVariantOptionIds.${groupIndex}`}
                                        label={group.name}
                                        render={({ field }) => (
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={field.value}
                                                onChange={e => {
                                                    const newValues = [
                                                        ...form.getValues('existingVariantOptionIds'),
                                                    ];
                                                    newValues[groupIndex] = e.target.value;
                                                    form.setValue('existingVariantOptionIds', newValues);
                                                }}
                                            >
                                                <option value="">Select an option</option>
                                                {group.options.map(option => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                ))}
                                {/* Then show new option groups */}
                                {form.watch('optionGroups').map((group, groupIndex) => (
                                    <FormFieldWrapper
                                        key={`new-${groupIndex}`}
                                        control={form.control}
                                        name={`existingVariantOptionIds.${(productData?.product?.optionGroups?.length || 0) + groupIndex}`}
                                        label={group.name || <Trans>Option group {groupIndex + 1}</Trans>}
                                        render={({ field }) => (
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={field.value}
                                                onChange={e => {
                                                    const newValues = [
                                                        ...form.getValues('existingVariantOptionIds'),
                                                    ];
                                                    newValues[
                                                        (productData?.product?.optionGroups?.length || 0) +
                                                            groupIndex
                                                    ] = e.target.value;
                                                    form.setValue('existingVariantOptionIds', newValues);
                                                }}
                                            >
                                                <option value="">Select an option</option>
                                                {group.options.map((option, optionIndex) => (
                                                    <option key={optionIndex} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                ))}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    createProductOptionGroupMutation.isPending ||
                                    addOptionGroupToProductMutation.isPending ||
                                    updateProductVariantMutation.isPending ||
                                    (productData?.product?.variants[0] &&
                                        form.watch('existingVariantOptionIds').some(value => !value))
                                }
                            >
                                <Trans>Create options</Trans>
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
