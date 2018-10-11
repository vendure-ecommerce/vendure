import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef,
} from '@angular/core';
import { PaginationService } from 'ngx-pagination';

import { DataTableColumnComponent } from './data-table-column.component';

@Component({
    selector: 'vdr-data-table',
    templateUrl: 'data-table.component.html',
    styleUrls: ['data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaginationService],
})
export class DataTableComponent<T> {
    @Input() items: T[];
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalItems: number;
    @Input() allSelected: boolean;
    @Input() isRowSelectedFn: (item: T) => boolean;
    @Output() allSelectChange = new EventEmitter<void>();
    @Output() rowSelectChange = new EventEmitter<T>();
    @Output() pageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();
    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
    @ContentChild(TemplateRef) rowTemplate: TemplateRef<any>;
}
