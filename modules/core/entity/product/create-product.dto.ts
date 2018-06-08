import { TranslatedInput } from '../../locale/locale-types';
import { CreateProductVariantDto } from '../product-variant/create-product-variant.dto';
import { Product } from './product.interface';

export interface CreateProductDto extends TranslatedInput<Product> {
    image?: string;
    optionGroupCodes?: [string];
    variants?: CreateProductVariantDto[];
}
