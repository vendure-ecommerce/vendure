import {
    AdjustmentSource,
    AdjustmentType,
    CreateAdjustmentSource,
    GetAdjustmentOperations,
    GetAdjustmentSource,
    GetAdjustmentSourceList,
    UpdateAdjustmentSource,
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import {
    CREATE_ADJUSTMENT_SOURCE,
    GET_ADJUSTMENT_OPERATIONS,
    GET_ADJUSTMENT_SOURCE,
    GET_ADJUSTMENT_SOURCE_LIST,
    UPDATE_ADJUSTMENT_SOURCE,
} from '../../admin-ui/src/app/data/definitions/adjustment-source-definitions';
import {
    AdjustmentActionDefinition,
    AdjustmentConditionDefinition,
} from '../src/config/adjustment/adjustment-types';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('AdjustmentSource resolver', () => {
    const client = new TestClient();
    const server = new TestServer();

    const promoCondition = generateTestCondition('promo_condition', AdjustmentType.PROMOTION);
    const promoCondition2 = generateTestCondition('promo_condition2', AdjustmentType.PROMOTION);
    const taxCondition = generateTestCondition('tax_condition', AdjustmentType.TAX);
    const shippingCondition = generateTestCondition('shipping_condition', AdjustmentType.SHIPPING);

    const promoAction = generateTestAction('promo_action', AdjustmentType.PROMOTION);
    const taxAction = generateTestAction('tax_action', AdjustmentType.TAX);
    const shippingAction = generateTestAction('shipping_action', AdjustmentType.SHIPPING);

    const snapshotProps = ['name', 'type', 'actions', 'conditions', 'enabled'] as Array<
        'name' | 'type' | 'actions' | 'conditions' | 'enabled'
    >;
    let promoAdjustmentSource: AdjustmentSource.Fragment;

    beforeAll(async () => {
        const token = await server.init(
            {
                productCount: 1,
                customerCount: 1,
            },
            {
                adjustmentConditions: [promoCondition, promoCondition2, taxCondition, shippingCondition],
                adjustmentActions: [promoAction, taxAction, shippingAction],
            },
        );
        await client.init();
    }, 60000);

    afterAll(async () => {
        await server.destroy();
    });

    it('createAdjustmentSource promotion', async () => {
        const result = await client.query<CreateAdjustmentSource.Mutation, CreateAdjustmentSource.Variables>(
            CREATE_ADJUSTMENT_SOURCE,
            {
                input: {
                    name: 'promo adjustment source',
                    type: AdjustmentType.PROMOTION,
                    enabled: true,
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: ['500'],
                        },
                    ],
                    actions: [
                        {
                            code: promoAction.code,
                            arguments: ['50'],
                        },
                    ],
                },
            },
        );
        promoAdjustmentSource = result.createAdjustmentSource;
        expect(pick(promoAdjustmentSource, snapshotProps)).toMatchSnapshot();
    });

    it('createAdjustmentSource tax', async () => {
        const result = await client.query<CreateAdjustmentSource.Mutation, CreateAdjustmentSource.Variables>(
            CREATE_ADJUSTMENT_SOURCE,
            {
                input: {
                    name: 'tax adjustment source',
                    type: AdjustmentType.TAX,
                    enabled: true,
                    conditions: [
                        {
                            code: taxCondition.code,
                            arguments: ['500'],
                        },
                    ],
                    actions: [
                        {
                            code: taxAction.code,
                            arguments: ['50'],
                        },
                    ],
                },
            },
        );
        expect(pick(result.createAdjustmentSource, snapshotProps)).toMatchSnapshot();
    });

    it('createAdjustmentSource shipping', async () => {
        const result = await client.query<CreateAdjustmentSource.Mutation, CreateAdjustmentSource.Variables>(
            CREATE_ADJUSTMENT_SOURCE,
            {
                input: {
                    name: 'shipping adjustment source',
                    type: AdjustmentType.SHIPPING,
                    enabled: true,
                    conditions: [
                        {
                            code: shippingCondition.code,
                            arguments: ['500'],
                        },
                    ],
                    actions: [
                        {
                            code: shippingAction.code,
                            arguments: ['50'],
                        },
                    ],
                },
            },
        );
        expect(pick(result.createAdjustmentSource, snapshotProps)).toMatchSnapshot();
    });

    it('updateAdjustmentSource', async () => {
        const result = await client.query<UpdateAdjustmentSource.Mutation, UpdateAdjustmentSource.Variables>(
            UPDATE_ADJUSTMENT_SOURCE,
            {
                input: {
                    id: promoAdjustmentSource.id,
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: ['90'],
                        },
                        {
                            code: promoCondition2.code,
                            arguments: ['10'],
                        },
                    ],
                },
            },
        );
        expect(pick(result.updateAdjustmentSource, snapshotProps)).toMatchSnapshot();
    });

    it('adjustmentSource', async () => {
        const result = await client.query<GetAdjustmentSource.Query, GetAdjustmentSource.Variables>(
            GET_ADJUSTMENT_SOURCE,
            {
                id: promoAdjustmentSource.id,
            },
        );

        expect(result.adjustmentSource!.name).toBe(promoAdjustmentSource.name);
    });

    it('adjustmentSources, type = promotion', async () => {
        const result = await client.query<GetAdjustmentSourceList.Query, GetAdjustmentSourceList.Variables>(
            GET_ADJUSTMENT_SOURCE_LIST,
            {
                type: AdjustmentType.PROMOTION,
            },
        );

        expect(result.adjustmentSources.totalItems).toBe(1);
        expect(result.adjustmentSources.items[0].name).toBe('promo adjustment source');
    });

    it('adjustmentSources, type = tax', async () => {
        const result = await client.query<GetAdjustmentSourceList.Query, GetAdjustmentSourceList.Variables>(
            GET_ADJUSTMENT_SOURCE_LIST,
            {
                type: AdjustmentType.TAX,
            },
        );

        expect(result.adjustmentSources.totalItems).toBe(1);
        expect(result.adjustmentSources.items[0].name).toBe('tax adjustment source');
    });

    it('adjustmentSources, type = shipping', async () => {
        const result = await client.query<GetAdjustmentSourceList.Query, GetAdjustmentSourceList.Variables>(
            GET_ADJUSTMENT_SOURCE_LIST,
            {
                type: AdjustmentType.SHIPPING,
            },
        );

        expect(result.adjustmentSources.totalItems).toBe(1);
        expect(result.adjustmentSources.items[0].name).toBe('shipping adjustment source');
    });

    it('adjustmentOperations, type = promotion', async () => {
        const result = await client.query<GetAdjustmentOperations.Query, GetAdjustmentOperations.Variables>(
            GET_ADJUSTMENT_OPERATIONS,
            {
                type: AdjustmentType.PROMOTION,
            },
        );

        expect(result.adjustmentOperations).toMatchSnapshot();
    });

    it('adjustmentOperations, type = tax', async () => {
        const result = await client.query<GetAdjustmentOperations.Query, GetAdjustmentOperations.Variables>(
            GET_ADJUSTMENT_OPERATIONS,
            {
                type: AdjustmentType.TAX,
            },
        );

        expect(result.adjustmentOperations).toMatchSnapshot();
    });

    it('adjustmentOperations, type = shipping', async () => {
        const result = await client.query<GetAdjustmentOperations.Query, GetAdjustmentOperations.Variables>(
            GET_ADJUSTMENT_OPERATIONS,
            {
                type: AdjustmentType.SHIPPING,
            },
        );

        expect(result.adjustmentOperations).toMatchSnapshot();
    });
});

function generateTestCondition(code: string, type: AdjustmentType): AdjustmentConditionDefinition {
    return {
        code,
        description: `description for ${code}`,
        args: [{ name: 'arg', type: 'money' }],
        type,
        predicate: (order, args) => true,
    };
}

function generateTestAction(code: string, type: AdjustmentType): AdjustmentActionDefinition {
    return {
        code,
        description: `description for ${code}`,
        args: [{ name: 'percentage', type: 'percentage' }],
        type,
        calculate: (order, args) => {
            return [{ amount: 42 }];
        },
    };
}
