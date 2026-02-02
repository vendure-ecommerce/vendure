import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { OptionGroupConfiguration, OptionGroupsEditor } from './option-groups-editor.js';
import { MoneyInput } from '@/vdb/components/data-input/index.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';

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

type VariantForm = z.infer<typeof variantSchema>;

export interface ExistingOptionGroup {
    id: string;
    code: string;
    name: string;
    options?: Array<{
        id: string;
        code: string;
        name: string;
    }>;
}

export interface ExistingVariant {
    id: string;
    options: Array<{
        id: string;
        code: string;
        name: string;
        groupId: string;
    }>;
}

interface CreateProductVariantsProps {
    currencyCode?: string;
    onChange?: ({ data, existingGroupIds }: { data: VariantConfiguration; existingGroupIds: string[] }) => void;
    existingOptionGroups?: ExistingOptionGroup[];
    existingVariants?: ExistingVariant[];
}

export function CreateProductVariants({
    currencyCode = 'USD',
    onChange,
    existingOptionGroups = [],
    existingVariants = [],
}: Readonly<CreateProductVariantsProps>) {
    const { data: stockLocationsResult } = useQuery({
        queryKey: ['stockLocations'],
        queryFn: () => api.query(getStockLocationsDocument, { options: { take: 100 } }),
    });
    const { activeChannel } = useChannel();
    const stockLocations = stockLocationsResult?.stockLocations.items ?? [];

    // Transform existing option groups to the editor format
    const initialGroups = useMemo(
        () =>
            existingOptionGroups.map(group => ({
                name: group.name,
                existingId: group.id,
                values:
                    group.options?.map(opt => ({
                        value: opt.name,
                        id: opt.id,
                        existingId: opt.id,
                    })) ?? [],
            })),
        [existingOptionGroups],
    );

    // Track which group IDs are existing (not newly created)
    const existingGroupIds = useMemo(
        () => existingOptionGroups.map(g => g.id),
        [existingOptionGroups],
    );

    const [optionGroups, setOptionGroups] = useState<OptionGroupConfiguration['optionGroups']>(initialGroups);

    const form = useForm<{
        variants: Record<string, VariantForm>;
        useGlobalPrice: boolean;
        globalPrice: string;
        useGlobalStock: boolean;
        globalStock: string;
    }>({
        resolver: zodResolver(
            z.object({
                variants: z.record(variantSchema),
                useGlobalPrice: z.boolean(),
                globalPrice: z.string(),
                useGlobalStock: z.boolean(),
                globalStock: z.string(),
            }),
        ),
        defaultValues: {
            variants: {},
            useGlobalPrice: false,
            globalPrice: '0',
            useGlobalStock: false,
            globalStock: '0',
        },
        mode: 'onChange',
    });

    const { useGlobalPrice, globalPrice, useGlobalStock, globalStock } = form.watch();
    const { setValue } = form;

    // Generate variants and filter out existing ones
    const variants = useMemo(() => {
        const existingCombos = new Set(
            existingVariants.map(v => v.options.map(o => o.id).sort((a, b) => a.localeCompare(b)).join(',')),
        );
        return generateVariants(optionGroups).filter(
            variant => !existingCombos.has(variant.options.map(o => o.id).sort((a, b) => a.localeCompare(b)).join(',')),
        );
    }, [optionGroups, existingVariants]);

    // Watch form changes and build variant data
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
                            price: (value?.useGlobalPrice ? value?.globalPrice : formVariant.price) ?? '',
                            stock: (value?.useGlobalStock ? value?.globalStock : formVariant.stock) ?? '',
                            options: variant.options,
                        });
                    }
                }
            });

            const filteredData: VariantConfiguration = {
                optionGroups,
                variants: activeVariants,
            };

            onChange?.({ data: filteredData, existingGroupIds });
        });

        return () => subscription.unsubscribe();
    }, [form, variants, optionGroups, existingGroupIds, onChange]);

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
                <OptionGroupsEditor
                    initialGroups={initialGroups}
                    onChange={data => setOptionGroups(data.optionGroups)}
                />
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
                                    <TableHead>
                                        <Trans>Create</Trans>
                                    </TableHead>
                                    <TableHead>
                                        <Trans>Variant</Trans>
                                    </TableHead>
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
                                {/* Global setting row */}
                                {variants.length > 1 && (
                                    <TableRow className="bg-muted/50">
                                        <TableCell />
                                        <TableCell className="font-medium">
                                            <Trans>All variants</Trans>
                                        </TableCell>
                                        <TableCell />
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="useGlobalPrice"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="globalPrice"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <MoneyInput
                                                                    {...field}
                                                                    value={Number(field.value) || 0}
                                                                    onChange={value =>
                                                                        field.onChange(value.toString())
                                                                    }
                                                                    currency={activeChannel?.defaultCurrencyCode}
                                                                    disabled={!useGlobalPrice}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="useGlobalStock"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="globalStock"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    min="0"
                                                                    step="1"
                                                                    className="w-24"
                                                                    disabled={!useGlobalStock}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {variants.map(variant => (
                                    <TableRow key={variant.id}>
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

                                        <TableCell>{variant.values.join(' ')}</TableCell>

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
                                                            <MoneyInput
                                                                {...field}
                                                                value={useGlobalPrice ? (Number(globalPrice) || 0) : (Number(field.value) || 0)}
                                                                onChange={value => field.onChange(value.toString())}
                                                                currency={activeChannel?.defaultCurrencyCode}
                                                                disabled={useGlobalPrice}
                                                            />
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
                                                                value={useGlobalStock ? globalStock : field.value}
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                disabled={useGlobalStock}
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
