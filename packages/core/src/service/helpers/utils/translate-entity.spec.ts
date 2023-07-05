import { LanguageCode } from '@vendure/common/lib/generated-types';
import { beforeEach, describe, expect, it } from 'vitest';

import { Translatable, Translation } from '../../../common/types/locale-types';
import { VendureEntity } from '../../../entity/base/base.entity';
import { CollectionTranslation } from '../../../entity/collection/collection-translation.entity';
import { Collection } from '../../../entity/collection/collection.entity';
import { ProductTranslation } from '../../../entity/product/product-translation.entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductOptionTranslation } from '../../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';

import { translateDeep, translateEntity, translateTree } from './translate-entity';

const LANGUAGE_CODE = LanguageCode.en;
const PRODUCT_NAME_EN = 'English Name';
const VARIANT_NAME_EN = 'English Variant';
const OPTION_NAME_EN = 'English Option';
const PRODUCT_NAME_DE = 'German Name';
const VARIANT_NAME_DE = 'German Variant';
const OPTION_NAME_DE = 'German Option';

describe('translateEntity()', () => {
    let product: Product;
    let productTranslationEN: ProductTranslation;
    let productTranslationDE: ProductTranslation;

    beforeEach(() => {
        productTranslationEN = new ProductTranslation({
            id: '2',
            languageCode: LanguageCode.en,
            name: PRODUCT_NAME_EN,
            slug: '',
            description: '',
        });
        productTranslationEN.base = { id: 1 } as any;
        productTranslationEN.customFields = {};

        productTranslationDE = new ProductTranslation({
            id: '3',
            languageCode: LanguageCode.de,
            name: PRODUCT_NAME_DE,
            slug: '',
            description: '',
        });
        productTranslationDE.base = { id: 1 } as any;
        productTranslationDE.customFields = {};

        product = new Product();
        product.id = '1';
        product.translations = [productTranslationEN, productTranslationDE];
        product.customFields = {};
    });

    it('should unwrap the matching translation', () => {
        const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
    });

    it('should not overwrite translatable id with translation id', () => {
        const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

        expect(result).toHaveProperty('id', '1');
    });

    it('should note transfer the base from the selected translation', () => {
        const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

        expect(result).not.toHaveProperty('base');
    });

    it('should transfer the languageCode from the selected translation', () => {
        const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

        expect(result).toHaveProperty('languageCode', 'en');
    });

    describe('customFields handling', () => {
        it('should leave customFields with no localeStrings intact', () => {
            const customFields = {
                aBooleanField: true,
            };
            product.customFields = customFields;
            const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

            expect(result.customFields).toEqual(customFields);
        });

        it('should translate customFields with localeStrings', () => {
            const translatedCustomFields = {
                aLocaleString1: 'translated1',
                aLocaleString2: 'translated2',
            };
            product.translations[0].customFields = translatedCustomFields;
            const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

            expect(result.customFields).toEqual(translatedCustomFields);
        });

        it('should translate customFields with localeStrings and other types', () => {
            const productCustomFields = {
                aBooleanField: true,
                aStringField: 'foo',
            };
            const translatedCustomFields = {
                aLocaleString1: 'translated1',
                aLocaleString2: 'translated2',
            };
            product.customFields = productCustomFields;
            product.translations[0].customFields = translatedCustomFields;
            const result = translateEntity(product, [LanguageCode.en, LanguageCode.en]);

            expect(result.customFields).toEqual({ ...productCustomFields, ...translatedCustomFields });
        });
    });

    it('throw if there are no translations available', () => {
        product.translations = [];

        expect(() => translateEntity(product, [LanguageCode.en, LanguageCode.en])).toThrow(
            'error.entity-has-no-translation-in-language',
        );
    });

    it('falls back to default language', () => {
        expect(translateEntity(product, [LanguageCode.zu, LanguageCode.en]).name).toEqual(PRODUCT_NAME_EN);
    });

    it('falls back to default language', () => {
        expect(translateEntity(product, [LanguageCode.zu, LanguageCode.de]).name).toEqual(PRODUCT_NAME_DE);
    });
});

