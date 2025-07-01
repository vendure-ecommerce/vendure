import { useMutation } from '@tanstack/react-query';
import { CopyIcon, LayersIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { duplicateEntityDocument } from '@/graphql/common-operations.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';

import {
    assignFacetsToChannelDocument,
    deleteFacetsDocument,
    removeFacetsFromChannelDocument,
} from '../facets.graphql.js';
import { AssignToChannelDialog } from './assign-to-channel-dialog.js';

export const DeleteFacetsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(deleteFacetsDocument),
        onSuccess: (result: ResultOf<typeof deleteFacetsDocument>) => {
            let deleted = 0;
            const errors: string[] = [];
            for (const item of result.deleteFacets) {
                if (item.result === 'DELETED') {
                    deleted++;
                } else if (item.message) {
                    errors.push(item.message);
                }
            }
            if (0 < deleted) {
                toast.success(i18n.t(`Deleted ${deleted} facets`));
            }
            if (0 < errors.length) {
                toast.error(i18n.t(`Failed to delete ${errors.length} facets`));
            }
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: () => {
            toast.error(`Failed to delete ${selection.length} facets`);
        },
    });
    return (
        <DataTableBulkActionItem
            requiresPermission={['DeleteCatalog', 'DeleteFacet']}
            onClick={() => mutate({ input: selection.map(s => s.id) })}
            label={<Trans>Delete</Trans>}
            confirmationText={<Trans>Are you sure you want to delete {selection.length} facets?</Trans>}
            icon={TrashIcon}
            className="text-destructive"
        />
    );
};

export const AssignFacetsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
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
                requiresPermission={['UpdateCatalog', 'UpdateFacet']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="facets"
                mutationFn={api.mutate(assignFacetsToChannelDocument)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export const RemoveFacetsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removeFacetsFromChannelDocument),
        onSuccess: (result: ResultOf<typeof removeFacetsFromChannelDocument>) => {
            const errors: string[] = [];

            for (const item of result.removeFacetsFromChannel) {
                if ('id' in item) {
                    // Do nothing
                } else if ('message' in item) {
                    errors.push(item.message);
                    toast.error(i18n.t(`Failed to remove facet from channel: ${item.message}`));
                }
            }

            const successCount = selection.length - errors.length;

            if (successCount > 0) {
                toast.success(i18n.t(`Successfully removed ${successCount} facets from channel`));
            }

            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(`Failed to remove ${selection.length} facets from channel: ${error.message}`);
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                facetIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdateCatalog', 'UpdateFacet']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} facets from the current channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};

export const DuplicateFacetsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
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
            // Process entities sequentially to avoid overwhelming the server
            for (let i = 0; i < selection.length; i++) {
                const entity = selection[i];

                try {
                    const result = (await mutateAsync({
                        input: {
                            entityName: 'Facet',
                            entityId: entity.id,
                            duplicatorInput: {
                                code: 'facet-duplicator',
                                arguments: [
                                    {
                                        name: 'includeValues',
                                        value: 'true',
                                    },
                                ],
                            },
                        },
                    })) as ResultOf<typeof duplicateEntityDocument>;

                    if ('newEntityId' in result.duplicateEntity) {
                        results.success++;
                    } else {
                        results.failed++;
                        const errorMsg =
                            (result.duplicateEntity as any).message ||
                            (result.duplicateEntity as any).duplicationError ||
                            'Unknown error';
                        results.errors.push(`Facet ${entity.name || entity.id}: ${errorMsg}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(
                        `Facet ${entity.name || entity.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    );
                }

                setProgress({ completed: i + 1, total: selection.length });
            }

            // Show results
            if (results.success > 0) {
                toast.success(i18n.t(`Successfully duplicated ${results.success} facets`));
            }
            if (results.failed > 0) {
                const errorMessage =
                    results.errors.length > 3
                        ? `${results.errors.slice(0, 3).join(', ')}... and ${results.errors.length - 3} more`
                        : results.errors.join(', ');
                toast.error(`Failed to duplicate ${results.failed} facets: ${errorMessage}`);
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
            requiresPermission={['UpdateCatalog', 'UpdateFacet']}
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
