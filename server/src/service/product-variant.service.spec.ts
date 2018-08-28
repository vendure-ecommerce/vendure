import { Test } from '@nestjs/testing';
import { LanguageCode } from 'shared/generated-types';
import { Connection } from 'typeorm';

import { DeepPartial } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { MockTranslationUpdaterService } from '../locale/translation-updater.mock';
import { TranslationUpdaterService } from '../locale/translation-updater.service';
import { MockConnection } from '../testing/connection.mock';

import { ProductVariantService } from './product-variant.service';

describe('ProductVariantService', () => {
    let productVariantService: ProductVariantService;
    let connection: MockConnection;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProductVariantService,
                { provide: TranslationUpdaterService, useClass: MockTranslationUpdaterService },
                { provide: Connection, useClass: MockConnection },
            ],
        }).compile();

        productVariantService = module.get(ProductVariantService);
        connection = module.get(Connection) as any;
    });

    describe('create()', () => {
        it('saves a new ProductVariant with the correct properties', async () => {
            const productEntity = new Product();
            await productVariantService.create(productEntity, {
                sku: '123456',
                price: 123,
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test en',
                    },
                    {
                        languageCode: LanguageCode.de,
                        name: 'Test de',
                    },
                ],
            });

            const savedProductVariant = connection.manager.save.mock.calls[2][0];
            expect(savedProductVariant instanceof ProductVariant).toBe(true);
            expect(savedProductVariant.product).toBe(productEntity);
        });

        it('saves each ProductVariantTranslation', async () => {
            const productEntity = new Product();
            await productVariantService.create(productEntity, {
                sku: '123456',
                price: 123,
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test en',
                    },
                    {
                        languageCode: LanguageCode.de,
                        name: 'Test de',
                    },
                ],
            });

            const savedTranslation1 = connection.manager.save.mock.calls[0][0];
            const savedTranslation2 = connection.manager.save.mock.calls[1][0];
            const savedProductVariant = connection.manager.save.mock.calls[2][0];
            expect(savedTranslation1 instanceof ProductVariantTranslation).toBe(true);
            expect(savedTranslation2 instanceof ProductVariantTranslation).toBe(true);
            expect(savedProductVariant.translations).toEqual([savedTranslation1, savedTranslation2]);
        });

        it('adds Options to the productVariant when specified', async () => {
            const productEntity = new Product();
            const mockOptions = [{ code: 'option1' }, { code: 'option2' }, { code: 'option3' }];
            const productOptionRepository = connection
                .registerMockRepository(ProductOption)
                .find.mockReturnValue(mockOptions);

            await productVariantService.create(productEntity, {
                sku: '123456',
                price: 123,
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test en',
                    },
                ],
                optionCodes: ['option2'],
            });

            const savedProductVariant = connection.manager.save.mock.calls[1][0];
            expect(savedProductVariant.options).toEqual([mockOptions[1]]);
        });
    });

    describe('generateVariantsForProduct()', () => {
        const mockSizeOptions: Array<DeepPartial<ProductOption>> = [
            { code: 'small', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Small' }] },
            { code: 'medium', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Medium' }] },
            { code: 'large', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Large' }] },
        ];

        const mockColorOptions: Array<DeepPartial<ProductOption>> = [
            { code: 'red', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Red' }] },
            { code: 'green', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Green' }] },
            { code: 'blue', translations: [{ languageCode: DEFAULT_LANGUAGE_CODE, name: 'Blue' }] },
        ];

        it('generates default variant for a product with no optionGroup', async () => {
            const mockProduct: DeepPartial<Product> = {
                id: 123,
                translations: [
                    {
                        languageCode: DEFAULT_LANGUAGE_CODE,
                        name: 'Mock Product',
                    },
                ],
                optionGroups: [],
            };
            const productVariantRepository = connection
                .registerMockRepository(Product)
                .findOne.mockReturnValue(mockProduct);
            const mockCreate = jest.spyOn(productVariantService, 'create').mockReturnValue(Promise.resolve());
            await productVariantService.generateVariantsForProduct(123);

            const saveCalls = mockCreate.mock.calls;
            expect(saveCalls.length).toBe(1);
            expect(saveCalls[0][0]).toBe(mockProduct);
            expect(saveCalls[0][1].translations[0].name).toBe('Mock Product');
            expect(saveCalls[0][1].optionCodes).toEqual([]);
        });

        it('generates variants for a product with a single optionGroup', async () => {
            const mockProduct: DeepPartial<Product> = {
                id: 123,
                translations: [
                    {
                        languageCode: DEFAULT_LANGUAGE_CODE,
                        name: 'Mock Product',
                    },
                ],
                optionGroups: [
                    {
                        name: 'Size',
                        code: 'size',
                        options: mockSizeOptions,
                    },
                ],
            };
            const productVariantRepository = connection
                .registerMockRepository(Product)
                .findOne.mockReturnValue(mockProduct);
            const mockCreate = jest.spyOn(productVariantService, 'create').mockReturnValue(Promise.resolve());
            await productVariantService.generateVariantsForProduct(123);

            const saveCalls = mockCreate.mock.calls;
            expect(saveCalls.length).toBe(3);
            expect(saveCalls[0][0]).toBe(mockProduct);
            expect(saveCalls[0][1].translations[0].name).toBe('Mock Product Small');
            expect(saveCalls[0][1].optionCodes).toEqual(['small']);
            expect(saveCalls[1][1].optionCodes).toEqual(['medium']);
            expect(saveCalls[2][1].optionCodes).toEqual(['large']);
        });

        it('generates variants for a product multiples optionGroups', async () => {
            const mockProduct: DeepPartial<Product> = {
                id: 123,
                translations: [
                    {
                        languageCode: DEFAULT_LANGUAGE_CODE,
                        name: 'Mock Product',
                    },
                ],
                optionGroups: [
                    {
                        name: 'Size',
                        code: 'size',
                        options: mockSizeOptions,
                    },
                    {
                        name: 'Color',
                        code: 'color',
                        options: mockColorOptions,
                    },
                ],
            };
            const productVariantRepository = connection
                .registerMockRepository(Product)
                .findOne.mockReturnValue(mockProduct);
            const mockCreate = jest.spyOn(productVariantService, 'create').mockReturnValue(Promise.resolve());

            await productVariantService.generateVariantsForProduct(123);

            const saveCalls = mockCreate.mock.calls;
            expect(saveCalls.length).toBe(9);
            expect(saveCalls[0][0]).toBe(mockProduct);
            expect(saveCalls[0][1].translations[0].name).toBe('Mock Product Small Red');
            expect(saveCalls[0][1].optionCodes).toEqual(['small', 'red']);
            expect(saveCalls[1][1].optionCodes).toEqual(['small', 'green']);
            expect(saveCalls[2][1].optionCodes).toEqual(['small', 'blue']);
            expect(saveCalls[3][1].optionCodes).toEqual(['medium', 'red']);
            expect(saveCalls[4][1].optionCodes).toEqual(['medium', 'green']);
            expect(saveCalls[5][1].optionCodes).toEqual(['medium', 'blue']);
            expect(saveCalls[6][1].optionCodes).toEqual(['large', 'red']);
            expect(saveCalls[7][1].optionCodes).toEqual(['large', 'green']);
            expect(saveCalls[8][1].optionCodes).toEqual(['large', 'blue']);
        });
    });
});
