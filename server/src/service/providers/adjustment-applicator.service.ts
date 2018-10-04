import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ConfigService } from '../../config/config.service';
import { Order } from '../../entity/order/order.entity';
import { applyAdjustments } from '../helpers/apply-adjustments';

import { AdjustmentSourceService } from './adjustment-source.service';

@Injectable()
export class AdjustmentApplicatorService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private adjustmentSourceService: AdjustmentSourceService,
    ) {}

    /**
     * Applies AdjustmentSources to an order, updating the adjustment arrays of the Order and
     * its OrderItems and updating the prices based on the adjustment actions.
     */
    async applyAdjustments(order: Order): Promise<Order> {
        const sources = await this.adjustmentSourceService.getActiveAdjustmentSources();
        const { adjustmentConditions, adjustmentActions } = this.configService;
        applyAdjustments(order, sources, adjustmentConditions, adjustmentActions);
        await this.connection.manager.save(order.items);
        return await this.connection.manager.save(order);
    }
}
