import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetSellersQuery,
    ItemOf,
    ModalService,
    NotificationService,
    SellerFilterParameter,
    SellerSortParameter,
} from '@vendure/admin-ui/core';
import { EMPTY, switchMap } from 'rxjs';

@Component({
    selector: 'vdr-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerListComponent
    extends BaseListComponent<GetSellersQuery, ItemOf<GetSellersQuery, 'sellers'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<SellerFilterParameter>()
        .addDateFilters()
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<SellerSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        route: ActivatedRoute,
        router: Router,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getSellerList(...args).refetchOnChannelChange(),
            data => data.sellers,
            (skip, take) => ({
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
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    deleteSeller(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-seller'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(response => (response ? this.dataService.settings.deleteSeller(id) : EMPTY)))
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Seller',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Seller',
                    });
                },
            );
    }
}
