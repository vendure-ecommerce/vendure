import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreatePaymentMethodInput,
    CreatePromotionInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    encodeConfigArgValue,
    findTranslation,
    getConfigArgValue,
    getDefaultConfigArgValue,
    LanguageCode,
    NotificationService,
    PaymentMethodFragment,
    PromotionFragment,
    ServerConfigService,
    toConfigurableOperationInput,
    UpdatePaymentMethodInput,
    UpdatePromotionInput,
} from '@vendure/admin-ui/core';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    styleUrls: ['./promotion-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDetailComponent
    extends BaseDetailComponent<PromotionFragment>
    implements OnInit, OnDestroy
{
    promotion$: Observable<PromotionFragment>;
    detailForm: FormGroup;
    customFields: CustomFieldConfig[];
    conditions: ConfigurableOperation[] = [];
    actions: ConfigurableOperation[] = [];

    private allConditions: ConfigurableOperationDefinition[] = [];
    private allActions: ConfigurableOperationDefinition[] = [];

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Promotion');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: '',
            enabled: true,
            couponCode: null,
            perCustomerUsageLimit: null,
            startsAt: null,
            endsAt: null,
            conditions: this.formBuilder.array([]),
            actions: this.formBuilder.array([]),
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.promotion$ = this.entity$;
        this.dataService.promotion.getPromotionActionsAndConditions().single$.subscribe(data => {
            this.allActions = data.promotionActions;
            this.allConditions = data.promotionConditions;
            this.changeDetector.markForCheck();
        });
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
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([promotion, languageCode]) => {
                    const input = this.getUpdatedPromotion(
                        promotion,
                        this.detailForm,
                        languageCode,
                    ) as CreatePromotionInput;
                    return this.dataService.promotion.createPromotion(input);
                }),
            )
            .subscribe(
                ({ createPromotion }) => {
                    switch (createPromotion.__typename) {
                        case 'Promotion':
                            this.notificationService.success(_('common.notify-create-success'), {
                                entity: 'Promotion',
                            });
                            this.detailForm.markAsPristine();
                            this.changeDetector.markForCheck();
                            this.router.navigate(['../', createPromotion.id], { relativeTo: this.route });
                            break;
                        case 'MissingConditionsError':
                            this.notificationService.error(createPromotion.message);
                            break;
                    }
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
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([paymentMethod, languageCode]) => {
                    const input = this.getUpdatedPromotion(
                        paymentMethod,
                        this.detailForm,
                        languageCode,
                    ) as UpdatePromotionInput;
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
     * Given a PaymentMethod and the value of the detailForm, this method creates an updated copy of it which
     * can then be persisted to the API.
     */
    private getUpdatedPromotion(
        promotion: PromotionFragment,
        formGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdatePromotionInput | CreatePromotionInput {
        const formValue = formGroup.value;
        const input = createUpdatedTranslatable({
            translatable: promotion,
            updatedFields: formValue,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: promotion.name || '',
                description: promotion.description || '',
            },
        });

        return {
            ...input,
            conditions: this.mapOperationsToInputs(this.conditions, formValue.conditions),
            actions: this.mapOperationsToInputs(this.actions, formValue.actions),
        };
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: PromotionFragment, languageCode: LanguageCode): void {
        const currentTranslation = findTranslation(entity, languageCode);
        this.detailForm.patchValue({
            name: currentTranslation?.name,
            description: currentTranslation?.description,
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
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity);
        }
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
                    value: encodeConfigArgValue(value),
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
                    [arg.name]:
                        getConfigArgValue(arg.value) ?? this.getDefaultArgValue(key, operation, arg.name),
                }),
                {},
            );
            operationsArray.push(
                this.formBuilder.control({
                    code: operation.code,
                    args: argsHash,
                }),
            );
            collection.push({
                code: operation.code,
                args: operation.args.map(a => ({ name: a.name, value: getConfigArgValue(a.value) })),
            });
        }
    }

    private getDefaultArgValue(
        key: 'conditions' | 'actions',
        operation: ConfigurableOperation,
        argName: string,
    ) {
        const def =
            key === 'conditions'
                ? this.allConditions.find(c => c.code === operation.code)
                : this.allActions.find(a => a.code === operation.code);
        if (def) {
            const argDef = def.args.find(a => a.name === argName);
            if (argDef) {
                return getDefaultConfigArgValue(argDef);
            }
        }
        throw new Error(`Could not determine default value for "argName"`);
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
