/**
 * @description
 * Prisma implementation of the TaxRate ORM adapter.
 * Converts Prisma results to TypeORM TaxRate entities for backward compatibility.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { TaxRatePrismaRepository } from '../repositories/prisma/tax-rate-prisma.repository';

import {
    CreateTaxRateInput,
    ITaxRateOrmAdapter,
    TaxRateListOptions,
    UpdateTaxRateInput,
} from './tax-rate-orm.adapter';

@Injectable()
export class TaxRatePrismaAdapter implements ITaxRateOrmAdapter {
    constructor(private readonly repository: TaxRatePrismaRepository) {}

    async findOne(id: ID, includeRelations: boolean = true): Promise<TaxRate | undefined> {
        const prismaTaxRate = await this.repository.findOne(id, includeRelations);

        if (!prismaTaxRate) {
            return undefined;
        }

        return this.mapToEntity(prismaTaxRate);
    }

    async findAll(options: TaxRateListOptions = {}): Promise<PaginatedList<TaxRate>> {
        const result = await this.repository.findAll({
            skip: options.skip,
            take: options.take,
            filter: options.filter,
            sort: options.sort,
        });

        return {
            items: result.items.map(item => this.mapToEntity(item)),
            totalItems: result.totalItems,
        };
    }

    async findByCategory(categoryId: ID): Promise<TaxRate[]> {
        const prismaTaxRates = await this.repository.findByCategory(categoryId);
        return prismaTaxRates.map(rate => this.mapToEntity(rate));
    }

    async findByZone(zoneId: ID): Promise<TaxRate[]> {
        const prismaTaxRates = await this.repository.findByZone(zoneId);
        return prismaTaxRates.map(rate => this.mapToEntity(rate));
    }

    async findApplicableTaxRate(
        categoryId: ID,
        zoneId: ID,
        customerGroupId?: ID,
    ): Promise<TaxRate | undefined> {
        const prismaTaxRate = await this.repository.findApplicableTaxRate(
            categoryId,
            zoneId,
            customerGroupId,
        );

        if (!prismaTaxRate) {
            return undefined;
        }

        return this.mapToEntity(prismaTaxRate);
    }

    async create(data: CreateTaxRateInput): Promise<TaxRate> {
        const prismaTaxRate = await this.repository.create({
            name: data.name,
            enabled: data.enabled,
            value: data.value,
            categoryId: data.categoryId,
            zoneId: data.zoneId,
            customerGroupId: data.customerGroupId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaTaxRate);
    }

    async update(id: ID, data: UpdateTaxRateInput): Promise<TaxRate> {
        const prismaTaxRate = await this.repository.update(id, {
            name: data.name,
            enabled: data.enabled,
            value: data.value,
            categoryId: data.categoryId,
            zoneId: data.zoneId,
            customerGroupId: data.customerGroupId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaTaxRate);
    }

    async delete(id: ID): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Map Prisma TaxRate to TypeORM TaxRate entity
     * This ensures backward compatibility with existing code
     */
    private mapToEntity(prismaTaxRate: any): TaxRate {
        const taxRate = new TaxRate({
            id: prismaTaxRate.id,
            createdAt: prismaTaxRate.createdAt,
            updatedAt: prismaTaxRate.updatedAt,
            name: prismaTaxRate.name,
            enabled: prismaTaxRate.enabled,
            value: prismaTaxRate.value,
            categoryId: prismaTaxRate.categoryId,
            zoneId: prismaTaxRate.zoneId,
            customerGroupId: prismaTaxRate.customerGroupId,
            customFields: prismaTaxRate.customFields,
        });

        // Map category (if loaded)
        if (prismaTaxRate.category) {
            taxRate.category = prismaTaxRate.category;
        }

        // Map zone (if loaded)
        if (prismaTaxRate.zone) {
            taxRate.zone = prismaTaxRate.zone;
        }

        // Map customer group (if loaded)
        if (prismaTaxRate.customerGroup) {
            taxRate.customerGroup = prismaTaxRate.customerGroup;
        }

        return taxRate;
    }
}
