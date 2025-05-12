import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet.js';
import { Trans } from '@/lib/trans.js';
import { PanelLeftOpen } from 'lucide-react';
import { CollectionContentsTable } from './collection-contents-table.js';
import { Button } from '@/components/ui/button.js';

export interface CollectionContentsSheetProps {
    collectionId: string;
    collectionName: string;
    children?: React.ReactNode;
}

export function CollectionContentsSheet({ collectionId, collectionName, children }: CollectionContentsSheetProps) {
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
                        <Trans>Collection contents for {collectionName}</Trans>
                    </SheetTitle>
                    <SheetDescription>
                        <Trans>
                            This is the contents of the <strong>{collectionName}</strong> collection.
                        </Trans>
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <CollectionContentsTable collectionId={collectionId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
