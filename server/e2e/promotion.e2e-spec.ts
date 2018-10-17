import {
    CreatePromotion,
    GetAdjustmentOperations,
    GetPromotion,
    GetPromotionList,
    Promotion,
    UpdatePromotion,
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import {
    CREATE_PROMOTION,
    GET_ADJUSTMENT_OPERATIONS,
    GET_PROMOTION,
    GET_PROMOTION_LIST,
    UPDATE_PROMOTION,
} from '../../admin-ui/src/app/data/definitions/promotion-definitions';
import { PromotionAction } from '../src/config/promotion/promotion-action';
import { PromotionCondition } from '../src/config/promotion/promotion-condition';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Promotion resolver', () => {
    const client = new TestClient();
    const server = new TestServer();

    const promoCondition = generateTestCondition('promo_condition');
    const promoCondition2 = generateTestCondition('promo_condition2');

    const promoAction = generateTestAction('promo_action');

    const snapshotProps = ['name', 'actions', 'conditions', 'enabled'] as Array<
        'name' | 'actions' | 'conditions' | 'enabled'
    >;
    let promotion: Promotion.Fragment;

    beforeAll(async () => {
        const token = await server.init(
            {
                productCount: 1,
                customerCount: 1,
            },
            {
                promotionConditions: [promoCondition, promoCondition2],
                promotionActions: [promoAction],
            },
        );
        await client.init();
    }, 60000);

    afterAll(async () => {
        await server.destroy();
    });

    it('createPromotion promotion', async () => {
        const result = await client.query<CreatePromotion.Mutation, CreatePromotion.Variables>(
            CREATE_PROMOTION,
            {
                input: {
                    name: 'test promotion',
                    enabled: true,
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: [{ name: 'arg', value: '500' }],
                        },
                    ],
                    actions: [
                        {
                            code: promoAction.code,
                            arguments: [{ name: 'percentage', value: '50' }],
                        },
                    ],
                },
            },
        );
        promotion = result.createPromotion;
        expect(pick(promotion, snapshotProps)).toMatchSnapshot();
    });

    it('updatePromotion', async () => {
        const result = await client.query<UpdatePromotion.Mutation, UpdatePromotion.Variables>(
            UPDATE_PROMOTION,
            {
                input: {
                    id: promotion.id,
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: [{ name: 'arg', value: '90' }],
                        },
                        {
                            code: promoCondition2.code,
                            arguments: [{ name: 'arg', value: '10' }],
                        },
                    ],
                },
            },
        );
        expect(pick(result.updatePromotion, snapshotProps)).toMatchSnapshot();
    });

    it('promotion', async () => {
        const result = await client.query<GetPromotion.Query, GetPromotion.Variables>(GET_PROMOTION, {
            id: promotion.id,
        });

        expect(result.promotion!.name).toBe(promotion.name);
    });

    it('promotions', async () => {
        const result = await client.query<GetPromotionList.Query, GetPromotionList.Variables>(
            GET_PROMOTION_LIST,
            {},
        );

        expect(result.promotions.totalItems).toBe(1);
        expect(result.promotions.items[0].name).toBe('test promotion');
    });

    it('adjustmentOperations', async () => {
        const result = await client.query<GetAdjustmentOperations.Query, GetAdjustmentOperations.Variables>(
            GET_ADJUSTMENT_OPERATIONS,
        );

        expect(result.adjustmentOperations).toMatchSnapshot();
    });
});

function generateTestCondition(code: string): PromotionCondition<any> {
    return new PromotionCondition({
        code,
        description: `description for ${code}`,
        args: { arg: 'money' },
        check: (order, args) => true,
    });
}

function generateTestAction(code: string): PromotionAction<any> {
    return new PromotionAction({
        code,
        description: `description for ${code}`,
        args: { percentage: 'percentage' },
        execute: (order, args) => {
            return 42;
        },
    });
}
