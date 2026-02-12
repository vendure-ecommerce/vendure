import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { usePaginatedList } from '@/vdb/hooks/use-paginated-list.js';
import { api } from '@/vdb/graphql/api.js';
import { BulkActionComponent } from '@/vdb/framework/extension-api/types/index.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { removeCustomersFromGroupDocument } from '../customer-groups.graphql.js';

export function createRemoveFromGroupBulkAction(customerGroupId: string): BulkActionComponent<any> {
    return function RemoveFromGroupBulkAction({ selection, table }) {
        const { refetchPaginatedList } = usePaginatedList();
        const { t } = useLingui();

        const { mutate } = useMutation({
            mutationFn: api.mutate(removeCustomersFromGroupDocument),
            onSuccess: () => {
                toast.success(t`Removed ${selection.length} customers from group`);
                refetchPaginatedList();
                table.resetRowSelection();
            },
            onError: () => {
                toast.error(t`Failed to remove customers from group`);
            },
        });

        return (
            <DataTableBulkActionItem
                requiresPermission={['UpdateCustomerGroup']}
                onClick={() =>
                    mutate({
                        customerGroupId,
                        customerIds: selection.map(s => s.id),
                    })
                }
                label={<Trans>Remove from group</Trans>}
                confirmationText={
                    <Trans>
                        Are you sure you want to remove {selection.length} customers from this group?
                    </Trans>
                }
                icon={UserMinus}
                className="text-destructive"
            />
        );
    };
}
