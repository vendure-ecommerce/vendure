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
import { RelationPaths } from '../../api/index';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { FacetTranslation } from '../../entity/facet/facet-translation.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { EventBus } from '../../event-bus';
import { FacetEvent } from '../../event-bus/events/facet-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

/**
 * @description
 * Contains methods relating to {@link Facet} entities.
 *
 * @docsCategory services
 */
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
        private eventBus: EventBus,
        private translator: TranslatorService,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Facet>,
        relations?: RelationPaths<Facet>,
    ): Promise<PaginatedList<Translated<Facet>>> {
        return this.listQueryBuilder
            .build(Facet, options, {
                relations: relations ?? ['values', 'values.facet', 'channels'],
                ctx,
                channelId: ctx.channelId,
            })
            .getManyAndCount()
            .then(([facets, totalItems]) => {
                const items = facets.map(facet =>
                    this.translator.translate(facet, ctx, ['values', ['values', 'facet']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(
        ctx: RequestContext,
        facetId: ID,
        relations?: RelationPaths<Facet>,
    ): Promise<Translated<Facet> | undefined> {
        return this.connection
            .findOneInChannel(ctx, Facet, facetId, ctx.channelId, {
                relations: relations ?? ['values', 'values.facet', 'channels'],
            })
            .then(facet => facet && this.translator.translate(facet, ctx, ['values', ['values', 'facet']]));
    }

    /**
     * @deprecated Use {@link FacetService.findByCode findByCode(ctx, facetCode, lang)} instead
     */
    findByCode(facetCode: string, lang: LanguageCode): Promise<Translated<Facet> | undefined>;
    findByCode(
        ctx: RequestContext,
        facetCode: string,
        lang: LanguageCode,
    ): Promise<Translated<Facet> | undefined>;
    findByCode(
        ctxOrFacetCode: RequestContext | string,
        facetCodeOrLang: string | LanguageCode,
        lang?: LanguageCode,
    ): Promise<Translated<Facet> | undefined> {
        const relations = ['values', 'values.facet'];
        const [repository, facetCode, languageCode] =
            ctxOrFacetCode instanceof RequestContext
                ? // tslint:disable-next-line:no-non-null-assertion
                  [this.connection.getRepository(ctxOrFacetCode, Facet), facetCodeOrLang, lang!]
                : [
                      this.connection.rawConnection.getRepository(Facet),
                      ctxOrFacetCode,
                      facetCodeOrLang as LanguageCode,
                  ];

        // ToDo Implement usage of channelLanguageCode
        return repository
            .findOne({
                where: {
                    code: facetCode,
                },
                relations,
            })
            .then(facet => facet && translateDeep(facet, languageCode, ['values', ['values', 'facet']]));
    }

    /**
     * @description
     * Returns the Facet which contains the given FacetValue id.
     */
    async findByFacetValueId(ctx: RequestContext, id: ID): Promise<Translated<Facet> | undefined> {
        const facet = await this.connection
            .getRepository(ctx, Facet)
            .createQueryBuilder('facet')
            .leftJoinAndSelect('facet.translations', 'translations')
            .leftJoin('facet.values', 'facetValue')
            .where('facetValue.id = :id', { id })
            .getOne();
        if (facet) {
            return this.translator.translate(facet, ctx);
        }
    }

    async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Facet,
            translationType: FacetTranslation,
            beforeSave: async f => {
                f.code = await this.ensureUniqueCode(ctx, f.code);
                await this.channelService.assignToCurrentChannel(f, ctx);
            },
        });
        const facetWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            Facet,
            input,
            facet,
        );
        this.eventBus.publish(new FacetEvent(ctx, facetWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, facet.id));
    }

    async update(ctx: RequestContext, input: UpdateFacetInput): Promise<Translated<Facet>> {
        const facet = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Facet,
            translationType: FacetTranslation,
            beforeSave: async f => {
                f.code = await this.ensureUniqueCode(ctx, f.code, f.id);
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Facet, input, facet);
        this.eventBus.publish(new FacetEvent(ctx, facet, 'updated', input));
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
            this.eventBus.publish(new FacetEvent(ctx, facet, 'deleted', id));
        } else {
            message = ctx.translate('message.facet-used', i18nVars);
            result = DeletionResult.NOT_DELETED;
        }

        return {
            result,
            message,
        };
    }

    /**
     * Checks to ensure the Facet code is unique. If there is a conflict, then the code is suffixed
     * with an incrementing integer.
     */
    private async ensureUniqueCode(ctx: RequestContext, code: string, id?: ID) {
        let candidate = code;
        let suffix = 1;
        let conflict = false;
        const alreadySuffixed = /-\d+$/;
        do {
            const match = await this.connection
                .getRepository(ctx, Facet)
                .findOne({ where: { code: candidate } });

            conflict = !!match && ((id != null && !idsAreEqual(match.id, id)) || id == null);
            if (conflict) {
                suffix++;
                if (alreadySuffixed.test(candidate)) {
                    candidate = candidate.replace(alreadySuffixed, `-${suffix}`);
                } else {
                    candidate = `${candidate}-${suffix}`;
                }
            }
        } while (conflict);

        return candidate;
    }
}
