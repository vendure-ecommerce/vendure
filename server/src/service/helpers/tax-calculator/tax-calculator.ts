import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { idsAreEqual } from '../../../common/utils';
import { Channel } from '../../../entity/channel/channel.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../../entity/zone/zone.entity';

import { TaxRateService } from '../../services/tax-rate.service';

export interface TaxCalculationResult {
    price: number;
    priceIncludesTax: boolean;
    priceWithoutTax: number;
    priceWithTax: number;
}

@Injectable()
export class TaxCalculator {
    constructor(private taxRateService: TaxRateService) {}

    /**
     * Given a price and TacxCategory, this method calculates the applicable tax rate and returns the adjusted
     * price along with other contextual information.
     */
    calculate(inputPrice: number, taxCategory: TaxCategory, ctx: RequestContext): TaxCalculationResult {
        let price = 0;
        let priceWithTax = 0;
        let priceWithoutTax = 0;
        let priceIncludesTax = false;
        const taxRate = this.taxRateService.getApplicableTaxRate(ctx.activeTaxZone, taxCategory);

        if (ctx.channel.pricesIncludeTax) {
            const isDefaultZone = idsAreEqual(ctx.activeTaxZone.id, ctx.channel.defaultTaxZone.id);
            const taxRateForDefaultZone = this.taxRateService.getApplicableTaxRate(
                ctx.channel.defaultTaxZone,
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
            priceWithoutTax = netPrice;
        }

        return {
            price,
            priceIncludesTax,
            priceWithTax,
            priceWithoutTax,
        };
    }
}
