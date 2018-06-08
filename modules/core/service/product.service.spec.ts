import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { ProductOptionGroupEntity } from '../entity/product-option-group/product-option-group.entity';
import { ProductTranslationEntity } from '../entity/product/product-translation.entity';
import { ProductEntity } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { ProductRepository } from '../repository/product-repository';
import { MockConnection } from '../repository/repository.mock';
import { ProductService } from './product.service';

describe('ProductService', () => {
    let productService: ProductService;
    let connection: MockConnection;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ProductService, { provide: Connection, useClass: MockConnection }],
        }).compile();

        productService = module.get(ProductService);
        connection = module.get(Connection) as any;
    });

    describe('create()', () => {
        it('calls ProductRepository.create with product and translation entities', () => {
            productService.create({
                translations: [
                    {
                        languageCode: LanguageCode.EN,
                        name: 'Test EN',
                        slug: 'test-en',
                        description: 'Test description EN',
                    },
                    {
                        languageCode: LanguageCode.DE,
                        name: 'Test DE',
                        slug: 'test-de',
                        description: 'Test description DE',
                    },
                ],
            });

            const [arg1, arg2] = connection.getCustomRepository(ProductRepository).create.mock.calls[0];
            expect(arg1 instanceof ProductEntity).toBe(true);
            expect(Array.isArray(arg2)).toBe(true);
            expect(arg2.length).toBe(2);
            expect(arg2[0] instanceof ProductTranslationEntity).toBe(true);
        });

        it('adds OptionGroups to the product when specified', async () => {
            const productOptionGroupRepository = connection.registerMockRepository(ProductOptionGroupEntity);
            const productRepository = connection.getCustomRepository(ProductRepository);
            const mockOptionGroups = [{ code: 'optionGroup1' }, { code: 'optionGroup2' }, { code: 'optionGroup3' }];
            productOptionGroupRepository.find.mockReturnValue(mockOptionGroups);

            await productService.create({
                translations: [
                    {
                        languageCode: LanguageCode.EN,
                        name: 'Test EN',
                        slug: 'test-en',
                        description: 'Test description EN',
                    },
                ],
                optionGroupCodes: ['optionGroup2'],
            });

            const [arg1] = productRepository.create.mock.calls[0];
            expect(arg1.optionGroups).toEqual([mockOptionGroups[1]]);
        });
    });
});
