import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Controller('run-job')
class TestController implements OnModuleInit {
    private queue: JobQueue;

    constructor(private jobQueueService: JobQueueService) {}

    async onModuleInit(): Promise<void> {
        this.queue = await this.jobQueueService.createQueue({
            name: 'test',
            process: job => {
                return PluginWithJobQueue.jobSubject
                    .pipe(take(1))
                    .toPromise()
                    .then(() => {
                        PluginWithJobQueue.jobHasDoneWork = true;
                    });
            },
        });
    }

    @Get()
    async runJob() {
        await this.queue.add({});
        return true;
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [TestController],
})
export class PluginWithJobQueue {
    static jobHasDoneWork = false;
    static jobSubject = new Subject();
}
