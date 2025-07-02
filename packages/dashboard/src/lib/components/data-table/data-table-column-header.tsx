import { Button } from '@/vdb/components/ui/button.js';
import { camelCaseToTitleCase } from '@/vdb/lib/utils.js';
import { ColumnDef, HeaderContext } from '@tanstack/table-core';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface DataTableColumnHeaderProps {
    customConfig: Partial<ColumnDef<any>>;
    headerContext: HeaderContext<any, any>;
}

export function DataTableColumnHeader({ headerContext, customConfig }: Readonly<DataTableColumnHeaderProps>) {
    const { column } = headerContext;
    const isSortable = column.getCanSort();

    const customHeader = customConfig.header;
    let display = camelCaseToTitleCase(column.id);
    if (typeof customHeader === 'function') {
        display = customHeader(headerContext);
    } else if (typeof customHeader === 'string') {
        display = customHeader;
    }

    const columSort = column.getIsSorted();
    const nextSort = columSort === 'asc' ? true : columSort === 'desc' ? undefined : false;

    return (
        <div className="flex items-center">
            {isSortable && (
                <Button size="icon-sm" variant="ghost" onClick={() => column.toggleSorting(nextSort)}>
                    {columSort === 'desc' ? (
                        <ArrowUp />
                    ) : columSort === 'asc' ? (
                        <ArrowDown />
                    ) : (
                        <ArrowUpDown className="opacity-50" />
                    )}
                </Button>
            )}
            <div>{display}</div>
        </div>
    );
}
