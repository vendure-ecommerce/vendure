import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from '@ng-select/ng-select';

import { SearchProducts } from '../../../common/generated-types';

import { ProductSearchSelectionModelFactory } from './product-search-selection-model';

@Component({
    selector: 'vdr-product-search-input',
    templateUrl: './product-search-input.component.html',
    styleUrls: ['./product-search-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: SELECTION_MODEL_FACTORY, useValue: ProductSearchSelectionModelFactory }],
})
export class ProductSearchInputComponent {
    @Input() facetValueResults: SearchProducts.FacetValues[];
    @Output() searchTermChange = new EventEmitter<string>();
    @Output() facetValueChange = new EventEmitter<string[]>();
    @ViewChild('selectComponent') private selectComponent: NgSelectComponent;

    filterFacetResults = (term: string, item: SearchProducts.FacetValues | { label: string }) => {
        if (!this.isFacetValueItem(item)) {
            return false;
        }
        return (
            item.facetValue.name.toLowerCase().startsWith(term.toLowerCase()) ||
            item.facetValue.facet.name.toLowerCase().startsWith(term.toLowerCase())
        );
    };

    groupByFacet = (item: SearchProducts.FacetValues | { label: string }) => {
        if (this.isFacetValueItem(item)) {
            return item.facetValue.facet.name;
        } else {
            return '';
        }
    };

    onSelectChange(selectedItems: Array<SearchProducts.FacetValues | { label: string }>) {
        const searchTermItem = selectedItems.find(item => !this.isFacetValueItem(item)) as
            | { label: string }
            | undefined;
        const searchTerm = searchTermItem ? searchTermItem.label : '';

        const facetValueIds = selectedItems.filter(this.isFacetValueItem).map(i => i.facetValue.id);

        this.searchTermChange.emit(searchTerm);
        this.facetValueChange.emit(facetValueIds);
    }

    isSearchHeaderSelected(): boolean {
        return this.selectComponent.itemsList.markedIndex === -1;
    }

    private isFacetValueItem = (input: unknown): input is SearchProducts.FacetValues => {
        return typeof input === 'object' && !!input && input.hasOwnProperty('facetValue');
    };
}
