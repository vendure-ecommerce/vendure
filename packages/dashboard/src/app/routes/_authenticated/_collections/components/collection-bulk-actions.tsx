import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
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
import { AssignCollectionsToChannelDialog } from './assign-collections-to-channel-dialog.js';

export const AssignCollectionsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { channels } = useChannel();
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    if (channels.length < 2) {
        return null;
    }

    const handleSuccess = () => {
        refetchPaginatedList();
        table.resetRowSelection();
        queryClient.invalidateQueries({ queryKey: ['childCollections'] });
    };

    return (
        <>
            <DataTableBulkActionItem
                requiresPermission={['UpdateCatalog', 'UpdateCollection']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignCollectionsToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                mutationFn={api.mutate(assignCollectionToChannelDocument)}
                onSuccess={handleSuccess}
            />
        </>
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
