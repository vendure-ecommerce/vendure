import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateTaxCategoryInput, UpdateTaxCategoryInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { EntityNotFoundError } from '../../common/error/errors';
import { assertFound } from '../../common/utils';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { patchEntity } from '../helpers/utils/patch-entity';

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
            throw new EntityNotFoundError('TaxCategory', input.id);
        }
        const updatedTaxCategory = patchEntity(taxCategory, input);
        await this.connection.getRepository(TaxCategory).save(updatedTaxCategory, { reload: false });
        return assertFound(this.findOne(taxCategory.id));
    }
}
