import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProductOptionGroupEntity } from '../entity/product-option-group/product-option-group.entity';
import { CreateProductDto } from '../entity/product/create-product.dto';
import { ProductTranslationEntity } from '../entity/product/product-translation.entity';
import { ProductEntity } from '../entity/product/product.entity';
import { Product } from '../entity/product/product.interface';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';
import { ProductRepository } from '../repository/product-repository';

@Injectable()
export class ProductService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(lang: LanguageCode): Promise<Product[]> {
        return this.connection
            .getCustomRepository(ProductRepository)
            .find(lang)
            .then(products => products.map(product => this.translateProductEntity(product)));
    }

    findOne(productId: number, lang: LanguageCode): Promise<Product | undefined> {
        return this.connection
            .getCustomRepository(ProductRepository)
            .findOne(productId, lang)
            .then(product => product && this.translateProductEntity(product));
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const { variants, optionGroupCodes, image, translations } = createProductDto;
        const productEntity = new ProductEntity();
        const productTranslations: ProductTranslationEntity[] = [];

        if (optionGroupCodes && optionGroupCodes.length) {
            const optionGroups = await this.connection.getRepository(ProductOptionGroupEntity).find();
            const selectedOptionGroups = optionGroups.filter(og => optionGroupCodes.includes(og.code));
            productEntity.optionGroups = selectedOptionGroups;
        }

        for (const input of createProductDto.translations) {
            const { languageCode, name, description, slug } = input;
            const translation = new ProductTranslationEntity();
            translation.languageCode = languageCode;
            translation.name = name;
            translation.slug = slug;
            translation.description = description;
            productTranslations.push(translation);
        }

        return this.connection
            .getCustomRepository(ProductRepository)
            .create(productEntity, productTranslations)
            .then(product => translateDeep(product));
    }

    private translateProductEntity(product: ProductEntity): Product {
        return translateDeep(product, ['optionGroups', 'variants', ['variants', 'options']]);
    }
}
