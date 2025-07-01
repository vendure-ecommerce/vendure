import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelBulkAction } from '@/components/shared/assign-to-channel-bulk-action.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
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
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeCollectionFromChannelDocument),
        onSuccess: () => {
            toast.success(i18n.t(`Successfully removed ${selection.length} collections from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
            queryClient.invalidateQueries({ queryKey: ['childCollections'] });
        },
        onError: error => {
            toast.error(`Failed to remove ${selection.length} collections from channel: ${error.message}`);
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                collectionIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdateCatalog', 'UpdateCollection']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} collections from the current channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
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
