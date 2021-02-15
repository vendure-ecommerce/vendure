import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { PaginationInstance } from 'ngx-pagination';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, takeUntil, tap } from 'rxjs/operators';

import {
    Asset,
    GetAssetList,
    LogicalOperator,
    SortOrder,
    TagFragment,
} from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { QueryResult } from '../../../data/query-result';
import { Dialog } from '../../../providers/modal/modal.service';
import { NotificationService } from '../../../providers/notification/notification.service';

/**
 * A dialog which allows the creation and selection of assets.
 */
@Component({
    selector: 'vdr-asset-picker-dialog',
    templateUrl: './asset-picker-dialog.component.html',
    styleUrls: ['./asset-picker-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPickerDialogComponent implements OnInit, OnDestroy, Dialog<Asset[]> {
    assets$: Observable<GetAssetList.Items[]>;
    allTags$: Observable<TagFragment[]>;
    paginationConfig: PaginationInstance = {
        currentPage: 1,
        itemsPerPage: 25,
        totalItems: 1,
    };

    multiSelect = true;

    resolveWith: (result?: Asset[]) => void;
    selection: Asset[] = [];
    searchTerm$ = new BehaviorSubject<string | undefined>(undefined);
    filterByTags$ = new BehaviorSubject<TagFragment[] | undefined>(undefined);
    uploading = false;
    private listQuery: QueryResult<GetAssetList.Query, GetAssetList.Variables>;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    ngOnInit() {
        this.listQuery = this.dataService.product.getAssetList(this.paginationConfig.itemsPerPage, 0);
        this.allTags$ = this.dataService.product.getTagList().mapSingle(data => data.tags.items);
        this.assets$ = this.listQuery.stream$.pipe(
            tap(result => (this.paginationConfig.totalItems = result.assets.totalItems)),
            map(result => result.assets.items),
        );
        this.searchTerm$.pipe(debounceTime(250), takeUntil(this.destroy$)).subscribe(() => {
            this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
        });
        this.filterByTags$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
            this.uploading = true;
            this.dataService.product
                .createAssets(files)
                .pipe(finalize(() => (this.uploading = false)))
                .subscribe(res => {
                    this.fetchPage(this.paginationConfig.currentPage, this.paginationConfig.itemsPerPage);
                    this.notificationService.success(_('asset.notify-create-assets-success'), {
                        count: files.length,
                    });
                });
        }
    }

    private fetchPage(currentPage: number, itemsPerPage: number) {
        const take = +itemsPerPage;
        const skip = (currentPage - 1) * +itemsPerPage;
        const searchTerm = this.searchTerm$.value;
        const tags = this.filterByTags$.value?.map(t => t.value);
        this.listQuery.ref.refetch({
            options: {
                skip,
                take,
                filter: {
                    name: {
                        contains: searchTerm,
                    },
                },
                sort: {
                    createdAt: SortOrder.DESC,
                },
                tags,
                tagsOperator: LogicalOperator.AND,
            },
        });
    }
}
