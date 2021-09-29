import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    configurableDefinitionToInstance,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    CreateShippingMethodInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    findTranslation,
    GetActiveChannel,
    getConfigArgValue,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    ShippingMethod,
    TestShippingMethodInput,
    TestShippingMethodResult,
    toConfigurableOperationInput,
    UpdateShippingMethodInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

import { TestAddress } from '../test-address-form/test-address-form.component';
import { TestOrderLine } from '../test-order-builder/test-order-builder.component';

@Component({
    selector: 'vdr-shipping-method-detail',
    templateUrl: './shipping-method-detail.component.html',
    styleUrls: ['./shipping-method-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodDetailComponent
    extends BaseDetailComponent<ShippingMethod.Fragment>
    implements OnInit, OnDestroy {
    detailForm: FormGroup;
    checkers: ConfigurableOperationDefinition[] = [];
    calculators: ConfigurableOperationDefinition[] = [];
    fulfillmentHandlers: ConfigurableOperationDefinition[] = [];
    selectedChecker?: ConfigurableOperation | null;
    selectedCheckerDefinition?: ConfigurableOperationDefinition;
    selectedCalculator?: ConfigurableOperation | null;
    selectedCalculatorDefinition?: ConfigurableOperationDefinition;
    activeChannel$: Observable<GetActiveChannel.ActiveChannel>;
    testAddress: TestAddress;
    testOrderLines: TestOrderLine[];
    testDataUpdated = false;
    testResult$: Observable<TestShippingMethodResult | undefined>;
    customFields: CustomFieldConfig[];
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdateShippingMethod];
    private fetchTestResult$ = new Subject<[TestAddress, TestOrderLine[]]>();

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
        this.customFields = this.getCustomFieldConfig('ShippingMethod');
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: '',
            fulfillmentHandler: ['', Validators.required],
            checker: {},
            calculator: {},
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        combineLatest([
            this.dataService.shippingMethod.getShippingMethodOperations().single$,
            this.entity$.pipe(take(1)),
        ]).subscribe(([data, entity]) => {
            this.checkers = data.shippingEligibilityCheckers;
            this.calculators = data.shippingCalculators;
            this.fulfillmentHandlers = data.fulfillmentHandlers;
            this.changeDetector.markForCheck();
            this.selectedCheckerDefinition = data.shippingEligibilityCheckers.find(
                c => c.code === (entity.checker && entity.checker.code),
            );
            this.selectedCalculatorDefinition = data.shippingCalculators.find(
                c => c.code === (entity.calculator && entity.calculator.code),
            );
        });

        this.activeChannel$ = this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel);

        this.testResult$ = this.fetchTestResult$.pipe(
            switchMap(([address, lines]) => {
                if (!this.selectedChecker || !this.selectedCalculator) {
                    return of(undefined);
                }
                const formValue = this.detailForm.value;
                const input: TestShippingMethodInput = {
                    shippingAddress: { ...address, streetLine1: 'test' },
                    lines: lines.map(l => ({ productVariantId: l.id, quantity: l.quantity })),
                    checker: toConfigurableOperationInput(this.selectedChecker, formValue.checker),
                    calculator: toConfigurableOperationInput(this.selectedCalculator, formValue.calculator),
                };
                return this.dataService.shippingMethod
                    .testShippingMethod(input)
                    .mapSingle(result => result.testShippingMethod);
            }),
        );

        // tslint:disable:no-non-null-assertion
        merge(
            this.detailForm.get(['checker'])!.valueChanges,
            this.detailForm.get(['calculator'])!.valueChanges,
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => (this.testDataUpdated = true));
        // tslint:enable:no-non-null-assertion
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['customFields', name]);
    }

    updateCode(currentCode: string, nameValue: string) {
        if (!currentCode) {
            const codeControl = this.detailForm.get(['code']);
            if (codeControl && codeControl.pristine) {
                codeControl.setValue(normalizeString(nameValue, '-'));
            }
        }
    }

    selectChecker(checker: ConfigurableOperationDefinition) {
        this.selectedCheckerDefinition = checker;
        this.selectedChecker = configurableDefinitionToInstance(checker);
        const formControl = this.detailForm.get('checker');
        if (formControl) {
            formControl.clearValidators();
            formControl.updateValueAndValidity({ onlySelf: true });
            formControl.patchValue(this.selectedChecker);
        }
        this.detailForm.markAsDirty();
    }

    selectCalculator(calculator: ConfigurableOperationDefinition) {
        this.selectedCalculatorDefinition = calculator;
        this.selectedCalculator = configurableDefinitionToInstance(calculator);
        const formControl = this.detailForm.get('calculator');
        if (formControl) {
            formControl.clearValidators();
            formControl.updateValueAndValidity({ onlySelf: true });
            formControl.patchValue(this.selectedCalculator);
        }
        this.detailForm.markAsDirty();
    }

    create() {
        const selectedChecker = this.selectedChecker;
        const selectedCalculator = this.selectedCalculator;
        if (!selectedChecker || !selectedCalculator) {
            return;
        }
        combineLatest([this.entity$, this.languageCode$])
            .pipe(
                take(1),
                mergeMap(([shippingMethod, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input = {
                        ...(this.getUpdatedShippingMethod(
                            shippingMethod,
                            this.detailForm,
                            languageCode,
                        ) as CreateShippingMethodInput),
                        checker: toConfigurableOperationInput(selectedChecker, formValue.checker),
                        calculator: toConfigurableOperationInput(selectedCalculator, formValue.calculator),
                    };
                    return this.dataService.shippingMethod.createShippingMethod(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'ShippingMethod',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createShippingMethod.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'ShippingMethod',
                    });
                },
            );
    }

    save() {
        const selectedChecker = this.selectedChecker;
        const selectedCalculator = this.selectedCalculator;
        if (!selectedChecker || !selectedCalculator) {
            return;
        }
        combineLatest([this.entity$, this.languageCode$])
            .pipe(
                take(1),
                mergeMap(([shippingMethod, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input = {
                        ...(this.getUpdatedShippingMethod(
                            shippingMethod,
                            this.detailForm,
                            languageCode,
                        ) as UpdateShippingMethodInput),
                        checker: toConfigurableOperationInput(selectedChecker, formValue.checker),
                        calculator: toConfigurableOperationInput(selectedCalculator, formValue.calculator),
                    };
                    return this.dataService.shippingMethod.updateShippingMethod(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'ShippingMethod',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'ShippingMethod',
                    });
                },
            );
    }

    setTestOrderLines(event: TestOrderLine[]) {
        this.testOrderLines = event;
        this.testDataUpdated = true;
    }

    setTestAddress(event: TestAddress) {
        this.testAddress = event;
        this.testDataUpdated = true;
    }

    allTestDataPresent(): boolean {
        return !!(
            this.testAddress &&
            this.testOrderLines &&
            this.testOrderLines.length &&
            this.selectedChecker &&
            this.selectedCalculator
        );
    }

    runTest() {
        this.fetchTestResult$.next([this.testAddress, this.testOrderLines]);
        this.testDataUpdated = false;
    }

    /**
     * Given a ShippingMethod and the value of the detailForm, this method creates an updated copy which
     * can then be persisted to the API.
     */
    private getUpdatedShippingMethod(
        shippingMethod: ShippingMethod.Fragment,
        formGroup: FormGroup,
        languageCode: LanguageCode,
    ): Omit<CreateShippingMethodInput | UpdateShippingMethodInput, 'checker' | 'calculator'> {
        const formValue = formGroup.value;
        const input = createUpdatedTranslatable({
            translatable: shippingMethod,
            updatedFields: formValue,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: shippingMethod.name || '',
                description: shippingMethod.description || '',
            },
        });
        return { ...input, fulfillmentHandler: formValue.fulfillmentHandler };
    }

    protected setFormValues(shippingMethod: ShippingMethod.Fragment, languageCode: LanguageCode): void {
        const currentTranslation = findTranslation(shippingMethod, languageCode);
        this.detailForm.patchValue({
            name: currentTranslation?.name ?? '',
            description: currentTranslation?.description ?? '',
            code: shippingMethod.code,
            fulfillmentHandler: shippingMethod.fulfillmentHandlerCode,
            checker: shippingMethod.checker || {},
            calculator: shippingMethod.calculator || {},
        });
        if (!this.selectedChecker) {
            this.selectedChecker = shippingMethod.checker && {
                code: shippingMethod.checker.code,
                args: shippingMethod.checker.args.map(a => ({ ...a, value: getConfigArgValue(a.value) })),
            };
        }
        if (!this.selectedCalculator) {
            this.selectedCalculator = shippingMethod.calculator && {
                code: shippingMethod.calculator?.code,
                args: shippingMethod.calculator?.args.map(a => ({ ...a, value: getConfigArgValue(a.value) })),
            };
        }
        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get('customFields') as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value =
                    fieldDef.type === 'localeString'
                        ? (currentTranslation as any).customFields[key]
                        : (shippingMethod as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }
    }
}
