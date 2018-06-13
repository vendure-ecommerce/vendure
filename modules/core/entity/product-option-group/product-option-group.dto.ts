import { TranslatedInput } from '../../locale/locale-types';
import { CreateProductOptionDto } from '../product-option/product-option.dto';
import { ProductOptionGroup } from './product-option-group.entity';

export interface CreateProductOptionGroupDto extends TranslatedInput<ProductOptionGroup> {
    code: string;
    options?: CreateProductOptionDto[];
}
