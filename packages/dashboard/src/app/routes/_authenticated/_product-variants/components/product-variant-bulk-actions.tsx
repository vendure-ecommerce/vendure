import { useMutation } from '@tanstack/react-query';
import { LayersIcon, TagIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { Permission } from '@vendure/common/lib/generated-types';
import { AssignFacetValuesDialog } from '../../_products/components/assign-facet-values-dialog.js';
import { AssignToChannelDialog } from '../../_products/components/assign-to-channel-dialog.js';
import {
    assignProductVariantsToChannelDocument,
    deleteProductVariantsDocument,
    getProductVariantsWithFacetValuesByIdsDocument,
    productVariantDetailDocument,
    removeProductVariantsFromChannelDocument,
    updateProductVariantsDocument,
} from '../product-variants.graphql.js';

export const DeleteProductVariantsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteProductVariantsDocument),
        onSuccess: (result: ResultOf<typeof deleteProductVariantsDocument>) => {
            let deleted = 0;
            const errors: string[] = [];
            for (const item of result.deleteProductVariants) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else if (item.message) {
                    errors.push(item.message);
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} product variants`));
            }
            if (0 < errors.length) {
                toast.error(i18n.t(`Failed to delete ${errors.length} product variants`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} product variants`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={[Permission.DeleteCatalog, Permission.DeleteProduct]}
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={
                <Trans>Are you sure you want to delete {selection.length} product variants?</Trans>
            }
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};

export const AssignProductVariantsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { channels } = useChannel();
    const [dialogOpen, setDialogOpen] = useState(false);

    if (channels.length < 2) {
        return null;
    }

    const handleSuccess = () => {
        refetchPaginatedList();
        table.resetRowSelection();
    };

    return (
        <>
            <DataTableBulkActionItem
                requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="variants"
                mutationFn={api.mutate(assignProductVariantsToChannelDocument)}
                onSuccess={handleSuccess}
            />
        </>
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
            requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
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
                requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
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
