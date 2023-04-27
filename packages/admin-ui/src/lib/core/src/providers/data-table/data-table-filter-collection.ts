import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableFilter, DataTableFilterType } from './data-table-filter';

export class DataTableFilterCollection<FilterInput extends Record<string, any> = Record<string, any>> {
    private readonly filters: Array<DataTableFilter<FilterInput, any>> = [];
    private valueChanges$ = new Subject<Array<{ id: string; value: any }>>();
    private connectedToRouter = false;
    valueChanges = this.valueChanges$.asObservable();
    private readonly filtersQueryParamName = 'filters';

    constructor(private router: Router) {}

    get length(): number {
        return this.filters.length;
    }

    addFilter<FilterType extends DataTableFilterType>(
        config: ConstructorParameters<typeof DataTableFilter<FilterInput, FilterType>>[0],
    ): DataTableFilterCollection<FilterInput> {
        if (this.connectedToRouter) {
            throw new Error(
                'Cannot add filter after connecting to router. Make sure to call addFilter() before connectToRoute()',
            );
        }
        this.filters.push(new DataTableFilter(config, () => this.onSetValue()));
        return this;
    }

    getFilter(id: string): DataTableFilter<FilterInput> | undefined {
        return this.filters.find(f => f.name === id);
    }

    getFilters(): Array<DataTableFilter<FilterInput>> {
        return this.filters;
    }

    getActiveFilters(): Array<DataTableFilter<FilterInput>> {
        return this.filters.filter(f => f.value !== undefined);
    }

    createFilterInput(): FilterInput {
        return this.getActiveFilters().reduce(
            (acc, f) => ({ ...acc, ...(f.value != null ? f.toFilterInput(f.value) : {}) }),
            {} as FilterInput,
        );
    }

    connectToRoute(route: ActivatedRoute) {
        this.valueChanges.subscribe(value => {
            this.router.navigate(['./'], {
                queryParams: { [this.filtersQueryParamName]: this.serialize() },
                relativeTo: route,
                queryParamsHandling: 'merge',
            });
        });
        const filterQueryParams = (route.snapshot.queryParamMap.get(this.filtersQueryParamName) ?? '')
            .split(';')
            .map(value => value.split(':'))
            .map(([id, value]) => ({ id, value }));
        for (const { id, value } of filterQueryParams) {
            const filter = this.getFilter(id);
            if (filter) {
                filter.deserializeValue(value);
            }
        }
        this.connectedToRouter = true;
        return this;
    }

    private serialize(): string {
        return this.getActiveFilters()
            .map(f => `${f.name}:${f.serializeValue()}`)
            .join(';');
    }

    private onSetValue() {
        this.valueChanges$.next(
            this.filters.filter(f => f.value !== undefined).map(f => ({ id: f.name, value: f.value })),
        );
    }
}
