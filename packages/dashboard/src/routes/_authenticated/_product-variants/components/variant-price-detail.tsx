import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDataService } from '@/framework/data-service/use-data-service.js';
import { Trans } from '@lingui/react/macro';
import { graphql } from '@/graphql/graphql.js';
import { api } from '@/graphql/api.js';
import { useChannel } from '@/hooks/use-channel.js';
import { Money } from '@/components/data-display/money.js';

const taxRatesDocument = graphql(`
    query TaxRates($options: TaxRateListOptions) {
        taxRates(options: $options) {
            items {
                id
                value
                zone {
                    id
                }
                category {
                    id
                }
            }
        }
    }
`);
interface VariantPriceDetailProps {
    priceIncludesTax: boolean;
    price: number;
    currencyCode: string;
    taxCategoryId: string;
}

export function VariantPriceDetail({
    priceIncludesTax,
    price,
    currencyCode,
    taxCategoryId,
}: VariantPriceDetailProps) {
    const { activeChannel } = useChannel();
    const [taxRate, setTaxRate] = useState(0);
    const [grossPrice, setGrossPrice] = useState(0);

    // Fetch tax rates
    const { data: taxRatesData } = useQuery({
        queryKey: ['taxRates'],
        queryFn: () => api.query(taxRatesDocument, { options: { take: 999, skip: 0 } }),
    });

    useEffect(() => {
        if (!taxRatesData?.taxRates.items || !activeChannel) {
            return;
        }

        const defaultTaxZone = activeChannel.defaultTaxZone?.id;
        if (!defaultTaxZone) {
            setTaxRate(0);
            return;
        }

        const applicableRate = taxRatesData.taxRates.items.find(
            taxRate => taxRate.zone.id === defaultTaxZone && taxRate.category.id === taxCategoryId,
        );

        if (!applicableRate) {
            setTaxRate(0);
            return;
        }

        setTaxRate(applicableRate.value);
    }, [taxRatesData, activeChannel, taxCategoryId]);

    useEffect(() => {
        setGrossPrice(Math.round(price * ((100 + taxRate) / 100)));
    }, [price, taxRate]);

    return (
        <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
                <Trans>Tax rate: {taxRate}%</Trans>
            </div>
            <div className="text-sm">
                <Trans>
                    Gross price: <Money value={grossPrice} currency={currencyCode} />
                </Trans>
            </div>
        </div>
    );
}
