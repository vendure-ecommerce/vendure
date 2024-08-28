import { ID } from '@vendure/common/lib/shared-types';
import { CREATE_CUSTOMER } from '@vendure/core/e2e/graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER } from '@vendure/core/e2e/graphql/shop-definitions';
import { SimpleGraphQLClient } from '@vendure/testing';

export async function addItemToOrder(
    shopClient: SimpleGraphQLClient,
    productVariantId: ID,
    quantity: number,
): Promise<ID> {
    const response = await shopClient.query(ADD_ITEM_TO_ORDER, {
        productVariantId,
        quantity,
    });
    return response.addItemToOrder.id;
}

export async function createCustomerAndLogin(
    adminClient: SimpleGraphQLClient,
    shopClient: SimpleGraphQLClient,
): Promise<ID> {
    const { createCustomerAccount } = await adminClient.query(CREATE_CUSTOMER, {
        input: {
            emailAddress: 'test@test.com',
            firstName: 'test',
            lastName: 'test',
            password: 'test',
        },
    });
    await shopClient.asUserWithCredentials('test@test.com', 'test');
    return createCustomerAccount.id;
}
