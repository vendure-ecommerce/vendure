import { TestBed } from '@angular/core/testing';

import { GetProductWithVariants_product, LanguageCode } from '../../../data/types/gql-generated-types';

import { ProductUpdaterService } from './product-updater.service';

// tslint:disable:no-non-null-assertion
describe('ProductUpdaterService', () => {
    let productUpdaterService: ProductUpdaterService;
    let product: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProductUpdaterService],
        });
        productUpdaterService = TestBed.get(ProductUpdaterService);
    });

    beforeEach(() => {
        product = {
            id: '1',
            languageCode: LanguageCode.en,
            name: 'Old Name EN',
            image: 'old-image.jpg',
            translations: [
                { languageCode: LanguageCode.en, name: 'Old Name EN' },
                { languageCode: LanguageCode.de, name: 'Old Name DE' },
            ],
            variants: [
                {
                    id: '11',
                    name: 'Old Variant 1 Name EN',
                    sku: '11A',
                    price: 11,
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Old Variant 1 Name EN' },
                        { languageCode: LanguageCode.de, name: 'Old Variant 1 Name DE' },
                    ],
                },
                {
                    id: '12',
                    name: 'Old Variant 2 Name EN',
                    sku: '12A',
                    price: 12,
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Old Variant 2 Name EN' },
                        { languageCode: LanguageCode.de, name: 'Old Variant 2 Name DE' },
                    ],
                },
            ],
        } as Partial<GetProductWithVariants_product>;
    });

    describe('getUpdatedProduct()', () => {
        it('returns a clone', () => {
            const formValue = {};
            const result = productUpdaterService.getUpdatedProduct(product, formValue, LanguageCode.en);

            expect(result).not.toBe(product);
        });

        it('creates new translation if the specified translation does not exist', () => {
            const formValue = {
                name: 'New Name AA',
            };
            const result = productUpdaterService.getUpdatedProduct(product, formValue, LanguageCode.aa);

            expect(result.translations[2]).toEqual({
                languageCode: LanguageCode.aa,
                name: 'New Name AA',
                description: '',
                slug: '',
            });
        });

        it('updates the non-translatable properties', () => {
            const formValue = {
                image: 'new-image.jpg',
            };

            const result = productUpdaterService.getUpdatedProduct(product, formValue, LanguageCode.en);

            if (!result) {
                fail('Expected result to be truthy');
                return;
            }

            expect(result.image).toBe('new-image.jpg');
        });

        it('updates only the specified translation', () => {
            const formValue = {
                name: 'New Name EN',
            };

            const result = productUpdaterService.getUpdatedProduct(product, formValue, LanguageCode.en);

            if (!result) {
                fail('Expected result to be truthy');
                return;
            }

            expect(result.translations).not.toBe(product.translations);
            expect(result.translations[0]!.name).toBe('New Name EN');
            expect(result.translations[1]!.name).toBe('Old Name DE');
        });
    });

    describe('getUpdatedProductVariants()', () => {
        it('returns a new array and cloned objects within the array', () => {
            const formValue = [{ name: 'New Variant 1 Name EN' }, { name: 'New Variant 2 Name EN' }];
            const result = productUpdaterService.getUpdatedProductVariants(
                product.variants,
                formValue,
                LanguageCode.en,
            );

            expect(result).not.toBe(product.variants);
            expect(result[0]).not.toBe(product.variants[0]);
            expect(result[1]).not.toBe(product.variants[1]);
        });

        it('throws if the length of the formValues array does not match the number of variants', () => {
            const formValue = [{ name: 'New Variant 1 Name EN' }];
            const invoke = () =>
                productUpdaterService.getUpdatedProductVariants(product.variants, formValue, LanguageCode.en);

            expect(invoke).toThrowError('error.product-variant-form-values-do-not-match');
        });

        it('updates the non-translatable properties', () => {
            const formValue = [{ price: 98, sku: '11B' }, { price: 99, sku: '12B' }];

            const result = productUpdaterService.getUpdatedProductVariants(
                product.variants,
                formValue,
                LanguageCode.en,
            );

            expect(result[0].price).toBe(98);
            expect(result[0].sku).toBe('11B');
            expect(result[1].price).toBe(99);
            expect(result[1].sku).toBe('12B');
        });

        it('updates only the specified translation', () => {
            const formValue = [{ name: 'New Variant 1 Name EN' }, { name: 'New Variant 2 Name EN' }];

            const result = productUpdaterService.getUpdatedProductVariants(
                product.variants,
                formValue,
                LanguageCode.en,
            );

            expect(result[0].translations).not.toBe(product.variants[0].translations);
            expect(result[0].translations[0].name).toBe('New Variant 1 Name EN');
            expect(result[0].translations[1].name).toBe('Old Variant 1 Name DE');
            expect(result[1].translations).not.toBe(product.variants[1].translations);
            expect(result[1].translations[0].name).toBe('New Variant 2 Name EN');
            expect(result[1].translations[1].name).toBe('Old Variant 2 Name DE');
        });
    });
});
