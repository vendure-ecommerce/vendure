import { LanguageCode, ProductWithVariants } from 'shared/generated-types';

import { CustomFieldConfig } from '../../../../../shared/shared-types';

import { createUpdatedTranslatable } from './create-updated-translatable';

// tslint:disable:no-non-null-assertion
describe('createUpdatedTranslatable()', () => {
    let product: any;

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
        } as Partial<ProductWithVariants>;
    });

    it('returns a clone', () => {
        const formValue = {};
        const result = createUpdatedTranslatable(product, formValue, [], LanguageCode.en);

        expect(result).not.toBe(product);
    });

    it('creates new translation if the specified translation does not exist', () => {
        const formValue = {
            name: 'New Name AA',
        };
        const result = createUpdatedTranslatable(product, formValue, [], LanguageCode.aa, {
            languageCode: LanguageCode.aa,
            name: product.name || '',
        });

        expect(result.translations[2]).toEqual({
            languageCode: LanguageCode.aa,
            name: 'New Name AA',
        });
    });

    it('updates the non-translatable properties', () => {
        const formValue = {
            image: 'new-image.jpg',
        };

        const result = createUpdatedTranslatable(product, formValue, [], LanguageCode.en);

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

        const result = createUpdatedTranslatable(product, formValue, [], LanguageCode.en);

        if (!result) {
            fail('Expected result to be truthy');
            return;
        }

        expect(result.translations).not.toBe(product.translations);
        expect(result.translations[0]!.name).toBe('New Name EN');
        expect(result.translations[1]!.name).toBe('Old Name DE');
    });

    it('updates custom fields correctly', () => {
        const customFieldConfig: CustomFieldConfig[] = [
            { name: 'available', type: 'boolean' },
            { name: 'shortName', type: 'localeString' },
        ];
        product.customFields = {
            available: true,
            shortName: 'foo',
        };
        product.translations[0].customFields = { shortName: 'foo' };

        const formValue = {
            customFields: {
                available: false,
                shortName: 'bar',
            },
        };

        const result = createUpdatedTranslatable(product, formValue, customFieldConfig, LanguageCode.en);

        if (!result) {
            fail('Expected result to be truthy');
            return;
        }

        expect((result as any).customFields).toEqual({
            available: false,
        });
        expect((result.translations[0] as any).customFields).toEqual({
            shortName: 'bar',
        });
    });

    it('updates custom fields when none initially exists', () => {
        const customFieldConfig: CustomFieldConfig[] = [
            { name: 'available', type: 'boolean' },
            { name: 'shortName', type: 'localeString' },
        ];

        const formValue = {
            customFields: {
                available: false,
                shortName: 'bar',
            },
        };

        const result = createUpdatedTranslatable(product, formValue, customFieldConfig, LanguageCode.en);

        if (!result) {
            fail('Expected result to be truthy');
            return;
        }

        expect((result as any).customFields).toEqual({
            available: false,
        });
        expect((result.translations[0] as any).customFields).toEqual({
            shortName: 'bar',
        });
    });
});
