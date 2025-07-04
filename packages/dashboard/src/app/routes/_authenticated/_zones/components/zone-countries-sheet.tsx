import { Button } from '@/vdb/components/ui/button.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/vdb/components/ui/sheet.js';
import { ZoneCountriesTable } from './zone-countries-table.js';

interface ZoneCountriesSheetProps {
    zoneId: string;
    zoneName: string;
    children?: React.ReactNode;
}

export function ZoneCountriesSheet({ zoneId, zoneName, children }: Readonly<ZoneCountriesSheetProps>) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    {children}
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>{zoneName}</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-2"></div>
                <ScrollArea className="px-6 max-h-[600px]">
                    <ZoneCountriesTable zoneId={zoneId} />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
