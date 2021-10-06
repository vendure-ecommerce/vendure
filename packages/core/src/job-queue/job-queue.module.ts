import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { JobBuffer } from './job-buffer/job-buffer';
import { JobQueueService } from './job-queue.service';

@Module({
    imports: [ConfigModule],
    providers: [JobQueueService, JobBuffer],
    exports: [JobQueueService, JobBuffer],
})
export class JobQueueModule {}
