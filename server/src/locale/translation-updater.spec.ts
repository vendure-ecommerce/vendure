import { ProductTranslation } from '../entity/product/product-translation.entity';
import { Product } from '../entity/product/product.entity';
import { MockEntityManager } from '../testing/connection.mock';

import { LanguageCode } from './language-code';
import { TranslationInput } from './locale-types';
import { TranslationUpdater } from './translation-updater';

describe('TranslationUpdater', () => {
    describe('diff()', () => {
        const existing: ProductTranslation[] = [
            new ProductTranslation({
                id: '10',
                languageCode: LanguageCode.EN,
                name: '',
                slug: '',
                description: '',
            }),
            new ProductTranslation({
                id: '11',
                languageCode: LanguageCode.DE,
                name: '',
                slug: '',
                description: '',
            }),
        ];

        let entityManager: any;

        beforeEach(() => {
            entityManager = new MockEntityManager() as any;
        });

        it('correctly marks translations for update', async () => {
            const updated: Array<TranslationInput<Product>> = [
                {
                    languageCode: LanguageCode.EN,
                    name: '',
                    slug: '',
                    description: '',
                },
                {
                    languageCode: LanguageCode.DE,
                    name: '',
                    slug: '',
                    description: '',
                },
            ];

            const diff = new TranslationUpdater(ProductTranslation, entityManager).diff(existing, updated);
            expect(diff.toUpdate).toEqual(existing);
        });

        it('correctly marks translations for addition', async () => {
            const updated: Array<TranslationInput<Product>> = [
                {
                    languageCode: LanguageCode.AA,
                    name: '',
                    slug: '',
                    description: '',
                },
                {
                    languageCode: LanguageCode.ZA,
                    name: '',
                    slug: '',
                    description: '',
                },
            ];
            const diff = new TranslationUpdater(ProductTranslation, entityManager).diff(existing, updated);
            expect(diff.toAdd).toEqual(updated);
        });

        it('correctly marks translations for removal', async () => {
            const updated = [];

            const diff = new TranslationUpdater(ProductTranslation, entityManager).diff(existing, updated);
            expect(diff.toRemove).toEqual(existing);
        });

        it('correctly marks languages for update, addition and deletion', async () => {
            const updated: Array<TranslationInput<Product>> = [
                {
                    languageCode: LanguageCode.EN,
                    name: '',
                    slug: '',
                    description: '',
                },
                {
                    languageCode: LanguageCode.ZA,
                    name: '',
                    slug: '',
                    description: '',
                },
            ];
            const diff = new TranslationUpdater(ProductTranslation, entityManager).diff(existing, updated);
            expect(diff.toUpdate).toEqual([existing[0]]);
            expect(diff.toAdd).toEqual([updated[1]]);
            expect(diff.toRemove).toEqual([existing[1]]);
        });
    });
});
