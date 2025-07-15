import { Button } from '@/vdb/components/ui/button.js';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Column } from '@tanstack/react-table';
import { useState } from 'react';
import { DataTableBooleanFilter } from './filters/data-table-boolean-filter.js';
import { DataTableDateTimeFilter } from './filters/data-table-datetime-filter.js';
import { DataTableIdFilter } from './filters/data-table-id-filter.js';
import { DataTableNumberFilter } from './filters/data-table-number-filter.js';
import { DataTableStringFilter } from './filters/data-table-string-filter.js';
import { ColumnDataType } from './types.js';

export interface DataTableFilterDialogProps {
    column: Column<any>;
}

export function DataTableFilterDialog({ column }: Readonly<DataTableFilterDialogProps>) {
    const columnFilter = column.getFilterValue() as Record<string, string> | undefined;
    const [filter, setFilter] = useState(columnFilter);

    const columnDataType = (column.columnDef.meta as any)?.fieldInfo?.type as ColumnDataType;
    const columnId = column.id;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <Trans>Filter by {columnId}</Trans>
                </DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            {columnDataType === 'String' ? (
                <DataTableStringFilter value={filter} onChange={e => setFilter(e)} />
            ) : columnDataType === 'Int' || columnDataType === 'Float' ? (
                <DataTableNumberFilter value={filter} onChange={e => setFilter(e)} mode="number" />
            ) : columnDataType === 'DateTime' ? (
                <DataTableDateTimeFilter value={filter} onChange={e => setFilter(e)} />
            ) : columnDataType === 'Boolean' ? (
                <DataTableBooleanFilter value={filter} onChange={e => setFilter(e)} />
            ) : columnDataType === 'ID' ? (
                <DataTableIdFilter value={filter} onChange={e => setFilter(e)} />
            ) : columnDataType === 'Money' ? (
                <DataTableNumberFilter value={filter} onChange={e => setFilter(e)} mode="money" />
            ) : null}
            <DialogFooter className="sm:justify-end">
                {columnFilter && (
                    <Button type="button" variant="secondary" onClick={e => column.setFilterValue(undefined)}>
                        <Trans>Clear filter</Trans>
                    </Button>
                )}
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            column.setFilterValue(filter);
                            setFilter(undefined);
                        }}
                    >
                        <Trans>Apply filter</Trans>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
