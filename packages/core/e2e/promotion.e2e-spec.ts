import { pick } from '@vendure/common/lib/pick';
import { PromotionAction, PromotionCondition, PromotionOrderAction } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { PROMOTION_FRAGMENT } from './graphql/fragments';
import {
    CreatePromotion,
    DeletePromotion,
    DeletionResult,
    GetAdjustmentOperations,
    GetPromotion,
    GetPromotionList,
    LanguageCode,
    Promotion,
    UpdatePromotion,
} from './graphql/generated-e2e-admin-types';
import { CREATE_PROMOTION } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('Promotion resolver', () => {
    const promoCondition = generateTestCondition('promo_condition');
    const promoCondition2 = generateTestCondition('promo_condition2');
    const promoAction = generateTestAction('promo_action');

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        promotionOptions: {
            promotionConditions: [promoCondition, promoCondition2],
            promotionActions: [promoAction],
        },
    });

    const snapshotProps: Array<keyof Promotion.Fragment> = [
        'name',
        'actions',
        'conditions',
        'enabled',
        'couponCode',
        'startsAt',
        'endsAt',
    ];
    let promotion: Promotion.Fragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createPromotion', async () => {
        const result = await adminClient.query<CreatePromotion.Mutation, CreatePromotion.Variables>(
            CREATE_PROMOTION,
            {
                input: {
                    name: 'test promotion',
                    enabled: true,
                    couponCode: 'TEST123',
                    startsAt: new Date('2019-10-30T00:00:00.000Z'),
                    endsAt: new Date('2019-12-01T00:00:00.000Z'),
                    conditions: [
                        {
                            code: promoCondition.code,
                            arguments: [{ name: 'arg', value: '500' }],
                        },
                    ],
                    actions: [
                        {
                            code: promoAction.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: '["T_1"]',
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

    it(
        'createPromotion throws with empty conditions and no couponCode',
        assertThrowsWithMessage(async () => {
            await adminClient.query<CreatePromotion.Mutation, CreatePromotion.Variables>(CREATE_PROMOTION, {
                input: {
                    name: 'bad promotion',
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: promoAction.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: '["T_1"]',
                                },
                            ],
                        },
                    ],
                },
            });
        }, 'A Promotion must have either at least one condition or a coupon code set'),
    );

    it('updatePromotion', async () => {
        const result = await adminClient.query<UpdatePromotion.Mutation, UpdatePromotion.Variables>(
            UPDATE_PROMOTION,
            {
                input: {
                    id: promotion.id,
                    couponCode: 'TEST1235',
                    startsAt: new Date('2019-05-30T22:00:00.000Z'),
                    endsAt: new Date('2019-06-01T22:00:00.000Z'),
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

    it(
        'updatePromotion throws with empty conditions and no couponCode',
        assertThrowsWithMessage(async () => {
            await adminClient.query<UpdatePromotion.Mutation, UpdatePromotion.Variables>(UPDATE_PROMOTION, {
                input: {
                    id: promotion.id,
                    couponCode: '',
                    conditions: [],
                },
            });
        }, 'A Promotion must have either at least one condition or a coupon code set'),
    );

    it('promotion', async () => {
        const result = await adminClient.query<GetPromotion.Query, GetPromotion.Variables>(GET_PROMOTION, {
            id: promotion.id,
        });

        expect(result.promotion!.name).toBe(promotion.name);
    });

    it('promotions', async () => {
        const result = await adminClient.query<GetPromotionList.Query, GetPromotionList.Variables>(
            GET_PROMOTION_LIST,
            {},
        );

        expect(result.promotions.totalItems).toBe(1);
        expect(result.promotions.items[0].name).toBe('test promotion');
    });

    it('adjustmentOperations', async () => {
        const result = await adminClient.query<
            GetAdjustmentOperations.Query,
            GetAdjustmentOperations.Variables
        >(GET_ADJUSTMENT_OPERATIONS);

        expect(result.promotionActions).toMatchSnapshot();
        expect(result.promotionConditions).toMatchSnapshot();
    });

    describe('deletion', () => {
        let allPromotions: GetPromotionList.Items[];
        let promotionToDelete: GetPromotionList.Items;

        beforeAll(async () => {
            const result = await adminClient.query<GetPromotionList.Query>(GET_PROMOTION_LIST);
            allPromotions = result.promotions.items;
        });

        it('deletes a promotion', async () => {
            promotionToDelete = allPromotions[0];
            const result = await adminClient.query<DeletePromotion.Mutation, DeletePromotion.Variables>(
                DELETE_PROMOTION,
                { id: promotionToDelete.id },
            );

            expect(result.deletePromotion).toEqual({ result: DeletionResult.DELETED });
        });

        it('cannot get a deleted promotion', async () => {
            const result = await adminClient.query<GetPromotion.Query, GetPromotion.Variables>(
                GET_PROMOTION,
                {
                    id: promotionToDelete.id,
                },
            );

            expect(result.promotion).toBe(null);
        });

        it('deleted promotion omitted from list', async () => {
            const result = await adminClient.query<GetPromotionList.Query>(GET_PROMOTION_LIST);

            expect(result.promotions.items.length).toBe(allPromotions.length - 1);
            expect(result.promotions.items.map(c => c.id).includes(promotionToDelete.id)).toBe(false);
        });

        it(
            'updatePromotion throws for deleted promotion',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<UpdatePromotion.Mutation, UpdatePromotion.Variables>(UPDATE_PROMOTION, {
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
        description: [{ languageCode: LanguageCode.en, value: `description for ${code}` }],
        args: { arg: { type: 'int' } },
        check: (order, args) => true,
    });
}

function generateTestAction(code: string): PromotionAction<any> {
    return new PromotionOrderAction({
        code,
        description: [{ languageCode: LanguageCode.en, value: `description for ${code}` }],
        args: { facetValueIds: { type: 'ID', list: true } },
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

export const GET_PROMOTION_LIST = gql`
    query GetPromotionList($options: PromotionListOptions) {
        promotions(options: $options) {
            items {
                ...Promotion
            }
            totalItems
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const GET_PROMOTION = gql`
    query GetPromotion($id: ID!) {
        promotion(id: $id) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const UPDATE_PROMOTION = gql`
    mutation UpdatePromotion($input: UpdatePromotionInput!) {
        updatePromotion(input: $input) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const CONFIGURABLE_DEF_FRAGMENT = gql`
    fragment ConfigurableOperationDef on ConfigurableOperationDefinition {
        args {
            name
            type
            config
        }
        code
        description
    }
`;

export const GET_ADJUSTMENT_OPERATIONS = gql`
    query GetAdjustmentOperations {
        promotionActions {
            ...ConfigurableOperationDef
        }
        promotionConditions {
            ...ConfigurableOperationDef
        }
    }
    ${CONFIGURABLE_DEF_FRAGMENT}
`;
