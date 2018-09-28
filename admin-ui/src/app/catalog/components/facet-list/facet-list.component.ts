import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetFacetList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent extends BaseListComponent<GetFacetList.Query, GetFacetList.Items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn((...args: any[]) => this.dataService.facet.getFacets(...args), data => data.facets);
    }
}
