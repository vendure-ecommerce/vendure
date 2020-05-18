import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    BaseListComponent,
    DataService,
    DeletionResult,
    GetAssetList,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-shop-types';
import { PaginationInstance } from 'ngx-pagination';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vdr-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent extends BaseListComponent<GetAssetList.Query, GetAssetList.Items>
    implements OnInit {
    searchTerm = new FormControl('');
    uploading = false;
    paginationConfig$: Observable<PaginationInstance>;

    constructor(
        private notificationService: NotificationService,
        private modalService: ModalService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getAssetList(...args),
            (data) => data.assets,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTerm.value,
                        },
                    },
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.paginationConfig$ = combineLatest(this.itemsPerPage$, this.currentPage$, this.totalItems$).pipe(
            map(([itemsPerPage, currentPage, totalItems]) => ({ itemsPerPage, currentPage, totalItems })),
        );
        this.searchTerm.valueChanges
            .pipe(debounceTime(250), takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
    }

    filesSelected(files: File[]) {
        if (files.length) {
            this.uploading = true;
            this.dataService.product
                .createAssets(files)
                .pipe(finalize(() => (this.uploading = false)))
                .subscribe((res) => {
                    super.refresh();
                    this.notificationService.success(_('asset.notify-create-assets-success'), {
                        count: files.length,
                    });
                });
        }
    }

    deleteAsset(asset: Asset) {
        this.showModalAndDelete(asset.id)
            .pipe(
                switchMap((response) => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(asset.id, response.message || '').pipe(
                            map((r) => r.result === DeletionResult.DELETED),
                        );
                    }
                }),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Asset',
                    });
                    this.refresh();
                },
                (err) => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Asset',
                    });
                },
            );
    }

    private showModalAndDelete(assetId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-asset'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap((res) => (res ? this.dataService.product.deleteAsset(assetId, !!message) : EMPTY)),
                map((res) => res.deleteAsset),
            );
    }
}
