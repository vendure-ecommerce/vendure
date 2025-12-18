import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { ChannelChip } from '@/vdb/components/shared/channel-chip.js';
import { AssignToChannelDialog } from '@/vdb/components/shared/assign-to-channel-dialog.js';
import { usePriceFactor } from '@/vdb/components/shared/assign-to-channel-dialog.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { DEFAULT_CHANNEL_CODE } from '@/vdb/constants.js';
import type { SimpleChannel } from '@/vdb/providers/channel-provider.js';

interface AssignedChannelsProps {
    channels: SimpleChannel[];
    entityId: string;
    canUpdate?: boolean;
    assignMutationFn: (variables: any) => Promise<any>;
    removeMutationFn: (variables: any) => Promise<any>;
}

export function AssignedChannels({
    channels,
    entityId,
    canUpdate = true,
    assignMutationFn,
    removeMutationFn,
}: AssignedChannelsProps) {
    const { t } = useLingui();
    const queryClient = useQueryClient();
    const { activeChannel, channels: allChannels } = useChannel();
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const { priceFactor, priceFactorField } = usePriceFactor();

    const { mutate: removeFromChannel, isPending: isRemoving } = useMutation({
        mutationFn: removeMutationFn,
        onSuccess: () => {
            toast.success(t`Successfully removed product from channel`);
            queryClient.invalidateQueries({ queryKey: ['DetailPage', 'product', { id: entityId }] });
        },
        onError: () => {
            toast.error(t`Failed to remove product from channel`);
        },
    });

    async function onRemoveHandler(channelId: string) {
        if (channelId === activeChannel?.id) {
            toast.error(t`Cannot remove from active channel`);
            return;
        }
        removeFromChannel({
            input: {
                productIds: [entityId],
                channelId,
            },
        });
    }

    const handleAssignSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['DetailPage', 'product', { id: entityId }] });
        setAssignDialogOpen(false);
    };

    // Only show add button if there are more channels available
    const availableChannels = allChannels.filter(ch => !channels.map(c => c.id).includes(ch.id));
    const showAddButton = canUpdate && availableChannels.length > 0;

    return (
        <>
            <div className="flex flex-wrap gap-1 mb-2">
                {channels.filter(c => c.code !== DEFAULT_CHANNEL_CODE).map((channel: SimpleChannel) => {
                    return (
                        <ChannelChip key={channel.id} channel={channel} removable={canUpdate && channel.id !== activeChannel?.id} onRemove={onRemoveHandler} />
                    );
                })}
            </div>
            {showAddButton && (
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAssignDialogOpen(true)}
                        disabled={isRemoving}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        <Trans>Assign to channel</Trans>
                    </Button>
                    <AssignToChannelDialog
                        entityType="product"
                        open={assignDialogOpen}
                        onOpenChange={setAssignDialogOpen}
                        entityIds={[entityId]}
                        mutationFn={assignMutationFn}
                        onSuccess={handleAssignSuccess}
                        buildInput={(channelId: string) => ({
                            productIds: [entityId],
                            channelId,
                            priceFactor,
                        })}
                        additionalFields={priceFactorField}
                    />
                </>
            )}
        </>
    );
}
