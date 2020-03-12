import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { DeletionResult, GetFacetList } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent extends BaseListComponent<GetFacetList.Query, GetFacetList.Items> {
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};
    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.facet.getFacets(...args).refetchOnChannelChange(),
            data => data.facets,
        );
    }

    toggleDisplayLimit(facet: GetFacetList.Items) {
        if (this.displayLimit[facet.id] === facet.values.length) {
            this.displayLimit[facet.id] = this.initialLimit;
        } else {
            this.displayLimit[facet.id] = facet.values.length;
        }
    }

    deleteFacet(facetValueId: string) {
        this.showModalAndDelete(facetValueId)
            .pipe(
                switchMap(response => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(facetValueId, response.message || '').pipe(
                            map(r => r.result === DeletionResult.DELETED),
                        );
                    }
                }),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'FacetValue',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'FacetValue',
                    });
                },
            );
    }

    private showModalAndDelete(facetId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-facet'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res => (res ? this.dataService.facet.deleteFacet(facetId, !!message) : EMPTY)),
                map(res => res.deleteFacet),
            );
    }
}
