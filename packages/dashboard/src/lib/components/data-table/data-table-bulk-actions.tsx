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
import { useRef, useEffect, useState } from 'react';

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>;
    bulkActions: BulkAction[];
}

export function DataTableBulkActions<TData>({
    table,
    bulkActions,
}: Readonly<DataTableBulkActionsProps<TData>>) {
    const { pageId } = usePage();
    const pageBlock = usePageBlock();
    const blockId = pageBlock?.blockId;

    // Cache to store selected items across page changes
    const selectedItemsCache = useRef<Map<string, TData>>(new Map());
    const selectedRowIds = Object.keys(table.getState().rowSelection);
    const tableRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ bottom: '2.5rem', left: '50%' });
    const [isPositioned, setIsPositioned] = useState(false);

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

    useEffect(() => {
        if (selection.length === 0) return;

        const updatePosition = () => {
            // Find the table container (look for common table container classes)
            const tableContainer = document.querySelector('[data-table-root], .data-table-container, table')?.closest('div') as HTMLElement;
            if (!tableContainer) return;

            const containerRect = tableContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if container bottom is visible in viewport
            const containerBottom = containerRect.bottom;
            const isContainerFullyVisible = containerBottom <= viewportHeight - 80; // 80px buffer for the menu
            
            if (isContainerFullyVisible) {
                // Position relative to container bottom
                const containerLeft = containerRect.left;
                const containerWidth = containerRect.width;
                const centerX = containerLeft + (containerWidth / 2);
                
                setPosition({
                    bottom: `${viewportHeight - containerBottom + 40}px`,
                    left: `${centerX}px`
                });
            } else {
                // Position relative to viewport bottom, centered in container
                const containerLeft = containerRect.left;
                const containerWidth = containerRect.width;
                const centerX = containerLeft + (containerWidth / 2);
                
                setPosition({
                    bottom: '2.5rem',
                    left: `${centerX}px`
                });
            }
            
            setIsPositioned(true);
        };

        updatePosition();
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [selection.length]);

    if (selection.length === 0) {
        return null;
    }
    
    if (!isPositioned) {
        return null;
    }
    const extendedBulkActions = pageId ? getBulkActions(pageId, blockId) : [];
    const allBulkActions = [...extendedBulkActions, ...(bulkActions ?? [])];
    allBulkActions.sort((a, b) => (a.order ?? 10_000) - (b.order ?? 10_000));

    return (
        <div
            className="flex items-center gap-4 px-8 py-2 animate-in fade-in duration-200 fixed transform -translate-x-1/2 bg-white shadow-2xl rounded-md border z-50"
            style={{ 
                height: 'auto', 
                maxHeight: '60px',
                bottom: position.bottom,
                left: position.left
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
