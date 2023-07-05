import {
    createBulkDeleteAction,
    GetChannelsQuery,
    GetCustomerListQuery,
    ItemOf,
    Permission,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

export const deleteChannelsBulkAction = createBulkDeleteAction<ItemOf<GetChannelsQuery, 'channels'>>({
    location: 'channel-list',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.SuperAdmin) || userPermissions.includes(Permission.DeleteChannel),
    getItemName: item => item.code,
    bulkDelete: (dataService, ids) =>
        dataService.settings.deleteChannels(ids).pipe(map(res => res.deleteChannels)),
});
