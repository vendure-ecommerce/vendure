import { Injectable } from '@nestjs/common';

import { Channel } from '../../entity/channel/channel.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';

import { TaxRateService } from './tax-rate.service';

export interface TaxCalculationResult {
    price: number;
    priceIncludesTax: boolean;
    priceWithoutTax: number;
    priceWithTax: number;
}

@Injectable()
export class TaxCalculatorService {
    constructor(private taxRateService: TaxRateService) {}

    calculate(
        inputPrice: number,
        taxRate: TaxRate,
        channel: Channel,
        zone: Zone,
        taxCategory: TaxCategory,
    ): TaxCalculationResult {
        let price = 0;
        let priceWithTax = 0;
        let priceWithoutTax = 0;
        let priceIncludesTax = false;

        if (channel.pricesIncludeTax) {
            const isDefaultZone = zone.id === channel.defaultTaxZone.id;
            const taxRateForDefaultZone = this.taxRateService.getApplicableTaxRate(
                channel.defaultTaxZone,
                taxCategory,
            );

            priceWithoutTax = taxRateForDefaultZone.netPriceOf(inputPrice);
            if (isDefaultZone) {
                priceIncludesTax = true;
                price = inputPrice;
                priceWithTax = inputPrice;
            } else {
                price = priceWithoutTax;
                priceWithTax = taxRate.grossPriceOf(priceWithoutTax);
            }
        } else {
            const netPrice = inputPrice;
            price = netPrice;
            priceWithTax = netPrice + taxRate.taxPayableOn(netPrice);
        }

        return {
            price,
            priceIncludesTax,
            priceWithTax,
            priceWithoutTax,
        };
    }
}
