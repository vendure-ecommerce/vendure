import {
    AutoIncrementIdStrategy,
    defaultShippingEligibilityChecker,
    Injector,
    ProductService,
    ShippingEligibilityChecker,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { TransactionalConnection } from '../src/service/transaction/transactional-connection';

const strategyInitSpy = jest.fn();
const strategyDestroySpy = jest.fn();
const codInitSpy = jest.fn();
const codDestroySpy = jest.fn();

class TestIdStrategy extends AutoIncrementIdStrategy {
    async init(injector: Injector) {
        const productService = injector.get(ProductService);
        const connection = injector.get(TransactionalConnection);
        await new Promise(resolve => setTimeout(resolve, 100));
        strategyInitSpy(productService.constructor.name, connection.rawConnection.name);
    }

    async destroy() {
        await new Promise(resolve => setTimeout(resolve, 100));
        strategyDestroySpy();
    }
}

const testShippingEligChecker = new ShippingEligibilityChecker({
    code: 'test',
    args: {},
    description: [],
    init: async injector => {
        const productService = injector.get(ProductService);
        const connection = injector.get(TransactionalConnection);
        await new Promise(resolve => setTimeout(resolve, 100));
        codInitSpy(productService.constructor.name, connection.rawConnection.name);
    },
    destroy: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        codDestroySpy();
    },
    check: order => {
        return true;
    },
});

describe('lifecycle hooks for configurable objects', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        entityIdStrategy: new TestIdStrategy(),
        shippingOptions: {
            shippingEligibilityCheckers: [defaultShippingEligibilityChecker, testShippingEligChecker],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    describe('strategy', () => {
        it('runs init with Injector', () => {
            expect(strategyInitSpy).toHaveBeenCalled();
            expect(strategyInitSpy.mock.calls[0][0]).toEqual('ProductService');
            expect(strategyInitSpy.mock.calls[0][1]).toBe('default');
        });

        it('runs destroy', async () => {
            await server.destroy();
            expect(strategyDestroySpy).toHaveBeenCalled();
        });
    });

    describe('configurable operation', () => {
        beforeAll(async () => {
            await server.bootstrap();
        }, TEST_SETUP_TIMEOUT_MS);

        afterAll(async () => {
            await server.destroy();
        });

        it('runs init with Injector', () => {
            expect(codInitSpy).toHaveBeenCalled();
            expect(codInitSpy.mock.calls[0][0]).toEqual('ProductService');
            expect(codInitSpy.mock.calls[0][1]).toBe('default');
        });

        it('runs destroy', async () => {
            await server.destroy();
            expect(codDestroySpy).toHaveBeenCalled();
        });
    });
});
