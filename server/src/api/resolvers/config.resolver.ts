import { Query, Resolver } from '@nestjs/graphql';

import { ConfigService } from '../../config/config.service';
import { getConfig, VendureConfig } from '../../config/vendure-config';

@Resolver('Config')
export class ConfigResolver {
    constructor(private configService: ConfigService) {}

    /**
     * Exposes a subset of the VendureConfig which may be of use to clients.
     */
    @Query()
    config(): Partial<VendureConfig> {
        return {
            customFields: this.configService.customFields,
        };
    }
}
