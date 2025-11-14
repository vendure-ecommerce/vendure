/**
 * @description
 * Prisma-based repository for Collection entity operations.
 * Handles CRUD operations for Collections with their tree structure, translations, and relations.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface CollectionListOptions {
    skip?: number;
    take?: number;
    filter?: {
        isRoot?: boolean;
        isPrivate?: boolean;
        parentId?: string | null;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateCollectionData {
    isRoot?: boolean;
    position: number;
    isPrivate?: boolean;
    filters?: any[];
    parentId?: string | null;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateCollectionData {
    position?: number;
    isPrivate?: boolean;
    filters?: any[];
    parentId?: string | null;
    featuredAssetId?: string | null;
    customFields?: Record<string, any>;
}

export interface CollectionTranslationData {
    name: string;
    slug: string;
    description?: string;
}

/**
 * Default include for loading Collection relations
 */
const DEFAULT_COLLECTION_INCLUDE = {
    translations: true,
    parent: {
        include: {
            translations: true,
        },
    },
    children: {
        include: {
            translations: true,
        },
    },
    featuredAsset: true,
    assets: {
        include: {
            asset: true,
        },
        orderBy: {
            position: 'asc' as const,
        },
    },
} satisfies Prisma.CollectionInclude;

@Injectable()
export class CollectionPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single collection by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_COLLECTION_INCLUDE : undefined;

        const collection = await this.prisma.collection.findUnique({
            where: { id: String(id) },
            include,
        });

        return collection || undefined;
    }

    /**
     * Find a collection by slug
     */
    async findBySlug(slug: string, languageCode: string = 'en'): Promise<any | undefined> {
        const collection = await this.prisma.collection.findFirst({
            where: {
                translations: {
                    some: {
                        slug,
                        languageCode,
                    },
                },
            },
            include: DEFAULT_COLLECTION_INCLUDE,
        });

        return collection || undefined;
    }

    /**
     * Find all collections with pagination and filtering
     */
    async findAll(options: CollectionListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.CollectionWhereInput = {};

        if (filter?.isRoot !== undefined) {
            where.isRoot = filter.isRoot;
        }

        if (filter?.isPrivate !== undefined) {
            where.isPrivate = filter.isPrivate;
        }

        if (filter?.parentId !== undefined) {
            where.parentId = filter.parentId;
        }

        // Build orderBy
        let orderBy: Prisma.CollectionOrderByWithRelationInput = {
            position: 'asc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.collection.findMany({
                where,
                include: DEFAULT_COLLECTION_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.collection.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Find root collections
     */
    async findRoots(): Promise<any[]> {
        const collections = await this.prisma.collection.findMany({
            where: {
                isRoot: true,
            },
            include: DEFAULT_COLLECTION_INCLUDE,
            orderBy: {
                position: 'asc',
            },
        });

        return collections;
    }

    /**
     * Find children of a collection
     */
    async findChildren(parentId: ID): Promise<any[]> {
        const collections = await this.prisma.collection.findMany({
            where: {
                parentId: String(parentId),
            },
            include: DEFAULT_COLLECTION_INCLUDE,
            orderBy: {
                position: 'asc',
            },
        });

        return collections;
    }

    /**
     * Find all descendants of a collection (recursive)
     */
    async findDescendants(parentId: ID): Promise<any[]> {
        // This is a simplified implementation
        // For production, consider using recursive CTEs or a separate query
        const descendants: any[] = [];
        const queue = [String(parentId)];

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (!currentId) {
                continue;
            }

            const children = await this.prisma.collection.findMany({
                where: {
                    parentId: currentId,
                },
                include: DEFAULT_COLLECTION_INCLUDE,
            });

            descendants.push(...children);
            queue.push(...children.map(c => c.id));
        }

        return descendants;
    }

    /**
     * Get ancestors of a collection (from root to parent)
     */
    async findAncestors(collectionId: ID): Promise<any[]> {
        const ancestors: any[] = [];
        let currentId: string | null = String(collectionId);

        while (currentId) {
            const collection = await this.prisma.collection.findUnique({
                where: { id: currentId },
                include: {
                    parent: {
                        include: {
                            translations: true,
                        },
                    },
                    translations: true,
                },
            });

            if (!collection || !collection.parentId || !collection.parent) {
                break;
            }

            ancestors.unshift(collection.parent);
            currentId = collection.parent.parentId;
        }

        return ancestors;
    }

    /**
     * Create a new collection
     */
    async create(data: CreateCollectionData): Promise<any> {
        const collection = await this.prisma.collection.create({
            data: {
                isRoot: data.isRoot ?? false,
                position: data.position,
                isPrivate: data.isPrivate ?? false,
                filters: data.filters as Prisma.JsonValue,
                parentId: data.parentId,
                featuredAssetId: data.featuredAssetId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_COLLECTION_INCLUDE,
        });

        return collection;
    }

    /**
     * Update an existing collection
     */
    async update(id: ID, data: UpdateCollectionData): Promise<any> {
        const updateData: Prisma.CollectionUpdateInput = {};

        if (data.position !== undefined) {
            updateData.position = data.position;
        }

        if (data.isPrivate !== undefined) {
            updateData.isPrivate = data.isPrivate;
        }

        if (data.filters !== undefined) {
            updateData.filters = data.filters as Prisma.JsonValue;
        }

        if (data.parentId !== undefined) {
            updateData.parentId = data.parentId;
        }

        if (data.featuredAssetId !== undefined) {
            updateData.featuredAssetId = data.featuredAssetId;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const collection = await this.prisma.collection.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_COLLECTION_INCLUDE,
        });

        return collection;
    }

    /**
     * Move collection to a new parent
     */
    async moveToParent(id: ID, parentId: ID | null, position?: number): Promise<any> {
        const updateData: Prisma.CollectionUpdateInput = {
            parentId: parentId ? String(parentId) : null,
            isRoot: parentId === null,
        };

        if (position !== undefined) {
            updateData.position = position;
        }

        const collection = await this.prisma.collection.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_COLLECTION_INCLUDE,
        });

        return collection;
    }

    /**
     * Delete a collection
     */
    async delete(id: ID): Promise<void> {
        await this.prisma.collection.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Upsert a translation for a collection
     */
    async upsertTranslation(
        collectionId: ID,
        languageCode: string,
        data: CollectionTranslationData,
    ): Promise<void> {
        await this.prisma.collectionTranslation.upsert({
            where: {
                collectionId_languageCode: {
                    collectionId: String(collectionId),
                    languageCode,
                },
            },
            create: {
                collectionId: String(collectionId),
                languageCode,
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
    }

    /**
     * Add an asset to a collection
     */
    async addAsset(collectionId: ID, assetId: ID, position?: number): Promise<void> {
        // Find the current maximum position
        const maxPosition = await this.prisma.collectionAsset.findFirst({
            where: { collectionId: String(collectionId) },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const currentMaxPos: number = maxPosition?.position ?? -1;
        const newPosition = position ?? currentMaxPos + 1;

        await this.prisma.collectionAsset.create({
            data: {
                collectionId: String(collectionId),
                assetId: String(assetId),
                position: newPosition,
            },
        });
    }

    /**
     * Remove an asset from a collection
     */
    async removeAsset(collectionId: ID, assetId: ID): Promise<void> {
        await this.prisma.collectionAsset.deleteMany({
            where: {
                collectionId: String(collectionId),
                assetId: String(assetId),
            },
        });
    }

    /**
     * Set featured asset for a collection
     */
    async setFeaturedAsset(collectionId: ID, assetId: ID | null): Promise<any> {
        const collection = await this.prisma.collection.update({
            where: { id: String(collectionId) },
            data: {
                featuredAssetId: assetId ? String(assetId) : null,
            },
            include: DEFAULT_COLLECTION_INCLUDE,
        });

        return collection;
    }

    /**
     * Add a product variant to a collection
     */
    async addProductVariant(collectionId: ID, productVariantId: ID): Promise<void> {
        await this.prisma.collectionProductVariant.create({
            data: {
                collectionId: String(collectionId),
                productVariantId: String(productVariantId),
            },
        });
    }

    /**
     * Remove a product variant from a collection
     */
    async removeProductVariant(collectionId: ID, productVariantId: ID): Promise<void> {
        await this.prisma.collectionProductVariant.deleteMany({
            where: {
                collectionId: String(collectionId),
                productVariantId: String(productVariantId),
            },
        });
    }

    /**
     * Get all product variants in a collection
     */
    async getProductVariants(collectionId: ID): Promise<any[]> {
        const relations = await this.prisma.collectionProductVariant.findMany({
            where: {
                collectionId: String(collectionId),
            },
            include: {
                productVariant: {
                    include: {
                        translations: true,
                        product: {
                            include: {
                                translations: true,
                            },
                        },
                    },
                },
            },
        });

        return relations.map(r => r.productVariant);
    }
}
