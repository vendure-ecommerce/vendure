import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteCountriesDocument } from '../countries.graphql.js';

export const DeleteCountriesBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteCountriesDocument}
            entityName="countries"
            requiredPermissions={['DeleteCountry']}
            selection={selection}
            table={table}
        />
    );
};
