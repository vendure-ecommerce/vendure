import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute } from '@tanstack/react-router';
import { formatRelative } from 'date-fns';
import { Ban, CheckCircle2Icon, CircleXIcon, ClockIcon, LoaderIcon, RotateCcw } from 'lucide-react';
import { PayloadDialog } from './components/payload-dialog.js';
import { jobListDocument, jobQueueListDocument } from './job-queue.graphql.js';

export const Route = createFileRoute('/_authenticated/_system/job-queue')({
    component: JobQueuePage,
    loader: () => ({ breadcrumb: () => <Trans>Job Queue</Trans> }),
});

const STATES = [
    {
        label: 'Pending',
        value: 'PENDING',
        icon: ClockIcon,
    },
    {
        label: 'Completed',
        value: 'COMPLETED',
        icon: CheckCircle2Icon,
    },
    {
        label: 'Running',
        value: 'RUNNING',
        icon: LoaderIcon,
    },
    {
        label: 'Failed',
        value: 'FAILED',
        icon: CircleXIcon,
    },
    {
        label: 'Retrying',
        value: 'RETRYING',
        icon: RotateCcw,
    },
    {
        label: 'Cancelled',
        value: 'CANCELLED',
        icon: Ban,
    },
];

function JobQueuePage() {
    return (
        <ListPage
            pageId="job-queue-list"
            title="Job Queue"
            defaultSort={[{ id: 'createdAt', desc: true }]}
            listQuery={jobListDocument}
            route={Route}
            customizeColumns={{
                createdAt: {
                    header: 'Created At',
                    cell: ({ row }) => (
                        <div title={row.original.createdAt}>
                            {formatRelative(new Date(row.original.createdAt), new Date())}
                        </div>
                    ),
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
                            <div className="text-muted-foreground">
                                <Trans>No result yet</Trans>
                            </div>
                        );
                    },
                },
                state: {
                    header: 'State',
                    cell: ({ row }) => {
                        const state = STATES.find(s => s.value === row.original.state);

                        return (
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
                                {state && <state.icon />}
                                {row.original.state}
                            </Badge>
                        );
                    },
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
            facetedFilters={{
                queueName: {
                    title: 'Queue',
                    optionsFn: async () => {
                        return api.query(jobQueueListDocument).then(r => {
                            return r.jobQueues.map(queue => ({
                                label: queue.name,
                                value: queue.name,
                            }));
                        });
                    },
                },
                state: {
                    title: 'State',
                    options: STATES,
                },
            }}
        ></ListPage>
    );
}
