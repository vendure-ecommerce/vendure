import { Injectable } from '@nestjs/common';

import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { Job } from '../job';

import { JobBufferProcessor } from './job-buffer-processor';
import { JobBufferStorageStrategy } from './job-buffer-storage-strategy';

@Injectable()
export class JobBuffer {
    private processors = new Set<JobBufferProcessor>();
    private storageStrategy: JobBufferStorageStrategy;

    constructor(private configService: ConfigService) {
        this.storageStrategy = configService.jobQueueOptions.jobBufferStorageStrategy;
    }

    addProcessor(processor: JobBufferProcessor<any>) {
        const idAlreadyExists = Array.from(this.processors).find(p => p.id === processor.id);
        if (idAlreadyExists) {
            throw new InternalServerError(
                `There is already a JobBufferProcessor with the id "${processor.id}". Ids must be unique`,
            );
        }
        this.processors.add(processor);
    }

    removeProcessor(processor: JobBufferProcessor<any>) {
        this.processors.delete(processor);
    }

    async add(job: Job): Promise<boolean> {
        let collected = false;
        for (const processor of this.processors) {
            const shouldCollect = await processor.collect(job);
            if (shouldCollect) {
                collected = true;
                await this.storageStrategy.add(processor.id, job);
            }
        }
        return collected;
    }

    bufferSize(
        forProcessors?: Array<JobBufferProcessor | string>,
    ): Promise<{ [processorId: string]: number }> {
        const processors = forProcessors ?? Array.from(this.processors);
        return this.storageStrategy.bufferSize(processors.map(p => (typeof p === 'string' ? p : p.id)));
    }

    async flush(forProcessors?: Array<JobBufferProcessor | string>): Promise<void> {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const processors = forProcessors ?? Array.from(this.processors);
        const flushResult = await this.storageStrategy.flush(
            processors.map(p => (typeof p === 'string' ? p : p.id)),
        );
        for (const processor of this.processors) {
            const jobsForProcessor = flushResult[processor.id];
            if (jobsForProcessor?.length) {
                let jobsToAdd = jobsForProcessor;
                try {
                    jobsToAdd = await processor.reduce(jobsForProcessor);
                } catch (e) {
                    Logger.error(
                        `Error encountered processing jobs in "${processor.id}:\n${e.message}"`,
                        undefined,
                        e.stack,
                    );
                }
                for (const job of jobsToAdd) {
                    await jobQueueStrategy.add(job);
                }
            }
        }
    }
}
