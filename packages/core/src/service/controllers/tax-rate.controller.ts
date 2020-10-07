import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';

import { RequestContext } from '../../api/common/request-context';
import { TaxRateService } from '../services/tax-rate.service';
import { TransactionalConnection } from '../transaction/transactional-connection';
import { TaxRateUpdatedMessage } from '../types/tax-rate-messages';

@Controller()
export class TaxRateController {
    constructor(private connection: TransactionalConnection, private taxRateService: TaxRateService) {}

    /**
     * When a TaxRate is updated on the main process, this will update the activeTaxRates
     * cache on the worker.
     */
    @MessagePattern(TaxRateUpdatedMessage.pattern)
    taxRateUpdated(): Observable<TaxRateUpdatedMessage['response']> {
        return from(this.taxRateService.updateActiveTaxRates(RequestContext.empty()).then(() => true));
    }
}
