import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { formatRelative } from 'date-fns';
import {
    Ban,
    CheckCircle2Icon,
    ChevronDown,
    CircleXIcon,
    ClockIcon,
    LoaderIcon,
    MoreVertical,
    RefreshCw,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PayloadDialog } from './components/payload-dialog.js';
import { cancelJobDocument, jobListDocument, jobQueueListDocument } from './job-queue.graphql.js';

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

const REFRESH_INTERVALS = [
    { label: <Trans>Off</Trans>, value: 0 },
    { label: <Trans>Every 5 seconds</Trans>, value: 5000 },
    { label: <Trans>Every 10 seconds</Trans>, value: 10000 },
    { label: <Trans>Every 30 seconds</Trans>, value: 30000 },
    { label: <Trans>Every 60 seconds</Trans>, value: 60000 },
];

function JobQueuePage() {
    const refreshRef = useRef<() => void>(() => {});
    const [refreshInterval, setRefreshInterval] = useState(10000);

    useEffect(() => {
        if (refreshInterval === 0) return;

        const interval = setInterval(() => {
            refreshRef.current();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    const currentInterval = REFRESH_INTERVALS.find(i => i.value === refreshInterval);

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
                    cell: ({ row, table }) => {
                        const cancelJobMutation = useMutation({
                            mutationFn: (jobId: string) => api.mutate(cancelJobDocument, { jobId }),
                            onSuccess: () => {
                                refreshRef.current();
                            },
                        });
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
                                {row.original.state === 'RUNNING' ? (
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => cancelJobMutation.mutate(row.original.id)}
                                                    disabled={cancelJobMutation.isPending}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    <Trans>Cancel Job</Trans>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : null}
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
            registerRefresher={refresher => {
                refreshRef.current = refresher;
            }}
        >
            <PageActionBarRight>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            <span>Auto refresh: {currentInterval?.label}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {REFRESH_INTERVALS.map(interval => (
                            <DropdownMenuItem
                                key={interval.value}
                                onClick={() => setRefreshInterval(interval.value)}
                                className={refreshInterval === interval.value ? 'bg-accent' : ''}
                            >
                                {interval.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </PageActionBarRight>
        </ListPage>
    );
}
