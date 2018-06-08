import { AbstractRepository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ProductVariantTranslationEntity } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariantEntity } from '../entity/product-variant/product-variant.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.interface';
import { ProductTranslationEntity } from '../entity/product/product-translation.entity';
import { ProductEntity } from '../entity/product/product.entity';
import { Product } from '../entity/product/product.interface';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';

@EntityRepository(ProductEntity)
export class ProductVariantRepository extends AbstractRepository<ProductVariantEntity> {
    /**
     * Returns an array of Products including ProductVariants, translated into the
     * specified language.
     */
    localeFindByProductId(productId: number, languageCode: LanguageCode): Promise<ProductVariantEntity[]> {
        return this.getProductVariantQueryBuilder(productId, languageCode).getMany();
    }

    /**
     * Creates a new Product with one or more ProductTranslations.
     */
    async create(
        product: ProductEntity | Product,
        productVariantEntity: ProductVariantEntity,
        translations: ProductVariantTranslationEntity[],
    ): Promise<ProductVariantEntity> {
        for (const translation of translations) {
            await this.manager.save(translation);
        }
        productVariantEntity.product = product as any;
        productVariantEntity.translations = translations;
        return this.manager.save(productVariantEntity);
    }

    private getProductVariantQueryBuilder(
        productId: number,
        languageCode: LanguageCode,
    ): SelectQueryBuilder<ProductVariantEntity> {
        const code = languageCode || LanguageCode.EN;

        return this.manager
            .createQueryBuilder(ProductVariantEntity, 'variant')
            .leftJoinAndSelect('product_variant.options', 'option')
            .leftJoinAndSelect(
                'variant.translations',
                'product_variant_translation',
                'product_variant_translation.languageCode = :code',
            )
            .leftJoinAndSelect('variant.options', 'variant_options')
            .leftJoinAndSelect(
                'variant_options.translations',
                'variant_options_translation',
                'variant_options_translation.languageCode = :code',
            )
            .where('variant.productId = :productId')
            .setParameters({ productId, code });
    }
}
