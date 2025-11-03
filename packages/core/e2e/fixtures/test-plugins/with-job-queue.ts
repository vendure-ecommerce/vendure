import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, Logger, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Controller('run-job')
class TestController implements OnModuleInit {
    private queue: JobQueue<{ returnValue?: string }>;

    constructor(private jobQueueService: JobQueueService) {}

    async onModuleInit(): Promise<void> {
        this.queue = await this.jobQueueService.createQueue({
            name: 'test',
            process: async job => {
                if (job.data.returnValue) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    return job.data.returnValue;
                } else {
                    const interval = setInterval(() => {
                        Logger.info(`Job is running...`);
                        if (job.state === 'CANCELLED') {
                            clearInterval(interval);
                            PluginWithJobQueue.jobSubject.next();
                        }
                    }, 500);
                    return PluginWithJobQueue.jobSubject
                        .pipe(take(1))
                        .toPromise()
                        .then(() => {
                            PluginWithJobQueue.jobHasDoneWork = true;
                            clearInterval(interval);
                            return 'job result';
                        });
                }
            },
        });
    }

    @Get()
    async runJob() {
        await this.queue.add({});
        return true;
    }

    @Get('subscribe')
    async runJobAndSubscribe() {
        const job = await this.queue.add({ returnValue: '42!' });
        return job
            .updates()
            .toPromise()
            .then(update => update?.result);
    }

    @Get('subscribe-timeout')
    async runJobAndSubscribeTimeout() {
        const job = await this.queue.add({});
        const result = await job
            .updates({ timeoutMs: 100 })
            .toPromise()
            .then(update => update?.result);
        return result;
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [TestController],
})
export class PluginWithJobQueue {
    static jobHasDoneWork = false;
    static jobSubject = new Subject<void>();
}
