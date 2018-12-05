import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ServiceModule } from '../service/service.module';

import { ImportParser } from './providers/import-parser/import-parser';
import { Importer } from './providers/importer/importer';

@Module({
    imports: [ServiceModule, ConfigModule],
    exports: [ImportParser, Importer],
    providers: [ImportParser, Importer],
})
export class DataImportModule {}
