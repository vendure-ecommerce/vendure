import { Injector } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { AutoIncrementIdStrategy } from '../src/config/entity-id-strategy/auto-increment-id-strategy';
import { ProductService } from '../src/service/services/product.service';

const initSpy = jest.fn();
const destroySpy = jest.fn();

class TestIdStrategy extends AutoIncrementIdStrategy {
    async init(injector: Injector) {
        const productService = injector.get(ProductService);
        const connection = injector.getConnection();
        await new Promise(resolve => setTimeout(resolve, 100));
        initSpy(productService.constructor.name, connection.name);
    }

    async destroy() {
        await new Promise(resolve => setTimeout(resolve, 100));
        destroySpy();
    }
}

describe('lifecycle hooks for configurable objects', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        entityIdStrategy: new TestIdStrategy(),
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    it('runs init with Injector', () => {
        expect(initSpy).toHaveBeenCalled();
        expect(initSpy.mock.calls[0][0]).toEqual('ProductService');
        expect(initSpy.mock.calls[0][1]).toBe('default');
    });

    it('runs destroy', async () => {
        await server.destroy();
        expect(destroySpy).toHaveBeenCalled();
    });
});
