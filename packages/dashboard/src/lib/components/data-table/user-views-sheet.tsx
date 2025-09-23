import { Copy, Edit, Globe, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { useDataTableContext } from './data-table-context.js';
import { Button } from '../ui/button.js';
import { Input } from '../ui/input.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu.js';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '../ui/sheet.js';
import { SavedView } from '../../types/saved-views.js';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';

interface UserViewsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserViewsSheet: React.FC<UserViewsSheetProps> = ({ open, onOpenChange }) => {
    const { userViews, deleteView, updateView, duplicateView, canManageGlobalViews } = useSavedViews();
    const { handleApplyView } = useDataTableContext();
    const { i18n } = useLingui();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleViewApply = (view: SavedView) => {
        handleApplyView(view.filters, view.searchTerm);
        toast.success(i18n.t(`Applied view "${view.name}"`));
    };

    const handleStartEdit = (view: SavedView) => {
        setEditingId(view.id);
        setEditingName(view.name);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingName.trim()) return;

        try {
            await updateView({ id: editingId, name: editingName.trim() });
            toast.success(i18n.t('View renamed successfully'));
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            toast.error(i18n.t('Failed to rename view'));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleDelete = async () => {
        if (!deleteConfirmId) return;

        try {
            await deleteView(deleteConfirmId);
            toast.success(i18n.t('View deleted successfully'));
            setDeleteConfirmId(null);
        } catch (error) {
            toast.error(i18n.t('Failed to delete view'));
        }
    };

    const handleDuplicate = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'user');
            toast.success(i18n.t('View duplicated successfully'));
        } catch (error) {
            toast.error(i18n.t('Failed to duplicate view'));
        }
    };

    const handleConvertToGlobal = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'global');
            await deleteView(view.id);
            toast.success(i18n.t('View converted to global successfully'));
        } catch (error) {
            toast.error(i18n.t('Failed to convert view to global'));
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle><Trans>My Saved Views</Trans></SheetTitle>
                        <SheetDescription>
                            <Trans>Manage your personal saved views for this table</Trans>
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                        {userViews.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p><Trans>You haven't saved any views yet.</Trans></p>
                                <p className="text-sm mt-2">
                                    <Trans>Apply filters to the table and click "Save View" to get started.</Trans>
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {userViews.map(view => (
                                    <div
                                        key={view.id}
                                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-accent/50 transition-colors rounded-md px-2"
                                    >
                                        {editingId === view.id ? (
                                            <div className="flex items-center gap-2 flex-1">
                                                <Input
                                                    value={editingName}
                                                    onChange={e => setEditingName(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') handleSaveEdit();
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    autoFocus
                                                    className="flex-1"
                                                />
                                                <Button size="sm" onClick={handleSaveEdit}>
                                                    <Trans>Save</Trans>
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                                    <Trans>Cancel</Trans>
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="font-medium text-sm truncate flex-1">{view.name}</span>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleViewApply(view)}
                                                    >
                                                        <Trans>Apply</Trans>
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleStartEdit(view)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                <Trans>Rename</Trans>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicate(view)}>
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                <Trans>Duplicate</Trans>
                                                            </DropdownMenuItem>
                                                            {canManageGlobalViews && (
                                                                <DropdownMenuItem onClick={() => handleConvertToGlobal(view)}>
                                                                    <Globe className="h-4 w-4 mr-2" />
                                                                    <Trans>Make Global</Trans>
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteConfirmId(view.id)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                <Trans>Delete</Trans>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle><Trans>Delete View</Trans></AlertDialogTitle>
                        <AlertDialogDescription>
                            <Trans>Are you sure you want to delete this view? This action cannot be undone.</Trans>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel><Trans>Cancel</Trans></AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}><Trans>Delete</Trans></AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};