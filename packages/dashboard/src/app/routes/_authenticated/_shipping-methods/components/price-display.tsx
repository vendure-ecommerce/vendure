import { Money } from '@/vdb/components/data-display/money.js';
import { Trans } from '@/vdb/lib/trans.js';
import React from 'react';

export function PriceDisplay({
    price,
    priceWithTax,
    currencyCode,
}: {
    price: number;
    priceWithTax: number;
    currencyCode: string;
}) {
    return (
        <div className="text-right">
            <Money value={priceWithTax} currency={currencyCode} />
            <div className="text-xs text-muted-foreground">
                <Trans>ex. tax:</Trans> <Money value={price} currency={currencyCode} />
            </div>
        </div>
    );
}
