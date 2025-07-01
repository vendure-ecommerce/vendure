import { useMutation } from '@tanstack/react-query';
import { LayersIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/framework/data-table/data-table-types.js';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';
import { useChannel, usePaginatedList } from '@/index.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { DuplicateBulkAction } from '../../../../common/duplicate-bulk-action.js';

import {
    assignPromotionsToChannelDocument,
    deletePromotionsDocument,
    removePromotionsFromChannelDocument,
} from '../promotions.graphql.js';
import { AssignToChannelDialog } from './assign-to-channel-dialog.js';

export const DeletePromotionsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deletePromotionsDocument}
            entityName="promotions"
            requiredPermissions={['DeletePromotion']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignPromotionsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
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
                requiresPermission={['UpdatePromotion']}
                onClick={() => setDialogOpen(true)}
                label={<Trans>Assign to channel</Trans>}
                icon={LayersIcon}
            />
            <AssignToChannelDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                entityIds={selection.map(s => s.id)}
                entityType="promotions"
                mutationFn={api.mutate(assignPromotionsToChannelDocument)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export const RemovePromotionsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();
    const { mutate } = useMutation({
        mutationFn: api.mutate(removePromotionsFromChannelDocument),
        onSuccess: (result: ResultOf<typeof removePromotionsFromChannelDocument>) => {
            toast.success(i18n.t(`Successfully removed ${selection.length} promotions from channel`));
            refetchPaginatedList();
            table.resetRowSelection();
        },
        onError: error => {
            toast.error(`Failed to remove ${selection.length} promotions from channel: ${error.message}`);
        },
    });

    if (!selectedChannel) {
        return null;
    }

    const handleRemove = () => {
        mutate({
            input: {
                promotionIds: selection.map(s => s.id),
                channelId: selectedChannel.id,
            },
        });
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={['UpdatePromotion']}
            onClick={handleRemove}
            label={<Trans>Remove from current channel</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to remove {selection.length} promotions from the current channel?
                </Trans>
            }
            icon={LayersIcon}
            className="text-warning"
        />
    );
};

export const DuplicatePromotionsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DuplicateBulkAction
            entityType="Promotion"
            duplicatorCode="promotion-duplicator"
            duplicatorArguments={[
                {
                    name: 'includeConditions',
                    value: 'true',
                },
                {
                    name: 'includeActions',
                    value: 'true',
                },
            ]}
            requiredPermissions={['CreatePromotion']}
            entityName="Promotion"
            selection={selection}
            table={table}
        />
    );
};
