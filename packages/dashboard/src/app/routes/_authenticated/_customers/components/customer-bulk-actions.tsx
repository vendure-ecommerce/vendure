import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteCustomersDocument } from '../customers.graphql.js';

export const DeleteCustomersBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteCustomersDocument}
            entityName="customers"
            requiredPermissions={['DeleteCustomer']}
            selection={selection}
            table={table}
        />
    );
};
