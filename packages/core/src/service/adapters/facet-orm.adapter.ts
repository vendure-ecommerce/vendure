/**
 * @description
 * ORM-agnostic adapter interface for Facet entity operations.
 * This abstraction allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';

export interface FacetFilterInput {
    isPrivate?: boolean;
    code?: string;
}

export interface FacetListOptions {
    skip?: number;
    take?: number;
    filter?: FacetFilterInput;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateFacetInput {
    isPrivate?: boolean;
    code: string;
    customFields?: Record<string, any>;
}

export interface UpdateFacetInput {
    isPrivate?: boolean;
    code?: string;
    customFields?: Record<string, any>;
}

export interface FacetTranslationInput {
    languageCode: string;
    name: string;
}

export interface CreateFacetValueInput {
    code: string;
    facetId: string;
    customFields?: Record<string, any>;
}

export interface UpdateFacetValueInput {
    code?: string;
    customFields?: Record<string, any>;
}

export interface FacetValueTranslationInput {
    languageCode: string;
    name: string;
}

/**
 * ORM-agnostic Facet adapter interface
 */
export interface IFacetOrmAdapter {
    /**
     * Find a single facet by ID
     */
    findOne(id: ID, includeRelations?: boolean): Promise<Facet | undefined>;

    /**
     * Find a facet by code
     */
    findByCode(code: string, includeRelations?: boolean): Promise<Facet | undefined>;

    /**
     * Find all facets with pagination and filtering
     */
    findAll(options?: FacetListOptions): Promise<PaginatedList<Facet>>;

    /**
     * Create a new facet
     */
    create(data: CreateFacetInput): Promise<Facet>;

    /**
     * Update an existing facet
     */
    update(id: ID, data: UpdateFacetInput): Promise<Facet>;

    /**
     * Delete a facet
     */
    delete(id: ID): Promise<void>;

    /**
     * Upsert a translation for a facet
     */
    upsertTranslation(facetId: ID, translation: FacetTranslationInput): Promise<void>;

    /**
     * Find a facet value by ID
     */
    findValueById(id: ID): Promise<FacetValue | undefined>;

    /**
     * Find all values for a facet
     */
    findValuesByFacetId(facetId: ID): Promise<FacetValue[]>;

    /**
     * Create a new facet value
     */
    createValue(data: CreateFacetValueInput): Promise<FacetValue>;

    /**
     * Update an existing facet value
     */
    updateValue(id: ID, data: UpdateFacetValueInput): Promise<FacetValue>;

    /**
     * Delete a facet value
     */
    deleteValue(id: ID): Promise<void>;

    /**
     * Upsert a translation for a facet value
     */
    upsertValueTranslation(facetValueId: ID, translation: FacetValueTranslationInput): Promise<void>;

    /**
     * Add a facet to a channel
     */
    addToChannel(facetId: ID, channelId: ID): Promise<void>;

    /**
     * Remove a facet from a channel
     */
    removeFromChannel(facetId: ID, channelId: ID): Promise<void>;

    /**
     * Get all channels for a facet
     */
    getChannels(facetId: ID): Promise<any[]>;
}
