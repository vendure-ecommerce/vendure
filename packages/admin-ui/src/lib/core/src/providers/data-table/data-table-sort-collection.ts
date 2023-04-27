import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableSort, DataTableSortOptions, SortOrder } from './data-table-sort';

export class DataTableSortCollection<
    SortInput extends Record<string, 'ASC' | 'DESC'>,
    Names extends [...Array<keyof SortInput>] = [],
> {
    readonly #sorts: Array<DataTableSort<SortInput>> = [];
    #valueChanges$ = new Subject<Array<{ name: string; sortOrder: SortOrder | undefined }>>();
    #connectedToRouter = false;
    valueChanges = this.#valueChanges$.asObservable();
    readonly #sortQueryParamName = 'sort';
    #defaultSort: { name: keyof SortInput; sortOrder: SortOrder } | undefined;

    constructor(private router: Router) {}

    get length(): number {
        return this.#sorts.length;
    }

    addSort<Name extends keyof SortInput>(
        config: DataTableSortOptions<SortInput, Name>,
    ): DataTableSortCollection<SortInput, [...Names, Name]> {
        if (this.#connectedToRouter) {
            throw new Error(
                'Cannot add sort after connecting to router. Make sure to call addSort() before connectToRoute()',
            );
        }
        this.#sorts.push(new DataTableSort<SortInput>(config, () => this.onSetValue()));
        return this as unknown as DataTableSortCollection<SortInput, [...Names, Name]>;
    }

    defaultSort(name: keyof SortInput, sortOrder: SortOrder) {
        this.#defaultSort = { name, sortOrder };
        return this;
    }

    get(name: Names[number]): DataTableSort<SortInput> | undefined {
        return this.#sorts.find(s => s.name === name);
    }

    connectToRoute(route: ActivatedRoute) {
        this.valueChanges.subscribe(value => {
            this.router.navigate(['./'], {
                queryParams: { [this.#sortQueryParamName]: this.serialize() },
                relativeTo: route,
                queryParamsHandling: 'merge',
            });
        });
        const filterQueryParams = (route.snapshot.queryParamMap.get(this.#sortQueryParamName) ?? '')
            .split(';')
            .map(value => value.split(':'))
            .map(([name, value]) => ({ name, value }));
        for (const { name, value } of filterQueryParams) {
            const sort = this.get(name);
            if (sort) {
                sort.setSortOrder(value as any);
            }
        }
        this.#connectedToRouter = true;
        return this;
    }

    createSortInput(): SortInput {
        const activeSorts = this.#sorts.filter(s => s.sortOrder !== undefined);
        let sortInput = {} as SortInput;
        if (activeSorts.length === 0 && this.#defaultSort) {
            return { [this.#defaultSort.name]: this.#defaultSort.sortOrder } as SortInput;
        }
        for (const sort of activeSorts) {
            sortInput = { ...sortInput, [sort.name]: sort.sortOrder };
        }
        return sortInput;
    }

    private serialize(): string {
        const activeSorts = this.#sorts.filter(s => s.sortOrder !== undefined);
        return activeSorts.map(s => `${s.name as string}:${s.sortOrder}`).join(';');
    }

    private onSetValue() {
        this.#valueChanges$.next(
            this.#sorts
                .filter(f => f.sortOrder !== undefined)
                .map(s => ({ name: s.name as any, sortOrder: s.sortOrder })),
        );
    }
}
