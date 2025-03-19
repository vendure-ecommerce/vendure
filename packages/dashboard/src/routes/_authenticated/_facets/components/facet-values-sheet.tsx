import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet.js';
import { Trans } from '@lingui/react/macro';
import { PanelLeftOpen } from 'lucide-react';
import { FacetValuesTable } from './facet-values-table.js';

export interface FacetValuesSheetProps {
    facetName: string;
    facetId: string;
}

export function FacetValuesSheet({ facetName, facetId }: FacetValuesSheetProps) {
    return (
        <Sheet>
            <SheetTrigger>
                <PanelLeftOpen className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent className="min-w-[90vw] lg:min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>
                        <Trans>Facet values for {facetName}</Trans>
                    </SheetTitle>
                        <FacetValuesTable facetId={facetId} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
