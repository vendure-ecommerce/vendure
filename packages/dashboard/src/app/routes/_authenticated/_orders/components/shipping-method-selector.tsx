import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Money } from '@/components/data-display/money.js';
import { Trans } from '@/lib/trans.js';
import { draftOrderEligibleShippingMethodsDocument } from '../orders.graphql.js';
import { ResultOf } from '@/graphql/graphql.js';

type ShippingMethodQuote = ResultOf<typeof draftOrderEligibleShippingMethodsDocument>['eligibleShippingMethodsForDraftOrder'][number];

interface ShippingMethodSelectorProps {
    eligibleShippingMethods: ShippingMethodQuote[];
    selectedShippingMethodId?: string;
    currencyCode: string;
    onSelect: (shippingMethodId: string) => void;
}

export function ShippingMethodSelector({ 
    eligibleShippingMethods, 
    selectedShippingMethodId,
    currencyCode,
    onSelect 
}: ShippingMethodSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleShippingMethods?.length ? eligibleShippingMethods.map(method => (
                <Card 
                    key={method.id} 
                    className={`cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent ${
                        selectedShippingMethodId === method.id 
                            ? 'border-primary' 
                            : ''
                    }`}
                    onClick={() => onSelect(method.id)}
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="">
                            <Trans>{method.name}</Trans>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {method.description && (
                                <p className="text-sm text-muted-foreground">
                                    <Trans>{method.description}</Trans>
                                </p>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    <Trans>Price</Trans>
                                </span>
                                <Money 
                                    value={method.priceWithTax} 
                                    currencyCode={currencyCode} 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )) : (
                <div className="col-span-full text-center text-muted-foreground">
                    <Trans>No shipping methods available</Trans>
                </div>
            )}
        </div>
    );
} 