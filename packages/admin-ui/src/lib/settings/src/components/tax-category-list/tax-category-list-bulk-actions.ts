import { createBulkDeleteAction, GetSellersQuery, ItemOf, Permission } from '@vendure/admin-ui/core';
import { GetTaxCategoryListQuery } from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { map } from 'rxjs/operators';

export const deleteTaxCategoriesBulkAction = createBulkDeleteAction<
    ItemOf<GetTaxCategoryListQuery, 'taxCategories'>
>({
    location: 'tax-category-list',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.DeleteSettings) ||
        userPermissions.includes(Permission.DeleteTaxCategory),
    getItemName: item => item.name,
    bulkDelete: (dataService, ids) =>
        dataService.settings.deleteTaxCategories(ids).pipe(map(res => res.deleteTaxCategories)),
});
