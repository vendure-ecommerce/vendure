import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';

import { Logger } from './vendure-logger';

const context = 'TypeORM';

/**
 * A custom logger for TypeORM which delegates to the Vendure Logger service.
 */
export class TypeOrmLogger implements TypeOrmLoggerInterface {
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        switch (level) {
            case 'info':
                Logger.info(message, context);
                break;
            case 'log':
                Logger.verbose(message, context);
                break;
            case 'warn':
                Logger.warn(message, context);
                break;
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        Logger.info(message, context);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Logger.debug(`Query: "${query}" -- [${parameters}]`, context);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Logger.error(`Query error: ${error}, "${query}" -- [${parameters}]`, context);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Logger.warn(`Slow query (${time}): "${query}" -- [${parameters}]`, context);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        Logger.info(message, context);
    }
}
