import { ColumnFiltersState } from '@tanstack/react-table';
import { Bookmark } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { UserViewsSheet } from './user-views-sheet.js';

interface MyViewsButtonProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

export const MyViewsButton: React.FC<MyViewsButtonProps> = ({ onApplyView }) => {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Button variant="outline" size="icon" onClick={() => setSheetOpen(true)}>
                <Bookmark />
            </Button>
            <UserViewsSheet open={sheetOpen} onOpenChange={setSheetOpen} onApplyView={onApplyView} />
        </>
    );
};
