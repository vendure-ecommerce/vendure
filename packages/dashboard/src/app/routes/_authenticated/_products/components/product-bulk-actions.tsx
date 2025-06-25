import { useMutation } from '@tanstack/react-query';
import { CopyIcon, LayersIcon, TagIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { Permission } from '@vendure/common/lib/generated-types';
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
            requiresPermission={[Permission.DeleteCatalog, Permission.DeleteProduct]}
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
                requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
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
            requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
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
                requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
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
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });

    const { mutateAsync } = useMutation({
        mutationFn: api.mutate(duplicateEntityDocument),
    });

    const handleDuplicate = async () => {
        if (isDuplicating) return;

        setIsDuplicating(true);
        setProgress({ completed: 0, total: selection.length });

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[],
        };

        try {
            // Process products sequentially to avoid overwhelming the server
            for (let i = 0; i < selection.length; i++) {
                const product = selection[i];

                try {
                    const result = await mutateAsync({
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
                    });

                    if ('newEntityId' in result.duplicateEntity) {
                        results.success++;
                    } else {
                        results.failed++;
                        const errorMsg =
                            result.duplicateEntity.message ||
                            result.duplicateEntity.duplicationError ||
                            'Unknown error';
                        results.errors.push(`Product ${product.name || product.id}: ${errorMsg}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(
                        `Product ${product.name || product.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    );
                }

                setProgress({ completed: i + 1, total: selection.length });
            }

            // Show results
            if (results.success > 0) {
                toast.success(i18n.t(`Successfully duplicated ${results.success} products`));
            }
            if (results.failed > 0) {
                const errorMessage =
                    results.errors.length > 3
                        ? `${results.errors.slice(0, 3).join(', ')}... and ${results.errors.length - 3} more`
                        : results.errors.join(', ');
                toast.error(`Failed to duplicate ${results.failed} products: ${errorMessage}`);
            }

            if (results.success > 0) {
                refetchPaginatedList();
                table.resetRowSelection();
            }
        } finally {
            setIsDuplicating(false);
            setProgress({ completed: 0, total: 0 });
        }
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={[Permission.UpdateCatalog, Permission.UpdateProduct]}
            onClick={handleDuplicate}
            label={
                isDuplicating ? (
                    <Trans>
                        Duplicating... ({progress.completed}/{progress.total})
                    </Trans>
                ) : (
                    <Trans>Duplicate</Trans>
                )
            }
            icon={CopyIcon}
        />
    );
};
