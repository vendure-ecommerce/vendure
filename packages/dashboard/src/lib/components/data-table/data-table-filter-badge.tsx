import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@lingui/react/macro';
import { Filter, XIcon } from 'lucide-react';
import { Badge } from '../ui/badge.js';
import { HumanReadableOperator, Operator } from './human-readable-operator.js';
import { ColumnDataType } from './types.js';

export function DataTableFilterBadge({
    filter,
    onRemove,
    onClick,
    dataType,
    currencyCode,
}: {
    filter: any;
    onRemove: (filter: any) => void;
    onClick?: (filter: any) => void;
    dataType: ColumnDataType;
    currencyCode: string;
}) {
    const [operator, value] = Object.entries(filter.value as Record<string, unknown>)[0];
    return (
        <Badge key={filter.id} className="flex gap-2 flex-wrap items-center" variant="outline">
            <button
                className="flex gap-1 flex-wrap items-center cursor-pointer flex-1"
                onClick={() => onClick?.(filter)}
            >
                <Filter size="12" className="opacity-50 flex-shrink-0" />
                <div
                    className="@xs:overflow-hidden @xs:text-ellipsis @xs:whitespace-nowrap"
                    title={filter.id}
                >
                    {filter.id}
                </div>
                <div className="text-muted-foreground flex-shrink-0">
                    <HumanReadableOperator operator={operator as Operator} mode="short" />
                </div>
                <div className="@xs:overflow-hidden @xs:text-ellipsis @xs:whitespace-nowrap flex flex-col @xl:flex-row @2xl:gap-1">
                    <FilterValue value={value} dataType={dataType} currencyCode={currencyCode} />
                </div>
            </button>
            <button className="border-l -mr-2" onClick={() => onRemove(filter)}>
                <XIcon className="h-4 flex-shrink-0 cursor-pointer" />
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
                <span className="text-muted-foreground">
                    <FilterKeyLabel filterKey={key} />:{' '}
                </span>
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
        return (
            <div title={formatDate(value, { dateStyle: 'short', timeStyle: 'long' })}>
                {formatDate(value, { dateStyle: 'short' })}
            </div>
        );
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

function FilterKeyLabel({ filterKey }: { filterKey: string }) {
    switch (filterKey) {
        case 'start':
            return <Trans>start</Trans>;
        case 'end':
            return <Trans>end</Trans>;
        default:
            return <>{filterKey}</>;
    }
}
