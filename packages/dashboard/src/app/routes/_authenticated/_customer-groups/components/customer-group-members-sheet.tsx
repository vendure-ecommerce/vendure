import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet.js';
import { Trans } from '@/lib/trans.js';
import { PanelLeftOpen } from 'lucide-react';
import { CustomerGroupMembersTable } from './customer-group-members-table.js';
import { Button } from '@/components/ui/button.js';

export interface CustomerGroupMembersSheetProps {
    customerGroupName: string;
    customerGroupId: string;
    children?: React.ReactNode;
}

export function CustomerGroupMembersSheet({ customerGroupName, customerGroupId, children }: CustomerGroupMembersSheetProps) {
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
                        <Trans>Customer group members for {customerGroupName}</Trans>
                    </SheetTitle>
                    <SheetDescription>
                        <Trans>These are the customers in the <strong>{customerGroupName}</strong> customer group.</Trans>
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <CustomerGroupMembersTable customerGroupId={customerGroupId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
