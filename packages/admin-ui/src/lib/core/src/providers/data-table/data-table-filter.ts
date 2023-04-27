import { assertNever } from '@vendure/common/lib/shared-utils';
import { DateOperators } from '../../common/generated-types';

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

export interface DataTableFilterNumberType {
    kind: 'number';
    inputType?: 'number' | 'currency';
}

export interface DataTableFilterDateRangeType {
    kind: 'dateRange';
}

export type KindValueMap = {
    text: { operator: 'contains' | 'eq' | 'notContains' | 'notEq' | 'regex'; term: string };
    select: string[];
    boolean: boolean;
    dateRange: { start?: string; end?: string; dateOperators: DateOperators };
    number: { operator: 'eq' | 'gt' | 'lt'; amount: string };
};
export type DataTableFilterType =
    | DataTableFilterTextType
    | DataTableFilterSelectType
    | DataTableFilterBooleanType
    | DataTableFilterDateRangeType
    | DataTableFilterNumberType;

export interface DataTableFilterOptions<
    FilterInput extends Record<string, any> = any,
    Type extends DataTableFilterType = DataTableFilterType,
> {
    readonly name: string;
    readonly type: Type;
    readonly label: string;
    readonly toFilterInput: (value: DataTableFilterValue<Type>) => Partial<FilterInput>;
}

export type DataTableFilterValue<Type extends DataTableFilterType> = KindValueMap[Type['kind']];

export class DataTableFilter<
    FilterInput extends Record<string, any> = any,
    Type extends DataTableFilterType = DataTableFilterType,
> {
    constructor(
        private readonly options: DataTableFilterOptions<FilterInput, Type>,
        private onActivate?: (
            filter: DataTableFilter<FilterInput, Type>,
            value: DataTableFilterValue<Type> | undefined,
        ) => void,
    ) {}

    get name(): string {
        return this.options.name;
    }

    get type(): Type {
        return this.options.type;
    }

    get label(): string {
        return this.options.label;
    }

    toFilterInput(value: DataTableFilterValue<Type>): Partial<FilterInput> {
        return this.options.toFilterInput(value);
    }

    activate(value: DataTableFilterValue<Type>) {
        if (this.onActivate) {
            this.onActivate(this, value);
        }
    }

    isText(): this is DataTableFilter<FilterInput, DataTableFilterTextType> {
        return this.type.kind === 'text';
    }

    isNumber(): this is DataTableFilter<FilterInput, DataTableFilterNumberType> {
        return this.type.kind === 'number';
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

    // private getValueForKind<Kind extends Type['kind']>(kind: Kind): KindValueMap[Kind] | undefined {
    //     return this.value as any;
    // }
}
