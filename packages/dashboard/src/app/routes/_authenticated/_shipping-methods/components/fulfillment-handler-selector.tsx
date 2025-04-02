import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { api } from '@/graphql/api.js';
import { configurableOperationDefFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';

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
    value: string | undefined;
    onChange: (value: string | undefined) => void;
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
