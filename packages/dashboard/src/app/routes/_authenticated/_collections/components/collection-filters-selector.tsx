import { ConfigurableOperationInput } from '@/vdb/components/shared/configurable-operation-input.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Plus } from 'lucide-react';
import { getCollectionFiltersQueryOptions } from '../collections.graphql.js';

export interface CollectionFiltersSelectorProps {
    value: ConfigurableOperationInputType[];
    onChange: (filters: ConfigurableOperationInputType[]) => void;
}

export function CollectionFiltersSelector({ value, onChange }: Readonly<CollectionFiltersSelectorProps>) {
    const { data: filtersData } = useQuery(getCollectionFiltersQueryOptions);

    const filters = filtersData?.collectionFilters;

    const onFilterSelected = (filter: ConfigurableOperationDefFragment) => {
        const filterDef = filters?.find(f => f.code === filter.code);
        if (!filterDef) {
            return;
        }
        onChange([
            ...value,
            {
                code: filter.code,
                arguments: filterDef.args.map(arg => ({
                    name: arg.name,
                    value: arg.defaultValue != null ? arg.defaultValue.toString() : '',
                })),
            },
        ]);
    };

    const onOperationValueChange = (
        filter: ConfigurableOperationInputType,
        newVal: ConfigurableOperationInputType,
    ) => {
        onChange(value.map(f => (f.code === filter.code ? newVal : f)));
    };

    const onOperationRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
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
                            onRemove={() => onOperationRemove(index)}
                        />
                        <Separator className="my-2" />
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
                        <DropdownMenuItem key={filter.code} onClick={() => onFilterSelected(filter)}>
                            {filter.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
