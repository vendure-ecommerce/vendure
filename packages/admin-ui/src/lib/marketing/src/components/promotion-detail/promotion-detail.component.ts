import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreatePromotionInput,
    DataService,
    FacetWithValues,
    GetActiveChannel,
    getDefaultConfigArgValue,
    LanguageCode,
    NotificationService,
    Promotion,
    ServerConfigService,
    UpdatePromotionInput,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    styleUrls: ['./promotion-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDetailComponent extends BaseDetailComponent<Promotion.Fragment>
    implements OnInit, OnDestroy {
    promotion$: Observable<Promotion.Fragment>;
    detailForm: FormGroup;
    conditions: ConfigurableOperation[] = [];
    actions: ConfigurableOperation[] = [];
    facets$: Observable<FacetWithValues.Fragment[]>;
    activeChannel$: Observable<GetActiveChannel.ActiveChannel>;

    private allConditions: ConfigurableOperationDefinition[] = [];
    private allActions: ConfigurableOperationDefinition[] = [];

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
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            enabled: true,
            couponCode: null,
            perCustomerUsageLimit: null,
            startsAt: null,
            endsAt: null,
            conditions: this.formBuilder.array([]),
            actions: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.init();
        this.facets$ = this.dataService.facet
            .getFacets(9999999, 0)
            .mapSingle(data => data.facets.items)
            .pipe(shareReplay(1));

        this.promotion$ = this.entity$;
        this.dataService.promotion.getPromotionActionsAndConditions().single$.subscribe(data => {
            this.allActions = data.promotionActions;
            this.allConditions = data.promotionConditions;
        });
        this.activeChannel$ = this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel);

        // When creating a new Promotion, the initial bindings do not work
        // unless explicitly re-running the change detector. Don't know why.
        setTimeout(() => this.changeDetector.markForCheck(), 0);
    }

    ngOnDestroy() {
        this.destroy();
    }

    getAvailableConditions(): ConfigurableOperationDefinition[] {
        return this.allConditions.filter(o => !this.conditions.find(c => c.code === o.code));
    }

    getConditionDefinition(condition: ConfigurableOperation): ConfigurableOperationDefinition | undefined {
        return this.allConditions.find(c => c.code === condition.code);
    }

    getAvailableActions(): ConfigurableOperationDefinition[] {
        return this.allActions.filter(o => !this.actions.find(a => a.code === o.code));
    }

    getActionDefinition(action: ConfigurableOperation): ConfigurableOperationDefinition | undefined {
        return this.allActions.find(c => c.code === action.code);
    }

    saveButtonEnabled(): boolean {
        return (
            this.detailForm.dirty &&
            this.detailForm.valid &&
            (this.conditions.length !== 0 || this.detailForm.value.couponCode) &&
            this.actions.length !== 0
        );
    }

    addCondition(condition: ConfigurableOperation) {
        this.addOperation('conditions', condition);
        this.detailForm.markAsDirty();
    }

    addAction(action: ConfigurableOperation) {
        this.addOperation('actions', action);
        this.detailForm.markAsDirty();
    }

    removeCondition(condition: ConfigurableOperation) {
        this.removeOperation('conditions', condition);
        this.detailForm.markAsDirty();
    }

    removeAction(action: ConfigurableOperation) {
        this.removeOperation('actions', action);
        this.detailForm.markAsDirty();
    }

    formArrayOf(key: 'conditions' | 'actions'): FormArray {
        return this.detailForm.get(key) as FormArray;
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        const input: CreatePromotionInput = {
            name: formValue.name,
            enabled: true,
            couponCode: formValue.couponCode,
            perCustomerUsageLimit: formValue.perCustomerUsageLimit,
            startsAt: formValue.startsAt,
            endsAt: formValue.endsAt,
            conditions: this.mapOperationsToInputs(this.conditions, formValue.conditions),
            actions: this.mapOperationsToInputs(this.actions, formValue.actions),
        };
        this.dataService.promotion.createPromotion(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), { entity: 'Promotion' });
                this.detailForm.markAsPristine();
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
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        this.promotion$
            .pipe(
                take(1),
                mergeMap(promotion => {
                    const input: UpdatePromotionInput = {
                        id: promotion.id,
                        name: formValue.name,
                        enabled: formValue.enabled,
                        couponCode: formValue.couponCode,
                        perCustomerUsageLimit: formValue.perCustomerUsageLimit,
                        startsAt: formValue.startsAt,
                        endsAt: formValue.endsAt,
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
                    this.detailForm.markAsPristine();
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
        this.detailForm.patchValue({
            name: entity.name,
            enabled: entity.enabled,
            couponCode: entity.couponCode,
            perCustomerUsageLimit: entity.perCustomerUsageLimit,
            startsAt: entity.startsAt,
            endsAt: entity.endsAt,
        });
        entity.conditions.forEach(o => {
            this.addOperation('conditions', o);
        });
        entity.actions.forEach(o => this.addOperation('actions', o));
    }

    /**
     * Maps an array of conditions or actions to the input format expected by the GraphQL API.
     */
    private mapOperationsToInputs(
        operations: ConfigurableOperation[],
        formValueOperations: any,
    ): ConfigurableOperationInput[] {
        return operations.map((o, i) => {
            return {
                code: o.code,
                arguments: Object.values<any>(formValueOperations[i].args).map((value, j) => ({
                    name: o.args[j].name,
                    value: value.toString(),
                    type: o.args[j].type,
                })),
            };
        });
    }

    /**
     * Adds a new condition or action to the promotion.
     */
    private addOperation(key: 'conditions' | 'actions', operation: ConfigurableOperation) {
        const operationsArray = this.formArrayOf(key);
        const collection = key === 'conditions' ? this.conditions : this.actions;
        const index = operationsArray.value.findIndex(o => o.code === operation.code);
        if (index === -1) {
            const argsHash = operation.args.reduce(
                (output, arg) => ({
                    ...output,
                    [arg.name]: arg.value != null ? arg.value : getDefaultConfigArgValue(arg),
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
    private removeOperation(key: 'conditions' | 'actions', operation: ConfigurableOperation) {
        const operationsArray = this.formArrayOf(key);
        const collection = key === 'conditions' ? this.conditions : this.actions;
        const index = operationsArray.value.findIndex(o => o.code === operation.code);
        if (index !== -1) {
            operationsArray.removeAt(index);
            collection.splice(index, 1);
        }
    }
}
