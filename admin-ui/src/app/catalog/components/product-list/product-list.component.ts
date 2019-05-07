import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';

import { BaseListComponent } from '../../../common/base-list.component';
import { DeletionResult, GetProductList, SearchProducts } from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends BaseListComponent<SearchProducts.Query, SearchProducts.Items, SearchProducts.Variables>
    implements OnInit {
    searchForm: FormGroup | undefined;
    groupByProduct = true;
    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) =>
                this.dataService.product.searchProducts(this.getFormValue('searchTerm', ''), ...args),
            data => data.search,
            (skip, take) => ({
                input: {
                    skip,
                    take,
                    term: this.getFormValue('searchTerm', ''),
                    groupByProduct: this.getFormValue('groupByProduct', true),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchForm = new FormGroup({
            searchTerm: new FormControl(''),
            groupByProduct: new FormControl(true),
        });
        this.searchForm.valueChanges
            .pipe(
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }

    deleteProduct(productId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-product'),
                buttons: [
                    { type: 'seconday', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response => (response ? this.dataService.product.deleteProduct(productId) : EMPTY)),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Product',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    private getFormValue<T>(controlName: string, defaultValue: T): T {
        if (!this.searchForm) {
            return defaultValue;
        }
        const control = this.searchForm.get(controlName);
        if (control) {
            return control.value;
        } else {
            throw new Error(`Form does not contain a control named ${controlName}`);
        }
    }
}
