import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LanguageCode } from '../../../common/generated-types';
import { DataTable2ColumnComponent } from '../data-table-2/data-table-column.component';

@Component({
    selector: 'vdr-data-table-colum-picker',
    templateUrl: './data-table-column-picker.component.html',
    styleUrls: ['./data-table-column-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableColumnPickerComponent {
    @Input() columns: Array<DataTable2ColumnComponent<any>>;
    @Input() uiLanguage: LanguageCode;

    toggleColumn(column: DataTable2ColumnComponent<any>) {
        column.setVisibility(!column.visible);
    }
}
