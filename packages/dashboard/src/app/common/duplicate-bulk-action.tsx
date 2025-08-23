import { useMutation } from '@tanstack/react-query';
import { CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { usePaginatedList } from '@/vdb/components/shared/paginated-list-data-table.js';
import { api } from '@/vdb/graphql/api.js';
import { duplicateEntityDocument } from '@/vdb/graphql/common-operations.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';

interface DuplicateBulkActionProps {
    entityType: 'Product' | 'Collection' | 'Facet' | 'Promotion';
    duplicatorCode: string;
    duplicatorArguments?: Array<{ name: string; value: string }>;
    requiredPermissions: string[];
    entityName: string; // For display purposes in error messages
    onSuccess?: () => void;
    selection: any[];
    table: any;
}

export function DuplicateBulkAction({
    entityType,
    duplicatorCode,
    duplicatorArguments = [],
    requiredPermissions,
    entityName,
    onSuccess,
    selection,
    table,
}: DuplicateBulkActionProps) {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });

    const { mutateAsync } = useMutation({
        mutationFn: api.mutate(duplicateEntityDocument),
    });

    const handleDuplicate = async () => {
        if (isDuplicating) return;

        setIsDuplicating(true);
        setProgress({ completed: 0, total: selection.length });

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[],
        };

        try {
            // Process entities sequentially to avoid overwhelming the server
            for (let i = 0; i < selection.length; i++) {
                const entity = selection[i];

                try {
                    const result = await mutateAsync({
                        input: {
                            entityName: entityType,
                            entityId: entity.id,
                            duplicatorInput: {
                                code: duplicatorCode,
                                arguments: duplicatorArguments,
                            },
                        },
                    });

                    if ('newEntityId' in result.duplicateEntity) {
                        results.success++;
                    } else {
                        results.failed++;
                        const errorMsg =
                            result.duplicateEntity.message ||
                            result.duplicateEntity.duplicationError ||
                            'Unknown error';
                        results.errors.push(`${entityName} ${entity.name || entity.id}: ${errorMsg}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(
                        `${entityName} ${entity.name || entity.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    );
                }

                setProgress({ completed: i + 1, total: selection.length });
            }

            // Show results
            if (results.success > 0) {
                toast.success(
                    i18n.t(`Successfully duplicated ${results.success} ${entityName.toLowerCase()}s`),
                );
            }
            if (results.failed > 0) {
                const errorMessage =
                    results.errors.length > 3
                        ? `${results.errors.slice(0, 3).join(', ')}... and ${results.errors.length - 3} more`
                        : results.errors.join(', ');
                toast.error(
                    `Failed to duplicate ${results.failed} ${entityName.toLowerCase()}s: ${errorMessage}`,
                );
            }

            if (results.success > 0) {
                refetchPaginatedList();
                table.resetRowSelection();
                onSuccess?.();
            }
        } finally {
            setIsDuplicating(false);
            setProgress({ completed: 0, total: 0 });
        }
    };

    return (
        <DataTableBulkActionItem
            requiresPermission={requiredPermissions}
            onClick={handleDuplicate}
            label={
                isDuplicating ? (
                    <Trans>
                        Duplicating... ({progress.completed}/{progress.total})
                    </Trans>
                ) : (
                    <Trans>Duplicate</Trans>
                )
            }
            icon={CopyIcon}
        />
    );
}
