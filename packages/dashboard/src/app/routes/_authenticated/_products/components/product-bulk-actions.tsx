import { useMutation } from '@tanstack/react-query';
import { CopyIcon, LayersIcon, TagIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/components/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import {
    deleteProductsDocument,
    duplicateEntityDocument,
    removeProductsFromChannelDocument,
} from '../products.graphql.js';
import { AssignFacetValuesDialog } from './assign-facet-values-dialog.js';
import { AssignToChannelDialog } from './assign-to-channel-dialog.js';

export const DeleteProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteProductsDocument),
        onSuccess: (result: ResultOf<typeof deleteProductsDocument>) => {
            let deleted = 0;
            const errors: string[] = [];
            for (const item of result.deleteProducts) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else if (item.message) {
                    errors.push(item.message);
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} products`));
            }
            if (0 < errors.length) {
                toast.error(i18n.t(`Failed to delete ${errors.length} products`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} products`);
        },
    });
    return (
        <DataTableBulkActionItem
            onClick={() => mutate({ ids: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} products?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};

export const AssignProductsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { channels, selectedChannel } = useChannel();
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
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                productIds={selection.map(s => s.id)}
                onSuccess={handleSuccess}
            />
        </>
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
                onClick={() => setDialogOpen(true)}
                label={<Trans>Edit facet values</Trans>}
                icon={TagIcon}
            />
            <AssignFacetValuesDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                productIds={selection.map(s => s.id)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export const DuplicateProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate, isPending } = useMutation({
        mutationFn: api.mutate(duplicateEntityDocument),
        onSuccess: (result: ResultOf<typeof duplicateEntityDocument>) => {
            if ('newEntityId' in result.duplicateEntity) {
                toast.success(i18n.t(`Successfully duplicated ${selection.length} products`));
                refetchPaginatedList();
                table.resetRowSelection();
            } else {
                toast.error(
                    `Failed to duplicate products: ${result.duplicateEntity.message || result.duplicateEntity.duplicationError}`,
                );
            }
        },
        onError: () => {
            toast.error(`Failed to duplicate ${selection.length} products`);
        },
    });

    const handleDuplicate = () => {
        if (isPending) return;

        // For now, we'll duplicate products one by one
        // In a real implementation, you might want to batch this or show progress
        const duplicatePromises = selection.map(product =>
            mutate({
                input: {
                    entityName: 'Product',
                    entityId: product.id,
                    duplicatorInput: {
                        code: 'product-duplicator',
                        arguments: [
                            {
                                name: 'includeVariants',
                                value: 'true',
                            },
                        ],
                    },
                },
            }),
        );

        // Execute all duplications
        Promise.all(duplicatePromises).catch(() => {
            // Error handling is done in the mutation onError
        });
    };

    return (
        <DataTableBulkActionItem onClick={handleDuplicate} label={<Trans>Duplicate</Trans>} icon={CopyIcon} />
    );
};
