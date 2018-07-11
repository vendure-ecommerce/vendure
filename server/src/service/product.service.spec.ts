import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { UpdateProductDto } from '../entity/product/product.dto';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { MockTranslationUpdaterService } from '../locale/translation-updater.mock';
import { TranslationUpdaterService } from '../locale/translation-updater.service';
import { MockConnection } from '../testing/connection.mock';

import { ProductService } from './product.service';

describe('ProductService', () => {
    let productService: ProductService;
    let translationUpdaterService: MockTranslationUpdaterService;
    let connection: MockConnection;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: TranslationUpdaterService, useClass: MockTranslationUpdaterService },
                { provide: Connection, useClass: MockConnection },
            ],
        }).compile();

        productService = module.get(ProductService);
        translationUpdaterService = module.get(TranslationUpdaterService) as any;
        connection = module.get(Connection) as any;
    });

    describe('create()', () => {
        beforeEach(() => {
            connection.manager.save.mockReturnValue({ id: 1 });
            connection.manager.findOne.mockReturnValue(Promise.resolve());
        });

        it('saves a new Product with the correct properties', async () => {
            await productService.create({
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

            const savedProduct = connection.manager.save.mock.calls[2][0];
            expect(savedProduct instanceof Product).toBe(true);
        });

        it('saves each ProductTranslation', async () => {
            await productService.create({
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

            const savedTranslation1 = connection.manager.save.mock.calls[0][0];
            const savedTranslation2 = connection.manager.save.mock.calls[1][0];
            const savedProduct = connection.manager.save.mock.calls[2][0];
            expect(savedTranslation1 instanceof ProductTranslation).toBe(true);
            expect(savedTranslation2 instanceof ProductTranslation).toBe(true);
            expect(savedProduct.translations).toEqual([savedTranslation1, savedTranslation2]);
        });

        it('adds OptionGroups to the product when specified', async () => {
            const mockOptionGroups = [
                { code: 'optionGroup1' },
                { code: 'optionGroup2' },
                { code: 'optionGroup3' },
            ];
            connection.registerMockRepository(ProductOptionGroup).find.mockReturnValue(mockOptionGroups);

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

            const savedProduct = connection.manager.save.mock.calls[1][0];
            expect(savedProduct.optionGroups).toEqual([mockOptionGroups[1]]);
        });
    });

    describe('update()', () => {
        it('uses the TranslationUpdater to diff the translations', async () => {
            connection.manager.findOne.mockReturnValue(Promise.resolve());
            connection.registerMockRepository(ProductTranslation).find.mockReturnValue([]);
            const productFromApplyDiffCall = {};
            const translationUpdater = translationUpdaterService.mockUpdater;
            translationUpdater.applyDiff.mockReturnValue(Promise.resolve(productFromApplyDiffCall));

            const dto: UpdateProductDto = {
                id: '1',
                image: 'some-image',
                translations: [],
            };
            await productService.update(dto);
            const savedProduct = connection.manager.save.mock.calls[0][0];

            expect(translationUpdater.diff).toHaveBeenCalledTimes(1);
            expect(translationUpdater.applyDiff).toHaveBeenCalledTimes(1);
            expect(savedProduct).toBe(productFromApplyDiffCall);
        });
    });
});
