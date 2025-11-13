/**
 * @description
 * Prisma-based repository for Product entity operations.
 * Handles CRUD operations for Products with their relations (variants, translations, assets, etc.)
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface ProductListOptions {
    skip?: number;
    take?: number;
    filter?: {
        enabled?: boolean;
        name?: string;
        slug?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateProductData {
    enabled?: boolean;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateProductData {
    enabled?: boolean;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

/**
 * Default include for loading Product relations
 */
const DEFAULT_PRODUCT_INCLUDE = {
    translations: true,
    variants: {
        include: {
            translations: true,
            prices: true,
        },
    },
    assets: {
        include: {
            asset: true,
        },
        orderBy: {
            position: 'asc' as const,
        },
    },
    featuredAsset: true,
    optionGroups: {
        include: {
            translations: true,
            options: {
                include: {
                    translations: true,
                },
            },
        },
    },
    facetValues: {
        include: {
            facetValue: {
                include: {
                    translations: true,
                    facet: {
                        include: {
                            translations: true,
                        },
                    },
                },
            },
        },
    },
    channels: {
        include: {
            channel: true,
        },
    },
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single product by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_PRODUCT_INCLUDE : undefined;

        const product = await this.prisma.product.findUnique({
            where: { id: String(id) },
            include,
        });

        return product || undefined;
    }

    /**
     * Find a product by slug (from translation)
     */
    async findBySlug(slug: string, languageCode: string = 'en'): Promise<any | undefined> {
        const product = await this.prisma.product.findFirst({
            where: {
                translations: {
                    some: {
                        slug,
                        languageCode,
                    },
                },
                deletedAt: null,
            },
            include: DEFAULT_PRODUCT_INCLUDE,
        });

        return product || undefined;
    }

    /**
     * Find all products with pagination and filtering
     */
    async findAll(options: ProductListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };

        if (filter?.enabled !== undefined) {
            where.enabled = filter.enabled;
        }

        if (filter?.name) {
            where.translations = {
                some: {
                    name: {
                        contains: filter.name,
                        mode: 'insensitive',
                    },
                },
            };
        }

        if (filter?.slug) {
            where.translations = {
                some: {
                    slug: {
                        contains: filter.slug,
                        mode: 'insensitive',
                    },
                },
            };
        }

        // Build orderBy
        let orderBy: Prisma.ProductOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: DEFAULT_PRODUCT_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Create a new product
     */
    async create(data: CreateProductData): Promise<any> {
        const product = await this.prisma.product.create({
            data: {
                enabled: data.enabled ?? true,
                featuredAssetId: data.featuredAssetId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_PRODUCT_INCLUDE,
        });

        return product;
    }

    /**
     * Update an existing product
     */
    async update(id: ID, data: UpdateProductData): Promise<any> {
        const updateData: Prisma.ProductUpdateInput = {};

        if (data.enabled !== undefined) {
            updateData.enabled = data.enabled;
        }

        if (data.featuredAssetId !== undefined) {
            updateData.featuredAssetId = data.featuredAssetId;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const product = await this.prisma.product.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_PRODUCT_INCLUDE,
        });

        return product;
    }

    /**
     * Soft delete a product
     */
    async softDelete(id: ID): Promise<void> {
        await this.prisma.product.update({
            where: { id: String(id) },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Restore a soft-deleted product
     */
    async restore(id: ID): Promise<any> {
        const product = await this.prisma.product.update({
            where: { id: String(id) },
            data: {
                deletedAt: null,
            },
            include: DEFAULT_PRODUCT_INCLUDE,
        });

        return product;
    }

    /**
     * Search products by name or description
     */
    async search(
        searchTerm: string,
        options: { skip?: number; take?: number; languageCode?: string } = {},
    ): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, languageCode = 'en' } = options;

        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
            translations: {
                some: {
                    languageCode,
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            slug: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            },
        };

        const [items, totalItems] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: DEFAULT_PRODUCT_INCLUDE,
                skip,
                take,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    // =========================================================================
    // Translation Management
    // =========================================================================

    /**
     * Add or update a translation for a product
     */
    async upsertTranslation(
        productId: ID,
        languageCode: string,
        data: { name: string; slug: string; description?: string },
    ): Promise<any> {
        const translation = await this.prisma.productTranslation.upsert({
            where: {
                languageCode_productId: {
                    languageCode,
                    productId: String(productId),
                },
            },
            create: {
                languageCode,
                productId: String(productId),
                name: data.name,
                slug: data.slug,
                description: data.description || '',
            },
            update: {
                name: data.name,
                slug: data.slug,
                description: data.description || '',
            },
        });

        return translation;
    }

    /**
     * Get all translations for a product
     */
    async getTranslations(productId: ID): Promise<any[]> {
        const translations = await this.prisma.productTranslation.findMany({
            where: {
                productId: String(productId),
            },
        });

        return translations;
    }

    // =========================================================================
    // Variant Management
    // =========================================================================

    /**
     * Get all variants for a product
     */
    async getVariants(productId: ID): Promise<any[]> {
        const variants = await this.prisma.productVariant.findMany({
            where: {
                productId: String(productId),
                deletedAt: null,
            },
            include: {
                translations: true,
                prices: true,
                options: {
                    include: {
                        option: {
                            include: {
                                translations: true,
                            },
                        },
                    },
                },
            },
        });

        return variants;
    }

    // =========================================================================
    // Asset Management
    // =========================================================================

    /**
     * Add an asset to a product
     */
    async addAsset(productId: ID, assetId: ID, position?: number): Promise<any> {
        const asset = await this.prisma.productAsset.create({
            data: {
                productId: String(productId),
                assetId: String(assetId),
                position: position ?? 0,
            },
            include: {
                asset: true,
            },
        });

        return asset;
    }

    /**
     * Remove an asset from a product
     */
    async removeAsset(productId: ID, assetId: ID): Promise<void> {
        await this.prisma.productAsset.deleteMany({
            where: {
                productId: String(productId),
                assetId: String(assetId),
            },
        });
    }

    /**
     * Set featured asset for a product
     */
    async setFeaturedAsset(productId: ID, assetId: ID | null): Promise<any> {
        const product = await this.prisma.product.update({
            where: { id: String(productId) },
            data: {
                featuredAssetId: assetId ? String(assetId) : null,
            },
            include: {
                featuredAsset: true,
            },
        });

        return product;
    }

    // =========================================================================
    // Facet Value Management
    // =========================================================================

    /**
     * Add a facet value to a product
     */
    async addFacetValue(productId: ID, facetValueId: ID): Promise<void> {
        await this.prisma.productFacetValue.create({
            data: {
                productId: String(productId),
                facetValueId: String(facetValueId),
            },
        });
    }

    /**
     * Remove a facet value from a product
     */
    async removeFacetValue(productId: ID, facetValueId: ID): Promise<void> {
        await this.prisma.productFacetValue.delete({
            where: {
                productId_facetValueId: {
                    productId: String(productId),
                    facetValueId: String(facetValueId),
                },
            },
        });
    }

    // =========================================================================
    // Channel Management
    // =========================================================================

    /**
     * Add product to a channel
     */
    async addToChannel(productId: ID, channelId: ID): Promise<void> {
        await this.prisma.productChannel.create({
            data: {
                productId: String(productId),
                channelId: String(channelId),
            },
        });
    }

    /**
     * Remove product from a channel
     */
    async removeFromChannel(productId: ID, channelId: ID): Promise<void> {
        await this.prisma.productChannel.delete({
            where: {
                productId_channelId: {
                    productId: String(productId),
                    channelId: String(channelId),
                },
            },
        });
    }
}
