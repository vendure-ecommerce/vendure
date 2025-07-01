import { useMutation } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
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
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { ResultOf } from '@/graphql/graphql.js';
import { Trans, useLingui } from '@/lib/trans.js';

import { useChannel } from '@/hooks/use-channel.js';

interface AssignToChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityIds: string[];
    entityType: string;
    mutationFn: (variables: any) => Promise<ResultOf<any>>;
    onSuccess?: () => void;
    /**
     * Function to build the input object for the mutation
     * @param channelId - The selected channel ID
     * @param additionalData - Any additional data (like priceFactor for products)
     * @returns The input object for the mutation
     */
    buildInput: (channelId: string, additionalData?: Record<string, any>) => Record<string, any>;
    /**
     * Optional additional form fields to render
     */
    additionalFields?: ReactNode;
    /**
     * Optional additional data to pass to buildInput
     */
    additionalData?: Record<string, any>;
}

export function AssignToChannelDialog({
    open,
    onOpenChange,
    entityIds,
    entityType,
    mutationFn,
    onSuccess,
    buildInput,
    additionalFields,
    additionalData = {},
}: Readonly<AssignToChannelDialogProps>) {
    const { i18n } = useLingui();
    const [selectedChannelId, setSelectedChannelId] = useState<string>('');
    const { channels, selectedChannel } = useChannel();

    // Filter out the currently selected channel from available options
    const availableChannels = channels.filter(channel => channel.id !== selectedChannel?.id);

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: () => {
            toast.success(i18n.t(`Successfully assigned ${entityIds.length} ${entityType} to channel`));
            onSuccess?.();
            onOpenChange(false);
        },
        onError: () => {
            toast.error(`Failed to assign ${entityIds.length} ${entityType} to channel`);
        },
    });

    const handleAssign = () => {
        if (!selectedChannelId) {
            toast.error('Please select a channel');
            return;
        }

        const input = buildInput(selectedChannelId, additionalData);
        mutate({ input });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Assign {entityType} to channel</Trans>
                    </DialogTitle>
                    <DialogDescription>
                        <Trans>
                            Select a channel to assign {entityIds.length} {entityType} to
                        </Trans>
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
                    {additionalFields}
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

/**
 * Hook for managing price factor state in assign-to-channel dialogs
 */
export function usePriceFactor() {
    const [priceFactor, setPriceFactor] = useState<number>(1);

    const priceFactorField = (
        <div className="grid gap-2">
            <label className="text-sm font-medium">
                <Trans>Price conversion factor</Trans>
            </label>
            <Input
                type="number"
                min="0"
                max="99999"
                step="0.01"
                value={priceFactor}
                onChange={e => setPriceFactor(parseFloat(e.target.value) || 1)}
            />
        </div>
    );

    return { priceFactor, priceFactorField };
}
