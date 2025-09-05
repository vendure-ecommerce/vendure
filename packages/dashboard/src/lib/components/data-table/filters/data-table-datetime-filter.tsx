import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { useEffect, useState } from 'react';
import { HumanReadableOperator } from '../human-readable-operator.js';

export interface DataTableDateTimeFilterProps {
    value: Record<string, any> | undefined;
    onChange: (filter: Record<string, any>) => void;
}

export const DATETIME_OPERATORS = ['eq', 'before', 'after', 'between', 'isNull'] as const;

export function DataTableDateTimeFilter({
    value: incomingValue,
    onChange,
}: Readonly<DataTableDateTimeFilterProps>) {
    const initialOperator = incomingValue ? Object.keys(incomingValue)[0] : 'eq';
    const initialValue = incomingValue ? Object.values(incomingValue)[0] : '';
    const [operator, setOperator] = useState<string>(initialOperator ?? 'eq');
    const [value, setValue] = useState<Date | undefined>(initialValue ? new Date(initialValue) : undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (operator === 'isNull') {
            onChange({ [operator]: true });
            return;
        }

        if (operator === 'between') {
            if (!startDate && !endDate) {
                onChange({});
                return;
            }
            if (!startDate || !endDate) {
                setError('Please enter both start and end dates');
                return;
            }
            if (startDate > endDate) {
                setError('Start date must be before end date');
                return;
            }
            setError('');
            onChange({ [operator]: { start: startDate.toISOString(), end: endDate.toISOString() } });
        } else {
            if (!value) {
                onChange({});
                return;
            }
            setError('');
            onChange({ [operator]: value.toISOString() });
        }
    }, [operator, value, startDate, endDate]);

    const parseToDate = (input: unknown): Date | undefined => {
        if (input instanceof Date) {
            return input;
        }
        if (typeof input === 'string' && input !== '') {
            return new Date(input);
        }
        return;
    };

    const dashboardComponentProps = {
        name: 'date',
        onBlur: () => {
            /* */
        },
        ref: () => null,
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-2">
                <Select value={operator} onValueChange={value => setOperator(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                        {DATETIME_OPERATORS.map(op => (
                            <SelectItem key={op} value={op}>
                                <HumanReadableOperator operator={op} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {operator !== 'isNull' &&
                    (operator === 'between' ? (
                        <div className="space-y-2">
                            <DateTimeInput
                                {...dashboardComponentProps}
                                value={startDate}
                                onChange={val => setStartDate(parseToDate(val))}
                            />
                            <DateTimeInput
                                {...dashboardComponentProps}
                                value={endDate}
                                onChange={val => setEndDate(parseToDate(val))}
                            />
                        </div>
                    ) : (
                        <DateTimeInput
                            {...dashboardComponentProps}
                            value={value}
                            onChange={val => setValue(parseToDate(val))}
                        />
                    ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
