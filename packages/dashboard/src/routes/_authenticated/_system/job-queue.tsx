import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { jobListDocument } from './job-queue.graphql.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { PayloadDialog } from './components/payload-dialog.js';
import { differenceInMilliseconds, formatDuration, formatRelative } from 'date-fns';
import { CircleXIcon, LoaderIcon } from 'lucide-react';
import { CheckCircle2Icon } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/_system/job-queue')({
    component: JobQueuePage,
    loader: () => ({ breadcrumb: () => <Trans>Job Queue</Trans> }),
});

export function JobQueuePage() {
    return (
        <ListPage
            title="Job Queue"
            listQuery={jobListDocument}
            route={Route}
            customizeColumns={{
                createdAt: {
                    header: 'Created At',
                    cell: ({ row }) => formatRelative(row.original.createdAt, new Date()),
                },
                data: {
                    header: 'Data',
                    cell: ({ row }) => (
                        <PayloadDialog
                            payload={row.original.data}
                            title={<Trans>View job data</Trans>}
                            description={<Trans>The data that has been passed to the job</Trans>}
                            trigger={
                                <Button size="sm" variant="secondary">
                                    View data
                                </Button>
                            }
                        />
                    ),
                },
                queueName: {
                    header: 'Queue',
                    cell: ({ row }) => <span className="font-mono">{row.original.queueName}</span>,
                },
                result: {
                    header: 'Result',
                    cell: ({ row }) => {
                        return row.original.result ? (
                            <PayloadDialog
                                payload={row.original.result}
                                title={<Trans>View job result</Trans>}
                                description={<Trans>The result of the job</Trans>}
                                trigger={
                                    <Button size="sm" variant="secondary">
                                        View result
                                    </Button>
                                }
                            />
                        ) : (
                            <Trans>No result yet</Trans>
                        );
                    },
                },
                state: {
                    header: 'State',
                    cell: ({ row }) => (
                        <Badge
                            variant={
                                row.original.state === 'PENDING'
                                    ? 'secondary'
                                    : row.original.state === 'COMPLETED'
                                      ? 'success'
                                      : row.original.state === 'FAILED'
                                        ? 'destructive'
                                        : 'outline'
                            }
                        >
                            {row.original.state === 'COMPLETED' ? (
                                <CheckCircle2Icon />
                            ) : row.original.state === 'FAILED' ? (
                                <CircleXIcon />
                            ) : (
                                <LoaderIcon />
                            )}
                            {row.original.state}
                        </Badge>
                    ),
                    enableColumnFilter: true,
                },
                duration: {
                    header: 'Duration',
                    cell: ({ row }) => {
                        return row.original.duration ? `${row.original.duration}ms` : null;
                    },
                },
            }}
            defaultVisibility={{
                isSettled: false,
                settledAt: false,
                progress: false,
                retries: false,
                attempts: false,
                error: false,
                startedAt: false,
            }}
        ></ListPage>
    );
}
