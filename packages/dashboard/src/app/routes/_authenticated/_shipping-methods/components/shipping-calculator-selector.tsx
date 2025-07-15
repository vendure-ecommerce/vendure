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

export const shippingCalculatorsDocument = graphql(
    `
        query GetShippingCalculators {
            shippingCalculators {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface ShippingCalculatorSelectorProps {
    value: ConfigurableOperationInputType | undefined;
    onChange: (value: ConfigurableOperationInputType | undefined) => void;
}

export function ShippingCalculatorSelector({ value, onChange }: Readonly<ShippingCalculatorSelectorProps>) {
    const { data: calculatorsData } = useQuery({
        queryKey: ['shippingCalculators'],
        queryFn: () => api.query(shippingCalculatorsDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const calculators = calculatorsData?.shippingCalculators;

    const onCalculatorSelected = (calculator: ConfigurableOperationDefFragment) => {
        const calculatorDef = calculators?.find(c => c.code === calculator.code);
        if (!calculatorDef) {
            return;
        }
        onChange({
            code: calculator.code,
            arguments: calculatorDef.args.map(arg => ({
                name: arg.name,
                value: arg.defaultValue != null ? arg.defaultValue.toString() : '',
            })),
        });
    };

    const onOperationValueChange = (newVal: ConfigurableOperationInputType) => {
        onChange(newVal);
    };

    const onOperationRemove = () => {
        onChange(undefined);
    };

    const calculatorDef = calculators?.find(c => c.code === value?.code);

    return (
        <div className="flex flex-col gap-2 mt-4">
            {value && calculatorDef && (
                <div className="flex flex-col gap-2">
                    <ConfigurableOperationInput
                        operationDefinition={calculatorDef}
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
                            <Trans context="Add new promotion action">Select Shipping Calculator</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent className="w-96">
                    {calculators?.map(calculator => (
                        <DropdownMenuItem
                            key={calculator.code}
                            onClick={() => onCalculatorSelected(calculator)}
                        >
                            {calculator.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
