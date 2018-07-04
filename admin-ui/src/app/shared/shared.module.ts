import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTableColumnComponent } from './components/data-table/data-table-column.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { TableRowActionComponent } from './components/table-row-action/table-row-action.component';

const IMPORTS = [
    ClarityModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
];

const DECLARATIONS = [
    DataTableComponent, DataTableColumnComponent, PaginationControlsComponent, TableRowActionComponent,
];

@NgModule({
    imports: IMPORTS,
    exports: [...IMPORTS, ...DECLARATIONS],
    declarations: DECLARATIONS,
    entryComponents: [],
})
export class SharedModule {

}
