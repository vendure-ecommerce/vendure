import { DataTableBulkActionItem } from '@/vdb/components/data-table/data-table-bulk-action-item.js';
import { BulkActionComponent } from '@/vdb/framework/extension-api/types/data-table.js';
import { api } from '@/vdb/graphql/api.js';
import { usePaginatedList } from '@/vdb/hooks/use-paginated-list.js';
import { Trans } from '@lingui/react/macro';
import { Ban } from 'lucide-react';
import { cancelJobDocument } from '../job-queue.graphql.js';

export const CancelJobsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    const { refetchPaginatedList } = usePaginatedList();

    const cancelSelectedJobs = async () => {
        const cancellableJobs = selection.filter(job => job.state === 'RUNNING' || job.state === 'PENDING');
        await Promise.all(cancellableJobs.map(job => api.mutate(cancelJobDocument, { jobId: job.id })));
        refetchPaginatedList();
        table.resetRowSelection();
    };

    const cancellableCount = selection.filter(
        job => job.state === 'RUNNING' || job.state === 'PENDING',
    ).length;

    if (cancellableCount === 0) {
        return null;
    }

    return (
        <DataTableBulkActionItem
            onClick={cancelSelectedJobs}
            label={<Trans>Cancel {cancellableCount} job(s)</Trans>}
            confirmationText={
                <Trans>
                    Are you sure you want to cancel {cancellableCount} job(s)? This action cannot be undone.
                </Trans>
            }
            icon={Ban}
            className="text-destructive"
        />
    );
};
