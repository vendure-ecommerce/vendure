import {
    createBulkDeleteAction,
    GetRolesQuery,
    GetShippingMethodListQuery,
    ItemOf,
    Permission,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

export const deleteShippingMethodsBulkAction = createBulkDeleteAction<
    ItemOf<GetShippingMethodListQuery, 'shippingMethods'>
>({
    location: 'shipping-method-list',
    requiresPermission: userPermissions => userPermissions.includes(Permission.DeleteShippingMethod),
    getItemName: item => item.name,
    bulkDelete: (dataService, ids) =>
        dataService.shippingMethod.deleteShippingMethods(ids).pipe(map(res => res.deleteShippingMethods)),
});
