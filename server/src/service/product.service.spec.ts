import { Test } from '@nestjs/testing';
import { LanguageCode, UpdateProductInput } from 'shared/generated-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../api/common/request-context';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { Product } from '../entity/product/product.entity';
import { MockConnection } from '../testing/connection.mock';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { MockTranslationUpdaterService } from './helpers/translation-updater.mock';
import { TranslationUpdaterService } from './helpers/translation-updater.service';
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
                { provide: ChannelService, useClass: MockChannelService },
                { provide: AssetService, useValue: {} },
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
            await productService.create(new RequestContext(), {
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test en',
                        slug: 'test-en',
                        description: 'Test description en',
                    },
                    {
                        languageCode: LanguageCode.de,
                        name: 'Test de',
                        slug: 'test-de',
                        description: 'Test description de',
                    },
                ],
            });

            const savedProduct = connection.manager.save.mock.calls[2][0];
            expect(savedProduct instanceof Product).toBe(true);
        });

        it('saves each ProductTranslation', async () => {
            await productService.create(new RequestContext(), {
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test en',
                        slug: 'test-en',
                        description: 'Test description en',
                    },
                    {
                        languageCode: LanguageCode.de,
                        name: 'Test de',
                        slug: 'test-de',
                        description: 'Test description de',
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
    });

    describe('update()', () => {
        it('uses the TranslationUpdater to diff the translations', async () => {
            connection.manager.save.mockReturnValue({ id: 1 });
            connection.manager.findOne.mockReturnValue(Promise.resolve());
            connection.registerMockRepository(ProductTranslation).find.mockReturnValue([]);
            const productFromApplyDiffCall = {};
            const translationUpdater = translationUpdaterService.mockUpdater;
            translationUpdater.applyDiff.mockReturnValue(Promise.resolve(productFromApplyDiffCall));

            const dto: UpdateProductInput = {
                id: '1',
                translations: [],
            };
            await productService.update(new RequestContext(), dto);
            const savedProduct = connection.manager.save.mock.calls[0][0];

            expect(translationUpdater.diff).toHaveBeenCalledTimes(1);
            expect(translationUpdater.applyDiff).toHaveBeenCalledTimes(1);
            expect(savedProduct).toBe(productFromApplyDiffCall);
        });
    });
});

class MockChannelService {
    assignToChannels = jest.fn();
}
