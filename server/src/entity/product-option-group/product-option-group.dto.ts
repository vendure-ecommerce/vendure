import { TranslatedInput } from '../../locale/locale-types';

import { ProductOptionGroup } from './product-option-group.entity';

export interface UpdateProductOptionGroupDto extends TranslatedInput<ProductOptionGroup> {
    id: string;
    code?: string;
}
