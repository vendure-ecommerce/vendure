'use client';

import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { getBulkActions } from '@/vdb/framework/data-table/data-table-extensions.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { usePageBlock } from '@/vdb/hooks/use-page-block.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>;
    bulkActions: BulkAction[];
}

export function DataTableBulkActions<TData>({ table, bulkActions }: DataTableBulkActionsProps<TData>) {
    const { pageId } = usePage();
    const { blockId } = usePageBlock();

    // Cache to store selected items across page changes
    const selectedItemsCache = useRef<Map<string, TData>>(new Map());
    const selectedRowIds = Object.keys(table.getState().rowSelection);

    // Get selection from cache instead of trying to get from table
    const selection = selectedRowIds
        .map(key => {
            try {
                const row = table.getRow(key);
                if (row) {
                    selectedItemsCache.current.set(key, row.original);
                    return row.original;
                }
            } catch (error) {
                // ignore the error, it just means the row is not on the
                // current page.
            }
            if (selectedItemsCache.current.has(key)) {
                return selectedItemsCache.current.get(key);
            }
            return undefined;
        })
        .filter((item): item is TData => item !== undefined);

    if (selection.length === 0) {
        return null;
    }
    const extendedBulkActions = pageId ? getBulkActions(pageId, blockId) : [];
    const allBulkActions = [...extendedBulkActions, ...(bulkActions ?? [])];
    allBulkActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));

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
                    {allBulkActions.length > 0 ? (
                        allBulkActions.map((action, index) => (
                            <action.component
                                key={`bulk-action-${index}`}
                                selection={selection}
                                table={table}
                            />
                        ))
                    ) : (
                        <DropdownMenuItem className="text-muted-foreground" disabled>
                            <Trans>No actions available</Trans>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
