import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {
    AdjustmentOperation,
    AdjustmentSource,
    AdjustmentType,
    CreateAdjustmentSourceInput,
    LanguageCode,
    UpdateAdjustmentSourceInput,
} from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-tax-detail',
    templateUrl: './tax-category-detail.component.html',
    styleUrls: ['./tax-category-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryDetailComponent extends BaseDetailComponent<AdjustmentSource.Fragment>
    implements OnInit, OnDestroy {
    taxCategory$: Observable<AdjustmentSource.Fragment>;
    taxCategoryForm: FormGroup;

    private taxCondition: AdjustmentOperation;
    private taxAction: AdjustmentOperation;

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.taxCategoryForm = this.formBuilder.group({
            name: ['', Validators.required],
            taxRate: [0, Validators.required],
        });
    }

    ngOnInit() {
        this.init();
        this.taxCategory$ = this.entity$;
        const allOperations$ = this.dataService.adjustmentSource
            .getAdjustmentOperations(AdjustmentType.TAX)
            .single$.subscribe(data => {
                this.taxCondition = data.adjustmentOperations.conditions[0];
                this.taxAction = data.adjustmentOperations.actions[0];
            });
    }

    ngOnDestroy() {
        this.destroy();
    }

    saveButtonEnabled(): boolean {
        return this.taxCategoryForm.dirty && this.taxCategoryForm.valid;
    }

    create() {
        if (!this.taxCategoryForm.dirty) {
            return;
        }
        const formValue = this.taxCategoryForm.value;
        const input = this.createAdjustmentSourceInput(formValue.name, formValue.taxRate);
        this.dataService.adjustmentSource.createTaxCategory(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'TaxCategory',
                });
                this.taxCategoryForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createAdjustmentSource.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'TaxCategory',
                });
            },
        );
    }

    save() {
        if (!this.taxCategoryForm.dirty) {
            return;
        }
        const formValue = this.taxCategoryForm.value;
        this.taxCategory$
            .pipe(
                take(1),
                mergeMap(taxCategory => {
                    const input = this.createAdjustmentSourceInput(
                        formValue.name,
                        formValue.taxRate,
                        taxCategory.id,
                    );
                    return this.dataService.adjustmentSource.updatePromotion(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'TaxCategory',
                    });
                    this.taxCategoryForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'TaxCategory',
                    });
                },
            );
    }

    private createAdjustmentSourceInput(name: string, taxRate: number): CreateAdjustmentSourceInput;
    private createAdjustmentSourceInput(
        name: string,
        taxRate: number,
        id: string,
    ): UpdateAdjustmentSourceInput;
    private createAdjustmentSourceInput(
        name: string,
        taxRate: number,
        id?: string,
    ): CreateAdjustmentSourceInput | UpdateAdjustmentSourceInput {
        const input = {
            name,
            conditions: [
                {
                    code: this.taxCondition.code,
                    arguments: [],
                },
            ],
            actions: [
                {
                    code: this.taxAction.code,
                    arguments: [taxRate.toString()],
                },
            ],
        };
        if (id !== undefined) {
            return { ...input, id };
        } else {
            return { ...input, type: AdjustmentType.TAX, enabled: true } as CreateAdjustmentSourceInput;
        }
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: AdjustmentSource.Fragment, languageCode: LanguageCode): void {
        const action = entity.actions[0];
        this.taxCategoryForm.patchValue({
            name: entity.name,
            taxRate: action ? action.args[0].value : 0,
        });
    }
}
