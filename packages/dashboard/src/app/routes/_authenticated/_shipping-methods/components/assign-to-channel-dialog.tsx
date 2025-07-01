import { ResultOf } from '@/graphql/graphql.js';

import { AssignToChannelDialog as SharedAssignToChannelDialog } from '@/components/shared/assign-to-channel-dialog.js';

interface AssignShippingMethodsToChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityIds: string[];
    entityType: string;
    mutationFn: (variables: any) => Promise<ResultOf<any>>;
    onSuccess?: () => void;
}

export function AssignToChannelDialog({
    open,
    onOpenChange,
    entityIds,
    entityType,
    mutationFn,
    onSuccess,
}: Readonly<AssignShippingMethodsToChannelDialogProps>) {
    return (
        <SharedAssignToChannelDialog
            open={open}
            onOpenChange={onOpenChange}
            entityIds={entityIds}
            entityType={entityType}
            mutationFn={mutationFn}
            onSuccess={onSuccess}
            buildInput={(channelId: string) => ({
                shippingMethodIds: entityIds,
                channelId,
            })}
        />
    );
}
