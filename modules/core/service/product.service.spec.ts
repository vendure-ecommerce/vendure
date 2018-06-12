import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { UpdateProductDto } from '../entity/product/product.dto';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { TranslationInput } from '../locale/locale-types';
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
            expect(arg1 instanceof Product).toBe(true);
            expect(Array.isArray(arg2)).toBe(true);
            expect(arg2.length).toBe(2);
            expect(arg2[0] instanceof ProductTranslation).toBe(true);
        });

        it('adds OptionGroups to the product when specified', async () => {
            const productOptionGroupRepository = connection.registerMockRepository(ProductOptionGroup);
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

    describe('update()', () => {
        it('calls ProductRepository.update with the UpdateProductDto', async () => {
            connection.registerMockRepository(ProductTranslation).find.mockReturnValue([]);
            const dto: UpdateProductDto = {
                id: 1,
                image: 'some-image',
                translations: [],
            };
            await productService.update(dto);

            const update = connection.getCustomRepository(ProductRepository).update;
            expect(update.mock.calls[0][0]).toBe(dto);
        });

        describe('translation handling', () => {
            const existingTranslations: ProductTranslation[] = [
                {
                    id: 10,
                    languageCode: LanguageCode.EN,
                    name: '',
                    slug: '',
                    description: '',
                    base: 1 as any,
                },
                {
                    id: 11,
                    languageCode: LanguageCode.DE,
                    name: '',
                    slug: '',
                    description: '',
                    base: 1 as any,
                },
            ];

            beforeEach(() => {
                connection.registerMockRepository(ProductTranslation).find.mockReturnValue(existingTranslations);
            });

            it('correctly marks translations for update', async () => {
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: [
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
                    ],
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][1]).toEqual(existingTranslations);
            });

            it('translations to update always have ids', async () => {
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: [
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
                    ],
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][1][0]).toHaveProperty('id', existingTranslations[0].id);
                expect(update.mock.calls[0][1][1]).toHaveProperty('id', existingTranslations[1].id);
            });

            it('correctly marks translations for addition', async () => {
                const languagesToAdd: TranslationInput<Product>[] = [
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
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: languagesToAdd,
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][2]).toEqual(languagesToAdd);
            });

            it('correctly marks translations for deletion', async () => {
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: [],
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][3]).toEqual(existingTranslations);
            });

            it('translations for deletion always have ids', async () => {
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: [],
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][3]).toEqual(existingTranslations);
            });

            it('correctly marks languages for update, addition and deletion', async () => {
                const updatedTranslations: TranslationInput<Product>[] = [
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
                const dto: UpdateProductDto = {
                    id: 1,
                    image: 'some-image',
                    translations: updatedTranslations,
                };
                await productService.update(dto);

                const update = connection.getCustomRepository(ProductRepository).update;
                expect(update.mock.calls[0][1]).toEqual([existingTranslations[0]]);
                expect(update.mock.calls[0][2]).toEqual([updatedTranslations[1]]);
                expect(update.mock.calls[0][3]).toEqual([existingTranslations[1]]);
            });
        });
    });
});
