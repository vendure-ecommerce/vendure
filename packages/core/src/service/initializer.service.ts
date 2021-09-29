import { Injectable } from '@nestjs/common';

import { Logger } from '../config/logger/vendure-logger';
import { Administrator } from '../entity/administrator/administrator.entity';

import { AdministratorService } from './services/administrator.service';
import { ChannelService } from './services/channel.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { RoleService } from './services/role.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { ZoneService } from './services/zone.service';
import { TransactionalConnection } from './transaction/transactional-connection';

/**
 * Only used internally to run the various service init methods in the correct
 * sequence on bootstrap.
 */
@Injectable()
export class InitializerService {
    constructor(
        private connection: TransactionalConnection,
        private zoneService: ZoneService,
        private channelService: ChannelService,
        private roleService: RoleService,
        private administratorService: AdministratorService,
        private shippingMethodService: ShippingMethodService,
        private globalSettingsService: GlobalSettingsService,
    ) {}

    async onModuleInit() {
        await this.awaitDbSchemaGeneration();
        // IMPORTANT - why manually invoke these init methods rather than just relying on
        // Nest's "onModuleInit" lifecycle hook within each individual service class?
        // The reason is that the order of invocation matters. By explicitly invoking the
        // methods below, we can e.g. guarantee that the default channel exists
        // (channelService.initChannels()) before we try to create any roles (which assume that
        // there is a default Channel to work with.
        await this.zoneService.initZones();
        await this.globalSettingsService.initGlobalSettings();
        await this.channelService.initChannels();
        await this.roleService.initRoles();
        await this.administratorService.initAdministrators();
        await this.shippingMethodService.initShippingMethods();
    }

    /**
     * On the first run of the server & worker, when dbConnectionOptions.synchronize = true, there can be
     * a race condition where the worker starts up before the server process has had a chance to generate
     * the DB schema. This results in a fatal error as the worker is not able to run its initialization
     * tasks which interact with the DB.
     *
     * This method applies retry logic to give the server time to populate the schema before the worker
     * continues with its bootstrap process.
     */
    private async awaitDbSchemaGeneration() {
        const retries = 20;
        const delayMs = 100;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const result = await this.connection.getRepository(Administrator).find();
                return;
            } catch (e) {
                if (attempt < retries - 1) {
                    Logger.warn(`Awaiting DB schema creation... (attempt ${attempt})`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                } else {
                    Logger.error(`Timed out when awaiting the DB schema to be ready!`, undefined, e.stack);
                }
            }
        }
    }
}
