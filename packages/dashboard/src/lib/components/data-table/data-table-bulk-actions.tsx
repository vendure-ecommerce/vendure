import { useAllBulkActions } from '@/vdb/components/data-table/use-all-bulk-actions.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { useFloatingBulkActions } from '@/vdb/hooks/use-floating-bulk-actions.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>;
    bulkActions: BulkAction[];
}

export function DataTableBulkActions<TData>({
    table,
    bulkActions,
}: Readonly<DataTableBulkActionsProps<TData>>) {
    const allBulkActions = useAllBulkActions(bulkActions);

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

    const { position, shouldShow } = useFloatingBulkActions({
        selectionCount: selection.length,
        containerSelector: '[data-table-root], .data-table-container, table',
        bottomOffset: 40,
    });

    if (!shouldShow) {
        return null;
    }

    return (
        <div
            className="flex items-center gap-4 px-8 py-2 animate-in fade-in duration-200 fixed transform -translate-x-1/2 bg-white shadow-2xl rounded-md border z-50"
            style={{
                height: 'auto',
                maxHeight: '60px',
                bottom: position.bottom,
                left: position.left,
            }}
        >
            <span className="text-sm text-muted-foreground">
                <Trans>{selection.length} selected</Trans>
            </span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 shadow-none">
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
