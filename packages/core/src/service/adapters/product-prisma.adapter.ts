/**
 * @description
 * Prisma implementation of the Product ORM adapter.
 * Converts Prisma results to TypeORM Product entities for backward compatibility.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { ProductTranslation } from '../../entity/product/product-translation.entity';
import { Product } from '../../entity/product/product.entity';
import { ProductPrismaRepository } from '../repositories/prisma/product-prisma.repository';

import {
    CreateProductInput,
    IProductOrmAdapter,
    ProductListOptions,
    ProductTranslationInput,
    UpdateProductInput,
} from './product-orm.adapter';

@Injectable()
export class ProductPrismaAdapter implements IProductOrmAdapter {
    constructor(private readonly repository: ProductPrismaRepository) {}

    async findOne(id: ID, includeRelations: boolean = true): Promise<Product | undefined> {
        const prismaProduct = await this.repository.findOne(id, includeRelations);

        if (!prismaProduct) {
            return undefined;
        }

        return this.mapToEntity(prismaProduct);
    }

    async findBySlug(slug: string, languageCode: string = 'en'): Promise<Product | undefined> {
        const prismaProduct = await this.repository.findBySlug(slug, languageCode);

        if (!prismaProduct) {
            return undefined;
        }

        return this.mapToEntity(prismaProduct);
    }

    async findAll(options: ProductListOptions = {}): Promise<PaginatedList<Product>> {
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

    async create(data: CreateProductInput): Promise<Product> {
        const prismaProduct = await this.repository.create({
            enabled: data.enabled,
            featuredAssetId: data.featuredAssetId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaProduct);
    }

    async update(id: ID, data: UpdateProductInput): Promise<Product> {
        const prismaProduct = await this.repository.update(id, {
            enabled: data.enabled,
            featuredAssetId: data.featuredAssetId,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaProduct);
    }

    async softDelete(id: ID): Promise<void> {
        await this.repository.softDelete(id);
    }

    async restore(id: ID): Promise<Product> {
        const prismaProduct = await this.repository.restore(id);
        return this.mapToEntity(prismaProduct);
    }

    async search(
        searchTerm: string,
        options: { skip?: number; take?: number; languageCode?: string } = {},
    ): Promise<PaginatedList<Product>> {
        const result = await this.repository.search(searchTerm, options);

        return {
            items: result.items.map(item => this.mapToEntity(item)),
            totalItems: result.totalItems,
        };
    }

    async upsertTranslation(productId: ID, translation: ProductTranslationInput): Promise<void> {
        await this.repository.upsertTranslation(productId, translation.languageCode, {
            name: translation.name,
            slug: translation.slug,
            description: translation.description,
        });
    }

    async getVariants(productId: ID): Promise<any[]> {
        return this.repository.getVariants(productId);
    }

    async addAsset(productId: ID, assetId: ID, position?: number): Promise<void> {
        await this.repository.addAsset(productId, assetId, position);
    }

    async removeAsset(productId: ID, assetId: ID): Promise<void> {
        await this.repository.removeAsset(productId, assetId);
    }

    async setFeaturedAsset(productId: ID, assetId: ID | null): Promise<Product> {
        const prismaProduct = await this.repository.setFeaturedAsset(productId, assetId);
        return this.mapToEntity(prismaProduct);
    }

    async addToChannel(productId: ID, channelId: ID): Promise<void> {
        await this.repository.addToChannel(productId, channelId);
    }

    async removeFromChannel(productId: ID, channelId: ID): Promise<void> {
        await this.repository.removeFromChannel(productId, channelId);
    }

    /**
     * Map Prisma Product to TypeORM Product entity
     * This ensures backward compatibility with existing code
     */
    private mapToEntity(prismaProduct: any): Product {
        const product = new Product({
            id: prismaProduct.id,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
            deletedAt: prismaProduct.deletedAt,
            enabled: prismaProduct.enabled,
            featuredAssetId: prismaProduct.featuredAssetId,
            customFields: prismaProduct.customFields,
        });

        // Map translations
        if (prismaProduct.translations) {
            product.translations = prismaProduct.translations.map(
                (t: any) =>
                    new ProductTranslation({
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

        // Map featured asset (if loaded)
        if (prismaProduct.featuredAsset) {
            product.featuredAsset = prismaProduct.featuredAsset;
        }

        // Map variants (if loaded)
        if (prismaProduct.variants) {
            product.variants = prismaProduct.variants;
        }

        // Map assets (if loaded)
        if (prismaProduct.assets) {
            // ProductAsset join table entities
            product.assets = prismaProduct.assets;
        }

        // Map option groups (if loaded)
        if (prismaProduct.optionGroups) {
            product.optionGroups = prismaProduct.optionGroups;
        }

        // Map facet values (if loaded)
        if (prismaProduct.facetValues) {
            // Extract just the facetValue from the join table
            product.facetValues = prismaProduct.facetValues.map((fv: any) => fv.facetValue);
        }

        // Map channels (if loaded)
        if (prismaProduct.channels) {
            // Extract just the channel from the join table
            product.channels = prismaProduct.channels.map((c: any) => c.channel);
        }

        return product;
    }
}