describe('translateDeep()', () => {
    interface TestProduct extends VendureEntity {
        singleTestVariant: TestVariant;
        singleRealVariant: ProductVariant;
    }

    class TestProductEntity extends VendureEntity implements Translatable {
        constructor() {
            super();
        }
        id: string;
        singleTestVariant: TestVariantEntity;
        singleRealVariant: ProductVariant;
        translations: Array<Translation<TestProduct>>;
    }

    interface TestVariant extends VendureEntity {
        singleOption: ProductOption;
    }

    class TestVariantEntity extends VendureEntity implements Translatable {
        constructor() {
            super();
        }
        id: string;
        singleOption: ProductOption;
        translations: Array<Translation<TestVariant>>;
    }

    let testProduct: TestProductEntity;
    let testVariant: TestVariantEntity;
    let product: Product;
    let productTranslation: ProductTranslation;
    let productVariant: ProductVariant;
    let productVariantTranslation: ProductVariantTranslation;
    let productOption: ProductOption;
    let productOptionTranslation: ProductOptionTranslation;

    beforeEach(() => {
        productTranslation = new ProductTranslation();
        productTranslation.id = '2';
        productTranslation.languageCode = LANGUAGE_CODE;
        productTranslation.name = PRODUCT_NAME_EN;

        productOptionTranslation = new ProductOptionTranslation();
        productOptionTranslation.id = '31';
        productOptionTranslation.languageCode = LANGUAGE_CODE;
        productOptionTranslation.name = OPTION_NAME_EN;

        productOption = new ProductOption();
        productOption.id = '3';
        productOption.translations = [productOptionTranslation];

        productVariantTranslation = new ProductVariantTranslation();
        productVariantTranslation.id = '41';
        productVariantTranslation.languageCode = LANGUAGE_CODE;
        productVariantTranslation.name = VARIANT_NAME_EN;

        productVariant = new ProductVariant();
        productVariant.id = '3';
        productVariant.translations = [productVariantTranslation];
        productVariant.options = [productOption];

        product = new Product();
        product.id = '1';
        product.translations = [productTranslation];
        product.variants = [productVariant];

        testVariant = new TestVariantEntity();
        testVariant.singleOption = productOption;

        testProduct = new TestProductEntity();
        testProduct.singleTestVariant = testVariant;
        testProduct.singleRealVariant = productVariant;
    });

    it('should translate the root entity', () => {
        const result = translateDeep(product, [LanguageCode.en, LanguageCode.en]);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
    });

    it('should not throw if root entity has no translations', () => {
        expect(() => translateDeep(testProduct, [LanguageCode.en, LanguageCode.en])).not.toThrow();
    });

    it('should not throw if first-level nested entity is not defined', () => {
        testProduct.singleRealVariant = undefined as any;
        expect(() =>
            translateDeep(testProduct, [LanguageCode.en, LanguageCode.en], ['singleRealVariant']),
        ).not.toThrow();
    });

    it('should not throw if second-level nested entity is not defined', () => {
        testProduct.singleRealVariant.options = undefined as any;
        expect(() =>
            translateDeep(
                testProduct,
                [LanguageCode.en, LanguageCode.en],
                [['singleRealVariant', 'options']],
            ),
        ).not.toThrow();
    });

    it('should translate a first-level nested non-array entity', () => {
        const result = translateDeep(testProduct, [LanguageCode.en, LanguageCode.en], ['singleRealVariant']);

        expect(result.singleRealVariant).toHaveProperty('name', VARIANT_NAME_EN);
    });

    it('should translate a first-level nested entity array', () => {
        const result = translateDeep(product, [LanguageCode.en, LanguageCode.en], ['variants']);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME_EN);
    });

    it('should translate a second-level nested non-array entity', () => {
        const result = translateDeep(
            testProduct,
            [LanguageCode.en, LanguageCode.en],
            [['singleTestVariant', 'singleOption']],
        );

        expect(result.singleTestVariant.singleOption).toHaveProperty('name', OPTION_NAME_EN);
    });

    it('should translate a second-level nested entity array (first-level is not array)', () => {
        const result = translateDeep(
            testProduct,
            [LanguageCode.en, LanguageCode.en],
            [['singleRealVariant', 'options']],
        );

        expect(result.singleRealVariant.options[0]).toHaveProperty('name', OPTION_NAME_EN);
    });

    it('should translate a second-level nested entity array', () => {
        const result = translateDeep(
            product,
            [LanguageCode.en, LanguageCode.en],
            ['variants', ['variants', 'options']],
        );

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME_EN);
        expect(result.variants[0].options[0]).toHaveProperty('name', OPTION_NAME_EN);
    });
});

describe('translateTree()', () => {
    let cat1: Collection;
    let cat11: Collection;
    let cat12: Collection;
    let cat111: Collection;

    beforeEach(() => {
        cat1 = new Collection({
            translations: [
                new CollectionTranslation({
                    languageCode: LanguageCode.en,
                    name: 'cat1 en',
                }),
            ],
        });
        cat11 = new Collection({
            translations: [
                new CollectionTranslation({
                    languageCode: LanguageCode.en,
                    name: 'cat11 en',
                }),
            ],
        });
        cat12 = new Collection({
            translations: [
                new CollectionTranslation({
                    languageCode: LanguageCode.en,
                    name: 'cat12 en',
                }),
            ],
        });
        cat111 = new Collection({
            translations: [
                new CollectionTranslation({
                    languageCode: LanguageCode.en,
                    name: 'cat111 en',
                }),
            ],
        });

        cat1.children = [cat11, cat12];
        cat11.children = [cat111];
    });

    it('translates all entities in the tree', () => {
        const result = translateTree(cat1, [LanguageCode.en, LanguageCode.en], []);

        expect(result.languageCode).toBe(LanguageCode.en);
        expect(result.name).toBe('cat1 en');
        expect(result.children[0].name).toBe('cat11 en');
        expect(result.children[1].name).toBe('cat12 en');
        expect(result.children[0].children[0].name).toBe('cat111 en');
    });
});
