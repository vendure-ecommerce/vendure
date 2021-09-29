import { Module } from '@nestjs/common';

import { RequestContextCacheService } from './request-context-cache.service';

@Module({
    providers: [RequestContextCacheService],
    exports: [RequestContextCacheService],
})
export class CacheModule {}
