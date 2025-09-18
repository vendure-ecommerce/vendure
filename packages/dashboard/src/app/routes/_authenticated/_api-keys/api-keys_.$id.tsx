import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { Page, PageLayout, PageTitle, PageBlock, PageActionBar, PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/vdb/components/ui/dialog.js';
import { CopyIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createApiKeyDocument } from './api-keys.graphql.js';
import { toast } from 'sonner';
import { api } from '@/vdb/graphql/api.js';

export const Route = createFileRoute('/_authenticated/_api-keys/api-keys_/$id')({
    component: CreateApiKeyPage,
    loader: () => ({
        breadcrumb: [
            { path: '/api-keys', label: <Trans>API Keys</Trans> },
            <Trans>New API Key</Trans>,
        ],
    }),
});

function CreateApiKeyPage() {
    const params = Route.useParams();
    const isNew = params.id === NEW_ENTITY_PATH;
    const navigate = useNavigate();
    const { i18n } = useLingui();

    const [name, setName] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const defaultExpiry = React.useMemo(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), []);
    const [expiresMode, setExpiresMode] = React.useState<'7'|'30'|'60'|'90'|'180'|'custom'>('7');
    const [expiresValue, setExpiresValue] = React.useState<string | Date>(defaultExpiry);
    const [rawKey, setRawKey] = React.useState<string | null>(null);

    const createMutation = useMutation({
        mutationFn: () => api.mutate(createApiKeyDocument, {
            name,
            expiresAt: new Date(expiresValue as any).toISOString(),
            notes: notes || undefined,
        }),
        onSuccess: res => {
            const secret = res.createApiKey.rawKey;
            setRawKey(secret);
            toast.success(i18n.t('API key created'));
        },
        onError: (err: Error) => {
            let friendly = err.message;
            if (friendly.includes('error.api-key-name-already-exists')) {
                friendly = i18n.t('An active API key with this name already exists.');
            }
            toast.error(i18n.t('Failed to create API key'), { description: friendly });
        },
    });

    return (
        <Page pageId="api-keys-create">
            <PageTitle><Trans>New API Key</Trans></PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button onClick={() => createMutation.mutate()} disabled={!name || !expiresValue || createMutation.isPending}>
                        <Trans>Create</Trans>
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="form">
                    <div className="space-y-3">
                        <Label><Trans>Name</Trans></Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                        <Label><Trans>Notes</Trans></Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
                        <Label><Trans>Expires at</Trans></Label>
                        <div className="flex items-center gap-2">
                            <Select
                                value={expiresMode}
                                onValueChange={(val: any) => {
                                    const now = new Date();
                                    switch (val as typeof expiresMode) {
                                        case '7':
                                        case '30':
                                        case '60':
                                        case '90':
                                        case '180': {
                                            const days = parseInt(val as string, 10);
                                            const d = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                                            setExpiresValue(d);
                                            setExpiresMode(val);
                                            break;
                                        }
                                        case 'custom':
                                            setExpiresValue(now);
                                            setExpiresMode('custom');
                                            break;
                                        default:
                                            setExpiresMode('7');
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="30">30 days</SelectItem>
                                    <SelectItem value="60">60 days</SelectItem>
                                    <SelectItem value="90">90 days</SelectItem>
                                    <SelectItem value="180">180 days</SelectItem>
                                    <SelectItem value="custom">Custom date…</SelectItem>
                                </SelectContent>
                            </Select>
                            {expiresMode === 'custom' && (
                                <div className="flex-1">
                                    <DateTimeInput
                                        value={expiresValue as any}
                                        onChange={(v: any) => setExpiresValue(v || null)}
                                        fieldDef={{ name: 'expiresAt', type: 'datetime' } as any}
                                    />
                                </div>
                            )}
                            {expiresMode !== 'custom' && (
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {new Date(expiresValue as any).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                </PageBlock>
            </PageLayout>

            {/* Raw key dialog */}
            <Dialog open={!!rawKey} onOpenChange={open => {
                if (!open) {
                    setRawKey(null);
                    navigate({ to: '/api-keys' });
                }
            }}>
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
                                <Button onClick={() => {
                                    setRawKey(null);
                                    navigate({ to: '/api-keys' });
                                }}><Trans>Close</Trans></Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Page>
    );
}
