import {
    AssignPromotionsToChannelDocument,
    createBulkAssignToChannelAction,
    createBulkDeleteAction,
    createBulkRemoveFromChannelAction,
    GetPromotionListQuery,
    ItemOf,
    Permission,
    RemovePromotionsFromChannelDocument,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

const ASSIGN_PROMOTIONS_TO_CHANNEL = gql`
    mutation AssignPromotionsToChannel($input: AssignPromotionsToChannelInput!) {
        assignPromotionsToChannel(input: $input) {
            id
            name
        }
    }
`;

const REMOVE_PROMOTIONS_FROM_CHANNEL = gql`
    mutation RemovePromotionsFromChannel($input: RemovePromotionsFromChannelInput!) {
        removePromotionsFromChannel(input: $input) {
            id
            name
        }
    }
`;

export const deletePromotionsBulkAction = createBulkDeleteAction<ItemOf<GetPromotionListQuery, 'promotions'>>(
    {
        location: 'promotion-list',
        requiresPermission: Permission.DeletePromotion,
        getItemName: item => item.name,
        bulkDelete: (dataService, ids) =>
            dataService.promotion.deletePromotions(ids).pipe(map(res => res.deletePromotions)),
    },
);

export const assignPromotionsToChannelBulkAction = createBulkAssignToChannelAction<
    ItemOf<GetPromotionListQuery, 'promotions'>
>({
    location: 'promotion-list',
    requiresPermission: Permission.UpdatePromotion,
    getItemName: item => item.name,
    bulkAssignToChannel: (dataService, promotionIds, channelId) =>
        dataService
            .mutate(AssignPromotionsToChannelDocument, {
                input: {
                    channelId,
                    promotionIds,
                },
            })
            .pipe(map(res => res.assignPromotionsToChannel)),
});

export const removePromotionsFromChannelBulkAction = createBulkRemoveFromChannelAction<
    ItemOf<GetPromotionListQuery, 'promotions'>
>({
    location: 'promotion-list',
    requiresPermission: Permission.DeleteCatalog,
    getItemName: item => item.name,
    bulkRemoveFromChannel: (dataService, promotionIds, channelId) =>
        dataService
            .mutate(RemovePromotionsFromChannelDocument, {
                input: {
                    channelId,
                    promotionIds,
                },
            })
            .pipe(map(res => res.removePromotionsFromChannel)),
});
