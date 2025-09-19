import { ColumnFiltersState } from '@tanstack/react-table';
import { Bookmark } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.js';
import { Trans } from '@/vdb/lib/trans.js';
import { UserViewsSheet } from './user-views-sheet.js';

interface MyViewsButtonProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

export const MyViewsButton: React.FC<MyViewsButtonProps> = ({ onApplyView }) => {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setSheetOpen(true)}>
                        <Bookmark />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Trans>My saved views</Trans>
                </TooltipContent>
            </Tooltip>
            <UserViewsSheet open={sheetOpen} onOpenChange={setSheetOpen} onApplyView={onApplyView} />
        </>
    );
};
