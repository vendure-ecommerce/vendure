import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { Button } from '@/vdb/components/ui/button.js';
import { RowAction } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/vdb/components/ui/dialog.js';
import { api } from '@/vdb/graphql/api.js';
import { useMutation } from '@tanstack/react-query';
import { Ban, RotateCcw, X, PlusIcon, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
    apiKeyListDocument,
    rotateApiKeyDocument,
    revokeApiKeyDocument,
    invalidateApiKeySessionsDocument,
    deleteApiKeyDocument,
} from './api-keys.graphql.js';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_api-keys/api-keys')({
    component: ApiKeysPage,
    loader: () => ({ breadcrumb: () => <Trans>API Keys</Trans> }),
});

function ApiKeysPage() {
    const { i18n } = useLingui();
    const [rawKey, setRawKey] = React.useState<string | null>(null);

    // Raw key dialog display is still supported when rotating

    const refreshRef = React.useRef<(() => void) | null>(null);
    const rotateMutation = useMutation({
        mutationFn: (id: string) => api.mutate(rotateApiKeyDocument, { id }),
        onSuccess: res => {
            setRawKey(res.rotateApiKey.rawKey);
            refreshRef.current?.();
            toast.success(i18n.t('API key rotated'));
        },
        onError: (err: Error) => {
            toast.error(i18n.t('Failed to rotate API key'), { description: err.message });
        },
    });
    const revokeMutation = useMutation({
        mutationFn: (id: string) => api.mutate(revokeApiKeyDocument, { id }),
        onSuccess: () => {
            refreshRef.current?.();
            toast.success(i18n.t('API key revoked'));
        },
        onError: (err: Error) => {
            toast.error(i18n.t('Failed to revoke API key'), { description: err.message });
        },
    });
    const invalidateMutation = useMutation({
        mutationFn: (id: string) => api.mutate(invalidateApiKeySessionsDocument, { id }),
        onSuccess: () => {
            refreshRef.current?.();
            toast.success(i18n.t('API key sessions invalidated'));
        },
        onError: (err: Error) => {
            toast.error(i18n.t('Failed to invalidate sessions'), { description: err.message });
        },
    });

    const rowActions: RowAction<any>[] = [
        {
            label: (
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> <Trans>Rotate</Trans>
                </div>
            ),
            onClick: row => rotateMutation.mutate(row.original.id),
            disabled: row => (row.original.status !== 'ACTIVE' && row.original.status !== 'active'),
            confirm: {
                title: i18n.t('Rotate API key'),
                description: i18n.t('Rotate this key and show the new secret? The old secret will no longer work.'),
                confirmText: i18n.t('Rotate'),
            },
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4" /> <Trans>Invalidate</Trans>
                </div>
            ),
            onClick: row => invalidateMutation.mutate(row.original.id),
            disabled: row => row.original.status !== 'ACTIVE' && row.original.status !== 'active',
            confirm: {
                title: i18n.t('Invalidate sessions'),
                description: i18n.t('Invalidate all active sessions created with this key?'),
                confirmText: i18n.t('Invalidate'),
            },
        },
        {
            label: (
                <div className="flex items-center gap-2">
                    <X className="w-4 h-4" /> <Trans>Revoke</Trans>
                </div>
            ),
            onClick: row => revokeMutation.mutate(row.original.id),
            disabled: row => (row.original.status !== 'ACTIVE' && row.original.status !== 'active'),
            confirm: {
                title: i18n.t('Revoke API key'),
                description: i18n.t('Revoke this key? It will stop working immediately.'),
                confirmText: i18n.t('Revoke'),
            },
        },
    ];

    return (
        <ListPage
            pageId="api-keys"
            title={i18n.t('API Keys')}
            listQuery={apiKeyListDocument}
            route={Route}
            deleteMutation={deleteApiKeyDocument}
            rowActions={rowActions}
            registerRefresher={fn => (refreshRef.current = fn)}
            onSearchTermChange={term => ({ name: { contains: term } })}
            facetedFilters={{
                status: {
                    title: i18n.t('Status'),
                    options: [
                        { label: i18n.t('Active'), value: 'active' },
                        { label: i18n.t('Revoked'), value: 'revoked' },
                    ],
                },
            }}
            customizeColumns={{
                name: { header: () => <Trans>Name</Trans> },
                status: {
                    header: () => <Trans>Status</Trans>,
                    cell: ({ row }: any) => {
                        const isActive = row.original.status === 'ACTIVE' || row.original.status === 'active';
                        return <Badge variant={isActive ? 'success' : 'destructive'}>{isActive ? 'Active' : 'Revoked'}</Badge>;
                    },
                },
            }}
            defaultColumnOrder={[ 'name', 'status', 'createdAt', 'expiresAt', 'lastUsedAt' ]}
        >
            <PageActionBarRight>
                <Button asChild>
                    <Link to="./new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        <Trans>New API Key</Trans>
                    </Link>
                </Button>
            </PageActionBarRight>


            {/* Raw key dialog */}
            <Dialog open={!!rawKey} onOpenChange={open => !open && setRawKey(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><Trans>API key created</Trans></DialogTitle>
                        <DialogDescription><Trans>Copy and store this secret now. It cannot be shown again.</Trans></DialogDescription>
                    </DialogHeader>
                    {rawKey && (
                        <div className="space-y-3">
                            <div className="font-mono break-all p-2 rounded bg-muted">{rawKey}</div>
                            <div className="text-sm text-muted-foreground">
                                <Trans>Saved as a hash only. You will not be able to view it again.</Trans>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(rawKey);
                                            toast.success('Copied to clipboard');
                                        } catch {
                                            toast.error('Copy failed');
                                        }
                                    }}
                                >
                                    <CopyIcon className="mr-2 h-4 w-4" />
                                    <Trans>Copy</Trans>
                                </Button>
                                <Button onClick={() => setRawKey(null)}><Trans>Close</Trans></Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ListPage>
    );
}
