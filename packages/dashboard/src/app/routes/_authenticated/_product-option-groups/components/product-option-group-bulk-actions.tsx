
import { AssignToChannelBulkAction } from '@/vdb/components/shared/assign-to-channel-bulk-action.js';
import { RemoveFromChannelBulkAction } from '@/vdb/components/shared/remove-from-channel-bulk-action.js';
import { BulkActionComponent } from '@/vdb/framework/extension-api/types/data-table.js';
import { api } from '@/vdb/graphql/api.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { toast } from 'sonner';

import { DeleteBulkAction } from '../../../../common/delete-bulk-action.js';
import { DuplicateBulkAction } from '../../../../common/duplicate-bulk-action.js';
import {
    assignProductOptionGroupsToChannelDocument,
    deleteProductOptionGroupsDocument,
    removeProductOptionGroupsFromChannelDocument,
} from '../product-option-groups.graphql.js';

export const DeleteProductOptionGroupsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteProductOptionGroupsDocument}
            entityName="product option groups"
            requiredPermissions={['DeleteCatalog', 'DeleteProduct']}
            selection={selection}
            table={table}
        />
    );
};

export const AssignProductOptionGroupsToChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <AssignToChannelBulkAction
            selection={selection}
            table={table}
            entityType="product option groups"
            mutationFn={api.mutate(assignProductOptionGroupsToChannelDocument)}
            requiredPermissions={['UpdateCatalog']}
            buildInput={(channelId: string) => ({
                productOptionGroupIds: selection.map(s => s.id),
                channelId,
            })}
        />
    );
};

export const RemoveProductOptionGroupsFromChannelBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { selectedChannel } = useChannel();
    const { i18n } = useLingui();

    return (
        <RemoveFromChannelBulkAction
            selection={selection}
            table={table}
            entityType="product option groups"
            mutationFn={api.mutate(removeProductOptionGroupsFromChannelDocument)}
            requiredPermissions={['UpdateCatalog' /* resolver has DeleteCatalog */]}
            buildInput={() => ({
                productOptionGroupIds: selection.map(s => s.id),
                channelId: selectedChannel?.id,
            })}
            onSuccess={result => {
                const typedResult = result as ResultOf<typeof removeProductOptionGroupsFromChannelDocument>;
                if (typedResult?.removeProductOptionGroupsFromChannel) {
                    const errors: string[] = [];

                    for (const item of typedResult.removeProductOptionGroupsFromChannel) {
                        if ('id' in item) {
                            // Do nothing
                        } else if ('message' in item) {
                            errors.push(item.message);
                            toast.error(i18n.t(`Failed to remove product option group from channel: ${item.message}`));
                        }
                    }

                    const successCount = selection.length - errors.length;

                    if (successCount > 0) {
                        toast.success(i18n.t(`Successfully removed ${successCount} product option groups from channel`));
                    }
                }
            }}
        />
    );
};

export const DuplicateProductOptionGroupsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DuplicateBulkAction
            entityType="ProductOptionGroup"
            duplicatorCode="product-option-group-duplicator"
            duplicatorArguments={[
                {
                    name: 'includeValues',
                    value: 'true',
                },
            ]}
            requiredPermissions={['UpdateCatalog']}
            entityName="ProductOptionGroup"
            selection={selection}
            table={table}
        />
    );
};
