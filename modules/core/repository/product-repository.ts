import { AbstractRepository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { ProductTranslation } from '../entity/product/product-translation.entity';
import { CreateProductDto, UpdateProductDto } from '../entity/product/product.dto';
import { Product } from '../entity/product/product.entity';
import { LanguageCode } from '../locale/language-code';
import { TranslationInput } from '../locale/locale-types';
import { translateDeep } from '../locale/translate-entity';

@EntityRepository(Product)
export class ProductRepository extends AbstractRepository<Product> {
    /**
     * Returns an array of Products including ProductVariants, translated into the
     * specified language.
     */
    find(languageCode: LanguageCode): Promise<Product[]> {
        return this.getProductQueryBuilder(languageCode).getMany();
    }

    /**
     * Returns single Product including ProductVariants, translated into the
     * specified language.
     */
    findOne(id: number, languageCode: LanguageCode): Promise<Product | undefined> {
        return this.getProductQueryBuilder(languageCode)
            .andWhere('product.id = :id', { id })
            .getOne();
    }

    /**
     * Creates a new Product with one or more ProductTranslations.
     */
    async create(productEntity: Product, translations: ProductTranslation[]): Promise<Product> {
        for (const translation of translations) {
            await this.manager.save(translation);
        }
        productEntity.translations = translations;
        return this.manager.save(productEntity);
    }

    /**
     * Updates an existing Product and manages its ProductTranslations.
     */
    async update(
        productDto: UpdateProductDto,
        translationsToUpdate: ProductTranslation[],
        translationsToAdd: ProductTranslation[],
        translationsToDelete: ProductTranslation[],
    ): Promise<Product> {
        const product = new Product(productDto);
        product.translations = [];

        if (translationsToUpdate.length) {
            for (const toUpdate of translationsToUpdate) {
                await this.manager
                    .createQueryBuilder()
                    .update(ProductTranslation)
                    .set(toUpdate)
                    .where('id = :id', { id: toUpdate.id })
                    .execute();
            }
            product.translations = product.translations.concat(translationsToUpdate);
        }

        if (translationsToAdd.length) {
            for (const toAdd of translationsToAdd) {
                const translation = new ProductTranslation(toAdd);
                translation.base = product;
                const newTranslation = await this.manager.getRepository(ProductTranslation).save(translation);
                product.translations.push(newTranslation);
            }
        }

        if (translationsToDelete.length) {
            const toDeleteEntities = translationsToDelete.map(toDelete => {
                const translation = new ProductTranslation(toDelete);
                translation.base = product;
                return translation;
            });
            await this.manager.getRepository(ProductTranslation).remove(toDeleteEntities);
        }

        return this.manager.save(product);
    }

    private getProductQueryBuilder(languageCode: LanguageCode): SelectQueryBuilder<Product> {
        return this.manager
            .createQueryBuilder(Product, 'product')
            .leftJoinAndSelect('product.variants', 'variant')
            .leftJoinAndSelect('product.optionGroups', 'option_group')
            .leftJoinAndSelect(
                'product.translations',
                'product_translation',
                // 'product_translation.languageCode = :code',
            )
            .leftJoinAndSelect(
                'variant.translations',
                'product_variant_translation',
                // 'product_variant_translation.languageCode = :code',
            )
            .leftJoinAndSelect(
                'option_group.translations',
                'option_group_translation',
                // 'option_group_translation.languageCode = :code',
            )
            .leftJoinAndSelect('variant.options', 'variant_options')
            .leftJoinAndSelect(
                'variant_options.translations',
                'variant_options_translation',
                // 'variant_options_translation.languageCode = :code',
            )
            .setParameters({ code: languageCode });
    }
}
