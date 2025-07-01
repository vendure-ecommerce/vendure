import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelDialog } from '@/components/shared/assign-to-channel-dialog.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';

import {
    assignStockLocationsToChannelDocument,
    deleteStockLocationsDocument,
    removeStockLocationsFromChannelDocument,
} from '../stock-locations.graphql.js';

export const DeleteStockLocationsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteStockLocationsDocument}
            entityName="stock locations"
            requiredPermissions={['DeleteStockLocation']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignStockLocationsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { channels } = useChannel();
    const [dialogOpen, setDialogOpen] = useState(false);

    if (channels.length < 2) {
        return null;
    }

    const handleSuccess = () => {
        refetchPaginatedList();
        table.resetRowSelection();
    };

    return (
        <>
            <DataTableBulkActionItem
                requiresPermission={['UpdateStockLocation']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="stock locations"
                mutationFn={api.mutate(assignStockLocationsToChannelDocument)}
                onSuccess={handleSuccess}
                buildInput={channelId => ({
                    stockLocationIds: selection.map(s => s.id),
                    channelId,
                })}
            />
        </>
    );
};

export const RemoveStockLocationsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeStockLocationsFromChannelDocument),
        onSuccess: (result: ResultOf<typeof removeStockLocationsFromChannelDocument>) => {
            toast.success(i18n.t(`Successfully removed ${selection.length} stock locations from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(
                `Failed to remove ${selection.length} stock locations from channel: ${error.message}`,
            );
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                stockLocationIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdateStockLocation']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} stock locations from the current
                    channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};
