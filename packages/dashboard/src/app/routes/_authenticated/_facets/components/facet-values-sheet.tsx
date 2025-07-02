import { Button } from '@/vdb/components/ui/button.js';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/vdb/components/ui/sheet.js';
import { Trans } from '@/vdb/lib/trans.js';
import { PanelLeftOpen } from 'lucide-react';
import { FacetValuesTable } from './facet-values-table.js';

export interface FacetValuesSheetProps {
    facetName: string;
    facetId: string;
    children?: React.ReactNode;
}

export function FacetValuesSheet({ facetName, facetId, children }: Readonly<FacetValuesSheetProps>) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    {children}
                    <PanelLeftOpen className="w-4 h-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[90vw] lg:min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>
                        <Trans>Facet values for {facetName}</Trans>
                    </SheetTitle>
                    <SheetDescription>
                        <Trans>
                            These are the facet values for the <strong>{facetName}</strong> facet.
                        </Trans>
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <FacetValuesTable facetId={facetId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
