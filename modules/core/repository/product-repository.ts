import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { ProductEntity } from "../entity/product/product.entity";
import { Product } from "../entity/product/product.interface";
import { translate } from "../locale/locale.service";
import { ProductVariant } from "../entity/product-variant/product-variant.interface";

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {

    /**
     * Returns an array of Products including ProductVariants, translated into the
     * specified language.
     */
    localeFind(languageCode: string): Promise<Product[]> {
        return this.getProductQueryBuilder(languageCode)
            .getMany()
            .then(result => this.translateProductAndVariants(result));
    }

    /**
     * Returns single Product including ProductVariants, translated into the
     * specified language.
     */
    localeFindOne(id: number, languageCode: string): Promise<Product> {
        return this.getProductQueryBuilder(languageCode)
            .andWhere('ProductEntity.id = :id', { id })
            .getMany()
            .then(result => this.translateProductAndVariants(result))
            .then(res => res[0]);
    }

    private getProductQueryBuilder(languageCode: string): SelectQueryBuilder<ProductEntity> {
        const code = languageCode || 'en';

        return this.manager.createQueryBuilder(ProductEntity, 'product')
            .leftJoinAndSelect('product.variants', 'variant')
            .leftJoinAndSelect('product.translations', 'product_translation')
            .leftJoinAndSelect('variant.translations', 'product_variant_translation')
            .where('product_translation.languageCode = :code', { code })
            .andWhere('product_variant_translation.languageCode = :code', { code })
    }

    private translateProductAndVariants(result: ProductEntity[]): Product[] {
        return result.map(productEntity => {
            const product = translate<Product>(productEntity);
            product.variants = product.variants.map(variant => translate<ProductVariant>(variant as any));
            return product;
        });
    };
}
