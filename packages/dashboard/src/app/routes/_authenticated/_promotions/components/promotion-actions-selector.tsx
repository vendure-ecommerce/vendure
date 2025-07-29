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

export function PromotionActionsSelector({ value, onChange }: Readonly<PromotionActionsSelectorProps>) {
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

    const hasActions = value && value.length > 0;

    return (
        <div className="space-y-4">
            {hasActions && (
                <div className="space-y-3">
                    {value.map((action, index) => {
                        const actionDef = actions?.find(a => a.code === action.code);
                        if (!actionDef) {
                            return null;
                        }
                        return (
                            <ConfigurableOperationInput
                                key={index}
                                operationDefinition={actionDef}
                                value={action}
                                onChange={value => onOperationValueChange(action, value)}
                                onRemove={() => onOperationRemove(index)}
                                position={index}
                            />
                        );
                    })}
                </div>
            )}

            <div className={hasActions ? 'pt-2' : ''}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            <Trans context="Add new promotion action">Add action</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="start">
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            Available Actions
                        </div>
                        {actions?.map(action => (
                            <DropdownMenuItem
                                key={action.code}
                                onClick={() => onActionSelected(action)}
                                className="flex flex-col items-start py-3 cursor-pointer"
                            >
                                <div className="font-medium text-sm">{action.description}</div>
                                <div className="text-xs text-muted-foreground font-mono mt-1">
                                    {action.code}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
