import { ConfigurableOperationInput } from '@/vdb/components/shared/configurable-operation-input.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { api } from '@/vdb/graphql/api.js';
import {
    configurableOperationDefFragment,
    ConfigurableOperationDefFragment,
} from '@/vdb/graphql/fragments.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Plus } from 'lucide-react';

export const promotionConditionsDocument = graphql(
    `
        query GetPromotionConditions {
            promotionConditions {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface PromotionConditionsSelectorProps {
    value: ConfigurableOperationInputType[];
    onChange: (value: ConfigurableOperationInputType[]) => void;
}

export function PromotionConditionsSelector({ value, onChange }: Readonly<PromotionConditionsSelectorProps>) {
    const { data: conditionsData } = useQuery({
        queryKey: ['promotionConditions'],
        queryFn: () => api.query(promotionConditionsDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const conditions = conditionsData?.promotionConditions;

    const onConditionSelected = (condition: ConfigurableOperationDefFragment) => {
        const conditionDef = conditions?.find(c => c.code === condition.code);
        if (!conditionDef) {
            return;
        }
        onChange([
            ...value,
            {
                code: condition.code,
                arguments: conditionDef.args.map(arg => ({
                    name: arg.name,
                    value: arg.defaultValue != null ? arg.defaultValue.toString() : '',
                })),
            },
        ]);
    };

    const onOperationValueChange = (
        condition: ConfigurableOperationInputType,
        newVal: ConfigurableOperationInputType,
    ) => {
        onChange(value.map(c => (c.code === condition.code ? newVal : c)));
    };

    const onOperationRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const hasConditions = value && value.length > 0;

    return (
        <div className="space-y-4">
            {hasConditions && (
                <div className="space-y-3">
                    {value.map((condition, index) => {
                        const conditionDef = conditions?.find(c => c.code === condition.code);
                        if (!conditionDef) {
                            return null;
                        }
                        return (
                            <ConfigurableOperationInput
                                key={index}
                                operationDefinition={conditionDef}
                                value={condition}
                                onChange={value => onOperationValueChange(condition, value)}
                                onRemove={() => onOperationRemove(index)}
                                position={index}
                            />
                        );
                    })}
                </div>
            )}

            <div className={hasConditions ? 'pt-2' : ''}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            <Trans context="Add new promotion condition">Add condition</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="start">
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            Available Conditions
                        </div>
                        {conditions?.map(condition => (
                            <DropdownMenuItem
                                key={condition.code}
                                onClick={() => onConditionSelected(condition)}
                                className="flex flex-col items-start py-3 cursor-pointer"
                            >
                                <div className="font-medium text-sm">{condition.description}</div>
                                <div className="text-xs text-muted-foreground font-mono mt-1">
                                    {condition.code}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
