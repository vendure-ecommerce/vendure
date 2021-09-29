import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { TypeOrmLogger } from '../config/logger/typeorm-logger';

import { TransactionSubscriber } from './transaction-subscriber';
import { TransactionalConnection } from './transactional-connection';

let defaultTypeOrmModule: DynamicModule;

@Module({
    providers: [TransactionalConnection, TransactionSubscriber],
    exports: [TransactionalConnection, TransactionSubscriber],
})
export class ConnectionModule {
    static forRoot(): DynamicModule {
        if (!defaultTypeOrmModule) {
            defaultTypeOrmModule = TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    const { dbConnectionOptions } = configService;
                    const logger = ConnectionModule.getTypeOrmLogger(dbConnectionOptions);
                    return {
                        ...dbConnectionOptions,
                        logger,
                    };
                },
                inject: [ConfigService],
            });
        }
        return {
            module: ConnectionModule,
            imports: [defaultTypeOrmModule],
        };
    }

    static forPlugin(): DynamicModule {
        return {
            module: ConnectionModule,
            imports: [TypeOrmModule.forFeature()],
        };
    }

    static getTypeOrmLogger(dbConnectionOptions: ConnectionOptions) {
        if (!dbConnectionOptions.logger) {
            return new TypeOrmLogger(dbConnectionOptions.logging);
        } else {
            return dbConnectionOptions.logger;
        }
    }
}
