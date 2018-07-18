import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID, PaginatedList } from '../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { assertFound } from '../common/utils';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { CreateProductDto, UpdateProductDto } from '../entity/product/product.dto';
import { Product } from '../entity/product/product.entity';
import { I18nError } from '../i18n/i18n-error';
import { LanguageCode } from '../locale/language-code';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    findAll(lang: LanguageCode, take?: number, skip?: number): Promise<PaginatedList<Translated<Product>>> {
        const relations = ['variants', 'optionGroups', 'variants.options'];

        if (skip !== undefined && take === undefined) {
            take = Number.MAX_SAFE_INTEGER;
        }

        return this.connection.manager
            .findAndCount(Product, { relations, take, skip })
            .then(([products, totalItems]) => {
                const items = products.map(product =>
                    translateDeep(product, lang, ['optionGroups', 'variants', ['variants', 'options']]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    findOne(productId: ID, lang: LanguageCode): Promise<Translated<Product> | undefined> {
        const relations = ['variants', 'optionGroups', 'variants.options'];

        return this.connection.manager
            .findOne(Product, productId, { relations })
            .then(
                product =>
                    product &&
                    translateDeep(product, lang, ['optionGroups', 'variants', ['variants', 'options']]),
            );
    }

    async create(createProductDto: CreateProductDto): Promise<Translated<Product>> {
        const { variants, optionGroupCodes, image, translations } = createProductDto;
        const product = new Product(createProductDto);
        const productTranslations: ProductTranslation[] = [];

        if (optionGroupCodes && optionGroupCodes.length) {
            const optionGroups = await this.connection.getRepository(ProductOptionGroup).find();
            const selectedOptionGroups = optionGroups.filter(og => optionGroupCodes.includes(og.code));
            product.optionGroups = selectedOptionGroups;
        }

        for (const input of translations) {
            const translation = new ProductTranslation(input);
            productTranslations.push(translation);
            await this.connection.manager.save(translation);
        }

        product.translations = productTranslations;
        const createdProduct = await this.connection.manager.save(product);

        return assertFound(this.findOne(createdProduct.id, DEFAULT_LANGUAGE_CODE));
    }

    async update(updateProductDto: UpdateProductDto): Promise<Translated<Product>> {
        const existingTranslations = await this.connection.getRepository(ProductTranslation).find({
            where: { base: updateProductDto.id },
            relations: ['base'],
        });

        const translationUpdater = this.translationUpdaterService.create(ProductTranslation);
        const diff = translationUpdater.diff(existingTranslations, updateProductDto.translations);

        const product = await translationUpdater.applyDiff(new Product(updateProductDto), diff);
        await this.connection.manager.save(product);

        return assertFound(this.findOne(updateProductDto.id, DEFAULT_LANGUAGE_CODE));
    }

    async updateProductVariants(updateProductVariants: any[]): Promise<Array<Translated<ProductVariant>>> {
        for (const variant of updateProductVariants) {
            await this.connection.getRepository(ProductVariant).update(variant.id, variant);
        }

        return await this.connection
            .getRepository(ProductVariant)
            .findByIds(updateProductVariants.map(v => v.id))
            .then(variants => {
                return variants.map(v => translateDeep(v, DEFAULT_LANGUAGE_CODE));
            });
    }

    async addOptionGroupToProduct(productId: ID, optionGroupId: ID): Promise<Translated<Product>> {
        const product = await this.getProductWithOptionGroups(productId);
        const optionGroup = await this.connection.getRepository(ProductOptionGroup).findOne(optionGroupId);
        if (!optionGroup) {
            throw new I18nError(`error.option-group-with-id-not-found`, { optionGroupId });
        }

        if (Array.isArray(product.optionGroups)) {
            product.optionGroups.push(optionGroup);
        } else {
            product.optionGroups = [optionGroup];
        }

        await this.connection.manager.save(product);
        return assertFound(this.findOne(productId, DEFAULT_LANGUAGE_CODE));
    }

    async removeOptionGroupFromProduct(productId: ID, optionGroupId: ID): Promise<Translated<Product>> {
        const product = await this.getProductWithOptionGroups(productId);
        product.optionGroups = product.optionGroups.filter(g => g.id !== optionGroupId);

        await this.connection.manager.save(product);
        return assertFound(this.findOne(productId, DEFAULT_LANGUAGE_CODE));
    }

    private async getProductWithOptionGroups(productId: ID): Promise<Product> {
        const product = await this.connection
            .getRepository(Product)
            .findOne(productId, { relations: ['optionGroups'] });
        if (!product) {
            throw new I18nError(`error.product-with-id-not-found`, { productId });
        }
        return product;
    }
}
