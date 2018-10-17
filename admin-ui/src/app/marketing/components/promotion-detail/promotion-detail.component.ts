import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {
    AdjustmentOperation,
    AdjustmentOperationInput,
    CreatePromotionInput,
    LanguageCode,
    Promotion,
    UpdatePromotionInput,
} from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    styleUrls: ['./promotion-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDetailComponent extends BaseDetailComponent<Promotion.Fragment>
    implements OnInit, OnDestroy {
    promotion$: Observable<Promotion.Fragment>;
    promotionForm: FormGroup;
    conditions: AdjustmentOperation[] = [];
    actions: AdjustmentOperation[] = [];

    private allConditions: AdjustmentOperation[];
    private allActions: AdjustmentOperation[];

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
        this.promotionForm = this.formBuilder.group({
            name: ['', Validators.required],
            conditions: this.formBuilder.array([]),
            actions: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.init();
        this.promotion$ = this.entity$;
        this.dataService.promotion.getAdjustmentOperations().single$.subscribe(data => {
            this.allActions = data.adjustmentOperations.actions;
            this.allConditions = data.adjustmentOperations.conditions;
        });
    }

    ngOnDestroy() {
        this.destroy();
    }

    getAvailableConditions(): AdjustmentOperation[] {
        return this.allConditions.filter(o => !this.conditions.find(c => c.code === o.code));
    }

    getAvailableActions(): AdjustmentOperation[] {
        return this.allActions.filter(o => !this.actions.find(a => a.code === o.code));
    }

    saveButtonEnabled(): boolean {
        return (
            this.promotionForm.dirty &&
            this.promotionForm.valid &&
            this.conditions.length !== 0 &&
            this.actions.length !== 0
        );
    }

    addCondition(condition: AdjustmentOperation) {
        this.addOperation('conditions', condition);
        this.promotionForm.markAsDirty();
    }

    addAction(action: AdjustmentOperation) {
        this.addOperation('actions', action);
        this.promotionForm.markAsDirty();
    }

    removeCondition(condition: AdjustmentOperation) {
        this.removeOperation('conditions', condition);
        this.promotionForm.markAsDirty();
    }

    removeAction(action: AdjustmentOperation) {
        this.removeOperation('actions', action);
        this.promotionForm.markAsDirty();
    }

    formArrayOf(key: 'conditions' | 'actions'): FormArray {
        return this.promotionForm.get(key) as FormArray;
    }

    create() {
        if (!this.promotionForm.dirty) {
            return;
        }
        const formValue = this.promotionForm.value;
        const input: CreatePromotionInput = {
            name: formValue.name,
            enabled: true,
            conditions: this.mapOperationsToInputs(this.conditions, formValue.conditions),
            actions: this.mapOperationsToInputs(this.actions, formValue.actions),
        };
        this.dataService.promotion.createPromotion(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), { entity: 'Promotion' });
                this.promotionForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createPromotion.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Promotion',
                });
            },
        );
    }

    save() {
        if (!this.promotionForm.dirty) {
            return;
        }
        const formValue = this.promotionForm.value;
        this.promotion$
            .pipe(
                take(1),
                mergeMap(promotion => {
                    const input: UpdatePromotionInput = {
                        id: promotion.id,
                        name: formValue.name,
                        conditions: this.mapOperationsToInputs(this.conditions, formValue.conditions),
                        actions: this.mapOperationsToInputs(this.actions, formValue.actions),
                    };
                    return this.dataService.promotion.updatePromotion(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Promotion',
                    });
                    this.promotionForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Promotion',
                    });
                },
            );
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: Promotion.Fragment, languageCode: LanguageCode): void {
        this.promotionForm.patchValue({ name: entity.name });
        entity.conditions.forEach(o => {
            this.addOperation('conditions', o);
        });
        entity.actions.forEach(o => this.addOperation('actions', o));
    }

    /**
     * Maps an array of conditions or actions to the input format expected by the GraphQL API.
     */
    private mapOperationsToInputs(
        operations: AdjustmentOperation[],
        formValueOperations: any,
    ): AdjustmentOperationInput[] {
        return operations.map((o, i) => {
            return {
                code: o.code,
                arguments: Object.values(formValueOperations[i].args).map((value, j) => ({
                    name: o.args[j].name,
                    value: value.toString(),
                })),
            };
        });
    }

    /**
     * Adds a new condition or action to the promotion.
     */
    private addOperation(key: 'conditions' | 'actions', operation: AdjustmentOperation) {
        const operationsArray = this.formArrayOf(key);
        const collection = key === 'conditions' ? this.conditions : this.actions;
        const index = operationsArray.value.findIndex(o => o.code === operation.code);
        if (index === -1) {
            const argsHash = operation.args.reduce(
                (output, arg) => ({
                    ...output,
                    [arg.name]: arg.value,
                }),
                {},
            );
            operationsArray.push(
                this.formBuilder.control({
                    code: operation.code,
                    args: argsHash,
                }),
            );
            collection.push(operation);
        }
    }

    /**
     * Removes a condition or action from the promotion.
     */
    private removeOperation(key: 'conditions' | 'actions', operation: AdjustmentOperation) {
        const operationsArray = this.formArrayOf(key);
        const collection = key === 'conditions' ? this.conditions : this.actions;
        const index = operationsArray.value.findIndex(o => o.code === operation.code);
        if (index !== -1) {
            operationsArray.removeAt(index);
            collection.splice(index, 1);
        }
    }
}
