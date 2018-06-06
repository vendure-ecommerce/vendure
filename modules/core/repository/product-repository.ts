import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductEntity } from '../entity/product/product.entity';
import { Product } from '../entity/product/product.interface';
import { translate } from '../locale/locale.service';
import { ProductVariant } from '../entity/product-variant/product-variant.interface';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.interface';
import { ProductOption } from '../entity/product-option/product-option.interface';

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
            .andWhere('product.id = :id', { id })
            .getMany()
            .then(result => this.translateProductAndVariants(result))
            .then(res => res[0]);
    }

    private getProductQueryBuilder(languageCode: string): SelectQueryBuilder<ProductEntity> {
        const code = languageCode || 'en';

        return this.manager
            .createQueryBuilder(ProductEntity, 'product')
            .leftJoinAndSelect('product.variants', 'variant')
            .leftJoinAndSelect('product.optionGroups', 'option_group')
            .leftJoinAndSelect(
                'product.translations',
                'product_translation',
                'product_translation.languageCode = :code',
            )
            .leftJoinAndSelect(
                'variant.translations',
                'product_variant_translation',
                'product_variant_translation.languageCode = :code',
            )
            .leftJoinAndSelect(
                'option_group.translations',
                'option_group_translation',
                'option_group_translation.languageCode = :code',
            )
            .leftJoinAndSelect('variant.options', 'variant_options')
            .leftJoinAndSelect(
                'variant_options.translations',
                'variant_options_translation',
                'variant_options_translation.languageCode = :code',
            )
            .setParameters({ code });
    }

    private translateProductAndVariants(result: ProductEntity[]): Product[] {
        return result.map(productEntity => {
            const product = translate<Product>(productEntity);
            product.variants = product.variants.map(variant => {
                const v = translate<ProductVariant>(variant as any);
                v.options = v.options.map(vop => translate<ProductOption>(vop as any));
                return v;
            });
            product.optionGroups = product.optionGroups.map(group => translate<ProductOptionGroup>(group as any));
            return product;
        });
    }
}
