/**
 * @description
 * ORM-agnostic adapter interface for Collection entity operations.
 * This abstraction allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { Collection } from '../../entity/collection/collection.entity';

export interface CollectionFilterInput {
    isRoot?: boolean;
    isPrivate?: boolean;
    parentId?: string | null;
}

export interface CollectionListOptions {
    skip?: number;
    take?: number;
    filter?: CollectionFilterInput;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateCollectionInput {
    isRoot?: boolean;
    position: number;
    isPrivate?: boolean;
    filters?: any[];
    parentId?: string | null;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateCollectionInput {
    position?: number;
    isPrivate?: boolean;
    filters?: any[];
    parentId?: string | null;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface CollectionTranslationInput {
    languageCode: string;
    name: string;
    slug: string;
    description?: string;
}

/**
 * ORM-agnostic Collection adapter interface
 */
export interface ICollectionOrmAdapter {
    /**
     * Find a single collection by ID
     */
    findOne(id: ID, includeRelations?: boolean): Promise<Collection | undefined>;

    /**
     * Find a collection by slug
     */
    findBySlug(slug: string, languageCode?: string): Promise<Collection | undefined>;

    /**
     * Find all collections with pagination and filtering
     */
    findAll(options?: CollectionListOptions): Promise<PaginatedList<Collection>>;

    /**
     * Find root collections
     */
    findRoots(): Promise<Collection[]>;

    /**
     * Find children of a collection
     */
    findChildren(parentId: ID): Promise<Collection[]>;

    /**
     * Find all descendants of a collection (recursive)
     */
    findDescendants(parentId: ID): Promise<Collection[]>;

    /**
     * Get ancestors of a collection (from root to parent)
     */
    findAncestors(collectionId: ID): Promise<Collection[]>;

    /**
     * Create a new collection
     */
    create(data: CreateCollectionInput): Promise<Collection>;

    /**
     * Update an existing collection
     */
    update(id: ID, data: UpdateCollectionInput): Promise<Collection>;

    /**
     * Move collection to a new parent
     */
    moveToParent(id: ID, parentId: ID | null, position?: number): Promise<Collection>;

    /**
     * Delete a collection
     */
    delete(id: ID): Promise<void>;

    /**
     * Upsert a translation for a collection
     */
    upsertTranslation(collectionId: ID, translation: CollectionTranslationInput): Promise<void>;

    /**
     * Add an asset to a collection
     */
    addAsset(collectionId: ID, assetId: ID, position?: number): Promise<void>;

    /**
     * Remove an asset from a collection
     */
    removeAsset(collectionId: ID, assetId: ID): Promise<void>;

    /**
     * Set featured asset for a collection
     */
    setFeaturedAsset(collectionId: ID, assetId: ID | null): Promise<Collection>;

    /**
     * Add a product variant to a collection
     */
    addProductVariant(collectionId: ID, productVariantId: ID): Promise<void>;

    /**
     * Remove a product variant from a collection
     */
    removeProductVariant(collectionId: ID, productVariantId: ID): Promise<void>;

    /**
     * Get all product variants in a collection
     */
    getProductVariants(collectionId: ID): Promise<any[]>;
}
