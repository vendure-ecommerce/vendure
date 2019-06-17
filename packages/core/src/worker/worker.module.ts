import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { PluginModule } from '../plugin/plugin.module';
import { ServiceModule } from '../service/service.module';

@Module({
    imports: [
        ConfigModule,
        ServiceModule.forWorker(),
        PluginModule.forWorker(),
    ],
})
export class WorkerModule {}
