import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { JobQueueService } from './job-queue.service';

@Module({
    imports: [ConfigModule],
    providers: [JobQueueService],
    exports: [JobQueueService],
})
export class JobQueueModule {}
