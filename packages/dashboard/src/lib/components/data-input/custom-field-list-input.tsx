import { Button } from '@/vdb/components/ui/button.js';
import { useLingui } from '@/vdb/lib/trans.js';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface CustomFieldListInputProps {
    field: ControllerRenderProps<any, any>;
    disabled?: boolean;
    renderInput: (index: number, inputField: ControllerRenderProps<any, any>) => React.ReactNode;
    defaultValue?: any;
}

interface SortableItemProps {
    id: string;
    index: number;
    item: any;
    disabled?: boolean;
    renderInput: (index: number, inputField: ControllerRenderProps<any, any>) => React.ReactNode;
    onRemove: (index: number) => void;
    onItemChange: (index: number, value: any) => void;
    field: ControllerRenderProps<any, any>;
}

function SortableItem({
    id,
    index,
    item,
    disabled,
    renderInput,
    onRemove,
    onItemChange,
    field,
}: Readonly<SortableItemProps>) {
    const { i18n } = useLingui();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        disabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-2 border rounded-md bg-gray-50 ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            {!disabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-gray-400 hover:text-gray-600"
                    title={i18n.t('Drag to reorder')}
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}

            <div className="flex-1">
                {renderInput(index, {
                    name: `${field.name}.${index}`,
                    value: item,
                    onChange: value => onItemChange(index, value),
                    onBlur: field.onBlur,
                    ref: field.ref,
                } as ControllerRenderProps<any, any>)}
            </div>

            {!disabled && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    title={i18n.t('Remove item')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

export function CustomFieldListInput({
    field,
    disabled,
    renderInput,
    defaultValue,
}: CustomFieldListInputProps) {
    const { i18n } = useLingui();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const items = field.value || [];
    const itemIds = items.map((_: any, index: number) => `item-${index}`);

    const handleAddItem = useCallback(() => {
        const newArray = [...items, defaultValue ?? ''];
        field.onChange(newArray);
    }, [items, defaultValue, field]);

    const handleRemoveItem = useCallback(
        (index: number) => {
            const newArray = items.filter((_: any, i: number) => i !== index);
            field.onChange(newArray);
        },
        [items, field],
    );

    const handleItemChange = useCallback(
        (index: number, value: any) => {
            const newArray = [...items];
            newArray[index] = value;
            field.onChange(newArray);
        },
        [items, field],
    );

    const [localItems, setLocalItems] = useState(field.value || []);

    useEffect(() => {
        setLocalItems(field.value || []);
    }, [field.value]);

    const handleDragEnd = useCallback(
        (event: any) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
                const oldIndex = itemIds.indexOf(active.id);
                const newIndex = itemIds.indexOf(over.id);

                const newArray = arrayMove(items, oldIndex, newIndex);
                setLocalItems(newArray);
                field.onChange(newArray);
            }
        },
        [itemIds, items, field],
    );

    return (
        <div className="space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="min-h-[100px] overflow-y-auto space-y-1 resize-y rounded-md border bg-background p-1">
                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                        {localItems.map((item: any, index: number) => (
                            <SortableItem
                                key={`item-${index}-${JSON.stringify(item)}`}
                                id={`item-${index}`}
                                index={index}
                                item={item}
                                disabled={disabled}
                                renderInput={renderInput}
                                onRemove={handleRemoveItem}
                                onItemChange={handleItemChange}
                                field={field}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {!disabled && (
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {i18n.t('Add item')}
                </Button>
            )}
        </div>
    );
}
