import { api } from '@/graphql/api.js';
import { ConfigurableOperationDefFragment, configurableOperationDefFragment } from '@/graphql/fragments.js';
import { useQuery } from '@tanstack/react-query';
import { graphql } from '@/graphql/graphql.js';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select.js';

export const fulfillmentHandlersDocument = graphql(
    `
        query GetFulfillmentHandlers {
            fulfillmentHandlers {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);

interface FulfillmentHandlerSelectorProps {
    value: string | null;
    onChange: (value: string | null) => void;
}

export function FulfillmentHandlerSelector({ value, onChange }: FulfillmentHandlerSelectorProps) {
    const { data: fulfillmentHandlersData } = useQuery({    
        queryKey: ['fulfillmentHandlers'],
        queryFn: () => api.query(fulfillmentHandlersDocument),
        staleTime: 1000 * 60 * 60 * 5,
    });

    const fulfillmentHandlers = fulfillmentHandlersData?.fulfillmentHandlers;

    const onFulfillmentHandlerSelected = (code: string) => {
        const fulfillmentHandler = fulfillmentHandlers?.find(fh => fh.code === code);
        if (!fulfillmentHandler) {
            return;
        }
        onChange(fulfillmentHandler.code);
    };

    return (
        <div>
            <Select onValueChange={onFulfillmentHandlerSelected} value={value ?? undefined}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a fulfillment handler" />
                </SelectTrigger>
                <SelectContent>
                    {fulfillmentHandlers?.map(fulfillmentHandler => (
                        <SelectItem key={fulfillmentHandler.code} value={fulfillmentHandler.code}>
                            {fulfillmentHandler.description}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
