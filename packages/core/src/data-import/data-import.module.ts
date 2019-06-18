import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { PluginModule } from '../plugin/plugin.module';
import { ServiceModule } from '../service/service.module';

import { ImportParser } from './providers/import-parser/import-parser';
import { Importer } from './providers/importer/importer';
import { Populator } from './providers/populator/populator';

@Module({
    // Important! PluginModule must be defined before ServiceModule
    // in order that overrides of Services (e.g. SearchService) are correctly
    // registered with the injector.
    imports: [PluginModule.forRoot(), ServiceModule.forRoot(), ConfigModule],
    exports: [ImportParser, Importer, Populator],
    providers: [ImportParser, Importer, Populator],
})
export class DataImportModule {}
