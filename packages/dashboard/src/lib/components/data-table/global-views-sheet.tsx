import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useSavedViews } from '../../hooks/use-saved-views.js';
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

interface GlobalViewsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

export const GlobalViewsSheet: React.FC<GlobalViewsSheetProps> = ({
    open,
    onOpenChange,
    onApplyView,
}) => {
    const { globalViews, deleteView, updateView, duplicateView } = useSavedViews();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleApplyView = (view: SavedView) => {
        onApplyView(view.filters, view.searchTerm);
        toast.success(`Applied global view "${view.name}"`);
    };

    const handleStartEdit = (view: SavedView) => {
        setEditingId(view.id);
        setEditingName(view.name);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingName.trim()) return;

        try {
            await updateView({ id: editingId, name: editingName.trim() });
            toast.success('Global view renamed successfully');
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            toast.error('Failed to rename global view');
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
            toast.success('Global view deleted successfully');
            setDeleteConfirmId(null);
        } catch (error) {
            toast.error('Failed to delete global view');
        }
    };

    const handleDuplicate = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'global');
            toast.success('Global view duplicated successfully');
        } catch (error) {
            toast.error('Failed to duplicate global view');
        }
    };

    const handleConvertToUser = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'user');
            toast.success('Global view converted to personal view successfully');
        } catch (error) {
            toast.error('Failed to convert global view to personal view');
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>Manage Global Views</SheetTitle>
                        <SheetDescription>
                            Manage global saved views that are visible to all users
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                        {globalViews.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No global views have been created yet.</p>
                                <p className="text-sm mt-2">
                                    Save a view as "Global" to make it available to all users.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {globalViews.map(view => (
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
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="font-medium text-sm truncate flex-1">{view.name}</span>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApplyView(view)}
                                                    >
                                                        Apply
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
                                                                Rename
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicate(view)}>
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleConvertToUser(view)}>
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                Copy to Personal
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteConfirmId(view.id)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
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
                        <AlertDialogTitle>Delete Global View</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this global view? This action cannot be undone and will affect all users.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};