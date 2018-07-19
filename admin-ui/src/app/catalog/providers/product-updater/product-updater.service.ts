import { Injectable } from '@angular/core';

import { notNullOrUndefined } from '../../../../../../shared/shared-utils';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import {
    GetProductWithVariants_product,
    GetProductWithVariants_product_variants,
    LanguageCode,
    UpdateProductInput,
    UpdateProductVariantInput,
} from '../../../data/types/gql-generated-types';

/**
 * A utility class containing method used to prepare product data from the ProductDetailComponent for
 * sending to the API.
 */
@Injectable()
export class ProductUpdaterService {
    /**
     * Given a product and the value of the productForm, this method creates an updated copy of the product which
     * can then be persisted to the API.
     */
    getUpdatedProduct(
        product: GetProductWithVariants_product,
        formValue: { [key: string]: any },
        languageCode: LanguageCode,
    ): UpdateProductInput {
        return this.createUpdatedTranslatable(product, formValue, languageCode, {
            languageCode,
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
        });
    }

    /**
     * Given an array of product variants and the values from the productForm, this method creates an new array
     * which can be persisted to the API.
     */
    getUpdatedProductVariants(
        variants: GetProductWithVariants_product_variants[],
        formValue: Array<{ [key: string]: any }>,
        languageCode: LanguageCode,
    ): UpdateProductVariantInput[] {
        if (variants.length !== formValue.length) {
            throw new Error(_(`error.product-variant-form-values-do-not-match`));
        }
        return variants
            .map((variant, i) => {
                return this.createUpdatedTranslatable(variant, formValue[i], languageCode);
            })
            .filter(notNullOrUndefined);
    }

    private createUpdatedTranslatable<T extends { translations: any[] }>(
        translatable: T,
        updatedFields: { [key: string]: any },
        languageCode: LanguageCode,
        defaultTranslation?: Partial<T['translations'][number]>,
    ): T {
        const currentTranslation =
            translatable.translations.find(t => t.languageCode === languageCode) || defaultTranslation;
        const index = translatable.translations.indexOf(currentTranslation);
        const newTranslation = this.patchObject(currentTranslation, updatedFields);
        const newTranslatable = {
            ...(this.patchObject(translatable, updatedFields) as any),
            ...{ translations: translatable.translations.slice() },
        };
        if (index !== -1) {
            newTranslatable.translations.splice(index, 1, newTranslation);
        } else {
            newTranslatable.translations.push(newTranslation);
        }
        return newTranslatable;
    }

    /**
     * Returns a shallow clone of `obj` with any properties contained in `patch` overwriting
     * those of `obj`.
     */
    private patchObject<T extends { [key: string]: any }>(obj: T, patch: { [key: string]: any }): T {
        const clone = Object.assign({}, obj);
        Object.keys(clone).forEach(key => {
            if (patch.hasOwnProperty(key)) {
                clone[key] = patch[key];
            }
        });
        return clone;
    }
}
