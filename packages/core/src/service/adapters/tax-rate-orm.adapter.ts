/**
 * @description
 * ORM-agnostic adapter interface for TaxRate entity operations.
 * This abstraction allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';

export interface TaxRateFilterInput {
    enabled?: boolean;
    categoryId?: string;
    zoneId?: string;
    customerGroupId?: string;
}

export interface TaxRateListOptions {
    skip?: number;
    take?: number;
    filter?: TaxRateFilterInput;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateTaxRateInput {
    name: string;
    enabled?: boolean;
    value: number;
    categoryId: string;
    zoneId: string;
    customerGroupId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateTaxRateInput {
    name?: string;
    enabled?: boolean;
    value?: number;
    categoryId?: string;
    zoneId?: string;
    customerGroupId?: string | null;
    customFields?: Record<string, any>;
}

/**
 * ORM-agnostic TaxRate adapter interface
 */
export interface ITaxRateOrmAdapter {
    /**
     * Find a single tax rate by ID
     */
    findOne(id: ID, includeRelations?: boolean): Promise<TaxRate | undefined>;

    /**
     * Find all tax rates with pagination and filtering
     */
    findAll(options?: TaxRateListOptions): Promise<PaginatedList<TaxRate>>;

    /**
     * Find tax rates by category ID
     */
    findByCategory(categoryId: ID): Promise<TaxRate[]>;

    /**
     * Find tax rates by zone ID
     */
    findByZone(zoneId: ID): Promise<TaxRate[]>;

    /**
     * Find applicable tax rate for a given category, zone, and optional customer group
     * Implements fallback logic: tries customer-group-specific rate first, then general rate
     */
    findApplicableTaxRate(categoryId: ID, zoneId: ID, customerGroupId?: ID): Promise<TaxRate | undefined>;

    /**
     * Create a new tax rate
     */
    create(data: CreateTaxRateInput): Promise<TaxRate>;

    /**
     * Update an existing tax rate
     */
    update(id: ID, data: UpdateTaxRateInput): Promise<TaxRate>;

    /**
     * Delete a tax rate
     */
    delete(id: ID): Promise<void>;
}
