import {
    createBulkDeleteAction,
    GetPaymentMethodListQuery,
    ItemOf,
    Permission,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

export const deleteFacetsBulkAction = createBulkDeleteAction<
    ItemOf<GetPaymentMethodListQuery, 'paymentMethods'>
>({
    location: 'payment-method-list',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.DeletePaymentMethod) ||
        userPermissions.includes(Permission.DeleteSettings),
    getItemName: item => item.name,
    shouldRetryItem: (response, item) => !!response.message,
    bulkDelete: (dataService, ids, retrying) =>
        dataService.settings.deletePaymentMethods(ids, retrying).pipe(map(res => res.deletePaymentMethods)),
});
