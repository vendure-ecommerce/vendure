import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateTaxRateInput,
    DeletionResponse,
    DeletionResult,
    UpdateTaxRateInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { EventBus } from '../../event-bus/event-bus';
import { TaxRateModificationEvent } from '../../event-bus/events/tax-rate-modification-event';
import { WorkerService } from '../../worker/worker.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TaxRateUpdatedMessage } from '../types/tax-rate-messages';

export class TaxRateService {
    /**
     * We cache all active TaxRates to avoid hitting the DB many times
     * per request.
     */
    private activeTaxRates: TaxRate[] = [];
    private readonly defaultTaxRate = new TaxRate({
        value: 0,
        enabled: true,
        name: 'No configured tax rate',
        id: '0',
    });

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
        private workerService: WorkerService,
    ) {}

    async initTaxRates() {
        return this.updateActiveTaxRates();
    }

    findAll(options?: ListQueryOptions<TaxRate>): Promise<PaginatedList<TaxRate>> {
        return this.listQueryBuilder
            .build(TaxRate, options, { relations: ['category', 'zone', 'customerGroup'] })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(taxRateId: ID): Promise<TaxRate | undefined> {
        return this.connection.manager.findOne(TaxRate, taxRateId, {
            relations: ['category', 'zone', 'customerGroup'],
        });
    }

    async create(ctx: RequestContext, input: CreateTaxRateInput): Promise<TaxRate> {
        const taxRate = new TaxRate(input);
        taxRate.category = await getEntityOrThrow(this.connection, TaxCategory, input.categoryId);
        taxRate.zone = await getEntityOrThrow(this.connection, Zone, input.zoneId);
        if (input.customerGroupId) {
            taxRate.customerGroup = await getEntityOrThrow(
                this.connection,
                CustomerGroup,
                input.customerGroupId,
            );
        }
        const newTaxRate = await this.connection.getRepository(TaxRate).save(taxRate);
        await this.updateActiveTaxRates();
        await this.workerService.send(new TaxRateUpdatedMessage(newTaxRate.id)).toPromise();
        this.eventBus.publish(new TaxRateModificationEvent(ctx, newTaxRate));
        return assertFound(this.findOne(newTaxRate.id));
    }

    async update(ctx: RequestContext, input: UpdateTaxRateInput): Promise<TaxRate> {
        const taxRate = await this.findOne(input.id);
        if (!taxRate) {
            throw new EntityNotFoundError('TaxRate', input.id);
        }
        const updatedTaxRate = patchEntity(taxRate, input);
        if (input.categoryId) {
            updatedTaxRate.category = await getEntityOrThrow(this.connection, TaxCategory, input.categoryId);
        }
        if (input.zoneId) {
            updatedTaxRate.zone = await getEntityOrThrow(this.connection, Zone, input.zoneId);
        }
        if (input.customerGroupId) {
            updatedTaxRate.customerGroup = await getEntityOrThrow(
                this.connection,
                CustomerGroup,
                input.customerGroupId,
            );
        }
        await this.connection.getRepository(TaxRate).save(updatedTaxRate, { reload: false });
        await this.updateActiveTaxRates();
        await this.workerService.send(new TaxRateUpdatedMessage(updatedTaxRate.id)).toPromise();
        this.eventBus.publish(new TaxRateModificationEvent(ctx, updatedTaxRate));
        return assertFound(this.findOne(taxRate.id));
    }

    async delete(id: ID): Promise<DeletionResponse> {
        const taxRate = await getEntityOrThrow(this.connection, TaxRate, id);
        try {
            await this.connection.getRepository(TaxRate).remove(taxRate);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.toString(),
            };
        }
    }

    getActiveTaxRates(): TaxRate[] {
        return this.activeTaxRates;
    }

    getApplicableTaxRate(zone: Zone, taxCategory: TaxCategory): TaxRate {
        const rate = this.getActiveTaxRates().find(r => r.test(zone, taxCategory));
        return rate || this.defaultTaxRate;
    }

    async updateActiveTaxRates() {
        this.activeTaxRates = await this.connection.getRepository(TaxRate).find({
            relations: ['category', 'zone', 'customerGroup'],
            where: {
                enabled: true,
            },
        });
    }
}
