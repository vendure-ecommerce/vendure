import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { getConfig } from '../config/vendure-config';

import { TranslationUpdaterService } from './helpers/translation-updater.service';
import { AdministratorService } from './providers/administrator.service';
import { AssetService } from './providers/asset.service';
import { AuthService } from './providers/auth.service';
import { ChannelService } from './providers/channel.service';
import { CustomerService } from './providers/customer.service';
import { FacetValueService } from './providers/facet-value.service';
import { FacetService } from './providers/facet.service';
import { OrderService } from './providers/order.service';
import { PasswordService } from './providers/password.service';
import { ProductOptionGroupService } from './providers/product-option-group.service';
import { ProductOptionService } from './providers/product-option.service';
import { ProductVariantService } from './providers/product-variant.service';
import { ProductService } from './providers/product.service';
import { RoleService } from './providers/role.service';

const exportedProviders = [
    AdministratorService,
    AssetService,
    AuthService,
    ChannelService,
    CustomerService,
    FacetService,
    FacetValueService,
    OrderService,
    ProductOptionService,
    ProductOptionGroupService,
    ProductService,
    ProductVariantService,
    RoleService,
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
    providers: [...exportedProviders, PasswordService, TranslationUpdaterService],
    exports: exportedProviders,
})
export class ServiceModule implements OnModuleInit {
    constructor(
        private channelService: ChannelService,
        private roleService: RoleService,
        private administratorService: AdministratorService,
    ) {}

    async onModuleInit() {
        await this.channelService.initChannels();
        await this.roleService.initRoles();
        await this.administratorService.initAdministrators();
    }
}
