import { ConfigurableOperationInput } from '@/components/shared/configurable-operation-input.js';
import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { api } from '@/graphql/api.js';
import { configurableOperationDefFragment, ConfigurableOperationDefFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Plus } from 'lucide-react';

export const shippingEligibilityCheckersDocument = graphql(
    `
        query GetShippingEligibilityCheckers {
            shippingEligibilityCheckers {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface ShippingEligibilityCheckerSelectorProps {
    value: ConfigurableOperationInputType | null;
    onChange: (value: ConfigurableOperationInputType | null) => void;
}

export function ShippingEligibilityCheckerSelector({ value, onChange }: ShippingEligibilityCheckerSelectorProps) {
    const { data: checkersData } = useQuery({
        queryKey: ['shippingEligibilityCheckers'],
        queryFn: () => api.query(shippingEligibilityCheckersDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const checkers = checkersData?.shippingEligibilityCheckers;

    const onCheckerSelected = (checker: ConfigurableOperationDefFragment) => {
        const checkerDef = checkers?.find(c => c.code === checker.code);
        if (!checkerDef) {
            return;
        }
        onChange(
            {
                code: checker.code,
                arguments: checkerDef.args.map(arg => ({
                    name: arg.name,
                    value: arg.defaultValue != null ? arg.defaultValue.toString() : '',
                })),
            },
        );
    };

    const onOperationValueChange = (
        newVal: ConfigurableOperationInputType,
    ) => {
        onChange(newVal);
    };

    const onOperationRemove = () => {
        onChange(null);
    };

    const checkerDef = checkers?.find(c => c.code === value?.code);

    return (
        <div className="flex flex-col gap-2 mt-4">
            {value && checkerDef && (
                <div className="flex flex-col gap-2">
                    <ConfigurableOperationInput
                        operationDefinition={checkerDef}
                        value={value}
                        onChange={value => onOperationValueChange(value)}
                        onRemove={() => onOperationRemove()}
                    />
                </div>
            )}
            <DropdownMenu>
                {!value && (
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Plus />
                            <Trans context="Add new promotion action">Select Shipping Eligibility Checker</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent className="w-96">
                    {checkers?.map(checker => (
                        <DropdownMenuItem key={checker.code} onClick={() => onCheckerSelected(checker)}>
                            {checker.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
