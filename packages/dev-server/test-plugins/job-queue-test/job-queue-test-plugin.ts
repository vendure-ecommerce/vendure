import { Injectable, OnModuleInit } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JobQueue, JobQueueService, Logger, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'apollo-server-core';

@Injectable()
export class JobQueueTestService implements OnModuleInit {
    private myQueue: JobQueue<{ intervalMs: number; shouldFail: boolean }>;

    constructor(private jobQueueService: JobQueueService) {}

    async onModuleInit() {
        this.myQueue = await this.jobQueueService.createQueue({
            name: 'my-queue',
            process: async job => {
                Logger.info(`Starting job ${job.id}, shouldFail: ${JSON.stringify(job.data.shouldFail)}`);
                let progress = 0;
                while (progress < 100) {
                    // Logger.info(`Job ${job.id} progress: ${progress}`);
                    await new Promise(resolve => setTimeout(resolve, job.data.intervalMs));
                    progress += 10;
                    job.setProgress(progress);
                    if (progress > 70 && job.data.shouldFail) {
                        Logger.warn(`Job ${job.id} will fail`);
                        throw new Error(`Job failed!!`);
                    }
                }
                Logger.info(`Completed job ${job.id}`);
            },
        });
    }

    async startTask(intervalMs: number, shouldFail: boolean) {
        await this.myQueue.add({ intervalMs, shouldFail }, { retries: 3 });
        return true;
    }
}

@Resolver()
export class JobQueueTestResolver {
    constructor(private service: JobQueueTestService) {}

    @Mutation()
    startTask(@Args() args: any) {
        return this.service.startTask(args.intervalMs, args.shouldFail);
    }
}

/**
 * A plugin which can be used to test job queue strategies. Exposes a mutation `startTask` in
 * the Admin API which triggers a job.
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        resolvers: [JobQueueTestResolver],
        schema: gql`
            extend type Mutation {
                startTask(intervalMs: Int, shouldFail: Boolean!): Boolean!
            }
        `,
    },
    providers: [JobQueueTestService],
})
export class JobQueueTestPlugin {}
