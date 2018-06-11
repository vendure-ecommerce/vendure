import { TranslatedInput } from '../../locale/locale-types';
import { Product } from './product.entity';

export interface CreateProductDto extends TranslatedInput<Product> {
    image?: string;
    optionGroupCodes?: [string];
}
