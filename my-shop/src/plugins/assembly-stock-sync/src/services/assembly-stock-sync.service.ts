import { Injectable, OnModuleInit } from '@nestjs/common';
import { Job, JobQueue, JobQueueService, Logger } from '@vendure/core';

import { loggerCtx } from '../constants';

import { AssemblyStockSyncJob } from './jobs/assembly-stock-sync-job';

@Injectable()
export class AssemblyStockSyncService implements OnModuleInit {
  private jobQueueAssemblyStockSync!: JobQueue;

  constructor(
    private jobQueueService: JobQueueService,
    private assemblyStockSyncJob: AssemblyStockSyncJob,
  ) {}

  async onModuleInit() {
    this.jobQueueAssemblyStockSync = await this.jobQueueService.createQueue({
      name: 'assembly-stock-sync',
      process: async (job: Job) => {
        Logger.verbose(`[Assembly stock sync job started`, loggerCtx);

        const result =
          await this.assemblyStockSyncJob.syncAssemblyStockLevels(job);

        Logger.verbose(`[Assembly stock sync job completed`, loggerCtx);
        return result;
      },
    });
  }

  /**
   * Trigger assembly stock sync job
   */
  async syncAssemblyStock(): Promise<void> {
    const importId = `assembly-stock-${Date.now()}`;

    Logger.info(`[${importId}] Starting assembly stock sync`, loggerCtx);

    await this.jobQueueAssemblyStockSync.add({ importId });
  }
}
