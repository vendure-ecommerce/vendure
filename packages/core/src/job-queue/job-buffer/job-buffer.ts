import { Injectable } from '@nestjs/common';

import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
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

    addProcessor(processor: JobBufferProcessor) {
        const idAlreadyExists = Array.from(this.processors).find(p => p.id === processor.id);
        if (idAlreadyExists) {
            throw new InternalServerError(
                `There is already a JobBufferProcessor with the id "${processor.id}". Ids must be unique`,
            );
        }
        this.processors.add(processor);
    }

    removeProcessor(processor: JobBufferProcessor) {
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
                const reducedJobs = await processor.reduce(jobsForProcessor);
                for (const job of reducedJobs) {
                    await jobQueueStrategy.add(job);
                }
            }
        }
    }
}
