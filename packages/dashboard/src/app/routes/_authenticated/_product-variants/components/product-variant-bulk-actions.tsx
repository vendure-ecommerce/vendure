import { useMutation } from '@tanstack/react-query';
import { LayersIcon, TagIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelBulkAction } from '@/components/shared/assign-to-channel-bulk-action.js';
import { usePriceFactor } from '@/components/shared/assign-to-channel-dialog.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';

import { AssignFacetValuesDialog } from '../../_products/components/assign-facet-values-dialog.js';
import {
    assignProductVariantsToChannelDocument,
    deleteProductVariantsDocument,
    getProductVariantsWithFacetValuesByIdsDocument,
    productVariantDetailDocument,
    removeProductVariantsFromChannelDocument,
    updateProductVariantsDocument,
} from '../product-variants.graphql.js';

export const DeleteProductVariantsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteProductVariantsDocument}
            entityName="product variants"
            requiredPermissions={['DeleteCatalog', 'DeleteProduct']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignProductVariantsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { priceFactor, priceFactorField } = usePriceFactor();

    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="variants"
            mutationFn={api.mutate(assignProductVariantsToChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateProduct']}
            buildInput={(channelId: string) => ({
                productVariantIds: selection.map(s => s.id),
                channelId,
                priceFactor,
            })}
            additionalFields={priceFactorField}
        />
    );
};

export const RemoveProductVariantsFromChannelBulkAction: BulkActionComponent<any> = ({
    selection,
    table,
}) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeProductVariantsFromChannelDocument),
        onSuccess: () => {
            toast.success(i18n.t(`Successfully removed ${selection.length} product variants from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(
                `Failed to remove ${selection.length} product variants from channel: ${error.message}`,
            );
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                productVariantIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdateCatalog', 'UpdateProduct']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} product variants from the current
                    channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};

export const AssignFacetValuesToProductVariantsBulkAction: BulkActionComponent<any> = ({
    selection,
    table,
}) => {
    const { refetchPaginatedList } = usePaginatedList();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSuccess = () => {
        refetchPaginatedList();
        table.resetRowSelection();
    };

    return (
        <>
            <DataTableBulkActionItem
                requiresPermission={['UpdateCatalog', 'UpdateProduct']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Edit facet values</Trans>}
                icon={TagIcon}
            />
            <AssignFacetValuesDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="variants"
                queryFn={variables => api.query(getProductVariantsWithFacetValuesByIdsDocument, variables)}
                mutationFn={api.mutate(updateProductVariantsDocument)}
                detailDocument={productVariantDetailDocument}
                onSuccess={handleSuccess}
            />
        </>
    );
};
