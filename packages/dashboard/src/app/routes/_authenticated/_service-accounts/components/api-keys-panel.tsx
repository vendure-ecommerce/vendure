import { DataTable } from '@/vdb/components/data-table/data-table.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/vdb/components/ui/dialog.js';
import { Input } from '@/vdb/components/ui/input.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Label } from '@/vdb/components/ui/label.js';
import { api } from '@/vdb/graphql/api.js';
import { usePermissions } from '@/vdb/hooks/use-permissions.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CopyIcon, RefreshCcw, RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import {
    apiKeyListDocument,
    createApiKeyDocument,
    rotateApiKeyDocument,
    revokeApiKeyDocument,
    invalidateApiKeySessionsDocument,
} from '../service-accounts.graphql.js';

interface ApiKeysPanelProps {
    administratorId: string;
    createDialogOpen?: boolean;
    onCreateDialogOpenChange?: (open: boolean) => void;
}

type ConfirmState = { type: 'rotate' | 'revoke' | 'invalidate'; id: string } | null;

function ConfirmDialogBody({
    items,
    confirm,
    confirmInput,
    onConfirm,
    onCancel,
    setConfirmInput,
    isPending,
}: {
    items: Array<any>;
    confirm: ConfirmState;
    confirmInput: string;
    setConfirmInput: (v: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    const target = items.find(k => k.id === confirm?.id);
    const requiredName = target?.name ?? '';
    const matches = confirmInput.trim() === requiredName;
    return (
        <div className="space-y-2">
            <div className="text-sm">
                <Trans>
                    Please type the API key name to confirm:
                </Trans>
                {requiredName ? (
                    <span className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {requiredName}
                    </span>
                ) : null}
            </div>
            <Input value={confirmInput} onChange={e => setConfirmInput(e.target.value)} />
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onCancel}><Trans>Cancel</Trans></Button>
                <Button
                    variant={confirm?.type === 'revoke' ? 'destructive' : 'default'}
                    disabled={!matches || isPending}
                    onClick={onConfirm}
                >
                    {confirm?.type === 'rotate' && <Trans>Rotate</Trans>}
                    {confirm?.type === 'revoke' && <Trans>Revoke</Trans>}
                    {confirm?.type === 'invalidate' && <Trans>Invalidate</Trans>}
                </Button>
            </div>
        </div>
    );
}

function ActionCell({
    row,
    canUpdate,
    onRotate,
    onRevoke,
    onInvalidate,
}: {
    row: any;
    canUpdate: boolean;
    onRotate: (id: string) => void;
    onRevoke: (id: string) => void;
    onInvalidate: (id: string) => void;
}) {
    return (
        <div className="flex gap-2 justify-end">
            {canUpdate && row.original.status === 'active' && (
                <Button variant="outline" size="xs" onClick={() => onRotate(row.original.id)}>
                    <RotateCcw className="mr-1 h-4 w-4" /> <Trans>Rotate</Trans>
                </Button>
            )}
            {canUpdate && row.original.status === 'active' && (
                <Button variant="destructive" size="xs" onClick={() => onRevoke(row.original.id)}>
                    <Trash2 className="mr-1 h-4 w-4" /> <Trans>Revoke</Trans>
                </Button>
            )}
            {canUpdate && (
                <Button variant="ghost" size="xs" onClick={() => onInvalidate(row.original.id)}>
                    <RefreshCcw className="mr-1 h-4 w-4" /> <Trans>Invalidate Sessions</Trans>
                </Button>
            )}
        </div>
    );
}

/**
 * Lists and manages API keys for a service account.
 * Shows raw secret only once in a dialog on create/rotate.
 * @since 3.5.0
 */
export function ApiKeysPanel({ administratorId, createDialogOpen = false, onCreateDialogOpenChange }: Readonly<ApiKeysPanelProps>) {
    const { hasPermissions } = usePermissions();
    const canUpdate = hasPermissions(['UpdateServiceAccount']);
    // Subscribe to locale changes for <Trans> without using the i18n object directly
    useLingui();

    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [rawKey, setRawKey] = React.useState<string | null>(null);
    const [newKeyName, setNewKeyName] = React.useState('');
    const [expiresValue, setExpiresValue] = React.useState<string | Date | null>(null);
    const [expiresMode, setExpiresMode] = React.useState<'7' | '30' | '60' | '90' | '180' | 'custom' | 'none'>('none');
    const [confirm, setConfirm] = React.useState<ConfirmState>(null);
    const [confirmInput, setConfirmInput] = React.useState('');
    React.useEffect(() => {
        setConfirmInput('');
    }, [confirm?.id, confirm?.type]);

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['api-keys', administratorId, page, pageSize],
        queryFn: () =>
            api.query(apiKeyListDocument, {
                administratorId,
                options: { skip: (page - 1) * pageSize, take: pageSize },
            }),
    });

    // Clear inputs when opening the create dialog
    React.useEffect(() => {
        if (createDialogOpen) {
            setNewKeyName('');
            setExpiresValue(null);
            setExpiresMode('none');
        }
    }, [createDialogOpen]);

    const createMutation = useMutation({
        mutationFn: (vars: { administratorId: string; name: string; expiresAt?: string }) =>
            api.mutate(createApiKeyDocument, {
                administratorId: vars.administratorId,
                name: vars.name,
                // Send ISO string to ensure consistent DateTime serialization
                expiresAt: expiresValue ? new Date(expiresValue as any).toISOString() : undefined,
            }),
        onSuccess: result => {
            const secret = result.createApiKey.rawKey;
            setRawKey(secret);
            onCreateDialogOpenChange?.(false);
            refetch();
            // Reset inputs after successful create
            setNewKeyName('');
            setExpiresValue(null);
        },
        onError: (err: any) => {
            const message = err?.message || 'Failed to create API Key';
            toast.error(message);
        },
    });

    const rotateMutation = useMutation({
        mutationFn: (id: string) => api.mutate(rotateApiKeyDocument, { id }),
        onSuccess: res => {
            setRawKey(res.rotateApiKey.rawKey);
            refetch();
        },
    });

    const revokeMutation = useMutation({
        mutationFn: (id: string) => api.mutate(revokeApiKeyDocument, { id }),
        onSuccess: () => {
            refetch();
        },
    });

    const invalidateMutation = useMutation({
        mutationFn: (id: string) => api.mutate(invalidateApiKeySessionsDocument, { id }),
        onSuccess: res => {
            const count = res.invalidateApiKeySessions ?? 0;
            // eslint-disable-next-line no-console
            console.info('Invalidated sessions', { count });
        },
    });

    const items = data?.apiKeys.items ?? [];
    const duplicateActiveName = React.useMemo(() => {
        const name = newKeyName.trim().toLowerCase();
        if (!name) return false;
        return items.some(k => (k.status === 'active') && (k.name?.trim().toLowerCase() === name));
    }, [newKeyName, items]);
    const totalItems = data?.apiKeys.totalItems ?? 0;

    const columns: ColumnDef<(typeof items)[number]>[] = [
        { accessorKey: 'name', header: () => <Trans>Name</Trans> },
        { accessorKey: 'prefix', header: () => <Trans>Prefix</Trans> },
        {
            accessorKey: 'status',
            header: () => <Trans>Status</Trans>,
            cell: ({ getValue }) => {
                const v = getValue() as string;
                const variant = v === 'active' ? 'default' : 'destructive';
                return <Badge variant={variant as any}>{v}</Badge>;
            },
        },
        { accessorKey: 'expiresAt', header: () => <Trans>Expires</Trans>, cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : '—') },
        { accessorKey: 'lastUsedAt', header: () => <Trans>Last used</Trans>, cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : '—') },
        { accessorKey: 'createdAt', header: () => <Trans>Created</Trans>, cell: ({ getValue }) => new Date(getValue() as string).toLocaleString() },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <ActionCell
                    row={row}
                    canUpdate={canUpdate}
                    onRotate={id => setConfirm({ type: 'rotate', id })}
                    onRevoke={id => setConfirm({ type: 'revoke', id })}
                    onInvalidate={id => setConfirm({ type: 'invalidate', id })}
                />
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Actions moved to PageBlock title via parent. This spacer remains minimal when needed. */}
            <DataTable
                columns={columns}
                data={items}
                totalItems={totalItems}
                isLoading={isFetching}
                page={page}
                itemsPerPage={pageSize}
                onPageChange={(_, p, per) => { setPage(p); setPageSize(per); }}
                onRefresh={() => {
                    refetch();
                }}
            />

            {/* Confirm dialog for rotate/revoke/invalidate */}
            <Dialog open={!!confirm} onOpenChange={open => !open && setConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirm?.type === 'rotate' && <Trans>Rotate API Key?</Trans>}
                            {confirm?.type === 'revoke' && <Trans>Revoke API Key?</Trans>}
                            {confirm?.type === 'invalidate' && <Trans>Invalidate Sessions?</Trans>}
                        </DialogTitle>
                        <DialogDescription>
                            {confirm?.type === 'rotate' && (
                                <Trans>This will revoke the current key and create a new one. The old key will no longer work.</Trans>
                            )}
                            {confirm?.type === 'revoke' && (
                                <Trans>This will revoke the key and invalidate all sessions created with it.</Trans>
                            )}
                            {confirm?.type === 'invalidate' && (
                                <Trans>This will invalidate all sessions created with this key but keep the key active.</Trans>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <ConfirmDialogBody
                        items={items}
                        confirm={confirm}
                        confirmInput={confirmInput}
                        setConfirmInput={setConfirmInput}
                        isPending={rotateMutation.isPending || revokeMutation.isPending || invalidateMutation.isPending}
                        onCancel={() => setConfirm(null)}
                        onConfirm={() => {
                            if (!confirm) return;
                            if (confirm.type === 'rotate') {
                                rotateMutation.mutate(confirm.id);
                            } else if (confirm.type === 'revoke') {
                                revokeMutation.mutate(confirm.id);
                            } else {
                                invalidateMutation.mutate(confirm.id);
                            }
                            setConfirm(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Create dialog */}
            <Dialog open={createDialogOpen} onOpenChange={onCreateDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><Trans>Create API Key</Trans></DialogTitle>
                        <DialogDescription><Trans>Generate a new Admin API key. The raw secret will be shown only once.</Trans></DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label><Trans>Name</Trans></Label>
                        <Input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                        {duplicateActiveName && (
                            <div className="text-xs text-destructive"><Trans>A key with this name already exists</Trans></div>
                        )}
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
                                            // leave as-is; user can pick with DateTimeInput
                                            if (!expiresValue) {
                                                setExpiresValue(now);
                                            }
                                            setExpiresMode('custom');
                                            break;
                                        case 'none':
                                        default:
                                            setExpiresValue(null);
                                            setExpiresMode('none');
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">7 days</SelectItem>
                                    <SelectItem value="30">30 days</SelectItem>
                                    <SelectItem value="60">60 days</SelectItem>
                                    <SelectItem value="90">90 days</SelectItem>
                                    <SelectItem value="180">180 days</SelectItem>
                                    <SelectItem value="custom">Custom date…</SelectItem>
                                    <SelectItem value="none">No expiration</SelectItem>
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
                            {expiresMode !== 'custom' && expiresMode !== 'none' && (
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {expiresValue ? new Date(expiresValue as any).toLocaleString() : null}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={() => onCreateDialogOpenChange?.(false)}><Trans>Cancel</Trans></Button>
                            <Button disabled={!newKeyName || duplicateActiveName || createMutation.isPending} onClick={() => createMutation.mutate({ administratorId, name: newKeyName })}><Trans>Create</Trans></Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Raw key dialog */}
            <Dialog open={!!rawKey} onOpenChange={open => !open && setRawKey(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><Trans>API key created</Trans></DialogTitle>
                        <DialogDescription><Trans>Copy and store this secret now. It cannot be shown again.</Trans></DialogDescription>
                    </DialogHeader>
                    {rawKey && (
                        <div className="space-y-3">
                            <Input readOnly value={rawKey} />
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(rawKey); }}>
                                    <CopyIcon className="mr-1 h-4 w-4"/> <Trans>Copy</Trans>
                                </Button>
                                <Button onClick={() => setRawKey(null)}><Trans>I’ve saved this key</Trans></Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
