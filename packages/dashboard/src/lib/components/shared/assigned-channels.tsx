import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { ChannelChip } from '@/vdb/components/shared/channel-chip.js';
import { AssignToChannelDialog } from '@/vdb/components/shared/assign-to-channel-dialog.js';
import { usePriceFactor } from '@/vdb/components/shared/assign-to-channel-dialog.js';
import { Button } from '@/vdb/components/ui/button.js';
import { api } from '@/vdb/graphql/api.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans, useLingui } from '@lingui/react/macro';

// Interface for channel type
interface Channel {
    id: string;
    code: string;
    token: string;
}

interface AssignedChannelsProps {
    value?: string[];
    channels: Channel[];
    entityId: string;
    entityType: 'product' | 'variant';
    canUpdate?: boolean;
    assignMutationFn: (variables: any) => Promise<any>;
    removeMutationFn: (variables: any) => Promise<any>;
}

export function AssignedChannels({
    value = [],
    channels,
    entityId,
    entityType,
    canUpdate = true,
    assignMutationFn,
    removeMutationFn,
}: AssignedChannelsProps) {
    const { t } = useLingui();
    const queryClient = useQueryClient();
    const { activeChannel, channels: allChannels } = useChannel();
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const { priceFactor, priceFactorField } = usePriceFactor();

    const queryName = entityType === 'product' ? 'product' : 'productVariant';
    const entityKey = entityType === 'product' ? 'productIds' : 'productVariantIds';

    const { mutate: removeFromChannel, isPending: isRemoving } = useMutation({
        mutationFn: removeMutationFn,
        onSuccess: () => {
            toast.success(t`Successfully removed ${entityType} from channel`);
            queryClient.invalidateQueries({ queryKey: ['DetailPage', queryName, { id: entityId }] });
        },
        onError: () => {
            toast.error(t`Failed to remove ${entityType} from channel`);
        },
    });

    async function onRemoveHandler(channelId: string) {
        if (channelId === activeChannel?.id) {
            toast.error(t`Cannot remove from active channel`);
            return;
        }
        removeFromChannel({
            input: {
                [entityKey]: [entityId],
                channelId,
            },
        });
    }

    const handleAssignSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['DetailPage', queryName, { id: entityId }] });
        setAssignDialogOpen(false);
    };

    // Only show add button if there are more channels available
    const availableChannels = allChannels.filter(ch => !value.includes(ch.id));
    const showAddButton = canUpdate && availableChannels.length > 0;

    return (
        <>
            <div className="flex flex-wrap gap-1 mb-2">
                {value.map(id => {
                    const channel = channels.find(c => c.id === id);
                    if (!channel) return null;
                    return (
                        <ChannelChip
                            key={channel.id}
                            channel={channel}
                            removable={canUpdate && channel.id !== activeChannel?.id}
                            onRemove={onRemoveHandler}
                        />
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
                        open={assignDialogOpen}
                        onOpenChange={setAssignDialogOpen}
                        entityIds={[entityId]}
                        entityType={entityType}
                        mutationFn={assignMutationFn}
                        onSuccess={handleAssignSuccess}
                        buildInput={(channelId: string) => ({
                            [entityKey]: [entityId],
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
