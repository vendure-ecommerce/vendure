import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { SessionCustomFieldsTestEntity } from './entities/example.entity';
import { SessionCustomFieldsTestService } from './services/example.service';
import './types';

export interface PluginInitOptions {
    // Add any configuration options here if needed
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [SessionCustomFieldsTestService],
    configuration: config => {
        // Add custom relation field to Session
        config.customFields.Session.push({
            name: 'example',
            type: 'relation',
            entity: SessionCustomFieldsTestEntity,
            internal: true,
            nullable: true,
        });

        // Add custom relation field to Product for comparison
        config.customFields.Product.push({
            name: 'example',
            type: 'relation',
            entity: SessionCustomFieldsTestEntity,
            internal: true,
            nullable: true,
        });

        return config;
    },
    compatibility: '^3.0.0',
    entities: [SessionCustomFieldsTestEntity],
})

export class SessionCustomFieldsTestPlugin {
    static init(options?: PluginInitOptions): typeof SessionCustomFieldsTestPlugin {
        return SessionCustomFieldsTestPlugin;
    }
}
