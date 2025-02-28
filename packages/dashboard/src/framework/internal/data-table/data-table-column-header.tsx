import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import { DataTableFilterDialog } from '@/framework/internal/data-table/data-table-filter-dialog.js';
import { FieldInfo } from '@/framework/internal/document-introspection/get-document-structure.js';
import { Trans } from '@lingui/react/macro';
import { ColumnDef, HeaderContext } from '@tanstack/table-core';
import { ArrowDown, ArrowUp, ArrowUpDown, EllipsisVertical, Filter } from 'lucide-react';
import React from 'react';

export interface DataTableColumnHeaderProps {
    customConfig: Partial<ColumnDef<any>>;
    headerContext: HeaderContext<any, any>;
}

export function DataTableColumnHeader({ headerContext, customConfig }: DataTableColumnHeaderProps) {
    const { column } = headerContext;
    const isSortable = column.getCanSort();
    const isFilterable = column.getCanFilter();

    const customHeader = customConfig.header;
    let display = column.id;
    if (typeof customHeader === 'function') {
        display = customHeader(headerContext);
    } else if (typeof customHeader === 'string') {
        display = customHeader;
    }

    const columSort = column.getIsSorted();
    const columnFilter = column.getFilterValue();
    const nextSort = columSort === 'asc' ? true : columSort === 'desc' ? undefined : false;
    return (
        <div className="flex items-center">
            <div>{display}</div>
            {isSortable && (
                <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(nextSort)}>
                    {columSort === 'desc' ? (
                        <ArrowUp />
                    ) : columSort === 'asc' ? (
                        <ArrowDown />
                    ) : (
                        <ArrowUpDown className="opacity-50" />
                    )}
                </Button>
            )}
            {isFilterable && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <Filter className={columnFilter ? '' : 'opacity-50'} />
                        </Button>
                    </DialogTrigger>
                    <DataTableFilterDialog column={column} />
                </Dialog>
            )}
        </div>
    );
}
