import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { AssignToChannelBulkAction } from '@/components/shared/assign-to-channel-bulk-action.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { DuplicateBulkAction } from '../../../../common/duplicate-bulk-action.js';

import {
    assignFacetsToChannelDocument,
    deleteFacetsDocument,
    removeFacetsFromChannelDocument,
} from '../facets.graphql.js';

export const DeleteFacetsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteFacetsDocument}
            entityName="facets"
            requiredPermissions={['DeleteCatalog', 'DeleteFacet']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignFacetsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="facets"
            mutationFn={api.mutate(assignFacetsToChannelDocument)}
            requiredPermissions={['UpdateCatalog', 'UpdateFacet']}
            buildInput={(channelId: string) => ({
                facetIds: selection.map(s => s.id),
                channelId,
            })}
        />
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
    return (
        <DuplicateBulkAction
            entityType="Facet"
            duplicatorCode="facet-duplicator"
            duplicatorArguments={[
                {
                    name: 'includeValues',
                    value: 'true',
                },
            ]}
            requiredPermissions={['UpdateCatalog', 'UpdateFacet']}
            entityName="Facet"
            selection={selection}
            table={table}
        />
    );
};
