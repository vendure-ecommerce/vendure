import { Injectable } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { isObject } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../../api/common/request-context';
import { InternalServerError } from '../../../common/error/errors';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductPriceApplicator } from '../product-price-applicator/product-price-applicator';
import { TranslatorService } from '../translator/translator.service';

import { HydrateOptions } from './entity-hydrator-types';

/**
 * @description
 * This is a helper class which is used to "hydrate" entity instances, which means to populate them
 * with the specified relations. This is useful when writing plugin code which receives an entity
 * and you need to ensure that one or more relations are present.
 *
 * @example
 * ```TypeScript
 * const product = await this.productVariantService
 *   .getProductForVariant(ctx, variantId);
 *
 * await this.entityHydrator
 *   .hydrate(ctx, product, { relations: ['facetValues.facet' ]});
 *```
 *
 * In this above example, the `product` instance will now have the `facetValues` relation
 * available, and those FacetValues will have their `facet` relations joined too.
 *
 * This `hydrate` method will _also_ automatically take care or translating any
 * translatable entities (e.g. Product, Collection, Facet), and if the `applyProductVariantPrices`
 * options is used (see {@link HydrateOptions}), any related ProductVariant will have the correct
 * Channel-specific prices applied to them.
 *
 * Custom field relations may also be hydrated:
 *
 * @example
 * ```TypeScript
 * const customer = await this.customerService
 *   .findOne(ctx, id);
 *
 * await this.entityHydrator
 *   .hydrate(ctx, customer, { relations: ['customFields.avatar' ]});
 * ```
 *
 * @docsCategory data-access
 * @since 1.3.0
 */
@Injectable()
export class EntityHydrator {
    constructor(
        private connection: TransactionalConnection,
        private productPriceApplicator: ProductPriceApplicator,
        private translator: TranslatorService,
    ) {}

    /**
     * @description
     * Hydrates (joins) the specified relations to the target entity instance. This method
     * mutates the `target` entity.
     *
     * @example
     * ```TypeScript
     * await this.entityHydrator.hydrate(ctx, product, {
     *   relations: [
     *     'variants.stockMovements'
     *     'optionGroups.options',
     *     'featuredAsset',
     *   ],
     *   applyProductVariantPrices: true,
     * });
     * ```
     *
     * @since 1.3.0
     */
    async hydrate<Entity extends VendureEntity>(
        ctx: RequestContext,
        target: Entity,
        options: HydrateOptions<Entity>,
    ): Promise<Entity> {
        if (options.relations) {
            let missingRelations = this.getMissingRelations(target, options);

            if (options.applyProductVariantPrices === true) {
                const productVariantPriceRelations = this.getRequiredProductVariantRelations(
                    target,
                    missingRelations,
                );
                missingRelations = unique([...missingRelations, ...productVariantPriceRelations]);
            }

            if (missingRelations.length) {
                const hydrated = await this.connection.getRepository(ctx, target.constructor).findOne({
                    where: { id: target.id },
                    relations: missingRelations,
                });
                const propertiesToAdd = unique(missingRelations.map(relation => relation.split('.')[0]));
                for (const prop of propertiesToAdd) {
                    (target as any)[prop] = this.mergeDeep((target as any)[prop], (hydrated as any)[prop]);
                }

                const relationsWithEntities = missingRelations.map(relation => ({
                    entity: this.getRelationEntityAtPath(target, relation.split('.')),
                    relation,
                }));

                if (options.applyProductVariantPrices === true) {
                    for (const relationWithEntities of relationsWithEntities) {
                        const entity = relationWithEntities.entity;
                        if (entity) {
                            if (Array.isArray(entity)) {
                                if (entity[0] instanceof ProductVariant) {
                                    await Promise.all(
                                        entity.map((e: any) =>
                                            this.productPriceApplicator.applyChannelPriceAndTax(e, ctx),
                                        ),
                                    );
                                }
                            } else {
                                if (entity instanceof ProductVariant) {
                                    await this.productPriceApplicator.applyChannelPriceAndTax(entity, ctx);
                                }
                            }
                        }
                    }
                }

                const translateDeepRelations = relationsWithEntities
                    .filter(item => this.isTranslatable(item.entity))
                    .map(item => item.relation.split('.'));

                this.assignSettableProperties(
                    target,
                    this.translator.translate(target as any, ctx, translateDeepRelations as any),
                );
            }
        }
        return target;
    }

