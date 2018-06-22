import { Address } from './address/address.entity';
import { Administrator } from './administrator/administrator.entity';
import { Customer } from './customer/customer.entity';
import { ProductOptionGroupTranslation } from './product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from './product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option/product-option-translation.entity';
import { ProductOption } from './product-option/product-option.entity';
import { ProductVariantTranslation } from './product-variant/product-variant-translation.entity';
import { ProductVariant } from './product-variant/product-variant.entity';
import { ProductTranslation } from './product/product-translation.entity';
import { Product } from './product/product.entity';
import { User } from './user/user.entity';

export const coreEntities = [
    Address,
    Administrator,
    Customer,
    Product,
    ProductTranslation,
    ProductOption,
    ProductOptionTranslation,
    ProductOptionGroup,
    ProductOptionGroupTranslation,
    ProductVariant,
    ProductVariantTranslation,
    User,
];
