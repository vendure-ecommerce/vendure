import { useQueryClient } from '@tanstack/react-query';

import { AssignToChannelBulkAction } from '@/vdb/components/shared/assign-to-channel-bulk-action.js';
import { RemoveFromChannelBulkAction } from '@/vdb/components/shared/remove-from-channel-bulk-action.js';
import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { api } from '@/vdb/graphql/api.js';
import { useChannel } from '@/vdb/index.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { DuplicateBulkAction } from '../../../../common/duplicate-bulk-action.js';
import {
    assignCollectionToChannelDocument,
    deleteCollectionsDocument,
    removeCollectionFromChannelDocument,
} from '../collections.graphql.js';

export const AssignCollectionsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const queryClient = useQueryClient();

    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="collections"
            mutationFn={api.mutate(assignCollectionToChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateCollection']}
            buildInput={(channelId: string) => ({
                collectionIds: selection.map(s => s.id),
                channelId,
            })}
            onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['childCollections'] });
            }}
        />
    );
};

export const RemoveCollectionsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { selectedChannel } = useChannel();
    const queryClient = useQueryClient();

    return (
        <RemoveFromChannelBulkAction
            selection={selection}
            table={table}
            entityType="collections"
            mutationFn={api.mutate(removeCollectionFromChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateCollection']}
            buildInput={() => ({
                collectionIds: selection.map(s => s.id),
                channelId: selectedChannel?.id,
            })}
            onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['childCollections'] });
            }}
        />
    );
};

export const DuplicateCollectionsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const queryClient = useQueryClient();
    return (
        <DuplicateBulkAction
            entityType="Collection"
            duplicatorCode="collection-duplicator"
            duplicatorArguments={[]}
            requiredPermissions={['UpdateCatalog', 'UpdateCollection']}
            entityName="Collection"
            selection={selection}
            table={table}
            onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['childCollections'] });
            }}
        />
    );
};

export const DeleteCollectionsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteCollectionsDocument}
            entityName="collections"
            requiredPermissions={['DeleteCatalog', 'DeleteCollection']}
            invalidateQueries={['childCollections']}
            selection={selection}
            table={table}
        />
    );
};
