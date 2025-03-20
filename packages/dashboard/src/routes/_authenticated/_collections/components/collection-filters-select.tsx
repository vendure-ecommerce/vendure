import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { api } from '@/graphql/api.js';
import { ConfigurableOperationDefFragment, ConfigurableOperationFragment } from '@/graphql/fragments.js';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getCollectionFiltersDocument } from '../collections.graphql.js';
import { useServerConfig } from '@/hooks/use-server-config.js';
import { ConfigurableOperationInput } from '@/components/shared/configurable-operation-input.js';

export interface CollectionFiltersSelectProps {
    value: ConfigurableOperationInputType[];
    onChange: (filters: ConfigurableOperationInputType[]) => void;
}

export function CollectionFiltersSelect({ value, onChange }: CollectionFiltersSelectProps) {
    const serverConfig = useServerConfig();
    const { data: filtersData } = useQuery({
        queryKey: ['collectionFilters'],
        queryFn: () => api.query(getCollectionFiltersDocument),
    });

    const filters = filtersData?.collectionFilters;

    const onFilterSelected = (filter: ConfigurableOperationDefFragment) => {
        if (value.find(f => f.code === filter.code)) {
            return;
        }
        onChange([...value, { code: filter.code, arguments: [] }]);
    };

    const onOperationValueChange = (
        filter: ConfigurableOperationInputType,
        newVal: ConfigurableOperationInputType,
    ) => {
        onChange(value.map(f => (f.code === filter.code ? newVal : f)));
    };

    return (
        <div className="flex flex-col gap-2">
            {(value ?? []).map((filter, index) => {
                const filterDef = filters?.find(f => f.code === filter.code);
                if (!filterDef) {
                    return null;
                }
                return (
                    <div key={index} className="flex flex-col gap-2">
                        <ConfigurableOperationInput
                            operationDefinition={filterDef}
                            value={filter}
                            onChange={value => onOperationValueChange(filter, value)}
                        />
                    </div>
                );
            })}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Plus />
                        <Trans context="Add new collection filter">Add condition</Trans>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                    {filters?.map(filter => (
                        <DropdownMenuItem key={filter.code} onClick={() => onFilterSelected?.(filter)}>
                            {filter.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
