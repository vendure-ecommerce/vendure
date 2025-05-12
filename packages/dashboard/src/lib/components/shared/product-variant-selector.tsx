import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command.js';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.js";
import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { cn } from '@/lib/utils.js';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button.js';
import { assetFragment } from '@/graphql/fragments.js';
import { VendureImage } from './vendure-image.js';

const productVariantListDocument = graphql(`
    query ProductVariantList($options: ProductVariantListOptions) {
        productVariants(options: $options) {
            items {
                id
                name
                sku
                featuredAsset {
                    ...Asset
                }
            }
            totalItems
        }
    }
`, [assetFragment]);

export interface ProductVariantSelectorProps {
    onProductVariantIdChange: (productVariantId: string) => void;
}

export function ProductVariantSelector({ onProductVariantIdChange }: ProductVariantSelectorProps) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useQuery({
        queryKey: ['productVariants', debouncedSearch],
        staleTime: 1000 * 60 * 5,
        enabled: debouncedSearch.length > 0,
        queryFn: () =>
            api.query(productVariantListDocument, {
                options: {
                    take: 10,
                    filter: {
                        name: { contains: debouncedSearch },
                        sku: { contains: debouncedSearch },
                    },
                    filterOperator: 'OR',
                },
            }),
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full"
                >
                    Add item to order
                    <Plus className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Add item to order..."
                        className="h-9"
                       onValueChange={(value) => setSearch(value)}
                    />
                    <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                            {data?.productVariants.items.map((variant) => (
                                <CommandItem
                                    key={variant.id}
                                    value={variant.id}
                                    onSelect={() => {
                                        onProductVariantIdChange(variant.id);
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2"
                                >
                                    {variant.featuredAsset && (
                                        <VendureImage
                                            asset={variant.featuredAsset}
                                            preset="tiny"
                                            className="size-8 rounded-md object-cover"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{variant.name}</span>
                                        <span className="text-xs text-muted-foreground">{variant.sku}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}