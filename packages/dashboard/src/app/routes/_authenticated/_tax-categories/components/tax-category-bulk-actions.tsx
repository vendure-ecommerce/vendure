import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { deleteTaxCategoriesDocument } from '../tax-categories.graphql.js';

export const DeleteTaxCategoriesBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteTaxCategoriesDocument),
        onSuccess: (result: ResultOf<typeof deleteTaxCategoriesDocument>) => {
            let deleted = 0;
            let failed = 0;
            for (const item of result.deleteTaxCategories) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else {
                    failed++;
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} tax categories`));
            }
            if (0 < failed) {
                toast.error(i18n.t(`Failed to delete ${failed} tax categories`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} tax categories`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={['DeleteTaxCategory']}
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={
                <Trans>Are you sure you want to delete {selection.length} tax categories?</Trans>
            }
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};
