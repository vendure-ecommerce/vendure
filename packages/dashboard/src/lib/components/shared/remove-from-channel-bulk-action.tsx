import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { usePaginatedList } from '@/vdb/components/shared/paginated-list-data-table.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';

interface RemoveFromChannelBulkActionProps {
    selection: any[];
    table: any;
    entityType: string;
    mutationFn: (variables: any) => Promise<ResultOf<any>>;
    requiredPermissions: string[];
    buildInput: () => Record<string, any>;
    /**
     * Additional callback to run on success, after the standard refetch and reset
     * @param result - The result from the mutation
     */
    onSuccess?: (result?: ResultOf<any>) => void;
    /**
     * Custom success message. If not provided, a default message will be used.
     */
    successMessage?: string;
    /**
     * Custom error message. If not provided, a default message will be used.
     */
    errorMessage?: string;
}

export function RemoveFromChannelBulkAction({
    selection,
    table,
    entityType,
    mutationFn,
    requiredPermissions,
    buildInput,
    onSuccess,
    successMessage,
    errorMessage,
}: Readonly<RemoveFromChannelBulkActionProps>) {
    const { refetchPaginatedList } = usePaginatedList();
    const { activeChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn,
        onSuccess: result => {
            const message =
                successMessage ||
                i18n.t(`Successfully removed ${selection.length} ${entityType} from channel`);
            toast.success(message);
            refetchPaginatedList();
            table.resetRowSelection();
            onSuccess?.(result);
        },
        onError: error => {
            const message =
                errorMessage ||
                `Failed to remove ${selection.length} ${entityType} from channel: ${error.message}`;
            toast.error(message);
        },
    });

    if (!activeChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: buildInput(),
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={requiredPermissions}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} {entityType} from the current channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
}
