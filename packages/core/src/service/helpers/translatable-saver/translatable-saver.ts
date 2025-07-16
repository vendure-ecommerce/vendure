import { Injectable } from '@nestjs/common';
import { omit } from '@vendure/common/lib/omit';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

import { RequestContext } from '../../../api/common/request-context';
import { Translatable, TranslatedInput, Translation } from '../../../common/types/locale-types';
import { ConfigService } from '../../../config/config.service';
import { HasCustomFields } from '../../../config/custom-field/custom-field-types';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
import { patchEntity } from '../utils/patch-entity';

import { TranslationDiffer } from './translation-differ';

export interface CreateTranslatableOptions<T extends Translatable> {
    ctx: RequestContext;
    entityType: Type<T>;
    translationType: Type<Translation<T>>;
    input: TranslatedInput<T>;
    beforeSave?: (newEntity: T) => any | Promise<any>;
    typeOrmSubscriberData?: any;
}

export interface UpdateTranslatableOptions<T extends Translatable> extends CreateTranslatableOptions<T> {
    input: TranslatedInput<T> & { id: ID };
}

/**
 * @description
 * A helper which contains methods for creating and updating entities which implement the {@link Translatable} interface.
 *
 * @example
 * ```ts
 * export class MyService {
 *   constructor(private translatableSaver: TranslatableSaver) {}
 *
 *   async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
 *     const facet = await this.translatableSaver.create({
 *       ctx,
 *       input,
 *       entityType: Facet,
 *       translationType: FacetTranslation,
 *       beforeSave: async f => {
 *           f.code = await this.ensureUniqueCode(ctx, f.code);
 *       },
 *     });
 *     return facet;
 *   }
 *
 *   // ...
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
@Injectable()
export class TranslatableSaver {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
    ) {}

    /**
     * @description
     * Create a translatable entity, including creating any translation entities according
     * to the `translations` array.
     */
    async create<T extends Translatable & VendureEntity>(options: CreateTranslatableOptions<T>): Promise<T> {
        const { ctx, entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;

        const entity = new entityType(input);

        const translations: Array<Translation<T>> = [];

        if (input.translations) {
            for (const translationInput of input.translations) {
                const translation = new translationType(translationInput);
                translations.push(translation);
                await this.connection.getRepository(ctx, translationType).save(translation as any);
            }
        }

        entity.translations = translations;

        // Apply custom field defaults for null values
        this.applyCustomFieldDefaults(entity, entityType);

        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return await this.connection
            .getRepository(ctx, entityType)
            .save(entity as any, { data: typeOrmSubscriberData });
    }

    /**
     * @description
     * Update a translatable entity. Performs a diff of the `translations` array in order to
     * perform the correct operation on the translations.
     */
    async update<T extends Translatable & VendureEntity>(options: UpdateTranslatableOptions<T>): Promise<T> {
        const { ctx, entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;
        const existingTranslations = await this.connection.getRepository(ctx, translationType).find({
            relationLoadStrategy: 'query',
            loadEagerRelations: false,
            where: { base: { id: input.id } } as Translation<T>,
            relations: ['base'],
        } as FindManyOptions<Translation<T>>);

        const differ = new TranslationDiffer(translationType, this.connection);
        const diff = differ.diff(existingTranslations, input.translations);
        const entity = await differ.applyDiff(
            ctx,
            new entityType({ ...input, translations: existingTranslations }),
            diff,
        );
        entity.updatedAt = new Date();

        const updatedEntity = patchEntity(entity as any, omit(input, ['translations']));
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return this.connection
            .getRepository(ctx, entityType)
            .save(updatedEntity, { data: typeOrmSubscriberData });
    }

    /**
     * @description
     * Apply custom field default values to an entity when fields are explicitly set to null
     */
    private applyCustomFieldDefaults<T extends VendureEntity & Partial<HasCustomFields>>(
        entity: T,
        entityType: Type<T>,
    ): void {
        const customFields = this.configService.customFields;
        const entityName = entityType.name as keyof typeof customFields;
        const entityCustomFields = customFields[entityName];

        if (!entityCustomFields || !entity.customFields) {
            return;
        }

        for (const customField of entityCustomFields) {
            const fieldName = customField.name;
            const fieldValue = entity.customFields[fieldName];

            // Only apply default if the field is explicitly null and has a default value
            if (fieldValue === null && customField.defaultValue !== undefined) {
                entity.customFields[fieldName] = customField.defaultValue;
            }
        }
    }
}
