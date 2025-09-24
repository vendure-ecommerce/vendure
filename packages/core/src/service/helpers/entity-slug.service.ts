import { Injectable } from '@nestjs/common';
import { EntityMetadata, ObjectLiteral, Repository } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { TransactionalConnection } from '../../connection/transactional-connection';

import { SlugService } from './slug.service';

/**
 * @description
 * Parameters for entity slug generation
 */
export interface GenerateSlugFromInputParams {
    /**
     * The name of the entity (base entity, e.g., 'Product', 'Collection')
     */
    entityName: string;
    /**
     * The name of the field to check for uniqueness (e.g., 'slug', 'code')
     */
    fieldName: string;
    /**
     * The value to generate the slug from
     */
    inputValue: string;
    /**
     * Optional ID of the entity being updated
     */
    entityId?: string | number;
}

/**
 * @description
 * A service that handles slug generation for entities, ensuring uniqueness
 * and handling conflicts by appending numbers.
 *
 * @docsCategory services
 * @since 3.x.x
 */
@Injectable()
export class EntitySlugService {
    constructor(
        private slugService: SlugService,
        private connection: TransactionalConnection,
    ) {}

    /**
     * @description
     * Generates a slug from input value for an entity, ensuring uniqueness.
     * Automatically detects if the field exists on the base entity or its translation entity.
     *
     * @param ctx The request context
     * @param params Parameters for slug generation
     * @returns A unique slug string
     */
    async generateSlugFromInput(ctx: RequestContext, params: GenerateSlugFromInputParams): Promise<string> {
        const { entityName, fieldName, inputValue, entityId } = params;
        const { entityMetadata, actualEntityName } = this.findEntityWithField(entityName, fieldName);

        const repository = this.connection.getRepository(ctx, entityMetadata.target);
        const baseSlug = await this.slugService.generate(ctx, {
            value: inputValue,
            entityName: actualEntityName,
            fieldName,
        });
        let slug = baseSlug;
        let counter = 1;

        while (await this.fieldValueExists(ctx, repository, fieldName, slug, entityId)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    /**
     * @description
     * Finds the entity metadata for the given entity name and field name.
     * If the field doesn't exist on the base entity, it checks the translation entity.
     *
     * @param entityName The base entity name
     * @param fieldName The field name to find
     * @returns Object containing entityMetadata and actualEntityName
     */
    private findEntityWithField(
        entityName: string,
        fieldName: string,
    ): {
        entityMetadata: EntityMetadata;
        actualEntityName: string;
    } {
        // First, try to find the base entity
        const entityMetadata = this.connection.rawConnection.entityMetadatas.find(
            metadata => metadata.name === entityName,
        );

        if (!entityMetadata) {
            throw new UserInputError(`error.entity-not-found`, {
                entityName,
            });
        }

        // Check if the field exists on the base entity
        const baseEntityHasField = entityMetadata.columns.find(col => col.propertyName === fieldName);

        if (baseEntityHasField) {
            return { entityMetadata, actualEntityName: entityName };
        }

        // If field doesn't exist on base entity, try to find the translation entity through relations
        const translationRelation = entityMetadata.relations.find(r => r.propertyName === 'translations');

        if (!translationRelation) {
            throw new UserInputError(`error.entity-has-no-field`, {
                entityName,
                fieldName,
            });
        }

        // Get the translation entity metadata from the relation
        const translationMetadata = this.connection.rawConnection.getMetadata(translationRelation.type);

        if (!translationMetadata) {
            throw new UserInputError(`error.entity-has-no-field`, {
                entityName,
                fieldName,
            });
        }

        const translationEntityHasField = translationMetadata.columns.find(
            col => col.propertyName === fieldName,
        );

        if (translationEntityHasField) {
            return { entityMetadata: translationMetadata, actualEntityName: translationMetadata.name };
        }

        throw new UserInputError(`error.entity-has-no-field`, {
            entityName,
            fieldName,
        });
    }

    private async fieldValueExists(
        ctx: RequestContext,
        repository: Repository<ObjectLiteral>,
        fieldName: string,
        value: string,
        excludeId?: string | number,
    ): Promise<boolean> {
        const qb = repository.createQueryBuilder('entity').where(`entity.${fieldName} = :value`, { value });

        if (excludeId) {
            qb.andWhere('entity.id != :id', { id: excludeId });
        }

        const count = await qb.getCount();
        return count > 0;
    }
}
