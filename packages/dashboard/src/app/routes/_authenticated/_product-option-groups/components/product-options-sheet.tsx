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

import { ProductOptionsTable } from './product-options-table.js';

export interface ProductOptionsSheetProps {
    groupName: string;
    groupId: string;
    children?: React.ReactNode;
}

export function ProductOptionsSheet({ groupName, groupId, children }: Readonly<ProductOptionsSheetProps>) {
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
                        <Trans>Product options for {groupName}</Trans>
                    </SheetTitle>
                    <SheetDescription>
                        <Trans>
                            These are the product options for the <strong>{groupName}</strong> product option group.
                        </Trans>
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <ProductOptionsTable groupId={groupId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
