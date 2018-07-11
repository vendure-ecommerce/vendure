import { TranslatedInput } from '../../locale/locale-types';
import { CreateProductVariantDto } from '../product-variant/create-product-variant.dto';

import { Product } from './product.entity';

export interface CreateProductDto extends TranslatedInput<Product> {
    image?: string;
    optionGroupCodes?: [string];
    variants?: CreateProductVariantDto[];
}

export interface UpdateProductDto extends TranslatedInput<Product> {
    id: string;
    image?: string;
    optionGroupCodes?: [string];
}
