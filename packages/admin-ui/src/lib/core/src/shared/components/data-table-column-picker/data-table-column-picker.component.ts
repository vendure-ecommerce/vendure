import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DataTable2ColumnComponent } from '../data-table-2/data-table-column.component';

@Component({
    selector: 'vdr-data-table-colum-picker',
    templateUrl: './data-table-column-picker.component.html',
    styleUrls: ['./data-table-column-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableColumnPickerComponent {
    @Input() columns: Array<DataTable2ColumnComponent<any>>;

    toggleColumn(column: DataTable2ColumnComponent<any>) {
        column.setVisibility(!column.visible);
    }
}
