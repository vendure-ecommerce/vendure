import { DeepPartial } from 'shared/shared-types';
import { EntityManager } from 'typeorm';

import { Translatable, Translation, TranslationInput } from '../../../common/types/locale-types';
import { foundIn, not } from '../../../common/utils';
import { I18nError } from '../../../i18n/i18n-error';

export interface TranslationContructor<T> {
    new (input?: DeepPartial<TranslationInput<T>> | DeepPartial<Translation<T>>): Translation<T>;
}

export interface TranslationDiff<T> {
    toUpdate: Array<Translation<T>>;
    toAdd: Array<Translation<T>>;
}

/**
 * This class is to be used when performing an update on a Translatable entity.
 */
export class TranslationDiffer<Entity extends Translatable> {
    constructor(private translationCtor: TranslationContructor<Entity>, private manager: EntityManager) {}

    /**
     * Compares the existing translations with the updated translations and produces a diff of
     * added, removed and updated translations.
     */
    diff(
        existing: Array<Translation<Entity>>,
        updated?: Array<TranslationInput<Entity>> | null,
    ): TranslationDiff<Entity> {
        if (updated) {
            const translationEntities = this.translationInputsToEntities(updated, existing);

            // TODO: deletion should be made more explicit that simple omission
            // from the update array. This would lead to accidental deletion.
            // const toDelete = existing.filter(not(foundIn(translationEntities, 'languageCode')));
            const toDelete = [];
            const toAdd = translationEntities.filter(not(foundIn(existing, 'languageCode')));
            const toUpdate = translationEntities.filter(foundIn(existing, 'languageCode'));

            return { toUpdate, toAdd };
        } else {
            return {
                toUpdate: [],
                toAdd: [],
            };
        }
    }

    async applyDiff(entity: Entity, { toUpdate, toAdd }: TranslationDiff<Entity>): Promise<Entity> {
        if (toUpdate.length) {
            for (const translation of toUpdate) {
                // any cast below is required due to TS issue: https://github.com/Microsoft/TypeScript/issues/21592
                const updated = await this.manager
                    .getRepository(this.translationCtor)
                    .save(translation as any);
                const index = entity.translations.findIndex(t => t.languageCode === updated.languageCode);
                entity.translations.splice(index, 1, updated);
            }
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
