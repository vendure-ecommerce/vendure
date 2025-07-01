import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelBulkAction } from '@/components/shared/assign-to-channel-bulk-action.js';
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
    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="shipping methods"
            mutationFn={api.mutate(assignShippingMethodsToChannelDocument)}
            requiredPermissions={['UpdateShippingMethod']}
            buildInput={(channelId: string) => ({
                shippingMethodIds: selection.map(s => s.id),
                channelId,
            })}
        />
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
