import { Injectable } from '@nestjs/common';
import {
    CreateFacetValueInput,
    CreateFacetValueWithFacetInput,
    DeletionResponse,
    DeletionResult,
    LanguageCode,
    UpdateFacetValueInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Product, ProductVariant } from '../../entity';
import { FacetValueTranslation } from '../../entity/facet-value/facet-value-translation.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class FacetValueService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private configService: ConfigService,
    ) {}

    findAll(lang: LanguageCode): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(FacetValue)
            .find({
                relations: ['facet'],
            })
            .then(facetValues => facetValues.map(facetValue => translateDeep(facetValue, lang, ['facet'])));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Translated<FacetValue> | undefined> {
        return this.connection
            .getRepository(ctx, FacetValue)
            .findOne(id, {
                relations: ['facet'],
            })
            .then(facetValue => facetValue && translateDeep(facetValue, ctx.languageCode, ['facet']));
    }

    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<FacetValue>>> {
        const facetValues = this.connection
            .getRepository(ctx, FacetValue)
            .findByIds(ids, { relations: ['facet'] });
        return facetValues.then(values =>
            values.map(facetValue => translateDeep(facetValue, ctx.languageCode, ['facet'])),
        );
    }

    findByFacetId(ctx: RequestContext, id: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ctx, FacetValue)
            .find({
                where: {
                    facet: { id },
                },
            })
            .then(values => values.map(facetValue => translateDeep(facetValue, ctx.languageCode)));
    }

    async create(
        ctx: RequestContext,
        facet: Facet,
        input: CreateFacetValueInput | CreateFacetValueWithFacetInput,
    ): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.create({
            ctx,
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
            beforeSave: fv => (fv.facet = facet),
        });
        return assertFound(this.findOne(ctx, facetValue.id));
    }

    async update(ctx: RequestContext, input: UpdateFacetValueInput): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.update({
            ctx,
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
        });
        return assertFound(this.findOne(ctx, facetValue.id));
    }

    async delete(ctx: RequestContext, id: ID, force: boolean = false): Promise<DeletionResponse> {
        const { productCount, variantCount } = await this.checkFacetValueUsage(ctx, [id]);

        const isInUse = !!(productCount || variantCount);
        const both = !!(productCount && variantCount) ? 'both' : 'single';
        const i18nVars = { products: productCount, variants: variantCount, both };
        let message = '';
        let result: DeletionResult;

        if (!isInUse) {
            const facetValue = await this.connection.getEntityOrThrow(ctx, FacetValue, id);
            await this.connection.getRepository(ctx, FacetValue).remove(facetValue);
            result = DeletionResult.DELETED;
        } else if (force) {
            const facetValue = await this.connection.getEntityOrThrow(ctx, FacetValue, id);
            await this.connection.getRepository(ctx, FacetValue).remove(facetValue);
            message = ctx.translate('message.facet-value-force-deleted', i18nVars);
            result = DeletionResult.DELETED;
        } else {
            message = ctx.translate('message.facet-value-used', i18nVars);
            result = DeletionResult.NOT_DELETED;
        }

        return {
            result,
            message,
        };
    }

    /**
     * Checks for usage of the given FacetValues in any Products or Variants, and returns the counts.
     */
    async checkFacetValueUsage(
        ctx: RequestContext,
        facetValueIds: ID[],
    ): Promise<{ productCount: number; variantCount: number }> {
        const consumingProducts = await this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.facetValues', 'facetValues')
            .where('facetValues.id IN (:...facetValueIds)', { facetValueIds })
            .getMany();

        const consumingVariants = await this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoinAndSelect('variant.facetValues', 'facetValues')
            .where('facetValues.id IN (:...facetValueIds)', { facetValueIds })
            .getMany();

        return {
            productCount: consumingProducts.length,
            variantCount: consumingVariants.length,
        };
    }
}
