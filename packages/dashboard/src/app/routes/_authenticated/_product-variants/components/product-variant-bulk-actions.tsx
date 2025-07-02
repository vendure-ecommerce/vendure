import { TagIcon } from 'lucide-react';
import { useState } from 'react';

import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelBulkAction } from '@/vdb/components/shared/assign-to-channel-bulk-action.js';
import { usePriceFactor } from '@/vdb/components/shared/assign-to-channel-dialog.js';
import { RemoveFromChannelBulkAction } from '@/vdb/components/shared/remove-from-channel-bulk-action.js';
import { BulkActionComponent } from '@/vdb/framework/data-table/data-table-types.js';
import { api } from '@/vdb/graphql/api.js';
import { useChannel, usePaginatedList } from '@/vdb/index.js';
import { Trans } from '@/vdb/lib/trans.js';
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
    const { selectedChannel } = useChannel();

    return (
        <RemoveFromChannelBulkAction
            selection={selection}
            table={table}
            entityType="product variants"
            mutationFn={api.mutate(removeProductVariantsFromChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateProduct']}
            buildInput={() => ({
                productVariantIds: selection.map(s => s.id),
                channelId: selectedChannel?.id,
            })}
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
