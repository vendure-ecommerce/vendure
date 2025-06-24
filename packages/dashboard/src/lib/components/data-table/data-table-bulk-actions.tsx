'use client';

import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { Trans } from '@/lib/trans.js';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { BulkAction } from './data-table-types.js';

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>;
    bulkActions: BulkAction[];
}

export function DataTableBulkActions<TData>({ table, bulkActions }: DataTableBulkActionsProps<TData>) {
    const selection = Object.keys(table.getState().rowSelection).map(key => table.getRow(key).original);
    if (selection.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md border">
            <span className="text-sm text-muted-foreground">
                <Trans>{selection.length} selected</Trans>
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                        <Trans>With selected...</Trans>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {bulkActions.length > 0 ? bulkActions
                        ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((action, index) => (
                            <action.component
                                key={`bulk-action-${index}`}
                                selection={selection}
                                table={table}
                            />
                        )) : (
                        <DropdownMenuItem className='text-muted-foreground' disabled>
                            <Trans>No actions available</Trans>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
