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
import { Trans } from '@/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Plus } from 'lucide-react';

export const paymentEligibilityCheckersDocument = graphql(
    `
        query GetPaymentEligibilityCheckers {
            paymentMethodEligibilityCheckers {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface PaymentEligibilityCheckerSelectorProps {
    value: ConfigurableOperationInputType | undefined;
    onChange: (value: ConfigurableOperationInputType | undefined) => void;
}

export function PaymentEligibilityCheckerSelector({
    value,
    onChange,
}: PaymentEligibilityCheckerSelectorProps) {
    const { data: checkersData } = useQuery({
        queryKey: ['paymentMethodEligibilityCheckers'],
        queryFn: () => api.query(paymentEligibilityCheckersDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const checkers = checkersData?.paymentMethodEligibilityCheckers;

    const onCheckerSelected = (checker: ConfigurableOperationDefFragment) => {
        const checkerDef = checkers?.find(c => c.code === checker.code);
        if (!checkerDef) {
            return;
        }
        onChange({
            code: checker.code,
            arguments: checkerDef.args.map(arg => ({
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
                {!value?.code && (
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Plus />
                            <Trans>Select Payment Eligibility Checker</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent className="w-96">
                    {checkers?.length ? (
                        checkers?.map(checker => (
                            <DropdownMenuItem key={checker.code} onClick={() => onCheckerSelected(checker)}>
                                {checker.description}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>No checkers found</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
