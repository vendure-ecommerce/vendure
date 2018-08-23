import { Connection } from 'typeorm';

import { ID, Type } from '../../../shared/shared-types';
import { Translatable, TranslatedInput, Translation } from '../locale/locale-types';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

/**
 * Returns a "save" function which uses the provided connection and dto to
 * update a translatable entity and its translations to the DB.
 */
export function updateTranslatable<T extends Translatable>(
    entityType: Type<T>,
    translationType: Type<Translation<T>>,
    translationUpdaterService: TranslationUpdaterService,
) {
    return async function saveTranslatable(
        connection: Connection,
        dto: TranslatedInput<T> & { id: ID },
    ): Promise<T> {
        const existingTranslations = await connection.getRepository(translationType).find({
            where: { base: dto.id },
            relations: ['base'],
        });

        const translationUpdater = translationUpdaterService.create(translationType);
        const diff = translationUpdater.diff(existingTranslations, dto.translations);

        const entity = await translationUpdater.applyDiff(new entityType(dto), diff);
        return connection.manager.save(entity);
    };
}
