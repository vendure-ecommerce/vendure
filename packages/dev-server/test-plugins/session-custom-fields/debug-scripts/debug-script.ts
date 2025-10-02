/**
 * Debug script to investigate Session custom fields issue
 */

import { INestApplication } from '@nestjs/common';
import { bootstrap, Logger, RequestContext, SessionService, TransactionalConnection, Product, Session } from '@vendure/core';
import { devConfig } from '../../dev-config';
import { Example } from './entities/example.entity';

async function debugSessionCustomFields() {
    let app: INestApplication | undefined;

    try {
        Logger.info('Starting debug application...');
        app = await bootstrap(devConfig);
        
        const connection = app.get(TransactionalConnection);
        const sessionService = app.get(SessionService);
        const ctx = RequestContext.empty();
        
        Logger.info('=== DEBUGGING SESSION CUSTOM FIELDS ===\n');

        // 1. Check database columns
        Logger.info('1. Checking database columns:');
        const columnsQuery = await connection.rawConnection
            .query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'session' AND column_name LIKE 'customFields%'`);
        Logger.info('Session table custom columns:', JSON.stringify(columnsQuery, null, 2));
        
        // Check actual data
        const rawQuery = await connection.rawConnection
            .query(`SELECT * FROM session WHERE id IN (1, 2)`);
        Logger.info('Raw SQL result (first row keys):', JSON.stringify(Object.keys(rawQuery[0] || {})));

        // 2. Check metadata
        Logger.info('\n2. Checking TypeORM metadata:');
        const metadata = connection.rawConnection.getMetadata(Session);
        const embeddeds = metadata.embeddeds;
        
        Logger.info('Embedded entities:', JSON.stringify(embeddeds.map(e => e.propertyName)));
        
        const customFieldsEmbedded = embeddeds.find(e => e.propertyName === 'customFields');
        if (customFieldsEmbedded) {
            Logger.info('CustomFields relations:', JSON.stringify(customFieldsEmbedded.relations.map(r => ({
                propertyName: r.propertyName,
                relationType: r.relationType,
                type: r.type,
            }))));
            
            Logger.info('CustomFields columns:', JSON.stringify(customFieldsEmbedded.columns.map(c => ({
                propertyName: c.propertyName,
                databaseName: c.databaseName,
            }))));
        }

        // 3. Test different query approaches
        Logger.info('\n3. Testing different query approaches:');

        // Approach A: Direct repository with relations
        Logger.info('\nApproach A - Repository.find with relations:');
        try {
            const sessionsA = await connection.getRepository(ctx, Session).find({
                relations: {
                    customFields: {
                        example: true,
                    },
                } as any,
                take: 1,
            });
            Logger.info('Result:', JSON.stringify(sessionsA[0]?.customFields, null, 2));
        } catch (error: any) {
            Logger.error('Failed:', error.message);
        }

        // Approach B: QueryBuilder with leftJoinAndSelect
        Logger.info('\nApproach B - QueryBuilder with leftJoinAndSelect:');
        try {
            const qb = connection.getRepository(ctx, Session)
                .createQueryBuilder('session')
                .leftJoinAndSelect('session.customFields.example', 'example')
                .take(1);
                
            Logger.info('Generated SQL:', qb.getSql());
            const sessionsB = await qb.getMany();
            Logger.info('Result:', JSON.stringify(sessionsB[0]?.customFields, null, 2));
        } catch (error: any) {
            Logger.error('Failed:', error.message);
        }

        // Approach C: QueryBuilder with addSelect
        Logger.info('\nApproach C - QueryBuilder with addSelect:');
        try {
            const qb = connection.getRepository(ctx, Session)
                .createQueryBuilder('session')
                .addSelect('session.customFields')
                .leftJoinAndSelect('session.customFields.example', 'example')
                .take(1);
                
            const sessionsC = await qb.getMany();
            Logger.info('Result:', JSON.stringify(sessionsC[0]?.customFields, null, 2));
        } catch (error: any) {
            Logger.error('Failed:', error.message);
        }

        // 4. Compare with Product (which works)
        Logger.info('\n4. Comparing with Product query:');
        const productQb = connection.getRepository(ctx, Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.customFields.example', 'example')
            .take(1);
            
        Logger.info('Product SQL:', productQb.getSql());
        const products = await productQb.getMany();
        Logger.info('Product result:', JSON.stringify(products[0]?.customFields, null, 2));

        // 5. Check if relations are properly set in database
        Logger.info('\n5. Checking if example_id is set in database:');
        const checkQuery = await connection.rawConnection
            .query(`SELECT id, "customFields_example_id" FROM session WHERE id IN (1, 2)`);
        Logger.info('Example IDs in database:', JSON.stringify(checkQuery, null, 2));

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
debugSessionCustomFields().catch(error => {
    Logger.error('Unhandled error:', error);
    process.exit(1);
});