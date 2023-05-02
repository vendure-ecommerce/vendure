import { createBulkDeleteAction, GetPromotionListQuery, ItemOf, Permission } from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

export const deletePromotionsBulkAction = createBulkDeleteAction<ItemOf<GetPromotionListQuery, 'promotions'>>(
    {
        location: 'promotion-list',
        requiresPermission: userPermissions => userPermissions.includes(Permission.DeletePromotion),
        getItemName: item => item.name,
        bulkDelete: (dataService, ids) =>
            dataService.promotion.deletePromotions(ids).pipe(map(res => res.deletePromotions)),
    },
);
