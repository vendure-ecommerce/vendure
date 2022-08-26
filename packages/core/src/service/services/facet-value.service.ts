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
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Product, ProductVariant } from '../../entity';
import { FacetValueTranslation } from '../../entity/facet-value/facet-value-translation.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { EventBus } from '../../event-bus';
import { FacetValueEvent } from '../../event-bus/events/facet-value-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';

/**
 * @description
 * Contains methods relating to {@link FacetValue} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class FacetValueService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private configService: ConfigService,
        private customFieldRelationService: CustomFieldRelationService,
        private channelService: ChannelService,
        private eventBus: EventBus,
        private translator: TranslatorService,
    ) {}

    /**
     * @deprecated Use {@link FacetValueService.findAll findAll(ctx, lang)} instead
     */
    findAll(lang: LanguageCode): Promise<Array<Translated<FacetValue>>>;
    findAll(ctx: RequestContext, lang: LanguageCode): Promise<Array<Translated<FacetValue>>>;
    findAll(
        ctxOrLang: RequestContext | LanguageCode,
        lang?: LanguageCode,
    ): Promise<Array<Translated<FacetValue>>> {
        const [repository, languageCode] =
            ctxOrLang instanceof RequestContext
                ? // tslint:disable-next-line:no-non-null-assertion
                  [this.connection.getRepository(ctxOrLang, FacetValue), lang!]
                : [this.connection.rawConnection.getRepository(FacetValue), ctxOrLang];
        // ToDo Implement usage of channelLanguageCode
        return repository
            .find({
                relations: ['facet'],
            })
            .then(facetValues =>
                facetValues.map(facetValue => translateDeep(facetValue, languageCode, ['facet'])),
            );
    }

    findOne(ctx: RequestContext, id: ID): Promise<Translated<FacetValue> | undefined> {
        return this.connection
            .getRepository(ctx, FacetValue)
            .findOne(id, {
                relations: ['facet'],
            })
            .then(facetValue => facetValue && this.translator.translate(facetValue, ctx, ['facet']));
    }

    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<FacetValue>>> {
        const facetValues = this.connection.findByIdsInChannel(ctx, FacetValue, ids, ctx.channelId, {
            relations: ['facet'],
        });
        return facetValues.then(values =>
            values.map(facetValue => this.translator.translate(facetValue, ctx, ['facet'])),
        );
    }

    /**
     * @description
     * Returns all FacetValues belonging to the Facet with the given id.
     */
    findByFacetId(ctx: RequestContext, id: ID): Promise<Array<Translated<FacetValue>>> {
        return this.connection
            .getRepository(ctx, FacetValue)
            .find({
                where: {
                    facet: { id },
                },
            })
            .then(values => values.map(facetValue => this.translator.translate(facetValue, ctx)));
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
            beforeSave: async fv => {
                fv.facet = facet;
                await this.channelService.assignToCurrentChannel(fv, ctx);
            },
        });
        const facetValueWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            FacetValue,
            input as CreateFacetValueInput,
            facetValue,
        );
        this.eventBus.publish(new FacetValueEvent(ctx, facetValueWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, facetValue.id));
    }

    async update(ctx: RequestContext, input: UpdateFacetValueInput): Promise<Translated<FacetValue>> {
        const facetValue = await this.translatableSaver.update({
            ctx,
            input,
            entityType: FacetValue,
            translationType: FacetValueTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, FacetValue, input, facetValue);
        this.eventBus.publish(new FacetValueEvent(ctx, facetValue, 'updated', input));
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
            this.eventBus.publish(new FacetValueEvent(ctx, facetValue, 'deleted', id));
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
     * @description
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
