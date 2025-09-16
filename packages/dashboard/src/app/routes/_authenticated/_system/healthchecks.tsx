import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { Page, PageActionBar, PageTitle } from '@/vdb/framework/layout-engine/page-layout.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { formatRelative } from 'date-fns';
import { CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { uiConfig } from 'virtual:vendure-ui-config';

export const Route = createFileRoute('/_authenticated/_system/healthchecks')({
    component: HealthchecksPage,
    loader: () => ({ breadcrumb: () => <Trans>Healthchecks</Trans> }),
});

interface HealthcheckItem {
    status: 'up' | 'down';
}

interface HealthcheckResponse {
    status: 'ok' | 'error';
    info: Record<string, HealthcheckItem>;
    error: Record<string, HealthcheckItem>;
    details: Record<string, HealthcheckItem>;
}

function HealthchecksPage() {
    const { data, refetch, dataUpdatedAt } = useQuery({
        queryKey: ['healthchecks'],
        queryFn: async () => {
            const schemeAndHost =
                uiConfig.api.host + (uiConfig.api.port !== 'auto' ? `:${uiConfig.api.port}` : '');

            const res = await fetch(`${schemeAndHost}/health`);
            return res.json() as Promise<HealthcheckResponse>;
        },
        refetchInterval: 5000,
    });

    return (
        <Page>
            <PageTitle>Healthchecks</PageTitle>
            <PageActionBar>
                <Button onClick={() => refetch()}>Refresh</Button>
            </PageActionBar>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span> Current status</span>
                            <span className="text-sm font-normal text-muted-foreground">
                                <Trans>Last updated {formatRelative(dataUpdatedAt, new Date())}</Trans>
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.status === 'ok' ? (
                            <div className="flex items-center gap-2 ">
                                <CheckCircle2Icon className="text-success"></CheckCircle2Icon>
                                <span className="text-2xl">
                                    <Trans>All resources are up and running</Trans>
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ">
                                <CircleXIcon className="text-destructive"></CircleXIcon>
                                <span className="text-2xl">
                                    <Trans>Some resources are down</Trans>
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Trans>Monitored Resources</Trans>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {Object.entries(data?.info || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-start gap-6">
                                    <span className="min-w-1/3">{key}</span>
                                    <span>{value.status}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
}
