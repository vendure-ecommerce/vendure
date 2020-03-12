import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from '@ng-select/ng-select';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { SearchProducts } from '@vendure/admin-ui/core';

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
    @ViewChild('selectComponent', { static: true }) private selectComponent: NgSelectComponent;
    private lastTerm = '';
    private lastFacetValueIds: string[] = [];

    setSearchTerm(term: string | null) {
        if (term) {
            this.selectComponent.select({ label: term, value: { label: term } });
        } else {
            const currentTerm = this.selectComponent.selectedItems.find(i => !this.isFacetValueItem(i.value));
            if (currentTerm) {
                this.selectComponent.unselect(currentTerm);
            }
        }
    }

    setFacetValues(ids: string[]) {
        const items = this.selectComponent.items;

        this.selectComponent.selectedItems.forEach(item => {
            if (this.isFacetValueItem(item.value) && !ids.includes(item.value.facetValue.id)) {
                this.selectComponent.unselect(item);
            }
        });

        ids.map(id => {
            return items.find(item => this.isFacetValueItem(item) && item.facetValue.id === id);
        })
            .filter(notNullOrUndefined)
            .forEach(item => {
                const isSelected = this.selectComponent.selectedItems.find(i => {
                    const val = i.value;
                    if (this.isFacetValueItem(val)) {
                        return val.facetValue.id === item.facetValue.id;
                    }
                    return false;
                });
                if (!isSelected) {
                    this.selectComponent.select({ label: '', value: item });
                }
            });
    }

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
        if (!Array.isArray(selectedItems)) {
            selectedItems = [selectedItems];
        }
        const searchTermItem = selectedItems.find(item => !this.isFacetValueItem(item)) as
            | { label: string }
            | undefined;
        const searchTerm = searchTermItem ? searchTermItem.label : '';

        const facetValueIds = selectedItems.filter(this.isFacetValueItem).map(i => i.facetValue.id);

        if (searchTerm !== this.lastTerm) {
            this.searchTermChange.emit(searchTerm);
            this.lastTerm = searchTerm;
        }
        if (this.lastFacetValueIds.join(',') !== facetValueIds.join(',')) {
            this.facetValueChange.emit(facetValueIds);
            this.lastFacetValueIds = facetValueIds;
        }
    }

    isSearchHeaderSelected(): boolean {
        return this.selectComponent.itemsList.markedIndex === -1;
    }

    private isFacetValueItem = (input: unknown): input is SearchProducts.FacetValues => {
        return typeof input === 'object' && !!input && input.hasOwnProperty('facetValue');
    };
}
