import { Module, OnModuleInit } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';

import { TransactionalEmailService } from './transactional-email.service';

@Module({
    imports: [ConfigModule, EventBusModule],
    providers: [TransactionalEmailService],
})
export class EmailModule implements OnModuleInit {
    constructor(private transactionalEmailService: TransactionalEmailService) {}

    async onModuleInit() {
        await this.transactionalEmailService.init();
    }
}
