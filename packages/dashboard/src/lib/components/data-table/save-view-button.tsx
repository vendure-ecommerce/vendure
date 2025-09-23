import { BookmarkPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { SaveViewDialog } from './save-view-dialog.js';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { isMatchingSavedView } from '../../utils/saved-views-utils.js';

interface SaveViewButtonProps {
    filters: ColumnFiltersState;
    searchTerm?: string;
    disabled?: boolean;
}

export const SaveViewButton: React.FC<SaveViewButtonProps> = ({
    filters,
    searchTerm,
    disabled,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { userViews, globalViews } = useSavedViews();

    const hasFilters = filters.length > 0 || (searchTerm && searchTerm.length > 0);
    const matchesExistingView = isMatchingSavedView(filters, searchTerm || '', userViews, globalViews);

    // Don't show the button if there are no filters or if filters match an existing saved view
    if (!hasFilters || matchesExistingView) {
        return null;
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                disabled={disabled}
            >
                <BookmarkPlus className="h-4 w-4 mr-1" />
                Save View
            </Button>
            <SaveViewDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                filters={filters}
                searchTerm={searchTerm}
            />
        </>
    );
};