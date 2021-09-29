import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { BaseListComponent, PromotionFilterParameter, PromotionListOptions } from '@vendure/admin-ui/core';
import { GetPromotionList } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';
import { EMPTY, merge } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

export type PromotionSearchForm = {
    name: string;
    couponCode: string;
};

@Component({
    selector: 'vdr-promotion-list',
    templateUrl: './promotion-list.component.html',
    styleUrls: ['./promotion-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionListComponent
    extends BaseListComponent<GetPromotionList.Query, GetPromotionList.Items>
    implements OnInit {
    searchForm = new FormGroup({
        name: new FormControl(''),
        couponCode: new FormControl(''),
    });

    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.promotion.getPromotions(...args).refetchOnChannelChange(),
            data => data.promotions,
            (skip, take) => this.createQueryOptions(skip, take, this.searchForm.value),
        );
    }

    ngOnInit(): void {
        super.ngOnInit();

        merge(this.searchForm.valueChanges.pipe(debounceTime(250)), this.route.queryParamMap)
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                if (!val.params) {
                    this.setPageNumber(1);
                }
                this.refresh();
            });
    }

    deletePromotion(promotionId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-promotion'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.promotion.deletePromotion(promotionId) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Promotion',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Promotion',
                    });
                },
            );
    }

    private createQueryOptions(
        skip: number,
        take: number,
        searchForm: PromotionSearchForm,
    ): { options: PromotionListOptions } {
        const filter: PromotionFilterParameter = {};

        if (searchForm.couponCode) {
            filter.couponCode = { contains: searchForm.couponCode };
        }

        if (searchForm.name) {
            filter.name = { contains: searchForm.name };
        }

        return {
            options: {
                skip,
                take,
                filter,
            },
        };
    }
}
