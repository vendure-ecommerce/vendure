import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
} from '@angular/core';
import { PaginationInstance, PaginationService } from 'ngx-pagination';
import { DataTableColumnComponent } from './data-table-column.component';

@Component({
    selector: 'vdr-data-table',
    templateUrl: 'data-table.component.html',
    styleUrls: ['data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaginationService],
})
export class DataTableComponent implements OnInit, AfterViewInit {

    @Input() items: any[];
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalItems: number;
    @Output() pageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();
    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
    @ContentChild(TemplateRef) rowTemplate: TemplateRef<any>;
    paginationConfig: PaginationInstance;

    ngOnInit() {
        this.paginationConfig = {
            itemsPerPage: this.itemsPerPage,
            currentPage: this.currentPage,
            totalItems: this.totalItems,
        };
    }

    ngOnChanges() {
        if (this.paginationConfig) {
            this.paginationConfig.itemsPerPage = this.itemsPerPage;
            this.paginationConfig.currentPage = this.currentPage;
            this.paginationConfig.totalItems = this.totalItems;
        }
    }

    ngAfterViewInit(): void {
    }
}
