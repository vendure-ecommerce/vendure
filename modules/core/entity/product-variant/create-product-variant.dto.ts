import { TranslatedInput } from '../../locale/locale-types';
import { ProductVariant } from './product-variant.interface';

export interface CreateProductVariantDto extends TranslatedInput<ProductVariant> {
    sku: string;
    price: number;
    image?: string;
    optionCodes?: string[];
}
