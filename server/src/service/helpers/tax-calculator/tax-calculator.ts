import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { idsAreEqual } from '../../../common/utils';
import { Channel } from '../../../entity/channel/channel.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../../entity/zone/zone.entity';

import { ConfigService } from '../../../config/config.service';
import { TaxRateService } from '../../services/tax-rate.service';

export interface TaxCalculationResult {
    price: number;
    priceIncludesTax: boolean;
    priceWithoutTax: number;
    priceWithTax: number;
}

@Injectable()
export class TaxCalculator {
    constructor(private configService: ConfigService, private taxRateService: TaxRateService) {}

    /**
     * Given a price and TacxCategory, this method calculates the applicable tax rate and returns the adjusted
     * price along with other contextual information.
     */
    calculate(
        inputPrice: number,
        taxCategory: TaxCategory,
        activeTaxZone: Zone,
        ctx: RequestContext,
    ): TaxCalculationResult {
        const { taxCalculationStrategy } = this.configService.taxOptions;
        return taxCalculationStrategy.calculate({
            activeTaxZone,
            taxRateService: this.taxRateService,
            taxCategory,
            ctx,
            inputPrice,
        });
    }
}
