import { Module } from '@nestjs/common';

import { EventBus } from './event-bus';

@Module({
    providers: [EventBus],
    exports: [EventBus],
})
export class EventBusModule {}
