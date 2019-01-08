import { OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CreateTaxRateInput, UpdateTaxRateInput } from '../../../../shared/generated-types';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

export class TaxRateService implements OnModuleInit {
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
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async onModuleInit() {
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

    async create(input: CreateTaxRateInput): Promise<TaxRate> {
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
        return assertFound(this.findOne(newTaxRate.id));
    }

    async update(input: UpdateTaxRateInput): Promise<TaxRate> {
        const taxRate = await this.findOne(input.id);
        if (!taxRate) {
            throw new EntityNotFoundError('TaxRate', input.id);
        }
        const updatedTaxRate = patchEntity(taxRate, input);
        if (input.categoryId) {
            updatedTaxRate.category = await getEntityOrThrow(this.connection, TaxCategory, input.categoryId);
        }
        if (input.zoneId) {
            updatedTaxRate.category = await getEntityOrThrow(this.connection, Zone, input.zoneId);
        }
        if (input.customerGroupId) {
            updatedTaxRate.customerGroup = await getEntityOrThrow(
                this.connection,
                CustomerGroup,
                input.customerGroupId,
            );
        }
        await this.connection.getRepository(TaxRate).save(updatedTaxRate);
        await this.updateActiveTaxRates();
        return assertFound(this.findOne(taxRate.id));
    }

    getActiveTaxRates(): TaxRate[] {
        return this.activeTaxRates;
    }

    getApplicableTaxRate(zone: Zone, taxCategory: TaxCategory): TaxRate {
        const rate = this.getActiveTaxRates().find(r => r.test(zone, taxCategory));
        return rate || this.defaultTaxRate;
    }

    private async updateActiveTaxRates() {
        this.activeTaxRates = await this.connection.getRepository(TaxRate).find({
            relations: ['category', 'zone', 'customerGroup'],
            where: {
                enabled: true,
            },
        });
    }
}
