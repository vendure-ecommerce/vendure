import { DateOperators } from '@vendure/admin-ui/core';
import { assertNever } from '@vendure/common/lib/shared-utils';

export interface DataTableFilterTextType {
    kind: 'text';
    placeholder?: string;
}

export interface DataTableFilterSelectType {
    kind: 'select';
    options: Array<{ value: any; label: string }>;
}

export interface DataTableFilterBooleanType {
    kind: 'boolean';
}

export interface DataTableFilterDateRangeType {
    kind: 'dateRange';
}

export type KindValueMap = {
    text: { operator: 'contains' | 'eq' | 'notContains' | 'notEq' | 'regex'; term: string };
    select: string[];
    boolean: boolean;
    dateRange: { start?: string; end?: string; dateOperators: DateOperators };
};
export type DataTableFilterType =
    | DataTableFilterTextType
    | DataTableFilterSelectType
    | DataTableFilterBooleanType
    | DataTableFilterDateRangeType;

export interface DataTableFilterOptions<
    FilterInput extends Record<string, any> = any,
    Type extends DataTableFilterType = DataTableFilterType,
> {
    readonly id: string;
    readonly type: Type;
    readonly label: string;
    readonly toFilterInput: (value: KindValueMap[Type['kind']]) => Partial<FilterInput>;
}

export class DataTableFilter<
    FilterInput extends Record<string, any> = any,
    Type extends DataTableFilterType = DataTableFilterType,
> {
    constructor(
        private readonly options: DataTableFilterOptions<FilterInput, Type>,
        private onSetValue?: (value: KindValueMap[Type['kind']] | undefined) => void,
    ) {}
    private _value: any | undefined;

    get value(): KindValueMap[Type['kind']] | undefined {
        return this._value;
    }

    get id(): string {
        return this.options.id;
    }

    get type(): Type {
        return this.options.type;
    }

    get label(): string {
        return this.options.label;
    }

    toFilterInput(value: KindValueMap[Type['kind']]): Partial<FilterInput> {
        return this.options.toFilterInput(value);
    }

    setValue(value: KindValueMap[Type['kind']]): void {
        this._value = value;
        if (this.onSetValue) {
            this.onSetValue(value);
        }
    }

    clearValue(): void {
        this._value = undefined;
        if (this.onSetValue) {
            this.onSetValue(undefined);
        }
    }

    serializeValue(): string | undefined {
        if (this.value === undefined) {
            return undefined;
        }
        const kind = this.type.kind;
        switch (kind) {
            case 'text': {
                const value = this.getValueForKind(kind);
                return `${value?.operator},${value?.term}`;
            }
            case 'select': {
                const value = this.getValueForKind(kind);
                return value?.join(',');
            }
            case 'boolean': {
                const value = this.getValueForKind(kind);
                return value ? '1' : '0';
            }
            case 'dateRange': {
                const value = this.getValueForKind(kind);
                const start = value?.start ? new Date(value.start).getTime() : '';
                const end = value?.end ? new Date(value.end).getTime() : '';
                return `${start},${end}`;
            }
            default:
                assertNever(this.type);
        }
    }

    deserializeValue(value: string): void {
        switch (this.type.kind) {
            case 'text': {
                const [operator, term] = value.split(',');
                this._value = { operator, term };
                break;
            }
            case 'select':
                this._value = value.split(',');
                break;
            case 'boolean':
                this._value = value === '1';
                break;
            case 'dateRange':
                const [startTimestamp, endTimestamp] = value.split(',');
                const start = startTimestamp ? new Date(Number(startTimestamp)).toISOString() : '';
                const end = endTimestamp ? new Date(Number(endTimestamp)).toISOString() : '';
                this._value = { start, end };
                break;
            default:
                assertNever(this.type);
        }
    }

    isText(): this is DataTableFilter<FilterInput, DataTableFilterTextType> {
        return this.type.kind === 'text';
    }

    isBoolean(): this is DataTableFilter<FilterInput, DataTableFilterBooleanType> {
        return this.type.kind === 'boolean';
    }

    isSelect(): this is DataTableFilter<FilterInput, DataTableFilterSelectType> {
        return this.type.kind === 'select';
    }

    isDateRange(): this is DataTableFilter<FilterInput, DataTableFilterDateRangeType> {
        return this.type.kind === 'dateRange';
    }

    private getValueForKind<Kind extends Type['kind']>(kind: Kind): KindValueMap[Kind] | undefined {
        switch (kind) {
            case 'text':
                return this.value as any;
            case 'select':
                return this.value as any;
            case 'boolean':
                return this.value as any;
            case 'dateRange':
                return this.value as any;
            default:
                assertNever(kind);
        }
    }
}
