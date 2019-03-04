import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { DataImportModule } from '../data-import/data-import.module';
import { PluginModule } from '../plugin/plugin.module';
import { ServiceModule } from '../service/service.module';

import { IdCodecService } from './common/id-codec.service';
import { AdministratorResolver } from './resolvers/admin/administrator.resolver';
import { AssetResolver } from './resolvers/admin/asset.resolver';
import { AuthResolver } from './resolvers/admin/auth.resolver';
import { ChannelResolver } from './resolvers/admin/channel.resolver';
import { CollectionResolver } from './resolvers/admin/collection.resolver';
import { CountryResolver } from './resolvers/admin/country.resolver';
import { CustomerGroupResolver } from './resolvers/admin/customer-group.resolver';
import { CustomerResolver } from './resolvers/admin/customer.resolver';
import { FacetResolver } from './resolvers/admin/facet.resolver';
import { GlobalSettingsResolver } from './resolvers/admin/global-settings.resolver';
import { ImportResolver } from './resolvers/admin/import.resolver';
import { OrderResolver } from './resolvers/admin/order.resolver';
import { PaymentMethodResolver } from './resolvers/admin/payment-method.resolver';
import { ProductOptionResolver } from './resolvers/admin/product-option.resolver';
import { ProductResolver } from './resolvers/admin/product.resolver';
import { PromotionResolver } from './resolvers/admin/promotion.resolver';
import { RoleResolver } from './resolvers/admin/role.resolver';
import { SearchResolver } from './resolvers/admin/search.resolver';
import { ShippingMethodResolver } from './resolvers/admin/shipping-method.resolver';
import { TaxCategoryResolver } from './resolvers/admin/tax-category.resolver';
import { TaxRateResolver } from './resolvers/admin/tax-rate.resolver';
import { ZoneResolver } from './resolvers/admin/zone.resolver';
import { CollectionEntityResolver } from './resolvers/entity/collection-entity.resolver';
import { CustomerEntityResolver } from './resolvers/entity/customer-entity.resolver';
import { OrderEntityResolver } from './resolvers/entity/order-entity.resolver';
import { OrderLineEntityResolver } from './resolvers/entity/order-line-entity.resolver';
import { ProductEntityResolver } from './resolvers/entity/product-entity.resolver';
import { ProductOptionGroupEntityResolver } from './resolvers/entity/product-option-group-entity.resolver';
import { ProductVariantEntityResolver } from './resolvers/entity/product-variant-entity.resolver';
import { ShopAuthResolver } from './resolvers/shop/shop-auth.resolver';
import { ShopCustomerResolver } from './resolvers/shop/shop-customer.resolver';
import { ShopOrderResolver } from './resolvers/shop/shop-order.resolver';
import { ShopProductsResolver } from './resolvers/shop/shop-products.resolver';

const adminResolvers = [
    AdministratorResolver,
    AssetResolver,
    AuthResolver,
    ChannelResolver,
    CollectionResolver,
    CountryResolver,
    CustomerGroupResolver,
    CustomerResolver,
    FacetResolver,
    GlobalSettingsResolver,
    ImportResolver,
    OrderResolver,
    PaymentMethodResolver,
    ProductOptionResolver,
    ProductResolver,
    PromotionResolver,
    RoleResolver,
    SearchResolver,
    ShippingMethodResolver,
    TaxCategoryResolver,
    TaxRateResolver,
    ZoneResolver,
];

const shopResolvers = [ShopAuthResolver, ShopCustomerResolver, ShopOrderResolver, ShopProductsResolver];

export const entityResolvers = [
    CollectionEntityResolver,
    CustomerEntityResolver,
    OrderEntityResolver,
    OrderLineEntityResolver,
    ProductEntityResolver,
    ProductOptionGroupEntityResolver,
    ProductVariantEntityResolver,
];

/**
 * The internal module containing some shared providers used by more than
 * one API module.
 */
@Module({
    imports: [ConfigModule],
    providers: [IdCodecService],
    exports: [IdCodecService],
})
export class ApiSharedModule {}

/**
 * The internal module containing the Admin GraphQL API resolvers
 */
@Module({
    imports: [ApiSharedModule, PluginModule, ServiceModule, DataImportModule],
    providers: [...adminResolvers, ...entityResolvers, ...PluginModule.adminApiResolvers()],
    exports: adminResolvers,
})
export class AdminApiModule {}

/**
 * The internal module containing the Shop GraphQL API resolvers
 */
@Module({
    imports: [ApiSharedModule, PluginModule, ServiceModule],
    providers: [...shopResolvers, ...entityResolvers, ...PluginModule.shopApiResolvers()],
    exports: shopResolvers,
})
export class ShopApiModule {}
