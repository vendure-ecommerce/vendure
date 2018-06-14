import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { ProductVariantTranslation } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
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
                        languageCode: LanguageCode.EN,
                        name: 'Test EN',
                    },
                    {
                        languageCode: LanguageCode.DE,
                        name: 'Test DE',
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
                        languageCode: LanguageCode.EN,
                        name: 'Test EN',
                    },
                    {
                        languageCode: LanguageCode.DE,
                        name: 'Test DE',
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
                        languageCode: LanguageCode.EN,
                        name: 'Test EN',
                    },
                ],
                optionCodes: ['option2'],
            });

            const savedProductVariant = connection.manager.save.mock.calls[1][0];
            expect(savedProductVariant.options).toEqual([mockOptions[1]]);
        });
    });
});
