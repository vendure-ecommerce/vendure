import { Address } from './address/address.entity';
import { Administrator } from './administrator/administrator.entity';
import { Asset } from './asset/asset.entity';
import { Channel } from './channel/channel.entity';
import { CollectionTranslation } from './collection/collection-translation.entity';
import { Collection } from './collection/collection.entity';
import { CountryTranslation } from './country/country-translation.entity';
import { Country } from './country/country.entity';
import { CustomerGroup } from './customer-group/customer-group.entity';
import { Customer } from './customer/customer.entity';
import { FacetValueTranslation } from './facet-value/facet-value-translation.entity';
import { FacetValue } from './facet-value/facet-value.entity';
import { FacetTranslation } from './facet/facet-translation.entity';
import { Facet } from './facet/facet.entity';
import { GlobalSettings } from './global-settings/global-settings.entity';
import { OrderItem } from './order-item/order-item.entity';
import { OrderLine } from './order-line/order-line.entity';
import { Order } from './order/order.entity';
import { PaymentMethod } from './payment-method/payment-method.entity';
import { Payment } from './payment/payment.entity';
import { ProductOptionGroupTranslation } from './product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from './product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from './product-option/product-option-translation.entity';
import { ProductOption } from './product-option/product-option.entity';
import { ProductVariantPrice } from './product-variant/product-variant-price.entity';
import { ProductVariantTranslation } from './product-variant/product-variant-translation.entity';
import { ProductVariant } from './product-variant/product-variant.entity';
import { ProductTranslation } from './product/product-translation.entity';
import { Product } from './product/product.entity';
import { Promotion } from './promotion/promotion.entity';
import { Role } from './role/role.entity';
import { AnonymousSession } from './session/anonymous-session.entity';
import { AuthenticatedSession } from './session/authenticated-session.entity';
import { Session } from './session/session.entity';
import { ShippingMethod } from './shipping-method/shipping-method.entity';
import { Cancellation } from './stock-movement/cancellation.entity';
import { Return } from './stock-movement/return.entity';
import { Sale } from './stock-movement/sale.entity';
import { StockAdjustment } from './stock-movement/stock-adjustment.entity';
import { StockMovement } from './stock-movement/stock-movement.entity';
import { TaxCategory } from './tax-category/tax-category.entity';
import { TaxRate } from './tax-rate/tax-rate.entity';
import { User } from './user/user.entity';
import { Zone } from './zone/zone.entity';

/**
 * A map of all the core database entities.
 */
export const coreEntitiesMap = {
    Address,
    Administrator,
    AnonymousSession,
    Asset,
    AuthenticatedSession,
    Cancellation,
    Channel,
    Collection,
    CollectionTranslation,
    Country,
    CountryTranslation,
    Customer,
    CustomerGroup,
    Facet,
    FacetTranslation,
    FacetValue,
    FacetValueTranslation,
    GlobalSettings,
    Order,
    OrderItem,
    OrderLine,
    Payment,
    PaymentMethod,
    Product,
    ProductOption,
    ProductOptionGroup,
    ProductOptionGroupTranslation,
    ProductOptionTranslation,
    ProductTranslation,
    ProductVariant,
    ProductVariantPrice,
    ProductVariantTranslation,
    Promotion,
    Return,
    Role,
    Sale,
    Session,
    ShippingMethod,
    StockAdjustment,
    StockMovement,
    TaxCategory,
    TaxRate,
    User,
    Zone,
};
