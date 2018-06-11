import { ProductOptionTranslation } from '../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { ProductVariantTranslationEntity } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from './language-code';
import { Translatable, Translation } from './locale-types';
import { translateDeep, translateEntity } from './translate-entity';

const LANGUAGE_CODE = LanguageCode.EN;
const PRODUCT_NAME = 'English Name';
const VARIANT_NAME = 'English Variant';
const OPTION_NAME = 'English Option';

describe('translateEntity()', () => {
    let product: Product;
    let productTranslation: ProductTranslation;

    beforeEach(() => {
        productTranslation = new ProductTranslation();
        productTranslation.id = 2;
        productTranslation.languageCode = LANGUAGE_CODE;
        productTranslation.name = PRODUCT_NAME;

        product = new Product();
        product.id = 1;
        product.translations = [productTranslation];
    });

    it('should unwrap the first translation', () => {
        const result = translateEntity(product);

        expect(result).toHaveProperty('name', PRODUCT_NAME);
    });

    it('should not overwrite translatable id with translation id', () => {
        const result = translateEntity(product);

        expect(result).toHaveProperty('id', 1);
    });

    it('should not transfer the languageCode from the translation', () => {
        const result = translateEntity(product);

        expect(result).not.toHaveProperty('languageCode');
    });

    it('throw if there are no translations available', () => {
        product.translations = [];

        expect(() => translateEntity(product)).toThrow(
            'Translatable entity "Product" has not been translated into the requested language',
        );
    });
});

describe('translateDeep()', () => {
    interface TestProduct {
        singleTestVariant: TestVariant;
        singleRealVariant: ProductVariant;
    }

    class TestProductEntity implements Translatable {
        id: number;
        singleTestVariant: TestVariantEntity;
        singleRealVariant: ProductVariant;
        translations: Translation<TestProduct>[];
    }

    interface TestVariant {
        singleOption: ProductOption;
    }

    class TestVariantEntity implements Translatable {
        id: number;
        singleOption: ProductOption;
        translations: Translation<TestVariant>[];
    }

    let testProduct: TestProductEntity;
    let testVariant: TestVariantEntity;
    let product: Product;
    let productTranslation: ProductTranslation;
    let productVariant: ProductVariant;
    let productVariantTranslation: ProductVariantTranslationEntity;
    let productOption: ProductOption;
    let productOptionTranslation: ProductOptionTranslation;

    beforeEach(() => {
        productTranslation = new ProductTranslation();
        productTranslation.id = 2;
        productTranslation.languageCode = LANGUAGE_CODE;
        productTranslation.name = PRODUCT_NAME;

        productOptionTranslation = new ProductOptionTranslation();
        productOptionTranslation.id = 31;
        productOptionTranslation.languageCode = LANGUAGE_CODE;
        productOptionTranslation.name = OPTION_NAME;

        productOption = new ProductOption();
        productOption.id = 3;
        productOption.translations = [productOptionTranslation];

        productVariantTranslation = new ProductVariantTranslationEntity();
        productVariantTranslation.id = 41;
        productVariantTranslation.languageCode = LANGUAGE_CODE;
        productVariantTranslation.name = VARIANT_NAME;

        productVariant = new ProductVariant();
        productVariant.id = 3;
        productVariant.translations = [productVariantTranslation];
        productVariant.options = [productOption];

        product = new Product();
        product.id = 1;
        product.translations = [productTranslation];
        product.variants = [productVariant];

        testVariant = new TestVariantEntity();
        testVariant.singleOption = productOption;

        testProduct = new TestProductEntity();
        testProduct.singleTestVariant = testVariant;
        testProduct.singleRealVariant = productVariant;
    });

    it('should translate the root entity', () => {
        const result = translateDeep(product);

        expect(result).toHaveProperty('name', PRODUCT_NAME);
    });

    it('should not throw if root entity has no translations', () => {
        expect(() => translateDeep(testProduct)).not.toThrow();
    });

    it('should not throw if first-level nested entity is not defined', () => {
        testProduct.singleRealVariant = undefined as any;
        expect(() => translateDeep(testProduct, ['singleRealVariant'])).not.toThrow();
    });

    it('should not throw if second-level nested entity is not defined', () => {
        testProduct.singleRealVariant.options = undefined as any;
        expect(() => translateDeep(testProduct, [['singleRealVariant', 'options']])).not.toThrow();
    });

    it('should translate a first-level nested non-array entity', () => {
        const result = translateDeep(testProduct, ['singleRealVariant']);

        expect(result.singleRealVariant).toHaveProperty('name', VARIANT_NAME);
    });

    it('should translate a first-level nested entity array', () => {
        const result = translateDeep(product, ['variants']);

        expect(result).toHaveProperty('name', PRODUCT_NAME);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME);
    });

    it('should translate a second-level nested non-array entity', () => {
        const result = translateDeep(testProduct, [['singleTestVariant', 'singleOption']]);

        expect(result.singleTestVariant.singleOption).toHaveProperty('name', OPTION_NAME);
    });

    it('should translate a second-level nested entity array (first-level is not array)', () => {
        const result = translateDeep(testProduct, [['singleRealVariant', 'options']]);

        expect(result.singleRealVariant.options[0]).toHaveProperty('name', OPTION_NAME);
    });

    it('should translate a second-level nested entity array', () => {
        const result = translateDeep(product, ['variants', ['variants', 'options']]);

        expect(result).toHaveProperty('name', PRODUCT_NAME);
        expect(result.variants[0]).toHaveProperty('name', VARIANT_NAME);
        expect(result.variants[0].options[0]).toHaveProperty('name', OPTION_NAME);
    });
});
