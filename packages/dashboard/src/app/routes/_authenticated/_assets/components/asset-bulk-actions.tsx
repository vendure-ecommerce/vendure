import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { api } from '@/vdb/graphql/api.js';
import { AssetFragment } from '@/vdb/graphql/fragments.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { deleteAssetsDocument } from '../assets.graphql.js';

export const DeleteAssetsBulkAction = ({
    selection,
    refetch,
}: {
    selection: AssetFragment[];
    refetch: () => void;
}) => {
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteAssetsDocument),
        onSuccess: (result: ResultOf<typeof deleteAssetsDocument>) => {
            if (result.deleteAssets.result === 'DELETED') {
                toast.success(i18n.t(`Deleted ${selection.length} assets`));
            } else {
                toast.error(i18n.t(`Failed to delete assets: ${result.deleteAssets.message}`));
            }
            refetch();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} assets`);
        },
    });

    return (
        <DataTableBulkActionItem
            requiresPermission={['DeleteCatalog', 'DeleteAsset']}
            onClick={() => mutate({ input: { assetIds: selection.map(s => s.id) } })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} assets?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};
