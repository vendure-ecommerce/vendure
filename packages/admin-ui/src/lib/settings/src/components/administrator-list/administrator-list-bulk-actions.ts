import { createBulkDeleteAction, GetAdministratorsQuery, ItemOf, Permission } from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

export const deleteAdministratorsBulkAction = createBulkDeleteAction<
    ItemOf<GetAdministratorsQuery, 'administrators'>
>({
    location: 'administrator-list',
    requiresPermission: userPermissions => userPermissions.includes(Permission.DeleteAdministrator),
    getItemName: item => item.firstName + ' ' + item.lastName,
    bulkDelete: (dataService, ids) =>
        dataService.administrator.deleteAdministrators(ids).pipe(map(res => res.deleteAdministrators)),
});
