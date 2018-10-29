import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { getConfig } from '../config/vendure-config';

import { ListQueryBuilder } from './helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from './helpers/order-calculator/order-calculator';
import { OrderMerger } from './helpers/order-merger/order-merger';
import { OrderStateMachine } from './helpers/order-state-machine/order-state-machine';
import { PasswordCiper } from './helpers/password-cipher/password-ciper';
import { TaxCalculator } from './helpers/tax-calculator/tax-calculator';
import { TranslatableSaver } from './helpers/translatable-saver/translatable-saver';
import { AdministratorService } from './services/administrator.service';
import { AssetService } from './services/asset.service';
import { AuthService } from './services/auth.service';
import { ChannelService } from './services/channel.service';
import { CountryService } from './services/country.service';
import { CustomerGroupService } from './services/customer-group.service';
import { CustomerService } from './services/customer.service';
import { FacetValueService } from './services/facet-value.service';
import { FacetService } from './services/facet.service';
import { OrderService } from './services/order.service';
import { ProductOptionGroupService } from './services/product-option-group.service';
import { ProductOptionService } from './services/product-option.service';
import { ProductVariantService } from './services/product-variant.service';
import { ProductService } from './services/product.service';
import { PromotionService } from './services/promotion.service';
import { RoleService } from './services/role.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { TaxCategoryService } from './services/tax-category.service';
import { TaxRateService } from './services/tax-rate.service';
import { ZoneService } from './services/zone.service';

const exportedProviders = [
    PromotionService,
    AdministratorService,
    AssetService,
    AuthService,
    ChannelService,
    CountryService,
    CustomerGroupService,
    CustomerService,
    FacetService,
    FacetValueService,
    OrderService,
    ProductOptionService,
    ProductOptionGroupService,
    ProductService,
    ProductVariantService,
    RoleService,
    ShippingMethodService,
    TaxCategoryService,
    TaxRateService,
    ZoneService,
];

/**
 * The ServiceModule is responsible for the service layer, i.e. accessing the database
 * and implementing the main business logic of the application.
 *
 * The exported providers are used in the ApiModule, which is responsible for parsing requests
 * into a format suitable for the service layer logic.
 */
@Module({
    imports: [ConfigModule, TypeOrmModule.forRoot(getConfig().dbConnectionOptions)],
    providers: [
        ...exportedProviders,
        PasswordCiper,
        TranslatableSaver,
        TaxCalculator,
        OrderCalculator,
        OrderStateMachine,
        OrderMerger,
        ListQueryBuilder,
    ],
    exports: exportedProviders,
})
export class ServiceModule implements OnModuleInit {
    constructor(
        private channelService: ChannelService,
        private roleService: RoleService,
        private administratorService: AdministratorService,
        private taxRateService: TaxRateService,
    ) {}

    async onModuleInit() {
        await this.channelService.initChannels();
        await this.roleService.initRoles();
        await this.administratorService.initAdministrators();
        await this.taxRateService.initTaxRates();
    }
}
