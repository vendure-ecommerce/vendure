import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { foundIn, not } from '../common/utils';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { CreateProductDto, UpdateProductDto } from '../entity/product/product.dto';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { TranslationInput } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
import { ProductRepository } from '../repository/product-repository';

@Injectable()
export class ProductService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(lang: LanguageCode): Promise<Product[]> {
        return this.connection
            .getCustomRepository(ProductRepository)
            .find(lang)
            .then(products =>
                products.map(product =>
                    translateDeep(product, lang, ['optionGroups', 'variants', ['variants', 'options']]),
                ),
            );
    }

    findOne(productId: number, lang: LanguageCode): Promise<Product | undefined> {
        return this.connection
            .getCustomRepository(ProductRepository)
            .findOne(productId, lang)
            .then(
                product =>
                    product && translateDeep(product, lang, ['optionGroups', 'variants', ['variants', 'options']]),
            );
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const { variants, optionGroupCodes, image, translations } = createProductDto;
        const product = new Product();
        const productTranslations: ProductTranslation[] = [];

        if (optionGroupCodes && optionGroupCodes.length) {
            const optionGroups = await this.connection.getRepository(ProductOptionGroup).find();
            const selectedOptionGroups = optionGroups.filter(og => optionGroupCodes.includes(og.code));
            product.optionGroups = selectedOptionGroups;
        }

        for (const input of createProductDto.translations) {
            productTranslations.push(new ProductTranslation(input));
        }

        return this.connection
            .getCustomRepository(ProductRepository)
            .create(product, productTranslations)
            .then(createdProduct => translateDeep(createdProduct, DEFAULT_LANGUAGE_CODE));
    }

    async update(updateProductDto: UpdateProductDto): Promise<Product | undefined> {
        const { optionGroupCodes, image, translations } = updateProductDto;
        const productTranslations: ProductTranslation[] = [];

        // get current translations
        const existingTranslations = await this.connection.getRepository(ProductTranslation).find({
            where: { base: updateProductDto.id },
            relations: ['base'],
        });

        const translationEntities = this.translationInputsToEntities(translations, existingTranslations);

        const toDelete = existingTranslations.filter(not(foundIn(translationEntities, 'languageCode')));
        const toAdd = translationEntities.filter(not(foundIn(existingTranslations, 'languageCode')));
        const toUpdate = translationEntities.filter(foundIn(existingTranslations, 'languageCode'));

        await this.connection
            .getCustomRepository(ProductRepository)
            .update(updateProductDto, toUpdate, toAdd, toDelete);

        return this.findOne(updateProductDto.id, DEFAULT_LANGUAGE_CODE);
    }

    private translationInputsToEntities(
        inputs: Array<TranslationInput<Product>>,
        existing: Array<ProductTranslation>,
    ): Array<ProductTranslation> {
        return inputs.map(input => {
            const counterpart = existing.find(e => e.languageCode === input.languageCode);
            const entity = new ProductTranslation(input);
            if (counterpart) {
                entity.id = counterpart.id;
                entity.base = counterpart.base;
            }
            return entity;
        });
    }
}
