import { ConfigurableOperationInput } from '@/vdb/components/shared/configurable-operation-input.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { Separator } from '@/vdb/components/ui/separator.js';
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
