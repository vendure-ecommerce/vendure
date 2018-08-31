import { Type } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { Translatable, TranslatedInput, Translation } from '../../common/types/locale-types';

/**
 * Returns a "save" function which uses the provided connection and dto to
 * save a translatable entity and its translations to the DB.
 */
export function createTranslatable<T extends Translatable>(
    entityType: Type<T>,
    translationType: Type<Translation<T>>,
    beforeSave?: (newEntity: T) => void,
) {
    return async function saveTranslatable(
        connection: Connection,
        dto: TranslatedInput<T>,
        data?: any,
    ): Promise<T> {
        const entity = new entityType(dto);
        const translations: Array<Translation<T>> = [];

        for (const input of dto.translations) {
            const translation = new translationType(input);
            translations.push(translation);
            await connection.manager.save(translation);
        }

        entity.translations = translations;
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return await connection.manager.save(entity, { data });
    };
}
