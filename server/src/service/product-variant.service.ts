import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../shared/shared-types';
import { generateAllCombinations } from '../../../shared/shared-utils';
import { DEFAULT_LANGUAGE_CODE } from '../common/constants';
import { createTranslatable } from '../common/create-translatable';
import { updateTranslatable } from '../common/update-translatable';
import { assertFound } from '../common/utils';
import { FacetValue } from '../entity/facet-value/facet-value.entity';
import { ProductOption } from '../entity/product-option/product-option.entity';
import {
    CreateProductVariantDto,
    UpdateProductVariantDto,
} from '../entity/product-variant/create-product-variant.dto';
import { ProductVariantTranslation } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { Product } from '../entity/product/product.entity';
import { I18nError } from '../i18n/i18n-error';
import { Translated } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';
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
        const save = createTranslatable(ProductVariant, ProductVariantTranslation, async variant => {
            const { optionCodes } = createProductVariantDto;
            if (optionCodes && optionCodes.length) {
                const options = await this.connection.getRepository(ProductOption).find();
                const selectedOptions = options.filter(og => optionCodes.includes(og.code));
                variant.options = selectedOptions;
            }
            variant.product = product;
        });
        return save(this.connection, createProductVariantDto);
    }

    async update(updateProductVariantsDto: UpdateProductVariantDto): Promise<Translated<ProductVariant>> {
        const save = updateTranslatable(
            ProductVariant,
            ProductVariantTranslation,
            this.translationUpdaterService,
        );
        await save(this.connection, updateProductVariantsDto);
        const variant = await assertFound(
            this.connection.manager.getRepository(ProductVariant).findOne(updateProductVariantsDto.id, {
                relations: ['options'],
            }),
        );
        return translateDeep(variant, DEFAULT_LANGUAGE_CODE, ['options']);
    }

    async generateVariantsForProduct(
        productId: ID,
        defaultPrice?: number,
        defaultSku?: string,
    ): Promise<Array<Translated<ProductVariant>>> {
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['optionGroups', 'optionGroups.options'],
        });

        if (!product) {
            throw new I18nError('error.product-with-id-not-found', { productId });
        }
        const defaultTranslation = product.translations.find(t => t.languageCode === DEFAULT_LANGUAGE_CODE);

        const productName = defaultTranslation ? defaultTranslation.name : `product_${productId}`;
        const optionCombinations = product.optionGroups.length
            ? generateAllCombinations(product.optionGroups.map(g => g.options))
            : [[]];
        const createVariants = optionCombinations.map(options => {
            const name = this.createVariantName(productName, options);
            return this.create(product, {
                sku: defaultSku || 'sku-not-set',
                price: defaultPrice || 0,
                optionCodes: options.map(o => o.code),
                translations: [
                    {
                        languageCode: DEFAULT_LANGUAGE_CODE,
                        name,
                    },
                ],
            });
        });

        return await Promise.all(createVariants).then(variants =>
            variants.map(v => translateDeep(v, DEFAULT_LANGUAGE_CODE)),
        );
    }

    async addFacetValues(
        productVariantIds: ID[],
        facetValues: FacetValue[],
    ): Promise<Array<Translated<ProductVariant>>> {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(productVariantIds, {
            relations: ['options', 'facetValues'],
        });
        for (const variant of variants) {
            for (const facetValue of facetValues) {
                if (!variant.facetValues.map(fv => fv.id).includes(facetValue.id)) {
                    variant.facetValues.push(facetValue);
                }
            }
            await this.connection.manager.save(variant);
        }

        return variants.map(v => translateDeep(v, DEFAULT_LANGUAGE_CODE, ['options', 'facetValues']));
    }

    private createVariantName(productName: string, options: ProductOption[]): string {
        const optionsSuffix = options
            .map(option => {
                const defaultTranslation = option.translations.find(
                    t => t.languageCode === DEFAULT_LANGUAGE_CODE,
                );
                return defaultTranslation ? defaultTranslation.name : option.code;
            })
            .join(' ');

        return options.length ? `${productName} ${optionsSuffix}` : productName;
    }
}
