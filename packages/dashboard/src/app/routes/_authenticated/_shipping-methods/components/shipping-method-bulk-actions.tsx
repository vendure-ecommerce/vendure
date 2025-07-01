import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';

import {
    assignShippingMethodsToChannelDocument,
    deleteShippingMethodsDocument,
    removeShippingMethodsFromChannelDocument,
} from '../shipping-methods.graphql.js';
import { AssignToChannelDialog } from './assign-to-channel-dialog.js';

export const DeleteShippingMethodsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteShippingMethodsDocument}
            entityName="shipping methods"
            requiredPermissions={['DeleteShippingMethod']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignShippingMethodsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
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
                requiresPermission={['UpdateShippingMethod']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="shipping methods"
                mutationFn={api.mutate(assignShippingMethodsToChannelDocument)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export const RemoveShippingMethodsFromChannelBulkAction: BulkActionComponent<any> = ({
    selection,
    table,
}) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeShippingMethodsFromChannelDocument),
        onSuccess: (result: ResultOf<typeof removeShippingMethodsFromChannelDocument>) => {
            toast.success(i18n.t(`Successfully removed ${selection.length} shipping methods from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(
                `Failed to remove ${selection.length} shipping methods from channel: ${error.message}`,
            );
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                shippingMethodIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdateShippingMethod']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} shipping methods from the current
                    channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};
