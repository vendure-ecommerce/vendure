import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

import { ConfigService } from '../config/config.service';
import { isInspectableJobQueueStrategy } from '../config/job-queue/inspectable-job-queue-strategy';
import { Logger } from '../config/logger/vendure-logger';
import { JobQueue } from '../job-queue/job-queue';
import { JobQueueService } from '../job-queue/job-queue.service';

export const WORKER_HEALTH_QUEUE_NAME = 'check-worker-health';

@Injectable()
export class WorkerHealthIndicator extends HealthIndicator implements OnModuleInit {
    private queue: JobQueue | undefined;
    constructor(private jobQueueService: JobQueueService, private configService: ConfigService) {
        super();
    }

    async onModuleInit() {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        if (isInspectableJobQueueStrategy(jobQueueStrategy)) {
            this.queue = await this.jobQueueService.createQueue({
                name: WORKER_HEALTH_QUEUE_NAME,
                process: async job => {
                    return { workerPid: process.pid };
                },
            });
        }
    }

    /**
     * This health check works by adding a job to the queue and checking whether it got picked up
     * by a worker.
     */
    async isHealthy(): Promise<HealthIndicatorResult> {
        if (this.queue) {
            const job = await this.queue.add({});
            let isHealthy: boolean;
            try {
                isHealthy = !!(await job.updates({ timeoutMs: 10000 }).toPromise());
            } catch (e) {
                Logger.error(e.message);
                isHealthy = false;
            }
            const result = this.getStatus('worker', isHealthy);

            if (isHealthy) {
                return result;
            }
            throw new HealthCheckError('Worker health check failed', result);
        } else {
            throw new HealthCheckError(
                'Current JobQueueStrategy does not support internal health checks',
                this.getStatus('worker', false),
            );
        }
    }
}
