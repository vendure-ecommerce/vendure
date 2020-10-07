import { Injectable } from '@nestjs/common';
import {
    CreateTaxCategoryInput,
    DeletionResponse,
    DeletionResult,
    UpdateTaxCategoryInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { assertFound } from '../../common/utils';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class TaxCategoryService {
    constructor(private connection: TransactionalConnection) {}

    findAll(ctx: RequestContext): Promise<TaxCategory[]> {
        return this.connection.getRepository(ctx, TaxCategory).find();
    }

    findOne(ctx: RequestContext, taxCategoryId: ID): Promise<TaxCategory | undefined> {
        return this.connection.getRepository(ctx, TaxCategory).findOne(taxCategoryId);
    }

    async create(ctx: RequestContext, input: CreateTaxCategoryInput): Promise<TaxCategory> {
        const taxCategory = new TaxCategory(input);
        const newTaxCategory = await this.connection.getRepository(ctx, TaxCategory).save(taxCategory);
        return assertFound(this.findOne(ctx, newTaxCategory.id));
    }

    async update(ctx: RequestContext, input: UpdateTaxCategoryInput): Promise<TaxCategory> {
        const taxCategory = await this.findOne(ctx, input.id);
        if (!taxCategory) {
            throw new EntityNotFoundError('TaxCategory', input.id);
        }
        const updatedTaxCategory = patchEntity(taxCategory, input);
        await this.connection.getRepository(ctx, TaxCategory).save(updatedTaxCategory, { reload: false });
        return assertFound(this.findOne(ctx, taxCategory.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const taxCategory = await this.connection.getEntityOrThrow(ctx, TaxCategory, id);
        const dependentRates = await this.connection
            .getRepository(ctx, TaxRate)
            .count({ where: { category: id } });

        if (0 < dependentRates) {
            const message = ctx.translate('message.cannot-remove-tax-category-due-to-tax-rates', {
                name: taxCategory.name,
                count: dependentRates,
            });
            return {
                result: DeletionResult.NOT_DELETED,
                message,
            };
        }

        try {
            await this.connection.getRepository(ctx, TaxCategory).remove(taxCategory);
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
