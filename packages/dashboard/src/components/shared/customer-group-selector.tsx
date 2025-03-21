import { Button } from '@/components/ui/button.js';
import { Command, CommandItem, CommandList } from '@/components/ui/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const customerGroupsDocument = graphql(`
    query GetCustomerGroups($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                name
            }
        }
    }
`);

export interface CustomerGroup {
    id: string;
    name: string;
}

export interface CustomerGroupSelectorProps {
    onSelect: (value: CustomerGroup) => void;
    readOnly?: boolean;
}

export function CustomerGroupSelector(props: CustomerGroupSelectorProps) {
    const [open, setOpen] = useState(false);

    const { data: groups } = useQuery({
        queryKey: ['customerGroups'],
        queryFn: () =>
            api.query(customerGroupsDocument, {
                options: {
                    sort: { name: 'ASC' },
                },
            }),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" type="button" disabled={props.readOnly} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <Trans>Add customer groups</Trans>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandList>
                        {groups?.customerGroups.items.map(group => (
                            <CommandItem key={group.id} onSelect={() => props.onSelect(group)}>
                                {group.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
