import { Button } from '@/vdb/components/ui/button.js';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/vdb/components/ui/sheet.js';
import { PageBlockContext } from '@/vdb/framework/layout-engine/page-block-provider.js';
import { PageContext } from '@/vdb/framework/layout-engine/page-provider.js';
import { Trans } from '@lingui/react/macro';
import { PanelLeftOpen } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';
import { FacetValuesTable } from './facet-values-table.js';

interface FacetValuesSheetContextValue {
    openSheet: (facetId: string, facetName: string) => void;
}

const FacetValuesSheetContext = createContext<FacetValuesSheetContextValue | null>(null);

export function FacetValuesSheetProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [facetId, setFacetId] = useState<string | null>(null);
    const [facetName, setFacetName] = useState<string>('');

    const openSheet = useCallback((id: string, name: string) => {
        setFacetId(id);
        setFacetName(name);
        setOpen(true);
    }, []);

    return (
        <FacetValuesSheetContext.Provider value={{ openSheet }}>
            {children}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="w-[90vw] max-w-[800px] sm:max-w-[800px]">
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
                    <PageContext.Provider value={{ pageId: 'facet-values-sheet' }}>
                        <PageBlockContext.Provider value={{ blockId: 'facet-values-sheet-block', column: 'main' }}>
                            <div className="px-4">
                                {facetId && <FacetValuesTable facetId={facetId} />}
                            </div>
                        </PageBlockContext.Provider>
                    </PageContext.Provider>
                </SheetContent>
            </Sheet>
        </FacetValuesSheetContext.Provider>
    );
}

export interface FacetValuesSheetTriggerProps {
    facetName: string;
    facetId: string;
    children?: React.ReactNode;
}

export function FacetValuesSheetTrigger({ facetName, facetId, children }: Readonly<FacetValuesSheetTriggerProps>) {
    const context = useContext(FacetValuesSheetContext);

    return (
        <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={event => {
                event.stopPropagation();
                context?.openSheet(facetId, facetName);
            }}
        >
            {children}
            <PanelLeftOpen className="w-4 h-4" />
        </Button>
    );
}

export { FacetValuesSheetTrigger as FacetValuesSheet };