    private assignSettableProperties<Entity extends VendureEntity>(target: Entity, source: Entity) {
        for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(target))) {
            if (typeof descriptor.get === 'function' && typeof descriptor.set !== 'function') {
                // If the entity property has a getter only, we will skip it otherwise
                // we will get an error of the form:
                // `Cannot set property <name> of #<Entity> which has only a getter`
                continue;
            }
            target[key as keyof Entity] = source[key as keyof Entity];
        }
        return target;
    }

    /**
     * Compares the requested relations against the actual existing relations on the target entity,
     * and returns an array of all missing relation paths that would need to be fetched.
     */
    private getMissingRelations<Entity extends VendureEntity>(
        target: Entity,
        options: HydrateOptions<Entity>,
    ) {
        const missingRelations: string[] = [];
        for (const relation of options.relations.slice().sort()) {
            if (typeof relation === 'string') {
                const parts = !relation.startsWith('customFields') ? relation.split('.') : [relation];
                let entity: Record<string, any> | undefined = target;
                const path = [];
                for (const part of parts) {
                    path.push(part);
                    if (entity && entity[part]) {
                        entity = Array.isArray(entity[part]) ? entity[part][0] : entity[part];
                    } else {
                        const allParts = path.reduce((result, p, i) => {
                            if (i === 0) {
                                return [p];
                            } else {
                                return [...result, [result[result.length - 1], p].join('.')];
                            }
                        }, [] as string[]);
                        missingRelations.push(...allParts);
                        entity = undefined;
                    }
                }
            }
        }
        return unique(missingRelations);
    }

    private getRequiredProductVariantRelations<Entity extends VendureEntity>(
        target: Entity,
        missingRelations: string[],
    ): string[] {
        const relationsToAdd: string[] = [];
        for (const relation of missingRelations) {
            const entityType = this.getRelationEntityTypeAtPath(target, relation);
            if (entityType === ProductVariant) {
                relationsToAdd.push([relation, 'taxCategory'].join('.'));
            }
        }
        return relationsToAdd;
    }

    /**
     * Returns an instance of the related entity at the given path. E.g. a path of `['variants', 'featuredAsset']`
     * will return an Asset instance.
     */
    private getRelationEntityAtPath(
        entity: VendureEntity,
        path: string[],
    ): VendureEntity | VendureEntity[] | undefined {
        let isArrayResult = false;
        const result: VendureEntity[] = [];

        function visit(parent: any, parts: string[]): any {
            if (parts.length === 0) {
                return;
            }
            const part = parts.shift() as string;
            const target = parent[part];
            if (Array.isArray(target)) {
                isArrayResult = true;
                if (parts.length === 0) {
                    result.push(...target);
                } else {
                    for (const item of target) {
                        visit(item, parts.slice());
                    }
                }
            } else {
                if (parts.length === 0) {
                    result.push(target);
                } else {
                    visit(target, parts.slice());
                }
            }
        }
        visit(entity, path.slice());
        return isArrayResult ? result : result[0];
    }

    private getRelationEntityTypeAtPath(entity: VendureEntity, path: string): Type<VendureEntity> {
        const { entityMetadatas } = this.connection.rawConnection;
        const targetMetadata = entityMetadatas.find(m => m.target === entity.constructor);
        if (!targetMetadata) {
            throw new InternalServerError(
                `Cannot find entity metadata for entity "${entity.constructor.name}"`,
            );
        }
        let currentMetadata = targetMetadata;
        for (const pathPart of path.split('.')) {
            const relationMetadata = currentMetadata.findRelationWithPropertyPath(pathPart);
            if (relationMetadata) {
                currentMetadata = relationMetadata.inverseEntityMetadata;
            } else {
                throw new InternalServerError(
                    `Cannot find relation metadata for entity "${currentMetadata.targetName}" at path "${pathPart}"`,
                );
            }
        }
        return currentMetadata.target as Type<VendureEntity>;
    }

    private isTranslatable<T extends VendureEntity>(input: T | T[] | undefined): boolean {
        return Array.isArray(input)
            ? input[0]?.hasOwnProperty('translations') ?? false
            : input?.hasOwnProperty('translations') ?? false;
    }

    /**
     * Merges properties into a target entity. This is needed for the cases in which a
     * property already exists on the target, but the hydrated version also contains that
     * property with a different set of properties. This prevents the original target
     * entity from having data overwritten.
     */
    private mergeDeep<T extends { [key: string]: any }>(a: T | undefined, b: T): T {
        if (!a) {
            return b;
        }
        for (const [key, value] of Object.entries(b)) {
            if (Object.getOwnPropertyDescriptor(b, key)?.writable) {
                if (Array.isArray(value)) {
                    (a as any)[key] = value.map((v, index) =>
                        this.mergeDeep(a?.[key]?.[index], b[key][index]),
                    );
                } else if (isObject(value)) {
                    (a as any)[key] = this.mergeDeep(a?.[key], b[key]);
                } else {
                    (a as any)[key] = b[key];
                }
            }
        }
        return a ?? b;
    }
}
