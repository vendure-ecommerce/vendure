import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { CircleX, Filter } from 'lucide-react';
import { Badge } from '../ui/badge.js';
import { HumanReadableOperator, Operator } from './human-readable-operator.js';
import { ColumnDataType } from './types.js';

export function DataTableFilterBadge({
    filter,
    onRemove,
    dataType,
    currencyCode,
}: {
    filter: any;
    onRemove: (filter: any) => void;
    dataType: ColumnDataType;
    currencyCode: string;
}) {
    const [operator, value] = Object.entries(filter.value as Record<string, unknown>)[0];
    return (
        <Badge key={filter.id} className="flex gap-1 items-center" variant="secondary">
            <Filter size="12" className="opacity-50" />
            <div>{filter.id}</div>
            <div className="text-muted-foreground">
                <HumanReadableOperator operator={operator as Operator} mode="short" />
            </div>
            <FilterValue value={value} dataType={dataType} currencyCode={currencyCode} />
            <button className="cursor-pointer" onClick={() => onRemove(filter)}>
                <CircleX size="14" />
            </button>
        </Badge>
    );
}

function FilterValue({
    value,
    dataType,
    currencyCode,
}: {
    value: unknown;
    dataType: ColumnDataType;
    currencyCode: string;
}) {
    const { formatDate, formatCurrency } = useLocalFormat();
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return Object.entries(value as Record<string, unknown>).map(([key, value]) => (
            <div key={key} className="flex gap-1 items-center">
                <span className="text-muted-foreground">{key}: </span>
                <FilterValue value={value} dataType={dataType} currencyCode={currencyCode} />
            </div>
        ));
    }
    if (Array.isArray(value)) {
        return (
            <div className="flex gap-1 items-center">
                [
                {value.map(v => (
                    <FilterValue value={v} dataType={dataType} currencyCode={currencyCode} key={v} />
                ))}
                ]
            </div>
        );
    }
    if (typeof value === 'string' && isDateIsoString(value)) {
        return <div>{formatDate(value, { dateStyle: 'short', timeStyle: 'short' })}</div>;
    }
    if (typeof value === 'boolean') {
        return <div>{value ? 'true' : 'false'}</div>;
    }
    if (typeof value === 'number' && dataType === 'Money') {
        return <div>{formatCurrency(value, currencyCode)}</div>;
    }
    if (typeof value === 'number') {
        return <div>{value}</div>;
    }
    if (typeof value === 'string') {
        return <div>{value}</div>;
    }
    return <div>{value as string}</div>;
}

function isDateIsoString(value: string) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);
}
