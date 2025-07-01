import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteAdministratorsDocument } from '../administrators.graphql.js';

export const DeleteAdministratorsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteAdministratorsDocument}
            entityName="administrators"
            requiredPermissions={['DeleteAdministrator']}
            selection={selection}
            table={table}
        />
    );
};
