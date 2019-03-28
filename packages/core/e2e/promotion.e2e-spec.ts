import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_PROMOTION,
    GET_ADJUSTMENT_OPERATIONS,
    GET_PROMOTION,
    GET_PROMOTION_LIST,
    UPDATE_PROMOTION,
} from '../../admin-ui/src/app/data/definitions/promotion-definitions';
import {
    ConfigArgType,
    CreatePromotion,
    DeletionResult,
    GetAdjustmentOperations,
    GetPromotion,
    GetPromotionList,
    Promotion,
    UpdatePromotion,
} from '../../../shared/generated-types';
import { pick } from '../../shared/pick';
import { PromotionAction, PromotionOrderAction } from '../src/config/promotion/promotion-action';
import { PromotionCondition } from '../src/config/promotion/promotion-condition';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './test-utils';

// tslint:disable:no-non-null-assertion

describe('Promotion resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();

    const promoCondition = generateTestCondition('promo_condition');
    const promoCondition2 = generateTestCondition('promo_condition2');

    const promoAction = generateTestAction('promo_action');

    const snapshotProps = ['name', 'actions', 'conditions', 'enabled'] as Array<
        'name' | 'actions' | 'conditions' | 'enabled'
    >;
    let promotion: Promotion.Fragment;

    beforeAll(async () => {
        await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            },
            {
                promotionOptions: {
                    promotionConditions: [promoCondition, promoCondition2],
                    promotionActions: [promoAction],
                },
            },
        );
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createPromotion', async () => {
        const result = await client.query<CreatePromotion.Mutation, CreatePromotion.Variables>(
            CREATE_PROMOTION,
            {
                input: {
                    name: 'test promotion',
                    enabled: true,
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: [{ name: 'arg', value: '500', type: ConfigArgType.MONEY }],
                        },
                    ],
                    actions: [
                        {
                            code: promoAction.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: '["T_1"]',
                                    type: ConfigArgType.FACET_VALUE_IDS,
                                },
                            ],
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
                            arguments: [{ name: 'arg', value: '90', type: ConfigArgType.MONEY }],
                        },
                        {
                            code: promoCondition2.code,
                            arguments: [{ name: 'arg', value: '10', type: ConfigArgType.MONEY }],
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

    describe('deletion', () => {
        let allPromotions: GetPromotionList.Items[];
        let promotionToDelete: GetPromotionList.Items;

        beforeAll(async () => {
            const result = await client.query<GetPromotionList.Query>(GET_PROMOTION_LIST);
            allPromotions = result.promotions.items;
        });

        it('deletes a promotion', async () => {
            promotionToDelete = allPromotions[0];
            const result = await client.query(DELETE_PROMOTION, { id: promotionToDelete.id });

            expect(result.deletePromotion).toEqual({ result: DeletionResult.DELETED });
        });

        it('cannot get a deleted promotion', async () => {
            const result = await client.query<GetPromotion.Query, GetPromotion.Variables>(GET_PROMOTION, {
                id: promotionToDelete.id,
            });

            expect(result.promotion).toBe(null);
        });

        it('deleted promotion omitted from list', async () => {
            const result = await client.query<GetPromotionList.Query>(GET_PROMOTION_LIST);

            expect(result.promotions.items.length).toBe(allPromotions.length - 1);
            expect(result.promotions.items.map(c => c.id).includes(promotionToDelete.id)).toBe(false);
        });

        it(
            'updatePromotion throws for deleted promotion',
            assertThrowsWithMessage(
                () =>
                    client.query<UpdatePromotion.Mutation, UpdatePromotion.Variables>(UPDATE_PROMOTION, {
                        input: {
                            id: promotionToDelete.id,
                            enabled: false,
                        },
                    }),
                `No Promotion with the id '1' could be found`,
            ),
        );
    });
});

function generateTestCondition(code: string): PromotionCondition<any> {
    return new PromotionCondition({
        code,
        description: `description for ${code}`,
        args: { arg: ConfigArgType.MONEY },
        check: (order, args) => true,
    });
}

function generateTestAction(code: string): PromotionAction<any> {
    return new PromotionOrderAction({
        code,
        description: `description for ${code}`,
        args: { facetValueIds: ConfigArgType.FACET_VALUE_IDS },
        execute: (order, args) => {
            return 42;
        },
    });
}

const DELETE_PROMOTION = gql`
    mutation DeletePromotion($id: ID!) {
        deletePromotion(id: $id) {
            result
        }
    }
`;
