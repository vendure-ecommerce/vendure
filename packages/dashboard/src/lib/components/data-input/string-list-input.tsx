import { X } from 'lucide-react';
import { KeyboardEvent, useId, useRef, useState } from 'react';

import { Badge } from '@/vdb/components/ui/badge.js';
import { Input } from '@/vdb/components/ui/input.js';
import type { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';
import { cn } from '@/vdb/lib/utils.js';
import { useLingui } from '@lingui/react';

export function StringListInput({
    value,
    onChange,
    onBlur,
    disabled,
    name,
    fieldDef,
}: DashboardFormComponentProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { i18n } = useLingui();
    const isDisabled = isReadonlyField(fieldDef) || disabled;
    const id = useId();

    const items = Array.isArray(value) ? value : [];

    const addItem = (item: string) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            onChange([...items, trimmedItem]);
            setInputValue('');
        }
    };

    const removeItem = (indexToRemove: number) => {
        onChange(items.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addItem(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && items.length > 0) {
            // Remove last item when backspace is pressed on empty input
            removeItem(items.length - 1);
        }
    };

    const handleInputBlur = () => {
        // Add current input value as item on blur if there's any
        if (inputValue.trim()) {
            addItem(inputValue);
        }
        onBlur?.();
    };

    return (
        <div
            className={cn(
                'flex min-h-10 w-full flex-wrap gap-2',
                isDisabled && 'cursor-not-allowed opacity-50',
            )}
        >
            {!isDisabled && (
                <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    name={name}
                    placeholder={i18n.t('Type and press Enter or comma to add...')}
                    className="min-w-[120px]"
                />
            )}
            <div className="flex flex-wrap gap-1 items-start justify-start">
                {items.map((item, index) => (
                    <Badge key={id + index} variant="secondary">
                        <span>{item}</span>
                        {!isDisabled && (
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    removeItem(index);
                                }}
                                className={cn(
                                    'ml-1 rounded-full outline-none ring-offset-background',
                                    'hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                )}
                                aria-label={`Remove ${item}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </Badge>
                ))}
            </div>
        </div>
    );
}

StringListInput.metadata = {
    isListInput: true,
};
