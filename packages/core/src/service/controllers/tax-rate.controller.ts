import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Connection } from 'typeorm';

import { TaxRateService } from '../services/tax-rate.service';
import { TaxRateUpdatedMessage } from '../types/tax-rate-messages';

@Controller()
export class TaxRateController {
    constructor(@InjectConnection() private connection: Connection, private taxRateService: TaxRateService) {}

    /**
     * When a TaxRate is updated on the main process, this will update the activeTaxRates
     * cache on the worker.
     */
    @MessagePattern(TaxRateUpdatedMessage.pattern)
    taxRateUpdated(): Observable<TaxRateUpdatedMessage['response']> {
        return from(this.taxRateService.updateActiveTaxRates().then(() => true));
    }
}
