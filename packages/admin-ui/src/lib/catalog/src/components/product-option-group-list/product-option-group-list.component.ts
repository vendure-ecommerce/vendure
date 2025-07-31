import { Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DataService, GetProductOptionGroupsDocument, TypedBaseListComponent } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-product-option-group-list',
    templateUrl: './product-option-group-list.component.html',
    styleUrls: ['./product-option-group-list.component.scss'],
    standalone: false,
})
export class ProductOptionGroupListComponent
    extends TypedBaseListComponent<typeof GetProductOptionGroupsDocument, 'productOptionGroups'>
    implements OnInit
{
    dataTableListId = 'option-group-list';
    readonly customFields = this.getCustomFieldConfig('ProductOptionGroup');
    readonly filters = this.createFilterCollection()
        .addIdFilter()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addFilter({
            name: 'code',
            type: { kind: 'text' },
            label: _('common.code'),
            filterField: 'code',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.createSortCollection()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'id' })
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'code' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(protected dataService: DataService) {
        super();
        super.configure({
            document: GetProductOptionGroupsDocument,
            getItems: data => data.productOptionGroups,
            setVariables: (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
            refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
        });
    }
}
