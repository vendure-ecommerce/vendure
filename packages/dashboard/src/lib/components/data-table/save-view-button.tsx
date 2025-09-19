import { BookmarkPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { SaveViewDialog } from './save-view-dialog.js';
import { ColumnFiltersState } from '@tanstack/react-table';

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

    const hasFilters = filters.length > 0 || (searchTerm && searchTerm.length > 0);

    if (!hasFilters) {
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