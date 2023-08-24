import { Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    DataService,
    FACET_WITH_VALUES_FRAGMENT,
    GetFacetListDocument,
    GetFacetListQuery,
    ItemOf,
    LanguageCode,
    TypedBaseListComponent,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';

export const FACET_LIST_QUERY = gql`
    query GetFacetList($options: FacetListOptions) {
        facets(options: $options) {
            items {
                ...FacetWithValues
            }
            totalItems
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent
    extends TypedBaseListComponent<typeof GetFacetListDocument, 'facets'>
    implements OnInit
{
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};

    readonly customFields = this.getCustomFieldConfig('Facet');
    readonly filters = this.createFilterCollection()
        .addIdFilter()
        .addDateFilters()
        .addFilter({
            name: 'visibility',
            type: { kind: 'boolean' },
            label: _('common.visibility'),
            toFilterInput: value => ({
                isPrivate: { eq: !value },
            }),
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
            document: GetFacetListDocument,
            getItems: data => data.facets,
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

    toggleDisplayLimit(facet: ItemOf<GetFacetListQuery, 'facets'>) {
        if (this.displayLimit[facet.id] === facet.values.length) {
            this.displayLimit[facet.id] = this.initialLimit;
        } else {
            this.displayLimit[facet.id] = facet.values.length;
        }
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
