import { PluginCommonModule } from '../../plugin/plugin-common.module';
import { VendurePlugin } from '../../plugin/vendure-plugin';

import { DEFAULT_SCHEDULER_PLUGIN_OPTIONS, DEFAULT_TIMEOUT } from './constants';
import { DefaultSchedulerStrategy } from './default-scheduler-strategy';
import { ScheduledTaskRecord } from './scheduled-task-record.entity';
import { DefaultSchedulerPluginOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ScheduledTaskRecord],
    configuration: config => {
        config.schedulerOptions.schedulerStrategy = new DefaultSchedulerStrategy();
        return config;
    },
    providers: [
        {
            provide: DEFAULT_SCHEDULER_PLUGIN_OPTIONS,
            useValue: DefaultSchedulerPlugin.options,
        },
    ],
})
export class DefaultSchedulerPlugin {
    static options: DefaultSchedulerPluginOptions = {
        defaultTimeout: DEFAULT_TIMEOUT,
    };

    static init(config: DefaultSchedulerPluginOptions) {
        this.options = { ...this.options, ...config };
        return this;
    }
}
