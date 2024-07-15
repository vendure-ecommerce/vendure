import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, PluginCommonModule, VendurePlugin } from '@vendure/core';
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
                    return PluginWithJobQueue.jobSubject
                        .pipe(take(1))
                        .toPromise()
                        .then(() => {
                            PluginWithJobQueue.jobHasDoneWork = true;
                            return job.data.returnValue;
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
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [TestController],
})
export class PluginWithJobQueue {
    static jobHasDoneWork = false;
    static jobSubject = new Subject<void>();
}
