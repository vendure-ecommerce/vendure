import { ProductOptionTranslation } from '../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from './language-code';
import { Translatable, Translation } from './locale-types';
import { translateDeep, translateEntity } from './translate-entity';

const LANGUAGE_CODE = LanguageCode.EN;
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
            languageCode: LanguageCode.EN,
            name: PRODUCT_NAME_EN,
            slug: '',
            description: '',
        });
        productTranslationEN.base = { id: 1 } as any;

        productTranslationDE = new ProductTranslation({
            id: '3',
            languageCode: LanguageCode.DE,
            name: PRODUCT_NAME_DE,
            slug: '',
            description: '',
        });
        productTranslationDE.base = { id: 1 } as any;

        product = new Product();
        product.id = '1';
        product.translations = [productTranslationEN, productTranslationDE];
    });

    it('should unwrap the matching translation', () => {
        const result = translateEntity(product, LanguageCode.EN);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
    });

    it('should not overwrite translatable id with translation id', () => {
        const result = translateEntity(product, LanguageCode.EN);

        expect(result).toHaveProperty('id', '1');
    });

    it('should note transfer the base from the selected translation', () => {
        const result = translateEntity(product, LanguageCode.EN);

        expect(result).not.toHaveProperty('base');
    });

    it('should transfer the languageCode from the selected translation', () => {
        const result = translateEntity(product, LanguageCode.EN);

        expect(result).toHaveProperty('languageCode', 'en');
    });

    it('throw if there are no translations available', () => {
        product.translations = [];

        expect(() => translateEntity(product, LanguageCode.EN)).toThrow(
            'Translatable entity "Product" has not been translated into the requested language (en)',
        );
    });

    it('throw if the desired translation is not available', () => {
        product.translations = [];

        expect(() => translateEntity(product, LanguageCode.ZU)).toThrow(
            'Translatable entity "Product" has not been translated into the requested language (zu)',
        );
    });
});

describe('translateDeep()', () => {
    interface TestProduct {
        singleTestVariant: TestVariant;
        singleRealVariant: ProductVariant;
    }

    class TestProductEntity implements Translatable {
        id: string;
        singleTestVariant: TestVariantEntity;
        singleRealVariant: ProductVariant;
        translations: Array<Translation<TestProduct>>;
    }

    interface TestVariant {
        singleOption: ProductOption;
    }

    class TestVariantEntity implements Translatable {
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
        const result = translateDeep(product, LanguageCode.EN);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
    });

    it('should not throw if root entity has no translations', () => {
        expect(() => translateDeep(testProduct, LanguageCode.EN)).not.toThrow();
    });

    it('should not throw if first-level nested entity is not defined', () => {
        testProduct.singleRealVariant = undefined as any;
        expect(() => translateDeep(testProduct, LanguageCode.EN, ['singleRealVariant'])).not.toThrow();
    });

    it('should not throw if second-level nested entity is not defined', () => {
        testProduct.singleRealVariant.options = undefined as any;
        expect(() => translateDeep(testProduct, LanguageCode.EN, [['singleRealVariant', 'options']])).not.toThrow();
    });

    it('should translate a first-level nested non-array entity', () => {
        const result = translateDeep(testProduct, LanguageCode.EN, ['singleRealVariant']);

        expect(result.singleRealVariant).toHaveProperty('name', VARIANT_NAME_EN);
    });

    it('should translate a first-level nested entity array', () => {
        const result = translateDeep(product, LanguageCode.EN, ['variants']);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME_EN);
    });

    it('should translate a second-level nested non-array entity', () => {
        const result = translateDeep(testProduct, LanguageCode.EN, [['singleTestVariant', 'singleOption']]);

        expect(result.singleTestVariant.singleOption).toHaveProperty('name', OPTION_NAME_EN);
    });

    it('should translate a second-level nested entity array (first-level is not array)', () => {
        const result = translateDeep(testProduct, LanguageCode.EN, [['singleRealVariant', 'options']]);

        expect(result.singleRealVariant.options[0]).toHaveProperty('name', OPTION_NAME_EN);
    });

    it('should translate a second-level nested entity array', () => {
        const result = translateDeep(product, LanguageCode.EN, ['variants', ['variants', 'options']]);

        expect(result).toHaveProperty('name', PRODUCT_NAME_EN);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME_EN);
        expect(result.variants[0].options[0]).toHaveProperty('name', OPTION_NAME_EN);
    });
});
