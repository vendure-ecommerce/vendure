import { RequestContext } from '../../api/common/request-context';
import { TaxCategory, Zone } from '../../entity';
import { TaxCalculationResult } from '../../service/helpers/tax-calculator/tax-calculator';
import { TaxRateService } from '../../service/services/tax-rate.service';

export interface TaxCalculationArgs {
    inputPrice: number;
    taxCategory: TaxCategory;
    activeTaxZone: Zone;
    ctx: RequestContext;
    taxRateService: TaxRateService;
}

/**
 * Defines how taxes are calculated based on the input price, tax zone and current request context.
 */
export interface TaxCalculationStrategy {
    calculate(args: TaxCalculationArgs): TaxCalculationResult;
}
