import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { getConfig } from '../config/vendure-config';

import { AdministratorService } from './administrator.service';
import { AuthService } from './auth.service';
import { ChannelService } from './channel.service';
import { CustomerService } from './customer.service';
import { FacetValueService } from './facet-value.service';
import { FacetService } from './facet.service';
import { TranslationUpdaterService } from './helpers/translation-updater.service';
import { PasswordService } from './password.service';
import { ProductOptionGroupService } from './product-option-group.service';
import { ProductOptionService } from './product-option.service';
import { ProductVariantService } from './product-variant.service';
import { ProductService } from './product.service';

const exportedProviders = [
    AdministratorService,
    AuthService,
    ChannelService,
    CustomerService,
    FacetService,
    FacetValueService,
    ProductOptionService,
    ProductOptionGroupService,
    ProductService,
    ProductVariantService,
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
    constructor(private channelService: ChannelService) {}

    async onModuleInit() {
        await this.channelService.initChannels();
    }
}
