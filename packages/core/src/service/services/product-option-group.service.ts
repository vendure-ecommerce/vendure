import { Injectable } from '@nestjs/common';
import {
    AssignOptionGroupsToChannelInput,
    CreateProductOptionGroupInput,
    DeletionResult,
    LanguageCode,
    Permission,
    RemoveOptionGroupFromChannelResult,
    RemoveOptionGroupsFromChannelInput,
    UpdateProductOptionGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { FindManyOptions, In, IsNull, Like } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import {
    ErrorResultUnion,
    ForbiddenError,
    ListQueryOptions,
    OptionGroupInUseError,
    UserInputError,
} from '../../common';
import { Instrument } from '../../common/instrument-decorator';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOption } from '../../entity';
import { ProductOptionGroupTranslation } from '../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus';
import { ProductOptionGroupEvent } from '../../event-bus/events/product-option-group-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { ProductOptionService } from './product-option.service';
import { RoleService } from './role.service';

/**
 * @description
 * Contains methods relating to {@link ProductOptionGroup} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class ProductOptionGroupService {
    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private customFieldRelationService: CustomFieldRelationService,
        private productOptionService: ProductOptionService,
        private eventBus: EventBus,
        private translator: TranslatorService,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
        private roleService: RoleService,
    ) {}

    /**
     * @deprecated Use {@link ProductOptionGroupService.findAllList findAllList(ctx, options, relations)} instead
     */
    findAll(
        ctx: RequestContext,
        filterTerm?: string,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const findOptions: FindManyOptions = {
            relations: relations ?? ['options'],
            where: {
                deletedAt: IsNull(),
            },
        };
        if (filterTerm) {
            findOptions.where = {
                code: Like(`%${filterTerm}%`),
                ...findOptions.where,
            };
        }
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find(findOptions)
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    findAllList(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductOptionGroup>,
        relations?: RelationPaths<ProductOptionGroup>,
    ): Promise<PaginatedList<Translated<ProductOptionGroup>>> {
        return this.listQueryBuilder
            .build(ProductOptionGroup, options, {
                ctx,
                relations: relations ?? ['options'],
                channelId: ctx.channelId,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items: items.map(item => this.translator.translate(item, ctx, ['options'])),
                    totalItems,
                };
            });
    }

    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductOptionGroup>,
        findOneOptions?: { includeSoftDeleted: boolean },
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne({
                where: {
                    id,
                    deletedAt: !findOneOptions?.includeSoftDeleted ? IsNull() : undefined,
                },
                relations: relations ?? ['options'],
            })
            .then(group => (group && this.translator.translate(group, ctx, ['options'])) ?? undefined);
    }

    findByCode(
        ctx: RequestContext,
        groupCode: string,
        lang: LanguageCode,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        // TODO: Implement usage of channelLanguageCode
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .findOne({
                where: {
                    code: groupCode,
                    productId: IsNull(),
                },
                relations: ['options', 'options.group'],
            })
            .then(
                group =>
                    (group && translateDeep(group, lang, ['options', ['options', 'group']])) ?? undefined,
            );
    }

    getOptionGroupsByProductId(ctx: RequestContext, id: ID): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.connection
            .getRepository(ctx, ProductOptionGroup)
            .find({
                relations: ['options'],
                where: [
                    { products: { id }, deletedAt: IsNull() },
                    { product: { id }, deletedAt: IsNull() },
                ],
                order: {
                    id: 'ASC',
                },
            })
            .then(groups => groups.map(group => this.translator.translate(group, ctx, ['options'])));
    }

    async create(
        ctx: RequestContext,
        input: Omit<CreateProductOptionGroupInput, 'options'>,
    ): Promise<Translated<ProductOptionGroup>> {
        const group = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
            beforeSave: async g => {
                g.code = await this.ensureUniqueCode(ctx, g.code);
                await this.channelService.assignToCurrentChannel(g, ctx);
            },
        });
        const groupWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            ProductOptionGroup,
            input,
            group,
        );
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, groupWithRelations, 'created', input));
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
            beforeSave: async g => {
                if (g.code) {
                    g.code = await this.ensureUniqueCode(ctx, g.code, g.id);
                }
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, ProductOptionGroup, input, group);
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, group, 'updated', input));
        return assertFound(this.findOneInternal(ctx, group.id));
    }

    /**
     * @description
     * Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
     * is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
     * referential integrity. Otherwise a hard-delete will be performed.
     */
    async deleteGroupAndOptions(ctx: RequestContext, id: ID, productId?: ID) {
        const optionGroup = await this.connection.getEntityOrThrow(ctx, ProductOptionGroup, id, {
            where: productId ? { productId } : { channels: { id: ctx.channelId } },
            relations: ['options', 'product'],
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
        });
        const deletedOptionGroup = new ProductOptionGroup(optionGroup);
        const inUseByActiveProducts = await this.isInUseByOtherProducts(ctx, optionGroup, productId);
        if (0 < inUseByActiveProducts) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.product-option-group-used', {
                    code: optionGroup.code,
                    count: inUseByActiveProducts,
                }),
            };
        }

        const optionsToDelete = optionGroup.options.filter(op => !op.deletedAt);
        for (const option of optionsToDelete) {
            const { result, message } = await this.productOptionService.delete(ctx, option.id);
            if (result === DeletionResult.NOT_DELETED) {
                await this.connection.rollBackTransaction(ctx);
                return { result, message };
            }
        }
        const hasOptionsWhichAreInUse = await this.groupOptionsAreInUse(ctx, optionGroup);
        if (0 < hasOptionsWhichAreInUse) {
            // soft delete
            optionGroup.deletedAt = new Date();
            await this.connection.getRepository(ctx, ProductOptionGroup).save(optionGroup, { reload: false });
        } else {
            // hard delete

            const product = await this.connection.getRepository(ctx, Product).findOne({
                relationLoadStrategy: 'query',
                loadEagerRelations: false,
                where: { id: productId },
                relations: ['optionGroups', '__optionGroups'],
            });
            if (product) {
                product.optionGroups = product.optionGroups.filter(og => !idsAreEqual(og.id, id));
                product.__optionGroups = product.__optionGroups.filter(og => !idsAreEqual(og.id, id));
                await this.connection.getRepository(ctx, Product).save(product, { reload: false });
            }

            try {
                await this.connection.getRepository(ctx, ProductOptionGroup).remove(optionGroup);
            } catch (e: any) {
                Logger.error(e.message, undefined, e.stack);
            }
        }
        await this.eventBus.publish(new ProductOptionGroupEvent(ctx, deletedOptionGroup, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * Checks to ensure the ProductOptionGroup code is unique. If there is a conflict, then the code is suffixed
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

    private async isInUseByOtherProducts(
        ctx: RequestContext,
        productOptionGroup: ProductOptionGroup,
        targetProductId?: ID,
    ): Promise<number> {
        if (targetProductId) {
            return this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoin('product.optionGroups', 'optionGroup')
                .where('product.deletedAt IS NULL')
                .andWhere('optionGroup.id = :id', { id: productOptionGroup.id })
                .andWhere('product.id != :productId', { productId: targetProductId })
                .getCount();
        } else {
            return this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .leftJoin('product.__optionGroups', 'optionGroups')
                .where('product.deletedAt IS NULL')
                .andWhere('optionGroups.id = :id', { id: productOptionGroup.id })
                .getCount();
        }
    }

    private async groupOptionsAreInUse(ctx: RequestContext, productOptionGroup: ProductOptionGroup) {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .leftJoin('variant.options', 'option')
            .where('option.groupId = :groupId', { groupId: productOptionGroup.id })
            .getCount();
    }

    private async findOneInternal(
        ctx: RequestContext,
        groupId: ID,
    ): Promise<Translated<ProductOptionGroup> | undefined> {
        const group = await this.connection.getRepository(ctx, ProductOptionGroup).findOne({
            where: { id: groupId },
            relations: ['options', 'channels'],
        });
        if (!group) {
            return undefined;
        }
        if (group.channels.some(c => c.id === ctx.channelId) || group.productId) {
            return this.translator.translate(group, ctx, ['options']);
        }
        return undefined;
    }

    /**
     * @description
     * Assigns ProductOptionGroups to the specified Channel
     */
    async assignGroupsToChannel(
        ctx: RequestContext,
        input: AssignOptionGroupsToChannelInput,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.UpdateProduct,
            Permission.UpdateCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const groupsToAssign = await this.connection.getRepository(ctx, ProductOptionGroup).find({
            where: {
                id: In(input.groupIds),
                productId: IsNull(),
            },
            relations: ['options'],
        });
        const optionsToAssign = groupsToAssign.reduce(
            (values, group) => [...values, ...group.options],
            [] as ProductOption[],
        );

        await Promise.all<any>([
            ...groupsToAssign.map(async group => {
                return this.channelService.assignToChannels(ctx, ProductOptionGroup, group.id, [
                    input.channelId,
                ]);
            }),
            ...optionsToAssign.map(async option =>
                this.channelService.assignToChannels(ctx, ProductOption, option.id, [input.channelId]),
            ),
        ]);
        return this.connection
            .findByIdsInChannel(
                ctx,
                ProductOptionGroup,
                groupsToAssign.map(g => g.id),
                ctx.channelId,
                {},
            )
            .then(groups => groups.map(group => translateDeep(group, ctx.languageCode)));
    }

    /**
     * @description
     * Remove Facets from the specified Channel
     */
    async removeGroupsFromChannel(
        ctx: RequestContext,
        input: RemoveOptionGroupsFromChannelInput,
    ): Promise<Array<ErrorResultUnion<RemoveOptionGroupFromChannelResult, ProductOptionGroup>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.DeleteFacet,
            Permission.DeleteCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (idsAreEqual(input.channelId, defaultChannel.id)) {
            throw new UserInputError('error.items-cannot-be-removed-from-default-channel');
        }
        const groupsToRemove = await this.connection.getRepository(ctx, ProductOptionGroup).find({
            where: {
                id: In(input.groupIds),
                productId: IsNull(),
            },
            relations: ['options'],
        });

        const results: Array<ErrorResultUnion<RemoveOptionGroupFromChannelResult, ProductOptionGroup>> = [];

        for (const group of groupsToRemove) {
            let variantCount = 0;
            if (group.options.length) {
                const counts = await this.productOptionService.checkOptionUsage(
                    ctx,
                    group.options.map(o => o.id),
                    input.channelId,
                );
                variantCount = counts.variantCount;

                const isInUse = !!variantCount;
                let result: Translated<ProductOptionGroup> | undefined;

                if (!isInUse || input.force) {
                    await this.channelService.removeFromChannels(ctx, ProductOptionGroup, group.id, [
                        input.channelId,
                    ]);
                    await Promise.all(
                        group.options.map(o =>
                            this.channelService.removeFromChannels(ctx, ProductOption, o.id, [
                                input.channelId,
                            ]),
                        ),
                    );
                    result = await this.findOne(ctx, group.id);
                    if (result) {
                        results.push(result);
                    }
                } else {
                    results.push(new OptionGroupInUseError({ optionGroupCode: group.code, variantCount }));
                }
            }
        }

        return results;
    }
}
