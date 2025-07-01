import { ResultOf } from '@/graphql/graphql.js';

import {
    AssignToChannelDialog as SharedAssignToChannelDialog,
    usePriceFactor,
} from '@/components/shared/assign-to-channel-dialog.js';

interface AssignProductsToChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityIds: string[];
    entityType: 'products' | 'variants';
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
}: Readonly<AssignProductsToChannelDialogProps>) {
    const { priceFactor, priceFactorField } = usePriceFactor();

    return (
        <SharedAssignToChannelDialog
            open={open}
            onOpenChange={onOpenChange}
            entityIds={entityIds}
            entityType={entityType}
            mutationFn={mutationFn}
            onSuccess={onSuccess}
            buildInput={(channelId: string) => {
                const baseInput = {
                    channelId,
                    priceFactor,
                };

                return entityType === 'products'
                    ? {
                          ...baseInput,
                          productIds: entityIds,
                      }
                    : {
                          ...baseInput,
                          productVariantIds: entityIds,
                      };
            }}
            additionalFields={priceFactorField}
        />
    );
}
