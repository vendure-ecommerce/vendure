import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateTaxCategoryInput,
    DeletionResponse,
    DeletionResult,
    UpdateTaxCategoryInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { assertFound } from '../../common/utils';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
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

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const taxCategory = await getEntityOrThrow(this.connection, TaxCategory, id);
        const dependentRates = await this.connection
            .getRepository(TaxRate)
            .count({ where: { category: id } });

        if (0 < dependentRates) {
            const message = ctx.translate('error.cannot-remove-tax-category-due-to-tax-rates', {
                name: taxCategory.name,
                count: dependentRates,
            });
            return {
                result: DeletionResult.NOT_DELETED,
                message,
            };
        }

        try {
            await this.connection.getRepository(TaxCategory).remove(taxCategory);
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
}
