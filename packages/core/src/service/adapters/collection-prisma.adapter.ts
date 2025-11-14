/**
 * @description
 * Prisma implementation of the Collection ORM adapter.
 * Converts Prisma results to TypeORM Collection entities for backward compatibility.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { CollectionPrismaRepository } from '../repositories/prisma/collection-prisma.repository';

import {
    CollectionListOptions,
    CollectionTranslationInput,
    CreateCollectionInput,
    ICollectionOrmAdapter,
    UpdateCollectionInput,
} from './collection-orm.adapter';

@Injectable()
export class CollectionPrismaAdapter implements ICollectionOrmAdapter {
    constructor(private readonly repository: CollectionPrismaRepository) {}

    async findOne(id: ID, includeRelations: boolean = true): Promise<Collection | undefined> {
        const prismaCollection = await this.repository.findOne(id, includeRelations);

        if (!prismaCollection) {
            return undefined;
        }

        return this.mapToEntity(prismaCollection);
    }

    async findBySlug(slug: string, languageCode: string = 'en'): Promise<Collection | undefined> {
        const prismaCollection = await this.repository.findBySlug(slug, languageCode);

        if (!prismaCollection) {
            return undefined;
        }

        return this.mapToEntity(prismaCollection);
    }

    async findAll(options: CollectionListOptions = {}): Promise<PaginatedList<Collection>> {
        const result = await this.repository.findAll({
            skip: options.skip,
            take: options.take,
            filter: options.filter,
            sort: options.sort,
        });

        return {
            items: result.items.map(item => this.mapToEntity(item)),
            totalItems: result.totalItems,
        };
    }

    async findRoots(): Promise<Collection[]> {
        const prismaCollections = await this.repository.findRoots();
        return prismaCollections.map(collection => this.mapToEntity(collection));
    }

    async findChildren(parentId: ID): Promise<Collection[]> {
        const prismaCollections = await this.repository.findChildren(parentId);
        return prismaCollections.map(collection => this.mapToEntity(collection));
    }

    async findDescendants(parentId: ID): Promise<Collection[]> {
        const prismaCollections = await this.repository.findDescendants(parentId);
        return prismaCollections.map(collection => this.mapToEntity(collection));
    }

    async findAncestors(collectionId: ID): Promise<Collection[]> {
        const prismaCollections = await this.repository.findAncestors(collectionId);
        return prismaCollections.map(collection => this.mapToEntity(collection));
    }

    async create(data: CreateCollectionInput): Promise<Collection> {
        const prismaCollection = await this.repository.create({
            isRoot: data.isRoot,
            position: data.position,
            isPrivate: data.isPrivate,
            filters: data.filters,
            parentId: data.parentId,
            featuredAssetId: data.featuredAssetId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaCollection);
    }

    async update(id: ID, data: UpdateCollectionInput): Promise<Collection> {
        const prismaCollection = await this.repository.update(id, {
            position: data.position,
            isPrivate: data.isPrivate,
            filters: data.filters,
            parentId: data.parentId,
            featuredAssetId: data.featuredAssetId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaCollection);
    }

    async moveToParent(id: ID, parentId: ID | null, position?: number): Promise<Collection> {
        const prismaCollection = await this.repository.moveToParent(id, parentId, position);
        return this.mapToEntity(prismaCollection);
    }

    async delete(id: ID): Promise<void> {
        await this.repository.delete(id);
    }

    async upsertTranslation(collectionId: ID, translation: CollectionTranslationInput): Promise<void> {
        await this.repository.upsertTranslation(collectionId, translation.languageCode, {
            name: translation.name,
            slug: translation.slug,
            description: translation.description,
        });
    }

    async addAsset(collectionId: ID, assetId: ID, position?: number): Promise<void> {
        await this.repository.addAsset(collectionId, assetId, position);
    }

    async removeAsset(collectionId: ID, assetId: ID): Promise<void> {
        await this.repository.removeAsset(collectionId, assetId);
    }

    async setFeaturedAsset(collectionId: ID, assetId: ID | null): Promise<Collection> {
        const prismaCollection = await this.repository.setFeaturedAsset(collectionId, assetId);
        return this.mapToEntity(prismaCollection);
    }

    async addProductVariant(collectionId: ID, productVariantId: ID): Promise<void> {
        await this.repository.addProductVariant(collectionId, productVariantId);
    }

    async removeProductVariant(collectionId: ID, productVariantId: ID): Promise<void> {
        await this.repository.removeProductVariant(collectionId, productVariantId);
    }

    async getProductVariants(collectionId: ID): Promise<any[]> {
        return this.repository.getProductVariants(collectionId);
    }

    /**
     * Map Prisma Collection to TypeORM Collection entity
     * This ensures backward compatibility with existing code
     */
    private mapToEntity(prismaCollection: any): Collection {
        const collection = new Collection({
            id: prismaCollection.id,
            createdAt: prismaCollection.createdAt,
            updatedAt: prismaCollection.updatedAt,
            isRoot: prismaCollection.isRoot,
            position: prismaCollection.position,
            isPrivate: prismaCollection.isPrivate,
            filters: prismaCollection.filters,
            parentId: prismaCollection.parentId,
            featuredAssetId: prismaCollection.featuredAssetId,
            customFields: prismaCollection.customFields,
        });

        // Map translations
        if (prismaCollection.translations) {
            collection.translations = prismaCollection.translations.map(
                (t: any) =>
                    new CollectionTranslation({
                        id: t.id,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                        languageCode: t.languageCode,
                        name: t.name,
                        slug: t.slug,
                        description: t.description,
                    }),
            );
        }

        // Map parent (if loaded)
        if (prismaCollection.parent) {
            collection.parent = this.mapToEntity(prismaCollection.parent);
        }

        // Map children (if loaded)
        if (prismaCollection.children) {
            collection.children = prismaCollection.children.map((child: any) => this.mapToEntity(child));
        }

        // Map featured asset (if loaded)
        if (prismaCollection.featuredAsset) {
            collection.featuredAsset = prismaCollection.featuredAsset;
        }

        // Map assets (if loaded)
        if (prismaCollection.assets) {
            // CollectionAsset join table entities
            collection.assets = prismaCollection.assets;
        }

        // Map product variants (if loaded)
        if (prismaCollection.productVariants) {
            // Extract just the productVariant from the join table
            collection.productVariants = prismaCollection.productVariants.map((pv: any) => pv.productVariant);
        }

        return collection;
    }
}
