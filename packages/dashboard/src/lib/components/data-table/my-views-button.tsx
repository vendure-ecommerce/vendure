import { Bookmark } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { UserViewsSheet } from './user-views-sheet.js';
import { ColumnFiltersState } from '@tanstack/react-table';

interface MyViewsButtonProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

export const MyViewsButton: React.FC<MyViewsButtonProps> = ({ onApplyView }) => {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setSheetOpen(true)}
            >
                <Bookmark className="h-4 w-4 mr-1" />
                My Views
            </Button>
            <UserViewsSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onApplyView={onApplyView}
            />
        </>
    );
};