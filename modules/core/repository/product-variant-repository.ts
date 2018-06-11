import { AbstractRepository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ProductVariantTranslationEntity } from '../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { translateDeep } from '../locale/translate-entity';

@EntityRepository(Product)
export class ProductVariantRepository extends AbstractRepository<ProductVariant> {
    /**
     * Returns an array of Products including ProductVariants, translated into the
     * specified language.
     */
    localeFindByProductId(productId: number, languageCode: LanguageCode): Promise<ProductVariant[]> {
        return this.getProductVariantQueryBuilder(productId, languageCode).getMany();
    }

    /**
     * Creates a new Product with one or more ProductTranslations.
     */
    async create(
        product: Product,
        productVariantEntity: ProductVariant,
        translations: ProductVariantTranslationEntity[],
    ): Promise<ProductVariant> {
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
    ): SelectQueryBuilder<ProductVariant> {
        const code = languageCode || LanguageCode.EN;

        return this.manager
            .createQueryBuilder(ProductVariant, 'variant')
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
