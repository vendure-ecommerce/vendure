import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateTaxCategoryInput, UpdateTaxCategoryInput } from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { assertFound } from '../../common/utils';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { I18nError } from '../../i18n/i18n-error';
import { patchEntity } from '../helpers/patch-entity';

@Injectable()
export class TaxCategoryService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<TaxCategory[]> {
        return this.connection.getRepository(TaxCategory).find();
    }

    findOne(taxCategoryId: ID): Promise<TaxCategory | undefined> {
        return this.connection.getRepository(TaxCategory).findOne(taxCategoryId);
    }

    async create(input: CreateTaxCategoryInput): Promise<TaxCategory> {
        const taxCategory = new TaxCategory(input);
        const newTaxCategory = await this.connection.getRepository(TaxCategory).save(taxCategory);
        return assertFound(this.findOne(newTaxCategory.id));
    }

    async update(input: UpdateTaxCategoryInput): Promise<TaxCategory> {
        const taxCategory = await this.findOne(input.id);
        if (!taxCategory) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                entityName: 'TaxCategory',
                id: input.id,
            });
        }
        const updatedTaxCategory = patchEntity(taxCategory, input);
        await this.connection.getRepository(TaxCategory).save(updatedTaxCategory);
        return assertFound(this.findOne(taxCategory.id));
    }
}
