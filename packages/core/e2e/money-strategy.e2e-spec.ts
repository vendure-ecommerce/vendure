import { DefaultMoneyStrategy, Logger, mergeConfig, MoneyStrategy, VendurePlugin } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { ColumnOptions } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { SortOrder } from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { AddItemToOrderMutation, AddItemToOrderMutationVariables } from './graphql/generated-e2e-shop-types';
import { GET_PRODUCT_VARIANT_LIST } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

const orderGuard: ErrorResultGuard<CodegenShop.UpdatedOrderFragment> = createErrorResultGuard(
    input => !!input.total,
);

class CustomMoneyStrategy implements MoneyStrategy {
    static transformerFromSpy = vi.fn();
    readonly moneyColumnOptions: ColumnOptions = {
        type: 'bigint',
        transformer: {
            to: (entityValue: number) => {
                return entityValue;
            },
            from: (databaseValue: string): number => {
                CustomMoneyStrategy.transformerFromSpy(databaseValue);
                if (databaseValue == null) {
                    return databaseValue;
                }
                const intVal = Number.parseInt(databaseValue, 10);
                if (!Number.isSafeInteger(intVal)) {
                    Logger.warn(`Monetary value ${databaseValue} is not a safe integer!`);
                }
                if (Number.isNaN(intVal)) {
                    Logger.warn(`Monetary value ${databaseValue} is not a number!`);
                }
                return intVal;
            },
        },
    };

    round(value: number, quantity = 1): number {
        return Math.round(value * quantity);
    }
}

@VendurePlugin({
    configuration: config => {
        config.entityOptions.moneyStrategy = new CustomMoneyStrategy();
        return config;
    },
})
class MyPlugin {}

describe('Custom MoneyStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [MyPlugin],
        }),
    );

    let cheapVariantId: string;
    let expensiveVariantId: string;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-money-handling.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('check initial prices', async () => {
        expect(CustomMoneyStrategy.transformerFromSpy).toHaveBeenCalledTimes(0);

        const { productVariants } = await adminClient.query<
            Codegen.GetProductVariantListQuery,
            Codegen.GetProductVariantListQueryVariables
        >(GET_PRODUCT_VARIANT_LIST, {
            options: {
                sort: {
                    price: SortOrder.ASC,
                },
            },
        });
        expect(productVariants.items[0].price).toBe(31);
        expect(productVariants.items[0].priceWithTax).toBe(37);
        expect(productVariants.items[1].price).toBe(9_999_999_00);
        expect(productVariants.items[1].priceWithTax).toBe(11_999_998_80);

        cheapVariantId = productVariants.items[0].id;
        expensiveVariantId = productVariants.items[1].id;

        expect(CustomMoneyStrategy.transformerFromSpy).toHaveBeenCalledTimes(2);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/838
    it('can handle totals over 21 million', async () => {
        await shopClient.asAnonymousUser();
        const { addItemToOrder } = await shopClient.query<
            AddItemToOrderMutation,
            AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: expensiveVariantId,
            quantity: 2,
        });
        orderGuard.assertSuccess(addItemToOrder);

        expect(addItemToOrder.lines[0].linePrice).toBe(1_999_999_800);
        expect(addItemToOrder.lines[0].linePriceWithTax).toBe(2_399_999_760);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1835
    // 31 * 1.2 = 37.2
    // Math.round(37.2 * 10) =372
    it('tax calculation rounds at the unit level', async () => {
        await shopClient.asAnonymousUser();
        const { addItemToOrder } = await shopClient.query<
            AddItemToOrderMutation,
            AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: cheapVariantId,
            quantity: 10,
        });
        orderGuard.assertSuccess(addItemToOrder);

        expect(addItemToOrder.lines[0].linePrice).toBe(310);
        expect(addItemToOrder.lines[0].linePriceWithTax).toBe(372);
    });
});
