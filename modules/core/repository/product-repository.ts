import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductOptionGroup } from '../entity/product-option-group/product-option-group.interface';
import { ProductOption } from '../entity/product-option/product-option.interface';
import { ProductVariant } from '../entity/product-variant/product-variant.interface';
import { ProductEntity } from '../entity/product/product.entity';
import { Product } from '../entity/product/product.interface';
import { Translatable, TranslatableKeys, TranslatedEntity } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
    /**
     * Returns an array of Products including ProductVariants, translated into the
     * specified language.
     */
    localeFind(languageCode: string): Promise<Product[]> {
        return this.getProductQueryBuilder(languageCode)
            .getMany()
            .then(result => result.map(res => translateDeep(res, ['variants', 'optionGroups']) as any));
    }

    /**
     * Returns single Product including ProductVariants, translated into the
     * specified language.
     */
    localeFindOne(id: number, languageCode: string): Promise<Product> {
        return this.getProductQueryBuilder(languageCode)
            .andWhere('product.id = :id', { id })
            .getOne()
            .then(result => translateDeep(result, ['variants', 'optionGroups', ['variants', 'options']]) as any);
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
}
