import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Subject } from 'rxjs';

@Controller('run-job')
class TestController implements OnModuleInit {
    private queue: JobQueue;

    constructor(private jobQueueService: JobQueueService) {}

    onModuleInit(): any {
        this.queue = this.jobQueueService.createQueue({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                PluginWithJobQueue.jobSubject.subscribe({
                    complete: () => {
                        PluginWithJobQueue.jobHasDoneWork = true;
                        job.complete();
                    },
                    error: (err) => job.fail(err),
                });
            },
        });
    }

    @Get()
    runJob() {
        this.queue.add({});
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
