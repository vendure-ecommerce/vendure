import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProductOption } from '../entity/product-option/product-option.entity';
import { CreateProductVariantDto } from '../entity/product-variant/create-product-variant.dto';
import { ProductVariantTranslationEntity } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { translateDeep } from '../locale/translate-entity';
import { ProductVariantRepository } from '../repository/product-variant-repository';

@Injectable()
export class ProductVariantService {
    constructor(@InjectConnection() private connection: Connection) {}

    async create(product: Product, createProductVariantDto: CreateProductVariantDto): Promise<ProductVariant> {
        const { sku, price, image, optionCodes, translations } = createProductVariantDto;
        const productVariant = new ProductVariant();
        productVariant.sku = sku;
        productVariant.price = price;
        productVariant.image = image!;

        if (optionCodes && optionCodes.length) {
            const options = await this.connection.getRepository(ProductOption).find();
            const selectedOptions = options.filter(o => optionCodes.includes(o.code));
            productVariant.options = selectedOptions;
        }

        const variantTranslations: ProductVariantTranslationEntity[] = [];

        for (const input of translations) {
            const { languageCode, name } = input;
            const translation = new ProductVariantTranslationEntity();
            translation.languageCode = languageCode;
            translation.name = name;
            variantTranslations.push(translation);
        }

        return this.connection
            .getCustomRepository(ProductVariantRepository)
            .create(product, productVariant, variantTranslations)
            .then(variant => translateDeep(variant));
    }
}
