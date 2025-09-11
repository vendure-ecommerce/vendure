'use client';

import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '@/vdb/components/ui/button.js';
import { Calendar } from '@/vdb/components/ui/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { ScrollArea, ScrollBar } from '@/vdb/components/ui/scroll-area.js';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { cn } from '@/vdb/lib/utils.js';
import { CalendarClock } from 'lucide-react';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

/**
 * @description
 * A component for selecting a date and time.
 *
 * @docsCategory form-components
 * @docsPage DateTimeInput
 */
export function DateTimeInput({ value, onChange, fieldDef }: Readonly<DashboardFormComponentProps>) {
    const readOnly = isReadonlyField(fieldDef);
    const date = value && value instanceof Date ? value.toISOString() : (value ?? '');
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            onChange(selectedDate.toISOString());
        }
    };

    const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: string) => {
        if (date) {
            const newDate = new Date(date);
            if (type === 'hour') {
                newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
            } else if (type === 'minute') {
                newDate.setMinutes(parseInt(value));
            } else if (type === 'ampm') {
                const currentHours = newDate.getHours();
                newDate.setHours(value === 'PM' ? currentHours + 12 : currentHours - 12);
            }
            onChange(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={readOnly ? undefined : setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={readOnly}
                    className={cn(
                        'w-full justify-start text-left font-normal shadow-xs',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MM/dd/yyyy hh:mm aa') : <span>MM/DD/YYYY hh:mm aa</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={new Date(date)}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map(hour => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && new Date(date).getHours() % 12 === hour % 12
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange('hour', hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date && new Date(date).getMinutes() === minute
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange('minute', minute.toString())}
                                    >
                                        {minute}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                                {['AM', 'PM'].map(ampm => (
                                    <Button
                                        key={ampm}
                                        size="icon"
                                        variant={
                                            date &&
                                            ((ampm === 'AM' && new Date(date).getHours() < 12) ||
                                                (ampm === 'PM' && new Date(date).getHours() >= 12))
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange('ampm', ampm)}
                                    >
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
