import { Injectable } from '@nestjs/common';

import { AdministratorService } from './services/administrator.service';
import { ChannelService } from './services/channel.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { PaymentMethodService } from './services/payment-method.service';
import { RoleService } from './services/role.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { TaxRateService } from './services/tax-rate.service';

/**
 * Only used internally to run the various service init methods in the correct
 * sequence on bootstrap.
 */
@Injectable()
export class InitializerService {
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
