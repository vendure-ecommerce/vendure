import { ResultOf } from '@/graphql/graphql.js';

import { AssignToChannelDialog } from '@/components/shared/assign-to-channel-dialog.js';

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
    return (
        <AssignToChannelDialog
            open={open}
            onOpenChange={onOpenChange}
            entityIds={entityIds}
            entityType="collections"
            mutationFn={mutationFn}
            onSuccess={onSuccess}
            buildInput={channelId => ({
                collectionIds: entityIds,
                channelId,
            })}
        />
    );
}
