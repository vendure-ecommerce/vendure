import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { deleteTaxRatesDocument } from '../tax-rates.graphql.js';

export const DeleteTaxRatesBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteTaxRatesDocument),
        onSuccess: (result: ResultOf<typeof deleteTaxRatesDocument>) => {
            let deleted = 0;
            let failed = 0;
            for (const item of result.deleteTaxRates) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else {
                    failed++;
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} tax rates`));
            }
            if (0 < failed) {
                toast.error(i18n.t(`Failed to delete ${failed} tax rates`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} tax rates`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={['DeleteTaxRate']}
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} tax rates?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};
