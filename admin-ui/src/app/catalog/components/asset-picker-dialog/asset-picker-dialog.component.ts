import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Asset, GetAssetList, GetAssetListVariables } from 'shared/generated-types';

import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { QueryResult } from '../../../data/query-result';
import { Dialog } from '../../../shared/providers/modal/modal.service';

/**
 * A dialog which allows the creation and selection of assets.
 */
@Component({
    selector: 'vdr-asset-picker-dialog',
    templateUrl: './asset-picker-dialog.component.html',
    styleUrls: ['./asset-picker-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPickerDialogComponent implements OnInit, Dialog<Asset[]> {
    assets$: Observable<Asset[]>;
    paginationConfig: PaginationInstance = {
        currentPage: 1,
        itemsPerPage: 25,
        totalItems: 1,
    };

    resolveWith: (result?: Asset[]) => void;
    selection: Asset[] = [];
    private listQuery: QueryResult<GetAssetList, GetAssetListVariables>;

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    ngOnInit() {
        this.listQuery = this.dataService.product.getAssetList(this.paginationConfig.itemsPerPage, 0);
        this.assets$ = this.listQuery.stream$.pipe(
            tap(result => (this.paginationConfig.totalItems = result.assets.totalItems)),
            map(result => result.assets.items),
        );
    }

    pageChange(page: number) {
        this.paginationConfig.currentPage = page;
        this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
    }

    itemsPerPageChange(itemsPerPage: number) {
        this.paginationConfig.itemsPerPage = itemsPerPage;
        this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
    }

    cancel() {
        this.resolveWith();
    }

    select() {
        this.resolveWith(this.selection);
    }

    createAssets(files: File[]) {
        if (files.length) {
            this.dataService.product.createAssets(files).subscribe(res => {
                this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
                this.notificationService.success(_('catalog.notify-create-assets-success'), {
                    count: files.length,
                });
            });
        }
    }

    private fetchPage(currentPage: number, itemsPerPage: number) {
        const take = +itemsPerPage;
        const skip = (currentPage - 1) * +itemsPerPage;
        this.listQuery.ref.refetch({ options: { skip, take } });
    }
}
