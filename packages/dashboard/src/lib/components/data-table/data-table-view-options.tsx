'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from '@tanstack/react-table';
import { GripVertical, Settings2 } from 'lucide-react';

import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-.5">
            <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            {children}
        </div>
    );
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
    const { setTableSettings } = useUserSettings();
    const page = usePage();
    const columns = table
        .getAllColumns()
        .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide());

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);
            // update the column order in the `columns` array
            const newColumns = [...columns];
            newColumns.splice(overIndex, 0, newColumns.splice(activeIndex, 1)[0]);
            if (page?.pageId) {
                setTableSettings(
                    page.pageId,
                    'columnOrder',
                    newColumns.map(col => col.id),
                );
            }
        }
    };

    const handleReset = () => {
        if (page?.pageId) {
            setTableSettings(page.pageId, 'columnOrder', undefined);
            setTableSettings(page.pageId, 'columnVisibility', undefined);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto hidden h-8 lg:flex">
                        <Settings2 />
                        <Trans>Columns</Trans>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="overflow-auto">
                    <ScrollArea className="max-h-[60vh]" type="always">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={columns.map(col => col.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {columns.map(column => (
                                    <SortableItem key={column.id} id={column.id}>
                                        <DropdownMenuCheckboxItem
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={value => column.toggleVisibility(!!value)}
                                            onSelect={e => e.preventDefault()}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleReset}>Reset</DropdownMenuItem>
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
