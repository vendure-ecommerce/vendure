import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ServiceModule } from '../service/service.module';

import { ImportParser } from './providers/import-parser/import-parser';
import { Importer } from './providers/importer/importer';
import { Populator } from './providers/populator/populator';

@Module({
    imports: [ServiceModule, ConfigModule],
    exports: [ImportParser, Importer, Populator],
    providers: [ImportParser, Importer, Populator],
})
export class DataImportModule {}
