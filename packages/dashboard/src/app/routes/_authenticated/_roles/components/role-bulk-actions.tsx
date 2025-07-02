import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteRolesDocument } from '../roles.graphql.js';

export const DeleteRolesBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteRolesDocument}
            entityName="roles"
            requiredPermissions={['DeleteAdministrator']}
            selection={selection}
            table={table}
        />
    );
};
