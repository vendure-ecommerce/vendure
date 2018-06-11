import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { ProductVariantTranslationEntity } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { ProductVariantRepository } from '../repository/product-variant-repository';
import { MockConnection } from '../repository/repository.mock';
import { ProductVariantService } from './product-variant.service';

describe('ProductVariantService', () => {
    let productVariantService: ProductVariantService;
    let connection: MockConnection;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ProductVariantService, { provide: Connection, useClass: MockConnection }],
        }).compile();

        productVariantService = module.get(ProductVariantService);
        connection = module.get(Connection) as any;
    });

    describe('create()', () => {
        it('calls ProductVariantRepository.create with product and translation entities', () => {
            const productEntity = new Product();
            productVariantService.create(productEntity, {
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

            const [arg1, arg2, arg3] = connection.getCustomRepository(ProductVariantRepository).create.mock.calls[0];
            expect(arg1).toBe(productEntity);
            expect(arg2 instanceof ProductVariant).toBe(true);
            expect(Array.isArray(arg3)).toBe(true);
            expect(arg3.length).toBe(2);
            expect(arg3[0] instanceof ProductVariantTranslationEntity).toBe(true);
        });

        it('adds Options to the productVariant when specified', async () => {
            const productEntity = new Product();
            const productOptionRepository = connection.registerMockRepository(ProductOption);
            const mockOptions = [{ code: 'option1' }, { code: 'option2' }, { code: 'option3' }];
            productOptionRepository.find.mockReturnValue(mockOptions);

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

            const [arg1, arg2] = connection.getCustomRepository(ProductVariantRepository).create.mock.calls[0];
            expect(arg2.options).toEqual([mockOptions[1]]);
        });
    });
});
