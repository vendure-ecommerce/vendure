import { DeepPartial } from 'shared/shared-types';
import { EntityManager } from 'typeorm';

import { foundIn, not } from '../../common/utils';
import { I18nError } from '../../i18n/i18n-error';

import { Translatable, Translation, TranslationInput } from '../../common/types/locale-types';

export interface TranslationContructor<T> {
    new (input?: DeepPartial<TranslationInput<T>> | DeepPartial<Translation<T>>): Translation<T>;
}

export interface TranslationDiff<T> {
    toUpdate: Array<Translation<T>>;
    toAdd: Array<Translation<T>>;
    toRemove: Array<Translation<T>>;
}

/**
 * This class is to be used when performing an update on a Translatable entity.
 */
export class TranslationUpdater<Entity extends Translatable> {
    constructor(private translationCtor: TranslationContructor<Entity>, private manager: EntityManager) {}

    /**
     * Compares the existing translations with the updated translations and produces a diff of
     * added, removed and updated translations.
     */
    diff(
        existing: Array<Translation<Entity>>,
        updated: Array<TranslationInput<Entity>>,
    ): TranslationDiff<Entity> {
        const translationEntities = this.translationInputsToEntities(updated, existing);

        const toDelete = existing.filter(not(foundIn(translationEntities, 'languageCode')));
        const toAdd = translationEntities.filter(not(foundIn(existing, 'languageCode')));
        const toUpdate = translationEntities.filter(foundIn(existing, 'languageCode'));

        return { toUpdate, toAdd, toRemove: toDelete };
    }

    async applyDiff(entity: Entity, { toUpdate, toAdd, toRemove }: TranslationDiff<Entity>): Promise<Entity> {
        entity.translations = [];

        if (toUpdate.length) {
            for (const translation of toUpdate) {
                await this.manager
                    .createQueryBuilder()
                    .update(this.translationCtor)
                    .set(translation)
                    .where('id = :id', { id: translation.id })
                    .execute();
            }
            entity.translations = entity.translations.concat(toUpdate);
        }

        if (toAdd.length) {
            for (const translation of toAdd) {
                translation.base = entity;
                let newTranslation: any;
                try {
                    newTranslation = await this.manager
                        .getRepository(this.translationCtor)
                        .save(translation as any);
                } catch (err) {
                    const entityName = entity.constructor.name;
                    const id = (entity as any).id || 'undefined';
                    throw new I18nError('error.entity-with-id-not-found', { entityName, id });
                }

                entity.translations.push(newTranslation);
            }
        }

        if (toRemove.length) {
            const toDeleteEntities = toRemove.map(translation => {
                translation.base = entity;
                return translation;
            });
            await this.manager.getRepository(this.translationCtor).remove(toDeleteEntities);
        }

        return entity;
    }

    private translationInputsToEntities(
        inputs: Array<TranslationInput<Entity>>,
        existing: Array<Translation<Entity>>,
    ): Array<Translation<Entity>> {
        return inputs.map(input => {
            const counterpart = existing.find(e => e.languageCode === input.languageCode);
            // any cast below is required due to TS issue: https://github.com/Microsoft/TypeScript/issues/21592
            const entity = new this.translationCtor(input as any);
            if (counterpart) {
                entity.id = counterpart.id;
                entity.base = counterpart.base;
            }
            return entity;
        });
    }
}
