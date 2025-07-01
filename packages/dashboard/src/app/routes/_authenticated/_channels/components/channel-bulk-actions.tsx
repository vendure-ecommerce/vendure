import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { deleteChannelsDocument } from '../channels.graphql.js';

export const DeleteChannelsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteChannelsDocument}
            entityName="channels"
            requiredPermissions={['DeleteChannel']}
            selection={selection}
            table={table}
        />
    );
};
