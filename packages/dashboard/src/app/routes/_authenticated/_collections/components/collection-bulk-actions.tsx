import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayersIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf, useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { Permission } from '@vendure/common/lib/generated-types';
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
                requiresPermission={[Permission.UpdateCatalog, Permission.UpdateCollection]}
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
            requiresPermission={[Permission.UpdateCatalog, Permission.UpdateCollection]}
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
            requiredPermissions={[Permission.UpdateCatalog, Permission.UpdateCollection]}
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
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteCollectionsDocument),
        onSuccess: (result: ResultOf<typeof deleteCollectionsDocument>) => {
            let deleted = 0;
            const errors: string[] = [];
            for (const item of result.deleteCollections) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else if (item.message) {
                    errors.push(item.message);
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} collections`));
            }
            if (0 < errors.length) {
                toast.error(i18n.t(`Failed to delete ${errors.length} collections`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
            queryClient.invalidateQueries({ queryKey: ['childCollections'] });
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} collections`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={[Permission.DeleteCatalog, Permission.DeleteCollection]}
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} collections?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};
