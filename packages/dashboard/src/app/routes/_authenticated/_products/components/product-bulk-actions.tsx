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
import { DuplicateBulkAction } from '../../../../common/duplicate-bulk-action.js';
import {
    assignProductsToChannelDocument,
    deleteProductsDocument,
    getProductsWithFacetValuesByIdsDocument,
    productDetailDocument,
    removeProductsFromChannelDocument,
    updateProductsDocument,
} from '../products.graphql.js';
import { AssignFacetValuesDialog } from './assign-facet-values-dialog.js';

export const DeleteProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteProductsDocument}
            entityName="products"
            requiredPermissions={['DeleteCatalog', 'DeleteProduct']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignProductsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { priceFactor, priceFactorField } = usePriceFactor();

    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="products"
            mutationFn={api.mutate(assignProductsToChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateProduct']}
            buildInput={(channelId: string) => ({
                productIds: selection.map(s => s.id),
                channelId,
                priceFactor,
            })}
            additionalFields={priceFactorField}
        />
    );
};

export const RemoveProductsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeProductsFromChannelDocument),
        onSuccess: () => {
            toast.success(i18n.t(`Successfully removed ${selection.length} products from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(`Failed to remove ${selection.length} products from channel: ${error.message}`);
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                productIds: selection.map(s => s.id),
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
                    Are you sure you want to remove {selection.length} products from the current channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};

export const AssignFacetValuesToProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
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
                entityType="products"
                queryFn={variables => api.query(getProductsWithFacetValuesByIdsDocument, variables)}
                mutationFn={api.mutate(updateProductsDocument)}
                detailDocument={productDetailDocument}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export const DuplicateProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DuplicateBulkAction
            entityType="Product"
            duplicatorCode="product-duplicator"
            duplicatorArguments={[
                {
                    name: 'includeVariants',
                    value: 'true',
                },
            ]}
            requiredPermissions={['UpdateCatalog', 'UpdateProduct']}
            entityName="Product"
            selection={selection}
            table={table}
        />
    );
};
