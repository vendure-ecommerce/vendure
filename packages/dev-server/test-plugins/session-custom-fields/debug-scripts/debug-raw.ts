/**
 * Debug getRawAndEntities to see raw data structure
 */

import { INestApplication } from '@nestjs/common';
import { bootstrap, Logger, RequestContext, SessionService, TransactionalConnection, Session } from '@vendure/core';
import { devConfig } from '../../dev-config';

async function debugRawAndEntities() {
    let app: INestApplication | undefined;

    try {
        Logger.info('Starting debug raw and entities...');
        app = await bootstrap(devConfig);
        
        const connection = app.get(TransactionalConnection);
        const ctx = RequestContext.empty();
        
        Logger.info('=== DEBUGGING getRawAndEntities ===\n');

        const qb = connection.getRepository(ctx, Session)
            .createQueryBuilder('session')
            .leftJoinAndSelect('session.customFields.example', 'customFields_example')
            .take(1);
            
        const result = await qb.getRawAndEntities();
        
        Logger.info('Raw result keys:', JSON.stringify(Object.keys(result.raw[0] || {})));
        Logger.info('Raw result:', JSON.stringify(result.raw[0], null, 2));
        Logger.info('Entity result:', JSON.stringify(result.entities[0], null, 2));

        Logger.info('\n=== Debug completed ===');
        
    } catch (error: any) {
        Logger.error('Debug failed:', error);
        Logger.error('Stack trace:', error.stack);
    } finally {
        if (app) {
            Logger.info('Closing application...');
            await app.close();
            process.exit(0);
        }
    }
}

// Run the debug script
debugRawAndEntities().catch(error => {
    Logger.error('Unhandled error:', error);
    process.exit(1);
});