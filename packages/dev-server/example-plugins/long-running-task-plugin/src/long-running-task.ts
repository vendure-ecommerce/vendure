import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { longRunningTaskTrigger } from './scheduled-tasks/long-running-task-trigger';


@VendurePlugin({
  imports: [PluginCommonModule],
  compatibility: '^3.0.0',
  configuration: (config) => {
    config.schedulerOptions.tasks.push(longRunningTaskTrigger);
    return config;
  },
})
export class LongRunningTaskPlugin {
  static init(): typeof LongRunningTaskPlugin {
    return LongRunningTaskPlugin;
  }
}
