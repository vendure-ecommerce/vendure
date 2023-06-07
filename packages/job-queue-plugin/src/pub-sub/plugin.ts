import { PubSub } from '@google-cloud/pubsub';
import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { PUB_SUB_OPTIONS } from './constants';
import { PubSubOptions } from './options';
import { PubSubJobQueueStrategy } from './pub-sub-job-queue-strategy';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        { provide: PUB_SUB_OPTIONS, useFactory: () => PubSubPlugin.options },
        { provide: PubSub, useFactory: () => new PubSub() },
    ],
    configuration: config => {
        config.jobQueueOptions.jobQueueStrategy = new PubSubJobQueueStrategy();
        return config;
    },
    compatibility: '^2.0.0',
})
export class PubSubPlugin {
    private static options: PubSubOptions;

    static init(options: PubSubOptions): Type<PubSubPlugin> {
        this.options = options;
        return PubSubPlugin;
    }
}
