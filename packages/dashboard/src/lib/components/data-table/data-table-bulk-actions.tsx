'use client';

import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { ChevronDown, Users } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Trans } from '@/lib/trans.js';

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>;
    selectedRows: number;
}

export function DataTableBulkActions<TData>({ table, selectedRows }: DataTableBulkActionsProps<TData>) {
    if (selectedRows === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md border">
            <span className="text-sm text-muted-foreground">
                <Trans>{selectedRows} selected</Trans>
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                        <Trans>With selected...</Trans>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <Trans>Bulk action 1</Trans>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <Trans>Bulk action 2</Trans>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <Trans>Bulk action 3</Trans>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 