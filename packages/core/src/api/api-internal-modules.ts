import { Module } from '@nestjs/common';

import { CacheModule } from '../cache/cache.module';
import { ConfigModule } from '../config/config.module';
import { ConnectionModule } from '../connection/connection.module';
import { DataImportModule } from '../data-import/data-import.module';
import { JobQueueModule } from '../job-queue/job-queue.module';
import { createDynamicGraphQlModulesForPlugins } from '../plugin/dynamic-plugin-api.module';
import { ServiceModule } from '../service/service.module';

import { ConfigurableOperationCodec } from './common/configurable-operation-codec';
import { CustomFieldRelationResolverService } from './common/custom-field-relation-resolver.service';
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
import { JobResolver } from './resolvers/admin/job.resolver';
import { OrderResolver } from './resolvers/admin/order.resolver';
import { PaymentMethodResolver } from './resolvers/admin/payment-method.resolver';
import { ProductOptionResolver } from './resolvers/admin/product-option.resolver';
import { ProductResolver } from './resolvers/admin/product.resolver';
import { PromotionResolver } from './resolvers/admin/promotion.resolver';
import { RoleResolver } from './resolvers/admin/role.resolver';
import { SearchResolver } from './resolvers/admin/search.resolver';
import { ShippingMethodResolver } from './resolvers/admin/shipping-method.resolver';
import { TagResolver } from './resolvers/admin/tag.resolver';
import { TaxCategoryResolver } from './resolvers/admin/tax-category.resolver';
import { TaxRateResolver } from './resolvers/admin/tax-rate.resolver';
import { ZoneResolver } from './resolvers/admin/zone.resolver';
import { AdministratorEntityResolver } from './resolvers/entity/administrator-entity.resolver';
import { AssetEntityResolver } from './resolvers/entity/asset-entity.resolver';
import { CollectionEntityResolver } from './resolvers/entity/collection-entity.resolver';
import { CountryEntityResolver } from './resolvers/entity/country-entity.resolver';
import {
    CustomerAdminEntityResolver,
    CustomerEntityResolver,
} from './resolvers/entity/customer-entity.resolver';
import { CustomerGroupEntityResolver } from './resolvers/entity/customer-group-entity.resolver';
import { FacetEntityResolver } from './resolvers/entity/facet-entity.resolver';
import { FacetValueEntityResolver } from './resolvers/entity/facet-value-entity.resolver';
import {
    FulfillmentAdminEntityResolver,
    FulfillmentEntityResolver,
} from './resolvers/entity/fulfillment-entity.resolver';
import { JobEntityResolver } from './resolvers/entity/job-entity.resolver';
import { OrderAdminEntityResolver, OrderEntityResolver } from './resolvers/entity/order-entity.resolver';
import { OrderItemEntityResolver } from './resolvers/entity/order-item-entity.resolver';
import { OrderLineEntityResolver } from './resolvers/entity/order-line-entity.resolver';
import {
    PaymentAdminEntityResolver,
    PaymentEntityResolver,
} from './resolvers/entity/payment-entity.resolver';
import { PaymentMethodEntityResolver } from './resolvers/entity/payment-method-entity.resolver';
import {
    ProductAdminEntityResolver,
    ProductEntityResolver,
} from './resolvers/entity/product-entity.resolver';
import { ProductOptionEntityResolver } from './resolvers/entity/product-option-entity.resolver';
import { ProductOptionGroupEntityResolver } from './resolvers/entity/product-option-group-entity.resolver';
import {
    ProductVariantAdminEntityResolver,
    ProductVariantEntityResolver,
} from './resolvers/entity/product-variant-entity.resolver';
import { RefundEntityResolver } from './resolvers/entity/refund-entity.resolver';
import { RoleEntityResolver } from './resolvers/entity/role-entity.resolver';
import { ShippingLineEntityResolver } from './resolvers/entity/shipping-line-entity.resolver';
import { ShippingMethodEntityResolver } from './resolvers/entity/shipping-method-entity.resolver';
import { TaxRateEntityResolver } from './resolvers/entity/tax-rate-entity.resolver';
import { UserEntityResolver } from './resolvers/entity/user-entity.resolver';
import { ShopAuthResolver } from './resolvers/shop/shop-auth.resolver';
import { ShopCustomerResolver } from './resolvers/shop/shop-customer.resolver';
import { ShopEnvironmentResolver } from './resolvers/shop/shop-environment.resolver';
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
    JobResolver,
    OrderResolver,
    PaymentMethodResolver,
    ProductOptionResolver,
    ProductResolver,
    PromotionResolver,
    RoleResolver,
    SearchResolver,
    ShippingMethodResolver,
    TagResolver,
    TaxCategoryResolver,
    TaxRateResolver,
    ZoneResolver,
];

const shopResolvers = [
    ShopAuthResolver,
    ShopCustomerResolver,
    ShopOrderResolver,
    ShopProductsResolver,
    ShopEnvironmentResolver,
];

export const entityResolvers = [
    CollectionEntityResolver,
    CountryEntityResolver,
    CustomerEntityResolver,
    CustomerGroupEntityResolver,
    FacetEntityResolver,
    FacetValueEntityResolver,
    FulfillmentEntityResolver,
    OrderEntityResolver,
    OrderItemEntityResolver,
    OrderLineEntityResolver,
    PaymentEntityResolver,
    ProductEntityResolver,
    ProductOptionEntityResolver,
    ProductOptionGroupEntityResolver,
    ProductVariantEntityResolver,
    RefundEntityResolver,
    RoleEntityResolver,
    ShippingLineEntityResolver,
    UserEntityResolver,
    TaxRateEntityResolver,
    ShippingMethodEntityResolver,
];

export const adminEntityResolvers = [
    AdministratorEntityResolver,
    AssetEntityResolver,
    CustomerAdminEntityResolver,
    OrderAdminEntityResolver,
    PaymentMethodEntityResolver,
    FulfillmentAdminEntityResolver,
    PaymentAdminEntityResolver,
    ProductVariantAdminEntityResolver,
    ProductAdminEntityResolver,
    JobEntityResolver,
];

/**
 * The internal module containing some shared providers used by more than
 * one API module.
 */
@Module({
    imports: [ConfigModule, ServiceModule, CacheModule, ConnectionModule.forRoot()],
    providers: [IdCodecService, ConfigurableOperationCodec, CustomFieldRelationResolverService],
    exports: [
        IdCodecService,
        CacheModule,
        ConfigModule,
        ConfigurableOperationCodec,
        CustomFieldRelationResolverService,
        ServiceModule,
        ConnectionModule.forRoot(),
    ],
})
export class ApiSharedModule {}

/**
 * The internal module containing the Admin GraphQL API resolvers
 */
@Module({
    imports: [
        ApiSharedModule,
        JobQueueModule,
        DataImportModule,
        ...createDynamicGraphQlModulesForPlugins('admin'),
    ],
    providers: [...adminResolvers, ...entityResolvers, ...adminEntityResolvers],
    exports: [...adminResolvers],
})
export class AdminApiModule {}

/**
 * The internal module containing the Shop GraphQL API resolvers
 */
@Module({
    imports: [ApiSharedModule, ...createDynamicGraphQlModulesForPlugins('shop')],
    providers: [...shopResolvers, ...entityResolvers],
    exports: [...shopResolvers],
})
export class ShopApiModule {}
