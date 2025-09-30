'use client';

import { Button } from '@/vdb/components/ui/button.js';
import { Calendar } from '@/vdb/components/ui/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { DefinedDateRange } from '@/vdb/framework/dashboard-widget/widget-filters-context.js';
import { cn } from '@/vdb/lib/utils.js';
import {
    addDays,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
    className?: string;
    dateRange: DefinedDateRange;
    onDateRangeChange: (range: DefinedDateRange) => void;
}

const presets = [
    {
        label: 'Today',
        getValue: () => ({
            from: startOfDay(new Date()),
            to: endOfDay(new Date()),
        }),
    },
    {
        label: 'Yesterday',
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 1)),
            to: endOfDay(subDays(new Date(), 1)),
        }),
    },
    {
        label: 'Last 7 days',
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 6)),
            to: endOfDay(new Date()),
        }),
    },
    {
        label: 'This week',
        getValue: () => ({
            from: startOfWeek(new Date(), { weekStartsOn: 1 }),
            to: endOfWeek(new Date(), { weekStartsOn: 1 }),
        }),
    },
    {
        label: 'Last 30 days',
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 29)),
            to: endOfDay(new Date()),
        }),
    },
    {
        label: 'Month to date',
        getValue: () => ({
            from: startOfMonth(new Date()),
            to: endOfDay(new Date()),
        }),
    },
    {
        label: 'This month',
        getValue: () => ({
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        }),
    },
    {
        label: 'Last month',
        getValue: () => ({
            from: startOfMonth(subDays(new Date(), 30)),
            to: endOfMonth(subDays(new Date(), 30)),
        }),
    },
];

export function DateRangePicker({ className, dateRange, onDateRangeChange }: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false);
    // Internal state uses react-day-picker's DateRange type for Calendar compatibility
    const [selectedRange, setSelectedRange] = React.useState<DateRange>({
        from: dateRange.from,
        to: dateRange.to
    });

    React.useEffect(() => {
        setSelectedRange({
            from: dateRange.from,
            to: dateRange.to
        });
    }, [dateRange]);

    const handleSelect = (range: DateRange | undefined) => {
        if (range?.from) {
            // If no end date is selected, use the from date as the end date
            const to = range.to || range.from;
            const finalRange: DefinedDateRange = {
                from: range.from,
                to: to
            };
            setSelectedRange({ from: range.from, to });
            onDateRangeChange(finalRange);
        }
    };

    const handlePresetClick = (preset: typeof presets[number]) => {
        const range = preset.getValue();
        handleSelect(range);
        setOpen(false);
    };

    const formatDateRange = () => {
        if (!selectedRange.from) {
            return 'Select date range';
        }
        if (!selectedRange.to || selectedRange.from === selectedRange.to) {
            return format(selectedRange.from, 'MMM dd, yyyy');
        }
        return `${format(selectedRange.from, 'MMM dd, yyyy')} - ${format(selectedRange.to, 'MMM dd, yyyy')}`;
    };

    const isPresetActive = (preset: typeof presets[number]) => {
        if (!selectedRange.from || !selectedRange.to) return false;
        const presetRange = preset.getValue();
        return (
            selectedRange.from.getTime() === presetRange.from.getTime() &&
            selectedRange.to.getTime() === presetRange.to.getTime()
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                    <div className="border-r p-2 space-y-0.5 min-w-0 w-32">
                        {presets.map((preset) => (
                            <Button
                                key={preset.label}
                                variant={isPresetActive(preset) ? 'default' : 'ghost'}
                                size="sm"
                                className="w-full justify-start font-normal text-xs h-7 px-2"
                                onClick={() => handlePresetClick(preset)}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                    <div className="p-3">
                        <Calendar
                            mode="range"
                            defaultMonth={selectedRange?.from}
                            selected={selectedRange}
                            onSelect={handleSelect}
                            numberOfMonths={2}
                            showOutsideDays={false}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}