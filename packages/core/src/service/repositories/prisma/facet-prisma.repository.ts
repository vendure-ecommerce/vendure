/**
 * @description
 * Prisma-based repository for Facet entity operations.
 * Handles CRUD operations for Facets with their values, translations, and channels.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface FacetListOptions {
    skip?: number;
    take?: number;
    filter?: {
        isPrivate?: boolean;
        code?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateFacetData {
    isPrivate?: boolean;
    code: string;
    customFields?: Record<string, any>;
}

export interface UpdateFacetData {
    isPrivate?: boolean;
    code?: string;
    customFields?: Record<string, any>;
}

export interface CreateFacetValueData {
    code: string;
    facetId: string;
    customFields?: Record<string, any>;
}

export interface UpdateFacetValueData {
    code?: string;
    customFields?: Record<string, any>;
}

export interface FacetTranslationData {
    name: string;
}

export interface FacetValueTranslationData {
    name: string;
}

/**
 * Default include for loading Facet relations
 */
const DEFAULT_FACET_INCLUDE = {
    translations: true,
    values: {
        include: {
            translations: true,
        },
        orderBy: {
            createdAt: 'asc' as const,
        },
    },
} satisfies Prisma.FacetInclude;

@Injectable()
export class FacetPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single facet by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_FACET_INCLUDE : undefined;

        const facet = await this.prisma.facet.findUnique({
            where: { id: String(id) },
            include,
        });

        return facet || undefined;
    }

    /**
     * Find a facet by code
     */
    async findByCode(code: string, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_FACET_INCLUDE : undefined;

        const facet = await this.prisma.facet.findUnique({
            where: { code },
            include,
        });

        return facet || undefined;
    }

    /**
     * Find all facets with pagination and filtering
     */
    async findAll(options: FacetListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.FacetWhereInput = {};

        if (filter?.isPrivate !== undefined) {
            where.isPrivate = filter.isPrivate;
        }

        if (filter?.code) {
            where.code = {
                contains: filter.code,
                mode: 'insensitive',
            };
        }

        // Build orderBy
        let orderBy: Prisma.FacetOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.facet.findMany({
                where,
                include: DEFAULT_FACET_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.facet.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Create a new facet
     */
    async create(data: CreateFacetData): Promise<any> {
        const facet = await this.prisma.facet.create({
            data: {
                isPrivate: data.isPrivate ?? false,
                code: data.code,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_FACET_INCLUDE,
        });

        return facet;
    }

    /**
     * Update an existing facet
     */
    async update(id: ID, data: UpdateFacetData): Promise<any> {
        const updateData: Prisma.FacetUpdateInput = {};

        if (data.isPrivate !== undefined) {
            updateData.isPrivate = data.isPrivate;
        }

        if (data.code !== undefined) {
            updateData.code = data.code;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const facet = await this.prisma.facet.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_FACET_INCLUDE,
        });

        return facet;
    }

    /**
     * Delete a facet
     */
    async delete(id: ID): Promise<void> {
        await this.prisma.facet.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Upsert a translation for a facet
     */
    async upsertTranslation(facetId: ID, languageCode: string, data: FacetTranslationData): Promise<void> {
        await this.prisma.facetTranslation.upsert({
            where: {
                facetId_languageCode: {
                    facetId: String(facetId),
                    languageCode,
                },
            },
            create: {
                facetId: String(facetId),
                languageCode,
                name: data.name,
            },
            update: {
                name: data.name,
            },
        });
    }

    /**
     * Find a facet value by ID
     */
    async findValueById(id: ID): Promise<any | undefined> {
        const facetValue = await this.prisma.facetValue.findUnique({
            where: { id: String(id) },
            include: {
                translations: true,
                facet: {
                    include: {
                        translations: true,
                    },
                },
            },
        });

        return facetValue || undefined;
    }

    /**
     * Find all values for a facet
     */
    async findValuesByFacetId(facetId: ID): Promise<any[]> {
        const facetValues = await this.prisma.facetValue.findMany({
            where: {
                facetId: String(facetId),
            },
            include: {
                translations: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return facetValues;
    }

    /**
     * Create a new facet value
     */
    async createValue(data: CreateFacetValueData): Promise<any> {
        const facetValue = await this.prisma.facetValue.create({
            data: {
                code: data.code,
                facetId: data.facetId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: {
                translations: true,
                facet: {
                    include: {
                        translations: true,
                    },
                },
            },
        });

        return facetValue;
    }

    /**
     * Update an existing facet value
     */
    async updateValue(id: ID, data: UpdateFacetValueData): Promise<any> {
        const updateData: Prisma.FacetValueUpdateInput = {};

        if (data.code !== undefined) {
            updateData.code = data.code;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const facetValue = await this.prisma.facetValue.update({
            where: { id: String(id) },
            data: updateData,
            include: {
                translations: true,
                facet: {
                    include: {
                        translations: true,
                    },
                },
            },
        });

        return facetValue;
    }

    /**
     * Delete a facet value
     */
    async deleteValue(id: ID): Promise<void> {
        await this.prisma.facetValue.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Upsert a translation for a facet value
     */
    async upsertValueTranslation(
        facetValueId: ID,
        languageCode: string,
        data: FacetValueTranslationData,
    ): Promise<void> {
        await this.prisma.facetValueTranslation.upsert({
            where: {
                facetValueId_languageCode: {
                    facetValueId: String(facetValueId),
                    languageCode,
                },
            },
            create: {
                facetValueId: String(facetValueId),
                languageCode,
                name: data.name,
            },
            update: {
                name: data.name,
            },
        });
    }

    /**
     * Add a facet to a channel
     */
    async addToChannel(facetId: ID, channelId: ID): Promise<void> {
        await this.prisma.facetChannel.create({
            data: {
                facetId: String(facetId),
                channelId: String(channelId),
            },
        });
    }

    /**
     * Remove a facet from a channel
     */
    async removeFromChannel(facetId: ID, channelId: ID): Promise<void> {
        await this.prisma.facetChannel.deleteMany({
            where: {
                facetId: String(facetId),
                channelId: String(channelId),
            },
        });
    }

    /**
     * Get all channels for a facet
     */
    async getChannels(facetId: ID): Promise<any[]> {
        const relations = await this.prisma.facetChannel.findMany({
            where: {
                facetId: String(facetId),
            },
            include: {
                channel: true,
            },
        });

        return relations.map(r => r.channel);
    }
}
