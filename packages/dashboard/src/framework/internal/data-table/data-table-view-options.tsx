'use client';

import { Badge } from '@/components/ui/badge.js';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';
import { CircleX, Cross, Filter, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu.js';

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
    const columnFilters = table.getState().columnFilters;
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {columnFilters.map(f => {
                    const [operator, value] = Object.entries(f.value as Record<string, string>)[0];
                    return (
                        <Badge key={f.id} className="flex gap-1 items-center" variant="secondary">
                            <Filter size="12" className="opacity-50" />
                            <div>{f.id}</div>
                            <div>{operator}</div>
                            <div>{value}</div>
                            <button
                                className="cursor-pointer"
                                onClick={() => table.setColumnFilters(old => old.filter(x => x.id !== f.id))}
                            >
                                <CircleX size="14" />
                            </button>
                        </Badge>
                    );
                })}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                        <Settings2 />
                        View
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                        .getAllColumns()
                        .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                        .map(column => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={value => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
