import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableFilterCollection } from './data-table-filter-collection';
import { DataTableSortCollection } from './data-table-sort-collection';

@Injectable({
    providedIn: 'root',
})
export class DataTableService {
    constructor(private router: Router) {}

    createFilterCollection<FilterInput extends Record<string, any>>() {
        return new DataTableFilterCollection<FilterInput>(this.router);
    }

    createSortCollection<SortInput extends Record<string, any>>() {
        return new DataTableSortCollection<SortInput>(this.router);
    }
}
