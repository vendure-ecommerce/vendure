import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteZonesDocument } from '../zones.graphql.js';

export const DeleteZonesBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteZonesDocument}
            entityName="zones"
            requiredPermissions={['DeleteZone']}
            selection={selection}
            table={table}
        />
    );
};
