import { Button } from '@/vdb/components/ui/button.js';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/vdb/components/ui/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const sellerListDocument = graphql(`
    query SellerList($options: SellerListOptions) {
        sellers(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`);

export interface Seller {
    id: string;
    name: string;
}

export interface SellerSelectorProps {
    value?: string | null;
    onChange: (value: string) => void;
    label?: string | React.ReactNode;
    readOnly?: boolean;
}

export function SellerSelector(props: SellerSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['sellerList', searchTerm],
        queryFn: () =>
            api.query(sellerListDocument, {
                options: {
                    sort: { name: 'ASC' },
                    filter: searchTerm
                        ? {
                              name: { contains: searchTerm },
                          }
                        : undefined,
                },
            }),
        staleTime: 1000 * 60, // 1 minute
    });

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const selectedSeller = data?.sellers.items.find(seller => seller.id === props.value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" type="button" disabled={props.readOnly} className="gap-2">
                    {selectedSeller ? (
                        <span className="flex-1 text-left">{selectedSeller.name}</span>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            {props.label ?? <Trans>Select seller</Trans>}
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[350px]" align="start">
                <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3">
                        <CommandInput
                            placeholder="Search sellers..."
                            onValueChange={handleSearch}
                            className="h-10 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <CommandList>
                        <CommandEmpty>
                            {isLoading ? <Trans>Loading...</Trans> : <Trans>No sellers found</Trans>}
                        </CommandEmpty>
                        {data?.sellers.items.map(seller => (
                            <CommandItem
                                key={seller.id}
                                onSelect={() => {
                                    props.onChange(seller.id);
                                    setOpen(false);
                                }}
                                className="flex flex-col items-start"
                            >
                                <div className="font-medium">{seller.name}</div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
