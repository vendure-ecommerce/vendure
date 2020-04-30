import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { TaxCategory, Zone } from '../../entity';
import { TaxCalculationResult } from '../../service/helpers/tax-calculator/tax-calculator';
import { TaxRateService } from '../../service/services/tax-rate.service';

/**
 * @description
 * Defines how taxes are calculated based on the input price, tax zone and current request context.
 *
 * @docsCategory tax
 */
export interface TaxCalculationStrategy extends InjectableStrategy {
    calculate(args: TaxCalculationArgs): TaxCalculationResult;
}

/**
 * @description
 * The arguments passed the the `calculate` method of the configured {@link TaxCalculationStrategy}.
 *
 * @docsCategory tax
 * @docsPage Tax Types
 */
export interface TaxCalculationArgs {
    inputPrice: number;
    taxCategory: TaxCategory;
    activeTaxZone: Zone;
    ctx: RequestContext;
    taxRateService: TaxRateService;
}
