import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.js';
import { Trans } from '@/vdb/lib/trans.js';
import { GlobalViewsSheet } from './global-views-sheet.js';

export const ManageGlobalViewsButton: React.FC = () => {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon-sm" onClick={() => setSheetOpen(true)}>
                        <Settings />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Trans>Manage global views</Trans>
                </TooltipContent>
            </Tooltip>
            <GlobalViewsSheet open={sheetOpen} onOpenChange={setSheetOpen} />
        </>
    );
};
