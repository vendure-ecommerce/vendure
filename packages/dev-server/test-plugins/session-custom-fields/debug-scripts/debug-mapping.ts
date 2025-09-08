/**
 * Debug mapping script to see what's actually in the QueryBuilder result
 */

import { INestApplication } from '@nestjs/common';
import { bootstrap, Logger, RequestContext, SessionService, TransactionalConnection, Session } from '@vendure/core';
import { devConfig } from '../../dev-config';

async function debugMapping() {
    let app: INestApplication | undefined;

    try {
        Logger.info('Starting debug mapping application...');
        app = await bootstrap(devConfig);
        
        const connection = app.get(TransactionalConnection);
        const sessionService = app.get(SessionService);
        const ctx = RequestContext.empty();
        
        Logger.info('=== DEBUGGING MAPPING ===\n');

        // Direct QueryBuilder test
        Logger.info('1. Testing raw QueryBuilder result:');
        const qb = connection.getRepository(ctx, Session)
            .createQueryBuilder('session')
            .leftJoinAndSelect('session.customFields.example', 'customFields_example')
            .take(1);
            
        Logger.info('SQL:', qb.getSql());
        
        const rawResult = await qb.getMany();
        Logger.info('Raw result keys:', JSON.stringify(Object.keys(rawResult[0] || {})));
        Logger.info('Raw result:', JSON.stringify(rawResult[0], null, 2));
        
        // Check if the alias is loaded
        Logger.info('\n2. Checking alias properties:');
        if (rawResult[0]) {
            const session = rawResult[0] as any;
            Logger.info('customFields_example:', JSON.stringify(session.customFields_example || 'NOT FOUND'));
            Logger.info('example:', JSON.stringify(session.example || 'NOT FOUND'));
        }

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
debugMapping().catch(error => {
    Logger.error('Unhandled error:', error);
    process.exit(1);
});