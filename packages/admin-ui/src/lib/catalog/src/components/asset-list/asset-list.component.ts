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
export class AssetListComponent
    extends BaseListComponent<GetAssetList.Query, GetAssetList.Items>
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
            data => data.assets,
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
                .subscribe(({ createAssets }) => {
                    let successCount = 0;
                    for (const result of createAssets) {
                        switch (result.__typename) {
                            case 'Asset':
                                successCount++;
                                break;
                            case 'MimeTypeError':
                                this.notificationService.error(result.message);
                                break;
                        }
                    }
                    if (0 < successCount) {
                        super.refresh();
                        this.notificationService.success(_('asset.notify-create-assets-success'), {
                            count: successCount,
                        });
                    }
                });
        }
    }

    deleteAssets(assets: Asset[]) {
        this.showModalAndDelete(assets.map(a => a.id))
            .pipe(
                switchMap(response => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(
                            assets.map(a => a.id),
                            response.message || '',
                        ).pipe(map(r => r.result === DeletionResult.DELETED));
                    }
                }),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Assets',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Assets',
                    });
                },
            );
    }

    private showModalAndDelete(assetIds: string[], message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-assets'),
                translationVars: {
                    count: assetIds.length,
                },
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res => (res ? this.dataService.product.deleteAssets(assetIds, !!message) : EMPTY)),
                map(res => res.deleteAssets),
            );
    }
}
