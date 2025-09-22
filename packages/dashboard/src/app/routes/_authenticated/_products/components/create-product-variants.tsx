import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { OptionGroupConfiguration, optionGroupSchema, OptionGroupsEditor } from './option-groups-editor.js';

const getStockLocationsDocument = graphql(`
    query GetStockLocations($options: StockLocationListOptions) {
        stockLocations(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`);

type VariantOption = {
    name: string;
    value: string;
    id: string;
};

type GeneratedVariant = {
    id: string;
    name: string;
    values: string[];
    options: VariantOption[];
    enabled: boolean;
    sku: string;
    price: string;
    stock: string;
};

export interface VariantConfiguration {
    optionGroups: Array<{
        name: string;
        values: Array<{
            value: string;
            id: string;
        }>;
    }>;
    variants: Array<{
        enabled: boolean;
        sku: string;
        price: string;
        stock: string;
        options: VariantOption[];
    }>;
}

const variantSchema = z.object({
    enabled: z.boolean().default(true),
    sku: z.string().min(1, { message: 'SKU is required' }),
    price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Price must be a positive number',
    }),
    stock: z.string().refine(val => !isNaN(Number(val)) && parseInt(val, 10) >= 0, {
        message: 'Stock must be a non-negative integer',
    }),
});

const formSchema = z.object({
    optionGroups: z.array(optionGroupSchema),
    variants: z.record(variantSchema),
});

type VariantForm = z.infer<typeof variantSchema>;

interface CreateProductVariantsProps {
    currencyCode?: string;
    onChange?: ({ data }: { data: VariantConfiguration }) => void;
}

export function CreateProductVariants({
    currencyCode = 'USD',
    onChange,
}: Readonly<CreateProductVariantsProps>) {
    const { data: stockLocationsResult } = useQuery({
        queryKey: ['stockLocations'],
        queryFn: () => api.query(getStockLocationsDocument, { options: { take: 100 } }),
    });
    const stockLocations = stockLocationsResult?.stockLocations.items ?? [];

    const [optionGroups, setOptionGroups] = useState<OptionGroupConfiguration['optionGroups']>([]);

    const form = useForm<{ variants: Record<string, VariantForm> }>({
        resolver: zodResolver(z.object({ variants: z.record(variantSchema) })),
        defaultValues: {
            variants: {},
        },
        mode: 'onChange',
    });

    const { setValue } = form;

    // memoize the variants
    const variants = useMemo(() => generateVariants(optionGroups), [JSON.stringify(optionGroups)]);

    // Use the handleSubmit approach for the entire form
    useEffect(() => {
        const subscription = form.watch(value => {
            const formVariants = value?.variants || {};
            const activeVariants: VariantConfiguration['variants'] = [];

            variants.forEach(variant => {
                if (variant && typeof variant === 'object') {
                    const formVariant = formVariants[variant.id];
                    if (formVariant) {
                        activeVariants.push({
                            enabled: formVariant.enabled ?? true,
                            sku: formVariant.sku ?? '',
                            price: formVariant.price ?? '',
                            stock: formVariant.stock ?? '',
                            options: variant.options,
                        });
                    }
                }
            });

            const filteredData: VariantConfiguration = {
                optionGroups,
                variants: activeVariants,
            };

            onChange?.({ data: filteredData });
        });

        return () => subscription.unsubscribe();
    }, [form, onChange, variants, optionGroups]);

    // Initialize variant form values when variants change
    useEffect(() => {
        // Initialize any new variants with default values
        const currentVariants = form.getValues().variants || {};
        const updatedVariants = { ...currentVariants };

        variants.forEach(variant => {
            if (!updatedVariants[variant.id]) {
                updatedVariants[variant.id] = {
                    enabled: true,
                    sku: '',
                    price: '',
                    stock: '',
                };
            }
        });

        setValue('variants', updatedVariants);
    }, [variants, form, setValue]);

    return (
        <FormProvider {...form}>
            <div className="mb-6">
                <OptionGroupsEditor onChange={data => setOptionGroups(data.optionGroups)} />
            </div>

            {stockLocations.length === 0 ? (
                <Alert variant="destructive">
                    <AlertDescription>
                        <Trans>No stock locations available on current channel</Trans>
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    {stockLocations.length > 1 && (
                        <div className="mb-4">
                            <FormLabel>
                                <Trans>Add Stock to Location</Trans>
                            </FormLabel>
                            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                {stockLocations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {variants.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {variants.length > 1 && (
                                        <TableHead>
                                            <Trans>Create</Trans>
                                        </TableHead>
                                    )}
                                    {variants.length > 1 && (
                                        <TableHead>
                                            <Trans>Variant</Trans>
                                        </TableHead>
                                    )}
                                    <TableHead>
                                        <Trans>SKU</Trans>
                                    </TableHead>
                                    <TableHead>
                                        <Trans>Price</Trans>
                                    </TableHead>
                                    <TableHead>
                                        <Trans>Stock on Hand</Trans>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map(variant => (
                                    <TableRow key={variant.id}>
                                        {variants.length > 1 && (
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${variant.id}.enabled`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center space-x-2">
                                                            <FormControl>
                                                                <Checkbox
                                                                    defaultChecked={true}
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        )}

                                        {variants.length > 1 && (
                                            <TableCell>{variant.values.join(' ')}</TableCell>
                                        )}

                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`variants.${variant.id}.sku`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} placeholder="SKU" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`variants.${variant.id}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-2.5">
                                                                    {currencyCode}
                                                                </span>
                                                                <Input
                                                                    {...field}
                                                                    className="pl-12"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`variants.${variant.id}.stock`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </>
            )}
        </FormProvider>
    );
}

// Generate all possible combinations of option values
function generateVariants(groups: OptionGroupConfiguration['optionGroups']): GeneratedVariant[] {
    // If there are no groups, return a single variant with no options
    if (!groups.length)
        return [
            {
                id: 'default',
                name: '',
                values: [],
                options: [],
                enabled: true,
                sku: '',
                price: '',
                stock: '',
            },
        ];

    // Make sure all groups have at least one value
    const validGroups = groups.filter(group => group.name && group.values && group.values.length > 0);
    if (!validGroups.length) return [];

    // Generate combinations
    const generateCombinations = (
        optionGroups: OptionGroupConfiguration['optionGroups'],
        currentIndex: number,
        currentCombination: VariantOption[],
    ): GeneratedVariant[] => {
        if (currentIndex === optionGroups.length) {
            return [
                {
                    id: currentCombination.map(c => c.id).join('-'),
                    name: currentCombination.map(c => c.value).join(' '),
                    values: currentCombination.map(c => c.value),
                    options: currentCombination,
                    enabled: true,
                    sku: '',
                    price: '',
                    stock: '',
                },
            ];
        }

        const currentGroup = optionGroups[currentIndex];
        const results: GeneratedVariant[] = [];

        currentGroup.values.forEach(optionValue => {
            const newCombination = [
                ...currentCombination,
                { name: currentGroup.name, value: optionValue.value, id: optionValue.id },
            ];

            const subResults = generateCombinations(optionGroups, currentIndex + 1, newCombination);
            results.push(...subResults);
        });

        return results;
    };

    return generateCombinations(validGroups, 0, []);
}
