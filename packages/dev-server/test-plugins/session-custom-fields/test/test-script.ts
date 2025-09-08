/**
 * Test script to demonstrate the Session custom fields relations fix
 *
 * Run this script with: npx ts-node test-script.ts
 */

import { INestApplication } from '@nestjs/common';
import { bootstrap, Logger, RequestContext, SessionService, TransactionalConnection, Product, Session } from '@vendure/core';
import { devConfig } from '../../../dev-config';
import { SessionCustomFieldsTestService } from '../services/example.service';
import { SessionCustomFieldsTestEntity } from '../entities/example.entity';

async function testSessionCustomFields() {
    let app: INestApplication | undefined;

    try {
        // 1. Bootstrap the application (migrations will run automatically if needed)
        Logger.info('Starting Vendure test application...');
        app = await bootstrap(devConfig);
        
        // 2. Get required services
        const exampleService = app.get(SessionCustomFieldsTestService);
        const connection = app.get(TransactionalConnection);
        const sessionService = app.get(SessionService);
        
        // 3. Create a request context
        const ctx = RequestContext.empty();
        
        Logger.info('=== Testing Session Custom Fields Relations ===\n');

        // 4. Create Example entities for testing
        Logger.info('Creating Example entities...');
        
        const exampleRepo = connection.getRepository(ctx, SessionCustomFieldsTestEntity);
        
        // Create or find Example entities
        let example1 = await exampleRepo.findOne({ where: { code: 'EXAMPLE_001' } });
        if (!example1) {
            example1 = await exampleRepo.save({
                code: 'EXAMPLE_001',
            });
            Logger.info(`Created Example entity with ID: ${example1.id}, code: ${example1.code}`);
        } else {
            Logger.info(`Found existing Example entity with ID: ${example1.id}, code: ${example1.code}`);
        }
        
        let example2 = await exampleRepo.findOne({ where: { code: 'EXAMPLE_002' } });
        if (!example2) {
            example2 = await exampleRepo.save({
                code: 'EXAMPLE_002',
            });
            Logger.info(`Created Example entity with ID: ${example2.id}, code: ${example2.code}`);
        } else {
            Logger.info(`Found existing Example entity with ID: ${example2.id}, code: ${example2.code}`);
        }

        // 5. Assign Example entities to Sessions
        Logger.info('\n=== Assigning Example entities to Sessions ===');
        const sessionRepo = connection.getRepository(ctx, Session);
        const sessions = await sessionRepo.find({ take: 2 });
        
        if (sessions.length === 0) {
            Logger.warn('No sessions found. Creating a test session...');
            const testSession = await sessionService.createAnonymousSession();
            sessions.push(await sessionRepo.findOne({ where: { id: testSession.id } }) as Session);
        }
        
        Logger.info(`Found ${sessions.length} sessions to update`);
        
        for (let i = 0; i < sessions.length && i < 2; i++) {
            const session = sessions[i];
            const example = i === 0 ? example1 : example2;
            
            // Update session with custom field
            await connection.getRepository(ctx, Session)
                .createQueryBuilder()
                .update(Session)
                .set({ 
                    customFields: {
                        example: example
                    } as any
                })
                .where("id = :id", { id: session.id })
                .execute();
                
            Logger.info(`Assigned Example ${example.code} to Session ${session.id}`);
        }
        
        // 6. Assign Example entities to Products
        Logger.info('\n=== Assigning Example entities to Products ===');
        const productRepo = connection.getRepository(ctx, Product);
        const products = await productRepo.find({ take: 2 });
        
        Logger.info(`Found ${products.length} products to update`);
        
        for (let i = 0; i < products.length && i < 2; i++) {
            const product = products[i];
            const example = i === 0 ? example1 : example2;
            
            // Update product with custom field
            await connection.getRepository(ctx, Product)
                .createQueryBuilder()
                .update(Product)
                .set({ 
                    customFields: {
                        example: example
                    } as any
                })
                .where("id = :id", { id: product.id })
                .execute();
                
            Logger.info(`Assigned Example ${example.code} to Product ${product.id}`);
        }

        // 7. Test WRONG way (will show the issue if not fixed)
        Logger.info('\n1. TESTING DIRECT REPOSITORY QUERY (problematic approach):');
        try {
            const sessionsWrong = await exampleService.exampleMethod(ctx);
            Logger.info(`Found ${sessionsWrong.length} sessions via direct query`);
            if (sessionsWrong.length > 0) {
                Logger.info('First session:', JSON.stringify(sessionsWrong[0], null, 2));
                Logger.info('CustomFields structure:', JSON.stringify(sessionsWrong[0]?.customFields || 'undefined'));
            }
        } catch (error: any) {
            Logger.error('Direct query failed with error:', error.message);
        }

        // 6. Test CORRECT way (using SessionService with fix)
        Logger.info('\n2. TESTING WITH SessionService.findSessionsWithRelations (correct approach):');
        try {
            const sessionsCorrect = await exampleService.exampleMethodFixed(ctx);
            Logger.info(`Found ${sessionsCorrect.length} sessions via SessionService`);
            if (sessionsCorrect.length > 0) {
                Logger.info('First session:', JSON.stringify(sessionsCorrect[0], null, 2));
                Logger.info('CustomFields structure:', JSON.stringify(sessionsCorrect[0]?.customFields || 'undefined'));
            }
        } catch (error: any) {
            Logger.error('SessionService query failed with error:', error.message);
        }

        // 7. Test Product for comparison (works normally)
        Logger.info('\n3. TESTING PRODUCT QUERY FOR COMPARISON:');
        try {
            const products = await exampleService.exampleMethod2(ctx);
            Logger.info(`Found ${products.length} products`);
            if (products.length > 0) {
                Logger.info('First product:', JSON.stringify(products[0], null, 2));
                Logger.info('Product CustomFields structure:', JSON.stringify(products[0]?.customFields || 'undefined'));
            } else {
                Logger.info('No products found in database');
            }
        } catch (error: any) {
            Logger.error('Product query failed with error:', error.message);
        }
        
        Logger.info('\n=== Test completed successfully ===');
        
    } catch (error: any) {
        Logger.error('Test failed with error:', error);
        Logger.error('Stack trace:', error.stack);
    } finally {
        // 8. Close the application
        if (app) {
            Logger.info('Closing application...');
            await app.close();
            process.exit(0);
        }
    }
}

// Run the test
testSessionCustomFields().catch(error => {
    Logger.error('Unhandled error:', error);
    process.exit(1);
});
