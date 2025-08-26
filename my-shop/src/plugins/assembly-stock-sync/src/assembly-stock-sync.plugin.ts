import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { assemblyStockTrigger } from './scheduled-tasks/assembly-stock-trigger';
import { AssemblyStockSyncService } from './services/assembly-stock-sync.service';
import { AssemblyStockSyncJob } from './services/jobs/assembly-stock-sync-job';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [AssemblyStockSyncService, AssemblyStockSyncJob],
  compatibility: '^3.0.0',
  configuration: (config) => {
    config.schedulerOptions.tasks.push(assemblyStockTrigger);
    return config;
  },
})
export class AssemblyStockSyncPlugin {
  static init(): typeof AssemblyStockSyncPlugin {
    return AssemblyStockSyncPlugin;
  }
}
