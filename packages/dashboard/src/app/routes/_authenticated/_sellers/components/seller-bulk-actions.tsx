import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { deleteSellersDocument } from '../sellers.graphql.js';

export const DeleteSellersBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteSellersDocument),
        onSuccess: (result: ResultOf<typeof deleteSellersDocument>) => {
            let deleted = 0;
            let failed = 0;
            for (const item of result.deleteSellers) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else {
                    failed++;
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} sellers`));
            }
            if (0 < failed) {
                toast.error(i18n.t(`Failed to delete ${failed} sellers`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} sellers`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={['DeleteSeller']}
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} sellers?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};
