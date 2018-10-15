import { InjectConnection } from '@nestjs/typeorm';
import { CreateTaxRateInput, UpdateTaxRateInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { patchEntity } from '../helpers/patch-entity';

export class TaxRateService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(options?: ListQueryOptions<TaxRate>): Promise<PaginatedList<TaxRate>> {
        return buildListQuery(this.connection, TaxRate, options, ['category', 'zone', 'customerGroup'])
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
        taxRate.category = await this.getTaxCategoryOrThrow(input.categoryId);
        taxRate.zone = await this.getZoneOrThrow(input.zoneId);
        if (input.customerGroupId) {
            taxRate.customerGroup = await this.getCustomerGroupOrThrow(input.customerGroupId);
        }
        const newTaxRate = await this.connection.getRepository(TaxRate).save(taxRate);
        return assertFound(this.findOne(newTaxRate.id));
    }

    async update(input: UpdateTaxRateInput): Promise<TaxRate> {
        const taxRate = await this.findOne(input.id);
        if (!taxRate) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'TaxRate',
                id: input.id,
            });
        }
        const updatedTaxRate = patchEntity(taxRate, input);
        if (input.categoryId) {
            taxRate.category = await this.getTaxCategoryOrThrow(input.categoryId);
        }
        if (input.zoneId) {
            taxRate.category = await this.getZoneOrThrow(input.zoneId);
        }
        if (input.customerGroupId) {
            taxRate.customerGroup = await this.getCustomerGroupOrThrow(input.customerGroupId);
        }
        await this.connection.getRepository(TaxRate).save(updatedTaxRate);
        return assertFound(this.findOne(taxRate.id));
    }

    private async getTaxCategoryOrThrow(id: ID): Promise<TaxCategory> {
        const taxCategory = await this.connection.getRepository(TaxCategory).findOne(id);
        if (!taxCategory) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'TaxCategory',
                id,
            });
        }
        return taxCategory;
    }

    private async getZoneOrThrow(id: ID): Promise<Zone> {
        const zone = await this.connection.getRepository(Zone).findOne(id);
        if (!zone) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'Zone',
                id,
            });
        }
        return zone;
    }

    private async getCustomerGroupOrThrow(id: ID): Promise<CustomerGroup> {
        const group = await this.connection.getRepository(CustomerGroup).findOne(id);
        if (!group) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'CustomerGroup',
                id,
            });
        }
        return group;
    }
}
