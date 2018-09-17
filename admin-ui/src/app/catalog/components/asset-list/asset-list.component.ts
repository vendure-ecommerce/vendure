import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAssetList, GetAssetList_assets_items } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent extends BaseListComponent<GetAssetList, GetAssetList_assets_items>
    implements OnInit {
    paginationConfig$: Observable<PaginationInstance>;

    constructor(
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getAssetList(...args),
            data => data.assets,
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.paginationConfig$ = combineLatest(this.itemsPerPage$, this.currentPage$, this.totalItems$).pipe(
            map(([itemsPerPage, currentPage, totalItems]) => ({ itemsPerPage, currentPage, totalItems })),
        );
    }

    filesSelected(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            this.dataService.product.createAssets(Array.from(files)).subscribe(res => {
                super.refresh();
                this.notificationService.success('catalog.notify-create-assets-success', {
                    count: files.length,
                });
            });
        }
    }
}
