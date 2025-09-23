import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { TransactionalConnection } from '../../connection/transactional-connection';

import { SlugService } from './slug.service';

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
     *
     * @param ctx The request context
     * @param entityName The name of the entity
     * @param fieldName The name of the field to check for uniqueness (e.g., 'slug', 'code')
     * @param inputValue The value to generate the slug from
     * @param entityId Optional ID of the entity being updated
     * @returns A unique slug string
     */
    async generateSlugFromInput(
        ctx: RequestContext,
        entityName: string,
        fieldName: string,
        inputValue: string,
        entityId?: string | number,
    ): Promise<string> {
        // Get the entity metadata
        const entityMetadata = this.connection.rawConnection.entityMetadatas.find(
            metadata => metadata.name === entityName,
        );

        if (!entityMetadata) {
            throw new UserInputError(`error.entity-not-found`, {
                entityName,
            });
        }

        // Check if the entity has the specified field
        const targetColumn = entityMetadata.columns.find(col => col.propertyName === fieldName);
        if (!targetColumn) {
            throw new UserInputError(`error.entity-has-no-field`, {
                entityName,
                fieldName,
            });
        }

        const repository = this.connection.getRepository(ctx, entityMetadata.target);
        const baseSlug = this.slugService.generate(inputValue);
        let slug = baseSlug;
        let counter = 1;

        while (await this.fieldValueExists(ctx, repository, fieldName, slug, entityId)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    private async fieldValueExists(
        ctx: RequestContext,
        repository: any,
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
