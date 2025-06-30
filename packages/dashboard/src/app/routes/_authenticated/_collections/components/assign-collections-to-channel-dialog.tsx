import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { ChannelCodeLabel } from '@/components/shared/channel-code-label.js';
import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { ResultOf } from '@/graphql/graphql.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { useChannel } from '@/hooks/use-channel.js';

interface AssignCollectionsToChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityIds: string[];
    mutationFn: (variables: any) => Promise<ResultOf<any>>;
    onSuccess?: () => void;
}

export function AssignCollectionsToChannelDialog({
    open,
    onOpenChange,
    entityIds,
    mutationFn,
    onSuccess,
}: AssignCollectionsToChannelDialogProps) {
    const { i18n } = useLingui();
    const [selectedChannelId, setSelectedChannelId] = useState<string>('');
    const { channels, selectedChannel } = useChannel();

    // Filter out the currently selected channel from available options
    const availableChannels = channels.filter(channel => channel.id !== selectedChannel?.id);

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: () => {
            toast.success(i18n.t(`Successfully assigned ${entityIds.length} collections to channel`));
            onSuccess?.();
            onOpenChange(false);
        },
        onError: () => {
            toast.error(`Failed to assign ${entityIds.length} collections to channel`);
        },
    });

    const handleAssign = () => {
        if (!selectedChannelId) {
            toast.error('Please select a channel');
            return;
        }

        const input = {
            collectionIds: entityIds,
            channelId: selectedChannelId,
        };

        mutate({ input });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Assign collections to channel</Trans>
                    </DialogTitle>
                    <DialogDescription>
                        <Trans>Select a channel to assign {entityIds.length} collections to</Trans>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">
                            <Trans>Channel</Trans>
                        </label>
                        <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
                            <SelectTrigger>
                                <SelectValue placeholder={i18n.t('Select a channel')} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableChannels.map(channel => (
                                    <SelectItem key={channel.id} value={channel.id}>
                                        <ChannelCodeLabel code={channel.code} />
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <Trans>Cancel</Trans>
                    </Button>
                    <Button onClick={handleAssign} disabled={!selectedChannelId || isPending}>
                        <Trans>Assign</Trans>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
