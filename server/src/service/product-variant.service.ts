import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ProductOption } from '../entity/product-option/product-option.entity';
import { CreateProductVariantDto } from '../entity/product-variant/create-product-variant.dto';
import { ProductVariantTranslation } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { TranslationUpdaterService } from '../locale/translation-updater.service';

@Injectable()
export class ProductVariantService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
    ) {}

    async create(
        product: Product,
        createProductVariantDto: CreateProductVariantDto,
    ): Promise<ProductVariant> {
        const { optionCodes, translations } = createProductVariantDto;
        const variant = new ProductVariant(createProductVariantDto);
        const variantTranslations: ProductVariantTranslation[] = [];

        if (optionCodes && optionCodes.length) {
            const options = await this.connection.getRepository(ProductOption).find();
            const selectedOptions = options.filter(og => optionCodes.includes(og.code));
            variant.options = selectedOptions;
        }

        for (const input of translations) {
            const translation = new ProductVariantTranslation(input);
            variantTranslations.push(translation);
            await this.connection.manager.save(translation);
        }

        variant.product = product;
        variant.translations = variantTranslations;
        const createdVariant = await this.connection.manager.save(variant);

        return createdVariant;
    }
}
