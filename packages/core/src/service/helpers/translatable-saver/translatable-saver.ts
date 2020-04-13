import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { omit } from '@vendure/common/lib/omit';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { Translatable, TranslatedInput, Translation } from '../../../common/types/locale-types';
import { VendureEntity } from '../../../entity/base/base.entity';
import { patchEntity } from '../utils/patch-entity';

import { TranslationDiffer } from './translation-differ';

export interface CreateTranslatableOptions<T extends Translatable> {
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
 * A helper which contains methods for creating and updating entities which implement the Translatable interface.
 */
@Injectable()
export class TranslatableSaver {
    constructor(@InjectConnection() private connection: Connection) {}

    /**
     * Create a translatable entity, including creating any translation entities according
     * to the `translations` array.
     */
    async create<T extends Translatable & VendureEntity>(options: CreateTranslatableOptions<T>): Promise<T> {
        const { entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;

        const entity = new entityType(input);
        const translations: Array<Translation<T>> = [];

        if (input.translations) {
            for (const translationInput of input.translations) {
                const translation = new translationType(translationInput);
                translations.push(translation);
                await this.connection.manager.save(translation);
            }
        }

        entity.translations = translations;
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return await this.connection.manager.save(entity, { data: typeOrmSubscriberData });
    }

    /**
     * Update a translatable entity. Performs a diff of the `translations` array in order to
     * perform the correct operation on the translations.
     */
    async update<T extends Translatable & VendureEntity>(options: UpdateTranslatableOptions<T>): Promise<T> {
        const { entityType, translationType, input, beforeSave, typeOrmSubscriberData } = options;
        const existingTranslations = await this.connection.getRepository(translationType).find({
            where: { base: input.id },
            relations: ['base'],
        });

        const differ = new TranslationDiffer(translationType, this.connection.manager);
        const diff = differ.diff(existingTranslations, input.translations);
        const entity = await differ.applyDiff(
            new entityType({ ...input, translations: existingTranslations }),
            diff,
        );
        const updatedEntity = patchEntity(entity as any, omit(input, ['translations']));
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return this.connection.manager.save(updatedEntity, { data: typeOrmSubscriberData });
    }
}
