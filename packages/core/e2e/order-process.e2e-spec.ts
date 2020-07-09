import { CustomOrderProcess, mergeConfig, OrderState } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AddItemToOrder,
    GetNextOrderStates,
    SetCustomerForOrder,
    TransitionToState,
} from './graphql/generated-e2e-shop-types';
import {
    ADD_ITEM_TO_ORDER,
    GET_NEXT_STATES,
    SET_CUSTOMER,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';

type TestOrderState = OrderState | 'ValidatingCustomer';

const initSpy = jest.fn();
const transitionStartSpy = jest.fn();
const transitionEndSpy = jest.fn();
const transitionEndSpy2 = jest.fn();
const transitionErrorSpy = jest.fn();

describe('Order process', () => {
    const VALIDATION_ERROR_MESSAGE = 'Customer must have a company email address';
    const customOrderProcess: CustomOrderProcess<'ValidatingCustomer'> = {
        init(injector) {
            initSpy(injector.getConnection().name);
        },
        transitions: {
            AddingItems: {
                to: ['ValidatingCustomer'],
                mergeStrategy: 'replace',
            },
            ValidatingCustomer: {
                to: ['ArrangingPayment', 'AddingItems'],
            },
        },
        onTransitionStart(fromState, toState, data) {
            transitionStartSpy(fromState, toState, data);
            if (toState === 'ValidatingCustomer') {
                if (!data.order.customer) {
                    return false;
                }
                if (!data.order.customer.emailAddress.includes('@company.com')) {
                    return VALIDATION_ERROR_MESSAGE;
                }
            }
        },
        onTransitionEnd(fromState, toState, data) {
            transitionEndSpy(fromState, toState, data);
        },
        onError(fromState, toState, message) {
            transitionErrorSpy(fromState, toState, message);
        },
    };

    const customOrderProcess2: CustomOrderProcess<'ValidatingCustomer'> = {
        transitions: {
            ValidatingCustomer: {
                to: ['Cancelled'],
            },
        },
        onTransitionEnd(fromState, toState, data) {
            transitionEndSpy2(fromState, toState, data);
        },
    };

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            orderOptions: { process: [customOrderProcess, customOrderProcess2] },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('CustomOrderProcess is injectable', () => {
        expect(initSpy).toHaveBeenCalled();
        expect(initSpy.mock.calls[0][0]).toBe('default');
    });

    it('replaced transition target', async () => {
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });

        const { nextOrderStates } = await shopClient.query<GetNextOrderStates.Query>(GET_NEXT_STATES);

        expect(nextOrderStates).toEqual(['ValidatingCustomer']);
    });

    it('custom onTransitionStart handler returning false', async () => {
        transitionStartSpy.mockClear();
        transitionEndSpy.mockClear();

        const { transitionOrderToState } = await shopClient.query<
            TransitionToState.Mutation,
            TransitionToState.Variables
        >(TRANSITION_TO_STATE, {
            state: 'ValidatingCustomer',
        });

        expect(transitionStartSpy).toHaveBeenCalledTimes(1);
        expect(transitionEndSpy).not.toHaveBeenCalled();
        expect(transitionStartSpy.mock.calls[0].slice(0, 2)).toEqual(['AddingItems', 'ValidatingCustomer']);
        expect(transitionOrderToState?.state).toBe('AddingItems');
    });

    it('custom onTransitionStart handler returning error message', async () => {
        transitionStartSpy.mockClear();
        transitionErrorSpy.mockClear();

        await shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(SET_CUSTOMER, {
            input: {
                firstName: 'Joe',
                lastName: 'Test',
                emailAddress: 'joetest@gmail.com',
            },
        });

        try {
            const { transitionOrderToState } = await shopClient.query<
                TransitionToState.Mutation,
                TransitionToState.Variables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain(VALIDATION_ERROR_MESSAGE);
        }

        expect(transitionStartSpy).toHaveBeenCalledTimes(1);
        expect(transitionErrorSpy).toHaveBeenCalledTimes(1);
        expect(transitionEndSpy).not.toHaveBeenCalled();
        expect(transitionErrorSpy.mock.calls[0]).toEqual([
            'AddingItems',
            'ValidatingCustomer',
            VALIDATION_ERROR_MESSAGE,
        ]);
    });

    it('custom onTransitionStart handler allows transition', async () => {
        transitionEndSpy.mockClear();

        await shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(SET_CUSTOMER, {
            input: {
                firstName: 'Joe',
                lastName: 'Test',
                emailAddress: 'joetest@company.com',
            },
        });

        const { transitionOrderToState } = await shopClient.query<
            TransitionToState.Mutation,
            TransitionToState.Variables
        >(TRANSITION_TO_STATE, {
            state: 'ValidatingCustomer',
        });

        expect(transitionEndSpy).toHaveBeenCalledTimes(1);
        expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['AddingItems', 'ValidatingCustomer']);
        expect(transitionOrderToState?.state).toBe('ValidatingCustomer');
    });

    it('composes multiple CustomOrderProcesses', async () => {
        transitionEndSpy.mockClear();
        transitionEndSpy2.mockClear();

        const { nextOrderStates } = await shopClient.query<GetNextOrderStates.Query>(GET_NEXT_STATES);

        expect(nextOrderStates).toEqual(['ArrangingPayment', 'AddingItems', 'Cancelled']);

        await shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(TRANSITION_TO_STATE, {
            state: 'Cancelled',
        });

        expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['ValidatingCustomer', 'Cancelled']);
        expect(transitionEndSpy2.mock.calls[0].slice(0, 2)).toEqual(['ValidatingCustomer', 'Cancelled']);
    });
});
