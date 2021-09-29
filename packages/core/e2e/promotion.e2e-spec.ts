import { pick } from '@vendure/common/lib/pick';
import { PromotionAction, PromotionCondition, PromotionOrderAction } from '@vendure/core';
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { PROMOTION_FRAGMENT } from './graphql/fragments';
import {
    AssignPromotionToChannel,
    ChannelFragment,
    CreateChannel,
    CreatePromotion,
    CurrencyCode,
    DeletePromotion,
    DeletionResult,
    ErrorCode,
    GetAdjustmentOperations,
    GetPromotion,
    GetPromotionList,
    LanguageCode,
    Promotion,
    PromotionFragment,
    RemovePromotionFromChannel,
    UpdatePromotion,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_PROMOTIONS_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_PROMOTION,
    REMOVE_PROMOTIONS_FROM_CHANNEL,
} from './graphql/shared-definitions';
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

    const promotionGuard: ErrorResultGuard<PromotionFragment> = createErrorResultGuard(
        input => !!input.couponCode,
    );

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
        const { createPromotion } = await adminClient.query<
            CreatePromotion.Mutation,
            CreatePromotion.Variables
        >(CREATE_PROMOTION, {
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
        });
        promotionGuard.assertSuccess(createPromotion);

        promotion = createPromotion;
        expect(pick(promotion, snapshotProps)).toMatchSnapshot();
    });

    it('createPromotion return error result with empty conditions and no couponCode', async () => {
        const { createPromotion } = await adminClient.query<
            CreatePromotion.Mutation,
            CreatePromotion.Variables
        >(CREATE_PROMOTION, {
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
        promotionGuard.assertErrorResult(createPromotion);

        expect(createPromotion.message).toBe(
            'A Promotion must have either at least one condition or a coupon code set',
        );
        expect(createPromotion.errorCode).toBe(ErrorCode.MISSING_CONDITIONS_ERROR);
    });

    it('updatePromotion', async () => {
        const { updatePromotion } = await adminClient.query<
            UpdatePromotion.Mutation,
            UpdatePromotion.Variables
        >(UPDATE_PROMOTION, {
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
        });
        promotionGuard.assertSuccess(updatePromotion);

        expect(pick(updatePromotion, snapshotProps)).toMatchSnapshot();
    });

    it('updatePromotion return error result with empty conditions and no couponCode', async () => {
        const { updatePromotion } = await adminClient.query<
            UpdatePromotion.Mutation,
            UpdatePromotion.Variables
        >(UPDATE_PROMOTION, {
            input: {
                id: promotion.id,
                couponCode: '',
                conditions: [],
            },
        });
        promotionGuard.assertErrorResult(updatePromotion);

        expect(updatePromotion.message).toBe(
            'A Promotion must have either at least one condition or a coupon code set',
        );
        expect(updatePromotion.errorCode).toBe(ErrorCode.MISSING_CONDITIONS_ERROR);
    });

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

    describe('channels', () => {
        const SECOND_CHANNEL_TOKEN = 'SECOND_CHANNEL_TOKEN';
        let secondChannel: ChannelFragment;
        beforeAll(async () => {
            const { createChannel } = await adminClient.query<
                CreateChannel.Mutation,
                CreateChannel.Variables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'second-channel',
                    token: SECOND_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    pricesIncludeTax: true,
                    currencyCode: CurrencyCode.EUR,
                    defaultTaxZoneId: 'T_1',
                    defaultShippingZoneId: 'T_2',
                },
            });
            secondChannel = createChannel as any;
        });

        it('does not list Promotions not in active channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { promotions } = await adminClient.query<GetPromotionList.Query>(GET_PROMOTION_LIST);

            expect(promotions.totalItems).toBe(0);
            expect(promotions.items).toEqual([]);
        });

        it('does not return Promotion not in active channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { promotion: result } = await adminClient.query<GetPromotion.Query, GetPromotion.Variables>(
                GET_PROMOTION,
                {
                    id: promotion.id,
                },
            );

            expect(result).toBeNull();
        });

        it('assignPromotionsToChannel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignPromotionsToChannel } = await adminClient.query<
                AssignPromotionToChannel.Mutation,
                AssignPromotionToChannel.Variables
            >(ASSIGN_PROMOTIONS_TO_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    promotionIds: [promotion.id],
                },
            });

            expect(assignPromotionsToChannel).toEqual([{ id: promotion.id, name: promotion.name }]);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { promotion: result } = await adminClient.query<GetPromotion.Query, GetPromotion.Variables>(
                GET_PROMOTION,
                {
                    id: promotion.id,
                },
            );
            expect(result?.id).toBe(promotion.id);

            const { promotions } = await adminClient.query<GetPromotionList.Query>(GET_PROMOTION_LIST);
            expect(promotions.totalItems).toBe(1);
            expect(promotions.items.map(pick(['id']))).toEqual([{ id: promotion.id }]);
        });

        it('removePromotionsFromChannel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removePromotionsFromChannel } = await adminClient.query<
                RemovePromotionFromChannel.Mutation,
                RemovePromotionFromChannel.Variables
            >(REMOVE_PROMOTIONS_FROM_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    promotionIds: [promotion.id],
                },
            });

            expect(removePromotionsFromChannel).toEqual([{ id: promotion.id, name: promotion.name }]);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { promotion: result } = await adminClient.query<GetPromotion.Query, GetPromotion.Variables>(
                GET_PROMOTION,
                {
                    id: promotion.id,
                },
            );
            expect(result).toBeNull();

            const { promotions } = await adminClient.query<GetPromotionList.Query>(GET_PROMOTION_LIST);
            expect(promotions.totalItems).toBe(0);
        });
    });

    describe('deletion', () => {
        let allPromotions: GetPromotionList.Items[];
        let promotionToDelete: GetPromotionList.Items;

        beforeAll(async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
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
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const CONFIGURABLE_DEF_FRAGMENT = gql`
    fragment ConfigurableOperationDef on ConfigurableOperationDefinition {
        args {
            name
            type
            ui
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
