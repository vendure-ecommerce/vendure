import { Copy, Edit, Globe, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { Button } from '../ui/button.js';
import { Input } from '../ui/input.js';
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

interface UserViewsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

export const UserViewsSheet: React.FC<UserViewsSheetProps> = ({
    open,
    onOpenChange,
    onApplyView,
}) => {
    const { userViews, deleteView, updateView, duplicateView, canManageGlobalViews } = useSavedViews();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleApplyView = (view: SavedView) => {
        onApplyView(view.filters, view.searchTerm);
        toast.success(`Applied view "${view.name}"`);
    };

    const handleStartEdit = (view: SavedView) => {
        setEditingId(view.id);
        setEditingName(view.name);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingName.trim()) return;

        try {
            await updateView({ id: editingId, name: editingName.trim() });
            toast.success('View renamed successfully');
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            toast.error('Failed to rename view');
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
            toast.success('View deleted successfully');
            setDeleteConfirmId(null);
        } catch (error) {
            toast.error('Failed to delete view');
        }
    };

    const handleDuplicate = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'user');
            toast.success('View duplicated successfully');
        } catch (error) {
            toast.error('Failed to duplicate view');
        }
    };

    const handleConvertToGlobal = async (view: SavedView) => {
        try {
            await duplicateView(view.id, 'global');
            await deleteView(view.id);
            toast.success('View converted to global successfully');
        } catch (error) {
            toast.error('Failed to convert view to global');
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>My Saved Views</SheetTitle>
                        <SheetDescription>
                            Manage your personal saved views for this table
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        {userViews.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>You haven't saved any views yet.</p>
                                <p className="text-sm mt-2">
                                    Apply filters to the table and click "Save View" to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {userViews.map(view => (
                                    <div
                                        key={view.id}
                                        className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        {editingId === view.id ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editingName}
                                                    onChange={e => setEditingName(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') handleSaveEdit();
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    autoFocus
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
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{view.name}</h4>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApplyView(view)}
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleStartEdit(view)}
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Rename
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDuplicate(view)}
                                                    >
                                                        <Copy className="h-3 w-3 mr-1" />
                                                        Duplicate
                                                    </Button>
                                                    {canManageGlobalViews && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleConvertToGlobal(view)}
                                                        >
                                                            <Globe className="h-3 w-3 mr-1" />
                                                            Make Global
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setDeleteConfirmId(view.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
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
                        <AlertDialogTitle>Delete View</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this view? This action cannot be undone.
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