import { omit } from 'shared/omit';
import { ID, Type } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { Translatable, TranslatedInput, Translation } from '../../common/types/locale-types';

import { patchEntity } from './patch-entity';
import { TranslationUpdaterService } from './translation-updater.service';

/**
 * Returns a "save" function which uses the provided connection and dto to
 * update a translatable entity and its translations to the DB.
 */
export function updateTranslatable<T extends Translatable>(
    entityType: Type<T>,
    translationType: Type<Translation<T>>,
    translationUpdaterService: TranslationUpdaterService,
    beforeSave?: (newEntity: T) => void,
) {
    return async function saveTranslatable(
        connection: Connection,
        input: TranslatedInput<T> & { id: ID },
        data?: any,
    ): Promise<T> {
        const existingTranslations = await connection.getRepository(translationType).find({
            where: { base: input.id },
            relations: ['base'],
        });

        const translationUpdater = translationUpdaterService.create(translationType);
        const diff = translationUpdater.diff(existingTranslations, input.translations);

        const entity = await translationUpdater.applyDiff(
            new entityType({ ...input, translations: existingTranslations }),
            diff,
        );
        const updatedEntity = patchEntity(entity as any, omit(input, ['translations']));
        if (typeof beforeSave === 'function') {
            await beforeSave(entity);
        }
        return connection.manager.save(updatedEntity, { data });
    };
}
