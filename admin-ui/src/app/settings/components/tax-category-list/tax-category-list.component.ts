import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { TaxCategory } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-tax-list',
    templateUrl: './tax-category-list.component.html',
    styleUrls: ['./tax-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryListComponent {
    taxCategories$: Observable<TaxCategory.Fragment[]>;

    constructor(private dataService: DataService) {
        this.taxCategories$ = this.dataService.settings
            .getTaxCategories()
            .mapStream(data => data.taxCategories);
    }
}
