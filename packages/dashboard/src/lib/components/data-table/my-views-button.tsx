import { ColumnFiltersState } from '@tanstack/react-table';
import { Bookmark } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.js';
import { Trans } from '@/vdb/lib/trans.js';
import { UserViewsSheet } from './user-views-sheet.js';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { findMatchingSavedView } from '../../utils/saved-views-utils.js';

interface MyViewsButtonProps {
    onApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
    currentFilters?: ColumnFiltersState;
    currentSearchTerm?: string;
}

export const MyViewsButton: React.FC<MyViewsButtonProps> = ({
    onApplyView,
    currentFilters = [],
    currentSearchTerm = ''
}) => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const { userViews } = useSavedViews();

    // Find the active view using centralized utility
    const activeView = useMemo(() => {
        return findMatchingSavedView(currentFilters, currentSearchTerm, userViews);
    }, [userViews, currentFilters, currentSearchTerm]);

    return (
        <>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={activeView ? "default" : "outline"}
                            size="icon"
                            onClick={() => setSheetOpen(true)}
                        >
                            <Bookmark />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Trans>My saved views</Trans>
                    </TooltipContent>
                </Tooltip>
                {activeView && (
                    <span className="text-sm text-muted-foreground">
                        {activeView.name}
                    </span>
                )}
            </div>
            <UserViewsSheet open={sheetOpen} onOpenChange={setSheetOpen} onApplyView={onApplyView} />
        </>
    );
};
