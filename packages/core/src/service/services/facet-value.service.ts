import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateFacetValueInput,
    CreateFacetValueWithFacetInput,
    DeletionResponse,
    DeletionResult,
    LanguageCode,
    UpdateFacetValueInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Product, ProductVariant } from '../../entity';
import { FacetValueTranslation } from '../../entity/facet-value/facet-value-translation.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep } from '../helpers/utils/translate-entity';

@Injectable()
export class FacetValueService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translatableSaver: TranslatableSaver,
        private configService: ConfigService,
    ) {}

    findAll(lang: LanguageCode): Promise<Array<Translated<FacetValue>>> {
        return this.connection.manager
            .find(FacetValue, {
                relations: ['facet'],
            })
            .then(facetValues => facetValues.map(facetValue => translateDeep(facetValue, lang, ['facet'])));
    }

    findOne(id: ID, lang: LanguageCode): Promise<Translated<FacetValue> | undefined> {
        return this.connection.manager
            .findOne(FacetValue, id, {
                relations: ['facet'],
            })
            .then(facetValue => facetValue && translateDeep(facetValue, lang, ['facet']));
    }

    findByIds(ids: ID[]): Promise<FacetValue[]>;
    findByIds(ids: ID[], lang: LanguageCode): Promise<Array<Translated<FacetValue>>>;
    findByIds(ids: ID[], lang?: LanguageCode): Promise<FacetValue[]> {
        const facetValues = this.connection
            .getRepository(FacetValue)
            .findByIds(ids, { relations: ['facet'] });
        if (lang) {
            return facetValues.then(values =>
                values.map(facetValue => translateDeep(facetValue, lang, ['facet'])),
            );
        } else {
            return facetValues;
        }
    }

    findByFacetId(id: ID, lang: LanguageCode): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(FacetValue)
            .find({
                where: {
                    facet: { id },
                },
            })
            .then(values => values.map(facetValue => translateDeep(facetValue, lang)));
    }

    async create(
        facet: Facet,
        input: CreateFacetValueInput | CreateFacetValueWithFacetInput,
    ): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.create({
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
            beforeSave: fv => (fv.facet = facet),
        });
        return assertFound(this.findOne(facetValue.id, this.configService.defaultLanguageCode));
    }

    async update(input: UpdateFacetValueInput): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.update({
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
        });
        return assertFound(this.findOne(facetValue.id, this.configService.defaultLanguageCode));
    }

    async delete(ctx: RequestContext, id: ID, force: boolean = false): Promise<DeletionResponse> {
        const { productCount, variantCount } = await this.checkFacetValueUsage([id]);

        const isInUse = !!(productCount || variantCount);
        const both = !!(productCount && variantCount) ? 'both' : 'single';
        const i18nVars = { products: productCount, variants: variantCount, both };
        let message = '';
        let result: DeletionResult;

        if (!isInUse) {
            const facetValue = await getEntityOrThrow(this.connection, FacetValue, id);
            await this.connection.getRepository(FacetValue).remove(facetValue);
            result = DeletionResult.DELETED;
        } else if (force) {
            const facetValue = await getEntityOrThrow(this.connection, FacetValue, id);
            await this.connection.getRepository(FacetValue).remove(facetValue);
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
    async checkFacetValueUsage(facetValueIds: ID[]): Promise<{ productCount: number; variantCount: number }> {
        const consumingProducts = await this.connection
            .getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.facetValues', 'facetValues')
            .where('facetValues.id IN (:...facetValueIds)', { facetValueIds })
            .getMany();

        const consumingVariants = await this.connection
            .getRepository(ProductVariant)
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
