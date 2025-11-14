/**
 * @description
 * Prisma implementation of the Facet ORM adapter.
 * Converts Prisma results to TypeORM Facet entities for backward compatibility.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { FacetValueTranslation } from '../../entity/facet-value/facet-value-translation.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { FacetTranslation } from '../../entity/facet/facet-translation.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { FacetPrismaRepository } from '../repositories/prisma/facet-prisma.repository';

import {
    CreateFacetInput,
    CreateFacetValueInput,
    FacetListOptions,
    FacetTranslationInput,
    FacetValueTranslationInput,
    IFacetOrmAdapter,
    UpdateFacetInput,
    UpdateFacetValueInput,
} from './facet-orm.adapter';

@Injectable()
export class FacetPrismaAdapter implements IFacetOrmAdapter {
    constructor(private readonly repository: FacetPrismaRepository) {}

    async findOne(id: ID, includeRelations: boolean = true): Promise<Facet | undefined> {
        const prismaFacet = await this.repository.findOne(id, includeRelations);

        if (!prismaFacet) {
            return undefined;
        }

        return this.mapToEntity(prismaFacet);
    }

    async findByCode(code: string, includeRelations: boolean = true): Promise<Facet | undefined> {
        const prismaFacet = await this.repository.findByCode(code, includeRelations);

        if (!prismaFacet) {
            return undefined;
        }

        return this.mapToEntity(prismaFacet);
    }

    async findAll(options: FacetListOptions = {}): Promise<PaginatedList<Facet>> {
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

    async create(data: CreateFacetInput): Promise<Facet> {
        const prismaFacet = await this.repository.create({
            isPrivate: data.isPrivate,
            code: data.code,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaFacet);
    }

    async update(id: ID, data: UpdateFacetInput): Promise<Facet> {
        const prismaFacet = await this.repository.update(id, {
            isPrivate: data.isPrivate,
            code: data.code,
            customFields: data.customFields,
        });

        return this.mapToEntity(prismaFacet);
    }

    async delete(id: ID): Promise<void> {
        await this.repository.delete(id);
    }

    async upsertTranslation(facetId: ID, translation: FacetTranslationInput): Promise<void> {
        await this.repository.upsertTranslation(facetId, translation.languageCode, {
            name: translation.name,
        });
    }

    async findValueById(id: ID): Promise<FacetValue | undefined> {
        const prismaFacetValue = await this.repository.findValueById(id);

        if (!prismaFacetValue) {
            return undefined;
        }

        return this.mapValueToEntity(prismaFacetValue);
    }

    async findValuesByFacetId(facetId: ID): Promise<FacetValue[]> {
        const prismaFacetValues = await this.repository.findValuesByFacetId(facetId);
        return prismaFacetValues.map(value => this.mapValueToEntity(value));
    }

    async createValue(data: CreateFacetValueInput): Promise<FacetValue> {
        const prismaFacetValue = await this.repository.createValue({
            code: data.code,
            facetId: data.facetId,
            customFields: data.customFields,
        });

        return this.mapValueToEntity(prismaFacetValue);
    }

    async updateValue(id: ID, data: UpdateFacetValueInput): Promise<FacetValue> {
        const prismaFacetValue = await this.repository.updateValue(id, {
            code: data.code,
            customFields: data.customFields,
        });

        return this.mapValueToEntity(prismaFacetValue);
    }

    async deleteValue(id: ID): Promise<void> {
        await this.repository.deleteValue(id);
    }

    async upsertValueTranslation(facetValueId: ID, translation: FacetValueTranslationInput): Promise<void> {
        await this.repository.upsertValueTranslation(facetValueId, translation.languageCode, {
            name: translation.name,
        });
    }

    async addToChannel(facetId: ID, channelId: ID): Promise<void> {
        await this.repository.addToChannel(facetId, channelId);
    }

    async removeFromChannel(facetId: ID, channelId: ID): Promise<void> {
        await this.repository.removeFromChannel(facetId, channelId);
    }

    async getChannels(facetId: ID): Promise<any[]> {
        return this.repository.getChannels(facetId);
    }

    /**
     * Map Prisma Facet to TypeORM Facet entity
     * This ensures backward compatibility with existing code
     */
    private mapToEntity(prismaFacet: any): Facet {
        const facet = new Facet({
            id: prismaFacet.id,
            createdAt: prismaFacet.createdAt,
            updatedAt: prismaFacet.updatedAt,
            isPrivate: prismaFacet.isPrivate,
            code: prismaFacet.code,
            customFields: prismaFacet.customFields,
        });

        // Map translations
        if (prismaFacet.translations) {
            facet.translations = prismaFacet.translations.map(
                (t: any) =>
                    new FacetTranslation({
                        id: t.id,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                        languageCode: t.languageCode,
                        name: t.name,
                    }),
            );
        }

        // Map values
        if (prismaFacet.values) {
            facet.values = prismaFacet.values.map((v: any) => this.mapValueToEntity(v));
        }

        return facet;
    }

    /**
     * Map Prisma FacetValue to TypeORM FacetValue entity
     */
    private mapValueToEntity(prismaFacetValue: any): FacetValue {
        const facetValue = new FacetValue({
            id: prismaFacetValue.id,
            createdAt: prismaFacetValue.createdAt,
            updatedAt: prismaFacetValue.updatedAt,
            code: prismaFacetValue.code,
            facetId: prismaFacetValue.facetId,
            customFields: prismaFacetValue.customFields,
        });

        // Map translations
        if (prismaFacetValue.translations) {
            facetValue.translations = prismaFacetValue.translations.map(
                (t: any) =>
                    new FacetValueTranslation({
                        id: t.id,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                        languageCode: t.languageCode,
                        name: t.name,
                    }),
            );
        }

        // Map facet (if loaded)
        if (prismaFacetValue.facet) {
            facetValue.facet = this.mapToEntity(prismaFacetValue.facet);
        }

        return facetValue;
    }
}
