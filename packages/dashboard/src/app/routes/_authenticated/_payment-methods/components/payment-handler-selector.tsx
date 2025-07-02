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

export const paymentHandlersDocument = graphql(
    `
        query GetPaymentHandlers {
            paymentMethodHandlers {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface PaymentHandlerSelectorProps {
    value: ConfigurableOperationInputType | undefined;
    onChange: (value: ConfigurableOperationInputType | undefined) => void;
}

export function PaymentHandlerSelector({ value, onChange }: Readonly<PaymentHandlerSelectorProps>) {
    const { data: handlersData } = useQuery({
        queryKey: ['paymentMethodHandlers'],
        queryFn: () => api.query(paymentHandlersDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const handlers = handlersData?.paymentMethodHandlers;

    const onHandlerSelected = (handler: ConfigurableOperationDefFragment) => {
        const handlerDef = handlers?.find(h => h.code === handler.code);
        if (!handlerDef) {
            return;
        }
        onChange({
            code: handler.code,
            arguments: handlerDef.args.map(arg => ({
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

    const handlerDef = handlers?.find(h => h.code === value?.code);

    return (
        <div className="flex flex-col gap-2 mt-4">
            {value && handlerDef && (
                <div className="flex flex-col gap-2">
                    <ConfigurableOperationInput
                        operationDefinition={handlerDef}
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
                            <Trans>Select Payment Handler</Trans>
                        </Button>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent className="w-96">
                    {handlers?.map(handler => (
                        <DropdownMenuItem key={handler.code} onClick={() => onHandlerSelected(handler)}>
                            {handler.description}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
