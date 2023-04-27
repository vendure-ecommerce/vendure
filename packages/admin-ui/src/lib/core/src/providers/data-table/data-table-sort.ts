import { DataTableFilterOptions, KindValueMap } from './data-table-filter';

export type SortOrder = 'ASC' | 'DESC';

export interface DataTableSortOptions<
    SortInput extends Record<string, SortOrder>,
    Name extends keyof SortInput,
> {
    name: Name;
}

export class DataTableSort<SortInput extends Record<string, SortOrder>> {
    constructor(
        private readonly options: DataTableSortOptions<SortInput, any>,
        private onSetValue?: (name: keyof SortInput, state: SortOrder | undefined) => void,
    ) {}
    #sortOrder: SortOrder | undefined;

    get sortOrder(): SortOrder | undefined {
        return this.#sortOrder;
    }

    get name(): keyof SortInput {
        return this.options.name as string;
    }

    toggleSortOrder(): void {
        if (this.#sortOrder === undefined) {
            this.#sortOrder = 'ASC';
        } else if (this.#sortOrder === 'ASC') {
            this.#sortOrder = 'DESC';
        } else {
            this.#sortOrder = undefined;
        }
        if (this.onSetValue) {
            this.onSetValue(this.name, this.#sortOrder);
        }
    }

    setSortOrder(sortOrder: SortOrder | undefined): void {
        this.#sortOrder = sortOrder;
        if (this.onSetValue) {
            this.onSetValue(this.name, this.#sortOrder);
        }
    }
}
