import { Injectable } from '@nestjs/common';
import {
    CreateFacetInput,
    DeletionResponse,
    DeletionResult,
    LanguageCode,
    UpdateFacetInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { FacetTranslation } from '../../entity/facet/facet-translation.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

@Injectable()
export class FacetService {
    constructor(
        private connection: TransactionalConnection,
        private facetValueService: FacetValueService,
        private translatableSaver: TranslatableSaver,
        private listQueryBuilder: ListQueryBuilder,
        private configService: ConfigService,
        private channelService: ChannelService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Facet>,
    ): Promise<PaginatedList<Translated<Facet>>> {
        const relations = ['values', 'values.facet', 'channels'];

        return this.listQueryBuilder
            .build(Facet, options, { relations, ctx, channelId: ctx.channelId })
            .getManyAndCount()
            .then(([facets, totalItems]) => {
                const items = facets.map(facet =>
                    translateDeep(facet, ctx.languageCode, ['values', ['values', 'facet']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(ctx: RequestContext, facetId: ID): Promise<Translated<Facet> | undefined> {
        const relations = ['values', 'values.facet', 'channels'];

        return this.connection
            .findOneInChannel(ctx, Facet, facetId, ctx.channelId, { relations })
            .then(facet => facet && translateDeep(facet, ctx.languageCode, ['values', ['values', 'facet']]));
    }

    findByCode(facetCode: string, lang: LanguageCode): Promise<Translated<Facet> | undefined> {
        const relations = ['values', 'values.facet'];
        return this.connection
            .getRepository(Facet)
            .findOne({
                where: {
                    code: facetCode,
                },
                relations,
            })
            .then(facet => facet && translateDeep(facet, lang, ['values', ['values', 'facet']]));
    }

    async findByFacetValueId(ctx: RequestContext, id: ID): Promise<Translated<Facet> | undefined> {
        const facet = await this.connection
            .getRepository(ctx, Facet)
            .createQueryBuilder('facet')
            .leftJoinAndSelect('facet.translations', 'translations')
            .leftJoin('facet.values', 'facetValue')
            .where('facetValue.id = :id', { id })
            .getOne();
        if (facet) {
            return translateDeep(facet, ctx.languageCode);
        }
    }

    async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Facet,
            translationType: FacetTranslation,
            beforeSave: newEntity => {
                this.channelService.assignToCurrentChannel(newEntity, ctx);
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Facet, input, facet);
        return assertFound(this.findOne(ctx, facet.id));
    }

    async update(ctx: RequestContext, input: UpdateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Facet,
            translationType: FacetTranslation,
        });
        await this.customFieldRelationService.updateRelations(ctx, Facet, input, facet);
        return assertFound(this.findOne(ctx, facet.id));
    }

    async delete(ctx: RequestContext, id: ID, force: boolean = false): Promise<DeletionResponse> {
        const facet = await this.connection.getEntityOrThrow(ctx, Facet, id, {
            relations: ['values'],
            channelId: ctx.channelId,
        });
        let productCount = 0;
        let variantCount = 0;
        if (facet.values.length) {
            const counts = await this.facetValueService.checkFacetValueUsage(
                ctx,
                facet.values.map(fv => fv.id),
            );
            productCount = counts.productCount;
            variantCount = counts.variantCount;
        }

        const isInUse = !!(productCount || variantCount);
        const both = !!(productCount && variantCount) ? 'both' : 'single';
        const i18nVars = { products: productCount, variants: variantCount, both };
        let message = '';
        let result: DeletionResult;

        if (!isInUse) {
            await this.connection.getRepository(ctx, Facet).remove(facet);
            result = DeletionResult.DELETED;
        } else if (force) {
            await this.connection.getRepository(ctx, Facet).remove(facet);
            message = ctx.translate('message.facet-force-deleted', i18nVars);
            result = DeletionResult.DELETED;
        } else {
            message = ctx.translate('message.facet-used', i18nVars);
            result = DeletionResult.NOT_DELETED;
        }

        return {
            result,
            message,
        };
    }
}
