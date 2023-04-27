import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DataTableFilter } from '../../../providers/data-table/data-table-filter';
import { FilterWithValue } from '../../../providers/data-table/data-table-filter-collection';

@Component({
    selector: 'vdr-data-table-filter-label',
    templateUrl: './data-table-filter-label.component.html',
    styleUrls: ['./data-table-filter-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DataTableFilterLabelComponent {
    @Input() filterWithValue: FilterWithValue;
}
