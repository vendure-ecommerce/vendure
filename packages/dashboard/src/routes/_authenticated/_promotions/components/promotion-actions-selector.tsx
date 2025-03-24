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

export const promotionActionsDocument = graphql(
    `
        query GetPromotionActions {
            promotionActions {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface PromotionActionsSelectorProps {
    value: ConfigurableOperationInputType[];
    onChange: (value: ConfigurableOperationInputType[]) => void;
}

export function PromotionActionsSelector({ value, onChange }: PromotionActionsSelectorProps) {
    const { data: actionsData } = useQuery({
        queryKey: ['promotionActions'],
        queryFn: () => api.query(promotionActionsDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const actions = actionsData?.promotionActions;

    const onActionSelected = (action: ConfigurableOperationDefFragment) => {
        const actionDef = actions?.find(a => a.code === action.code);
        if (!actionDef) {
            return;
        }
        onChange([
            ...value,
            {
                code: action.code,
                arguments: actionDef.args.map(arg => ({
                    name: arg.name,
                    value: arg.defaultValue != null ? arg.defaultValue.toString() : '',
                })),
            },
        ]);
    };

    const onOperationValueChange = (
        action: ConfigurableOperationInputType,
        newVal: ConfigurableOperationInputType,
    ) => {
        onChange(value.map(a => (a.code === action.code ? newVal : a)));
    };

    const onOperationRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2 mt-4">
            {(value ?? []).map((action, index) => {
                const actionDef = actions?.find(a => a.code === action.code);
                if (!actionDef) {
                    return null;
                }
                return (
                    <div key={index} className="flex flex-col gap-2">
                        <ConfigurableOperationInput
                            operationDefinition={actionDef}
                            value={action}
                            onChange={value => onOperationValueChange(action, value)}
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
                        <Trans context="Add new promotion action">Add action</Trans>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                    {actions?.map(action => (
                        <DropdownMenuItem key={action.code} onClick={() => onActionSelected(action)}>
                            {action.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
