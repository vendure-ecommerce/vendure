import { Button } from '@/components/ui/button.js';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { Trans } from '@/lib/trans.js';
import { Column } from '@tanstack/react-table';
import React, { useState } from 'react';

export interface DataTableFilterDialogProps {
    column: Column<any>;
}

const STRING_OPERATORS = ['eq', 'notEq', 'contains', 'notContains', 'in', 'notIn', 'regex', 'isNull'];

export function DataTableFilterDialog({ column }: DataTableFilterDialogProps) {
    const columnFilter = column.getFilterValue() as Record<string, string> | undefined;
    const [initialOperator, initialValue] = columnFilter ? Object.entries(columnFilter as any)[0] : [];
    const [operator, setOperator] = useState<string>(initialOperator ?? 'contains');
    const [value, setValue] = useState((initialValue as string) ?? '');
    const columnId = column.id;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <Trans>Filter by {columnId}</Trans>
                </DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col md:flex-row gap-2">
                <Select value={operator} onValueChange={value => setOperator(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                        {STRING_OPERATORS.map(op => (
                            <SelectItem key={op} value={op}>
                                <Trans context="filter-operator">{op}</Trans>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Enter filter value..."
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </div>
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
                        onClick={e => column.setFilterValue({ [operator]: value })}
                    >
                        <Trans>Apply filter</Trans>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
