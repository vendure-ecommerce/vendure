import { Bookmark } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.js';
import { Trans } from '@lingui/react/macro';
import { UserViewsSheet } from './user-views-sheet.js';
import { useSavedViews } from '../../hooks/use-saved-views.js';
import { findMatchingSavedView } from '../../utils/saved-views-utils.js';
import { useDataTableContext } from './data-table-context.js';

export const MyViewsButton: React.FC = () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const { userViews } = useSavedViews();
    const { columnFilters, searchTerm, handleApplyView } = useDataTableContext();

    // Find the active view using centralized utility
    const activeView = useMemo(() => {
        return findMatchingSavedView(columnFilters, searchTerm, userViews);
    }, [userViews, columnFilters, searchTerm]);

    return (
        <>
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={activeView ? 'default' : 'outline'}
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
            <UserViewsSheet open={sheetOpen} onOpenChange={setSheetOpen} />
        </>
    );
};
