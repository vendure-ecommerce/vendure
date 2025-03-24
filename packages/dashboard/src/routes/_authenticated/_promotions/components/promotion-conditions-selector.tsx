import { graphql } from '@/graphql/graphql.js';
import { configurableOperationDefFragment, ConfigurableOperationDefFragment } from '@/graphql/fragments.js';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { Separator } from '@/components/ui/separator.js';
import { Plus } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { ConfigurableOperationInput } from '@/components/shared/configurable-operation-input.js';
import { api } from '@/graphql/api.js';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';

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

export function PromotionConditionsSelector({ value, onChange }: PromotionConditionsSelectorProps) {
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

    return (
        <div className="flex flex-col gap-2 mt-4">
            {(value ?? []).map((condition, index) => {
                const conditionDef = conditions?.find(c => c.code === condition.code);
                if (!conditionDef) {
                    return null;
                }
                return (
                    <div key={index} className="flex flex-col gap-2">
                        <ConfigurableOperationInput
                            operationDefinition={conditionDef}
                            value={condition}
                            onChange={value => onOperationValueChange(condition, value)}
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
                        <Trans context="Add new promotion condition">Add condition</Trans>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                    {conditions?.map(condition => (
                        <DropdownMenuItem key={condition.code} onClick={() => onConditionSelected(condition)}>
                            {condition.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
