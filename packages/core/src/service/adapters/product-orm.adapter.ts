/**
 * @description
 * ORM-agnostic adapter interface for Product entity operations.
 * This abstraction allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { Product } from '../../entity/product/product.entity';

export interface ProductFilterInput {
    enabled?: boolean;
    name?: string;
    slug?: string;
}

export interface ProductListOptions {
    skip?: number;
    take?: number;
    filter?: ProductFilterInput;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateProductInput {
    enabled?: boolean;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateProductInput {
    enabled?: boolean;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface ProductTranslationInput {
    languageCode: string;
    name: string;
    slug: string;
    description?: string;
}

/**
 * ORM-agnostic Product adapter interface
 */
export interface IProductOrmAdapter {
    /**
     * Find a single product by ID
     */
    findOne(id: ID, includeRelations?: boolean): Promise<Product | undefined>;

    /**
     * Find a product by slug
     */
    findBySlug(slug: string, languageCode?: string): Promise<Product | undefined>;

    /**
     * Find all products with pagination
     */
    findAll(options?: ProductListOptions): Promise<PaginatedList<Product>>;

    /**
     * Create a new product
     */
    create(data: CreateProductInput): Promise<Product>;

    /**
     * Update an existing product
     */
    update(id: ID, data: UpdateProductInput): Promise<Product>;

    /**
     * Soft delete a product
     */
    softDelete(id: ID): Promise<void>;

    /**
     * Restore a soft-deleted product
     */
    restore(id: ID): Promise<Product>;

    /**
     * Search products by name or description
     */
    search(
        searchTerm: string,
        options?: { skip?: number; take?: number; languageCode?: string },
    ): Promise<PaginatedList<Product>>;

    /**
     * Add or update a translation
     */
    upsertTranslation(productId: ID, translation: ProductTranslationInput): Promise<void>;

    /**
     * Get all variants for a product
     */
    getVariants(productId: ID): Promise<any[]>;

    /**
     * Add an asset to a product
     */
    addAsset(productId: ID, assetId: ID, position?: number): Promise<void>;

    /**
     * Remove an asset from a product
     */
    removeAsset(productId: ID, assetId: ID): Promise<void>;

    /**
     * Set featured asset
     */
    setFeaturedAsset(productId: ID, assetId: ID | null): Promise<Product>;

    /**
     * Add product to a channel
     */
    addToChannel(productId: ID, channelId: ID): Promise<void>;

    /**
     * Remove product from a channel
     */
    removeFromChannel(productId: ID, channelId: ID): Promise<void>;
}
