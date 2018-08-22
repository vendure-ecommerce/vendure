import { Address } from './address/address.entity';
import { Administrator } from './administrator/administrator.entity';
import { Customer } from './customer/customer.entity';
import { FacetValueTranslation } from './facet-value/facet-value-translation.entity';
import { FacetValue } from './facet-value/facet-value.entity';
import { FacetTranslation } from './facet/facet-translation.entity';
import { Facet } from './facet/facet.entity';
import { ProductOptionGroupTranslation } from './product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from './product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option/product-option-translation.entity';
import { ProductOption } from './product-option/product-option.entity';
import { ProductVariantTranslation } from './product-variant/product-variant-translation.entity';
import { ProductVariant } from './product-variant/product-variant.entity';
import { ProductTranslation } from './product/product-translation.entity';
import { Product } from './product/product.entity';
import { User } from './user/user.entity';

/**
 * A map of all the core database entities.
 */
export const coreEntitiesMap = {
    Address,
    Administrator,
    Customer,
    Facet,
    FacetTranslation,
    FacetValue,
    FacetValueTranslation,
    Product,
    ProductTranslation,
    ProductOption,
    ProductOptionTranslation,
    ProductOptionGroup,
    ProductOptionGroupTranslation,
    ProductVariant,
    ProductVariantTranslation,
    User,
};
