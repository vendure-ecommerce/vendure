import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getConfig } from '../config/config-helpers';
import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';

import { AssetUpdater } from './helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from './helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from './helpers/order-calculator/order-calculator';
import { OrderMerger } from './helpers/order-merger/order-merger';
import { OrderStateMachine } from './helpers/order-state-machine/order-state-machine';
import { PasswordCiper } from './helpers/password-cipher/password-ciper';
import { ShippingCalculator } from './helpers/shipping-calculator/shipping-calculator';
import { TaxCalculator } from './helpers/tax-calculator/tax-calculator';
import { TranslatableSaver } from './helpers/translatable-saver/translatable-saver';
import { VerificationTokenGenerator } from './helpers/verification-token-generator/verification-token-generator';
import { AdministratorService } from './services/administrator.service';
import { AssetService } from './services/asset.service';
import { AuthService } from './services/auth.service';
import { ChannelService } from './services/channel.service';
import { CountryService } from './services/country.service';
import { CustomerGroupService } from './services/customer-group.service';
import { CustomerService } from './services/customer.service';
import { FacetValueService } from './services/facet-value.service';
import { FacetService } from './services/facet.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { OrderService } from './services/order.service';
import { PaymentMethodService } from './services/payment-method.service';
import { ProductCategoryService } from './services/product-category.service';
import { ProductOptionGroupService } from './services/product-option-group.service';
import { ProductOptionService } from './services/product-option.service';
import { ProductVariantService } from './services/product-variant.service';
import { ProductService } from './services/product.service';
import { PromotionService } from './services/promotion.service';
import { RoleService } from './services/role.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { TaxCategoryService } from './services/tax-category.service';
import { TaxRateService } from './services/tax-rate.service';
import { UserService } from './services/user.service';
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
    GlobalSettingsService,
    OrderService,
    PaymentMethodService,
    ProductCategoryService,
    ProductOptionService,
    ProductOptionGroupService,
    ProductService,
    ProductVariantService,
    RoleService,
    ShippingMethodService,
    TaxCategoryService,
    TaxRateService,
    UserService,
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
    imports: [ConfigModule, EventBusModule, TypeOrmModule.forRoot(getConfig().dbConnectionOptions)],
    providers: [
        ...exportedProviders,
        PasswordCiper,
        TranslatableSaver,
        TaxCalculator,
        OrderCalculator,
        OrderStateMachine,
        OrderMerger,
        ListQueryBuilder,
        ShippingCalculator,
        AssetUpdater,
        VerificationTokenGenerator,
    ],
    exports: exportedProviders,
})
export class ServiceModule implements OnModuleInit {
    constructor(
        private channelService: ChannelService,
        private roleService: RoleService,
        private administratorService: AdministratorService,
        private taxRateService: TaxRateService,
        private shippingMethodService: ShippingMethodService,
        private paymentMethodService: PaymentMethodService,
        private globalSettingsService: GlobalSettingsService,
    ) {}

    async onModuleInit() {
        // IMPORTANT - why manually invoke these init methods rather than just relying on
        // Nest's "onModuleInit" lifecycle hook within each individual service class?
        // The reason is that the order of invokation matters. By explicitly invoking the
        // methods below, we can e.g. guarantee that the default channel exists
        // (channelService.initChannels()) before we try to create any roles (which assume that
        // there is a default Channel to work with.
        await this.globalSettingsService.initGlobalSettings();
        await this.channelService.initChannels();
        await this.roleService.initRoles();
        await this.administratorService.initAdministrators();
        await this.taxRateService.initTaxRates();
        await this.shippingMethodService.initShippingMethods();
        await this.paymentMethodService.initPaymentMethods();
    }
}
