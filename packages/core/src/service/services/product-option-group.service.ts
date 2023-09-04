import { Injectable } from '@nestjs/common';
import {
    AssignOptionGroupsToChannelInput,
    CreateProductOptionGroupInput,
    DeletionResult,
    Permission,
    RemoveFacetFromChannelResult,
    RemoveFacetsFromChannelInput,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { FindManyOptions, In, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { ErrorResultUnion, FacetInUseError, ForbiddenError, UserInputError } from "../../common";
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import {Facet, FacetValue, ProductOption} from "../../entity";
import { Product } from '../../entity/product/product.entity';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { translateDeep } from "../helpers/utils/translate-entity";

import { ChannelService } from "./channel.service";
import { ProductOptionService } from './product-option.service';
import { RoleService } from "./role.service";

/**
 * @description
 * Contains methods relating to {@link ProductOptionGroup} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ProductOptionGroupService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private productOptionService: ProductOptionService,
        private eventBus: EventBus,
        private translator: TranslatorService,
        private channelService: ChannelService,
        private roleService: RoleService,
    ) {}

    findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: relations ?? ['options'],
        };
        if (filterTerm) {
            findOptions.where = {
                code: Like(`%${filterTerm}%`),
            };
        }
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find(findOptions)
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne({
                where: { id },
                relations: relations ?? ['options'],
            })
            .then(group => (group && this.translator.translate(group, ctx, ['options'])) ?? undefined);
    }

    getOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find({
                relations: ['options'],
                where: {
                    product: { id },
                },
                order: {
                    id: 'ASC',
                },
            })
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    findOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.getOptionGroupsByProductId(ctx, id);
    }

    async findByProductOptionId(ctx: RequestContext, id: ID): Promise<Translated<ProductOptionGroup> | undefined> {
        const productOptionGroup = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .createQueryBuilder('optionGroup')
            .leftJoinAndSelect('optionGroup.translations', 'translations')
            .leftJoin('optionGroup.options', 'option')
            .where('option.id = :id', { id })
            .getOne();

        if (productOptionGroup) {
            return this.translator.translate(productOptionGroup, ctx);
        }
    }

    async create(
        ctx: RequestContext,
        input: CreateProductOptionGroupInput,
    ): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async (optionGroup) => {
                optionGroup.code = await this.ensureUniqueCode(ctx, optionGroup.code)
                await this.channelService.assignToCurrentChannel(optionGroup, ctx);
            }
        });
        const groupWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOptionGroup,
            input,
            group,
        );
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, groupWithRelations, 'created', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    async update(
        ctx: RequestContext,
        input: UpdateProductOptionGroupInput,
    ): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async optionGroup => {
                if (optionGroup.code) {
                    optionGroup.code = await this.ensureUniqueCode(ctx, optionGroup.code, optionGroup.id);
                }
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, group, 'updated', input));
        return assertFound(this.findOne(ctx, group.id));
    }

    async assignOptionGroupsToChannel(
        ctx: RequestContext,
        input: AssignOptionGroupsToChannelInput,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            // Permission.UpdateProductOptionGroup
            Permission.UpdateCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const productOptionGroupsToAssign = await this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find({ where: { id: In(input.facetIds) }, relations: ['options'] });
        const valuesToAssign = productOptionGroupsToAssign.reduce(
            (options, optionGroup) => [...options, ...optionGroup.options],
            [] as ProductOption[],
        );

        await Promise.all<any>([
            ...productOptionGroupsToAssign.map(async facet => {
                return this.channelService.assignToChannels(ctx, ProductOptionGroup, facet.id, [input.channelId]);
            }),
            ...valuesToAssign.map(async value =>
                this.channelService.assignToChannels(ctx, ProductOption, value.id, [input.channelId]),
            ),
        ]);

        return this.connection
            .findByIdsInChannel(
                ctx,
                ProductOptionGroup,
                productOptionGroupsToAssign.map(optionGroup => optionGroup.id),
                ctx.channelId,
                {},
            )
            .then(optionGroups => optionGroups.map(optionGroup => translateDeep(optionGroup, ctx.languageCode)));
    }

    async removeFacetsFromChannel(
        ctx: RequestContext,
        input: RemoveFacetsFromChannelInput,
    ): Promise<Array<ErrorResultUnion<RemoveFacetFromChannelResult, Facet>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            // Permission.DeleteProductOptionGroup,
            Permission.DeleteCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (idsAreEqual(input.channelId, defaultChannel.id)) {
            throw new UserInputError('error.items-cannot-be-removed-from-default-channel');
        }
        const facetsToRemove = await this.connection
            .getRepository(ctx, Facet)
            .find({ where: { id: In(input.facetIds) }, relations: ['values'] });

        const results: Array<ErrorResultUnion<RemoveFacetFromChannelResult, Facet>> = [];

        for (const facet of facetsToRemove) {
            let productCount = 0;
            let variantCount = 0;
            if (facet.values.length) {
                // @ts-ignore is ok
                const counts = await this.facetValueService.checkFacetValueUsage(
                    ctx,
                    facet.values.map(fv => fv.id),
                    input.channelId,
                );
                productCount = counts.productCount;
                variantCount = counts.variantCount;

                const isInUse = !!(productCount || variantCount);
                const both = !!(productCount && variantCount) ? 'both' : 'single';
                const i18nVars = { products: productCount, variants: variantCount, both };
                let result: Translated<Facet> | undefined;

                if (!isInUse || input.force) {
                    await this.channelService.removeFromChannels(ctx, Facet, facet.id, [input.channelId]);
                    await Promise.all(
                        facet.values.map(fv =>
                            this.channelService.removeFromChannels(ctx, FacetValue, fv.id, [input.channelId]),
                        ),
                    );
                    // @ts-ignore is ok
                    result = await this.findOne(ctx, facet.id);
                    if (result) {
                        results.push(result);
                    }
                } else {
                    results.push(new FacetInUseError({ facetCode: facet.code, productCount, variantCount }));
                }
            }
        }

        return results;
    }

    /**
     * @description
     * Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
     * is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
     * referential integrity. Otherwise a hard-delete will be performed.
     */
    async deleteGroupAndOptionsFromProduct(ctx: RequestContext, id: ID, productId: ID) {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            relations: ['options', 'product'],
            channelId: ctx.channelId,
        });
        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const inUseByActiveProducts = await this.isInUseByOtherProducts(ctx, optionGroup, productId);
        if (inUseByActiveProducts > 0) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
                    code: optionGroup.code,
                    count: inUseByActiveProducts,
                }),
            };
        }

        const optionsToDelete = optionGroup.options && optionGroup.options.filter(group => !group.deletedAt);

        for (const option of optionsToDelete) {
            const { result, message } = await this.productOptionService.delete(ctx, option.id);
            if (result === DeletionResult.NOT_DELETED) {
                await this.connection.rollBackTransaction(ctx);
                return { result, message };
            }
        }
        const hasOptionsWhichAreInUse = await this.groupOptionsAreInUse(ctx, optionGroup);
        if (hasOptionsWhichAreInUse > 0) {
            // soft delete
            optionGroup.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOptionGroup).save(optionGroup, { reload: false });
        } else {
            // hard delete

            const product = await this.connection.getRepository(ctx, Product).findOne({
                where: { id: productId },
                relations: ['optionGroups'],
            });
            if (product) {
                product.optionGroups = product.optionGroups.filter(og => !idsAreEqual(og.id, id));
                await this.connection.getRepository(ctx, Product).save(product, { reload: false });
            }

            try {
                await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            } catch (e: any) {
                Logger.error(e.message, undefined, e.stack);
            }
        }
        this.eventBus.publish(new ProductOptionGroupEvent(ctx, deletedOptionGroup, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async isInUseByOtherProducts(
        ctx: RequestContext,
        productOptionGroup: ProductOptionGroup,
        targetProductId: ID,
    ): Promise<number> {
        return this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoin('product.optionGroups', 'optionGroup')
            .where('product.deletedAt IS NULL')
            .andWhere('optionGroup.id = :id', { id: productOptionGroup.id })
            .andWhere('product.id != :productId', { productId: targetProductId })
            .getCount();
    }

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('option.groupId = :groupId', { groupId: productOptionGroup.id })
            .getCount();
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
                .getRepository(ctx, ProductOptionGroup)
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
