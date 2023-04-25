import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableFilterCollection } from './data-table-filter-collection';

@Injectable({
    providedIn: 'root',
})
export class DataTableFilterService {
    constructor(private router: Router) {}

    createConfig<FilterInput extends Record<string, any>>() {
        return new DataTableFilterCollection<FilterInput>(this.router);
    }
}
