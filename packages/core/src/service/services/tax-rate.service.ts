import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
    CreateTaxRateInput,
    DeletionResponse,
    DeletionResult,
    UpdateTaxRateInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { RequestContextCacheService } from '../../cache';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { EventBus } from '../../event-bus/event-bus';
import { TaxRateModificationEvent } from '../../event-bus/events/tax-rate-modification-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

const activeTaxRatesKey = 'active-tax-rates';

@Injectable()
export class TaxRateService {
    private readonly defaultTaxRate = new TaxRate({
        value: 0,
        enabled: true,
        name: 'No configured tax rate',
        id: '0',
    });

    constructor(
        private connection: TransactionalConnection,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder,
        private cacheService: RequestContextCacheService,
    ) {}

    findAll(ctx: RequestContext, options?: ListQueryOptions<TaxRate>): Promise<PaginatedList<TaxRate>> {
        return this.listQueryBuilder
            .build(TaxRate, options, { relations: ['category', 'zone', 'customerGroup'], ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, taxRateId: ID): Promise<TaxRate | undefined> {
        return this.connection.getRepository(ctx, TaxRate).findOne(taxRateId, {
            relations: ['category', 'zone', 'customerGroup'],
        });
    }

    async create(ctx: RequestContext, input: CreateTaxRateInput): Promise<TaxRate> {
        const taxRate = new TaxRate(input);
        taxRate.category = await this.connection.getEntityOrThrow(ctx, TaxCategory, input.categoryId);
        taxRate.zone = await this.connection.getEntityOrThrow(ctx, Zone, input.zoneId);
        if (input.customerGroupId) {
            taxRate.customerGroup = await this.connection.getEntityOrThrow(
                ctx,
                CustomerGroup,
                input.customerGroupId,
            );
        }
        const newTaxRate = await this.connection.getRepository(ctx, TaxRate).save(taxRate);
        await this.updateActiveTaxRates(ctx);
        this.eventBus.publish(new TaxRateModificationEvent(ctx, newTaxRate));
        return assertFound(this.findOne(ctx, newTaxRate.id));
    }

    async update(ctx: RequestContext, input: UpdateTaxRateInput): Promise<TaxRate> {
        const taxRate = await this.findOne(ctx, input.id);
        if (!taxRate) {
            throw new EntityNotFoundError('TaxRate', input.id);
        }
        const updatedTaxRate = patchEntity(taxRate, input);
        if (input.categoryId) {
            updatedTaxRate.category = await this.connection.getEntityOrThrow(
                ctx,
                TaxCategory,
                input.categoryId,
            );
        }
        if (input.zoneId) {
            updatedTaxRate.zone = await this.connection.getEntityOrThrow(ctx, Zone, input.zoneId);
        }
        if (input.customerGroupId) {
            updatedTaxRate.customerGroup = await this.connection.getEntityOrThrow(
                ctx,
                CustomerGroup,
                input.customerGroupId,
            );
        }
        await this.connection.getRepository(ctx, TaxRate).save(updatedTaxRate, { reload: false });
        await this.updateActiveTaxRates(ctx);

        // Commit the transaction so that the worker process can access the updated
        // TaxRate when updating its own tax rate cache.
        await this.connection.commitOpenTransaction(ctx);

        this.eventBus.publish(new TaxRateModificationEvent(ctx, updatedTaxRate));
        return assertFound(this.findOne(ctx, taxRate.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const taxRate = await this.connection.getEntityOrThrow(ctx, TaxRate, id);
        try {
            await this.connection.getRepository(ctx, TaxRate).remove(taxRate);
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

    async getApplicableTaxRate(ctx: RequestContext, zone: Zone, taxCategory: TaxCategory): Promise<TaxRate> {
        const rate = (await this.getActiveTaxRates(ctx)).find(r => r.test(zone, taxCategory));
        return rate || this.defaultTaxRate;
    }

    async getActiveTaxRates(ctx: RequestContext): Promise<TaxRate[]> {
        return this.cacheService.get(ctx, activeTaxRatesKey, () => this.findActiveTaxRates(ctx));
    }

    async updateActiveTaxRates(ctx: RequestContext) {
        this.cacheService.set(ctx, activeTaxRatesKey, await this.findActiveTaxRates(ctx));
    }

    private async findActiveTaxRates(ctx: RequestContext): Promise<TaxRate[]> {
        return await this.connection.getRepository(ctx, TaxRate).find({
            relations: ['category', 'zone', 'customerGroup'],
            where: {
                enabled: true,
            },
        });
    }
}
