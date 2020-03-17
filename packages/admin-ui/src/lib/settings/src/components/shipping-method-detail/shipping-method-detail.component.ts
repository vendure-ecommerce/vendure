import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreateShippingMethodInput,
    DataService,
    GetActiveChannel,
    getDefaultConfigArgValue,
    NotificationService,
    ServerConfigService,
    ShippingMethod,
    TestShippingMethodInput,
    TestShippingMethodResult,
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
export class ShippingMethodDetailComponent extends BaseDetailComponent<ShippingMethod.Fragment>
    implements OnInit, OnDestroy {
    detailForm: FormGroup;
    checkers: ConfigurableOperationDefinition[] = [];
    calculators: ConfigurableOperationDefinition[] = [];
    selectedChecker?: ConfigurableOperation | null;
    selectedCheckerDefinition?: ConfigurableOperationDefinition;
    selectedCalculator?: ConfigurableOperation | null;
    selectedCalculatorDefinition?: ConfigurableOperationDefinition;
    activeChannel$: Observable<GetActiveChannel.ActiveChannel>;
    testAddress: TestAddress;
    testOrderLines: TestOrderLine[];
    testDataUpdated = false;
    testResult$: Observable<TestShippingMethodResult | undefined>;
    private fetchTestResult$ = new Subject<[TestAddress, TestOrderLine[]]>();

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
            code: ['', Validators.required],
            description: ['', Validators.required],
            checker: {},
            calculator: {},
        });
    }

    ngOnInit() {
        this.init();
        combineLatest(
            this.dataService.shippingMethod.getShippingMethodOperations().single$,
            this.entity$.pipe(take(1)),
        ).subscribe(([data, entity]) => {
            this.checkers = data.shippingEligibilityCheckers;
            this.calculators = data.shippingCalculators;
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
                    checker: this.toAdjustmentOperationInput(this.selectedChecker, formValue.checker),
                    calculator: this.toAdjustmentOperationInput(
                        this.selectedCalculator,
                        formValue.calculator,
                    ),
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
        this.selectedChecker = this.configurableDefinitionToInstance(checker);
        const formControl = this.detailForm.get('checker');
        if (formControl) {
            formControl.patchValue(this.selectedChecker);
        }
        this.detailForm.markAsDirty();
    }

    selectCalculator(calculator: ConfigurableOperationDefinition) {
        this.selectedCalculatorDefinition = calculator;
        this.selectedCalculator = this.configurableDefinitionToInstance(calculator);
        const formControl = this.detailForm.get('calculator');
        if (formControl) {
            formControl.patchValue(this.selectedCalculator);
        }
        this.detailForm.markAsDirty();
    }

    private configurableDefinitionToInstance(def: ConfigurableOperationDefinition): ConfigurableOperation {
        return {
            ...def,
            args: def.args.map(arg => {
                return {
                    ...arg,
                    value: getDefaultConfigArgValue(arg),
                };
            }),
        } as ConfigurableOperation;
    }

    create() {
        if (!this.selectedChecker || !this.selectedCalculator) {
            return;
        }
        const formValue = this.detailForm.value;
        const input: CreateShippingMethodInput = {
            code: formValue.code,
            description: formValue.description,
            checker: this.toAdjustmentOperationInput(this.selectedChecker, formValue.checker),
            calculator: this.toAdjustmentOperationInput(this.selectedCalculator, formValue.calculator),
        };
        this.dataService.shippingMethod.createShippingMethod(input).subscribe(
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
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const input: UpdateShippingMethodInput = {
                        id,
                        code: formValue.code,
                        description: formValue.description,
                        checker: this.toAdjustmentOperationInput(selectedChecker, formValue.checker),
                        calculator: this.toAdjustmentOperationInput(selectedCalculator, formValue.calculator),
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
     * Maps an array of conditions or actions to the input format expected by the GraphQL API.
     */
    private toAdjustmentOperationInput(
        operation: ConfigurableOperation,
        formValueOperations: any,
    ): ConfigurableOperationInput {
        return {
            code: operation.code,
            arguments: Object.values<any>(formValueOperations.args || {}).map((value, j) => ({
                name: operation.args[j].name,
                value: value.hasOwnProperty('value') ? (value as any).value : value.toString(),
                type: operation.args[j].type,
            })),
        };
    }

    protected setFormValues(shippingMethod: ShippingMethod.Fragment): void {
        this.detailForm.patchValue({
            description: shippingMethod.description,
            code: shippingMethod.code,
            checker: shippingMethod.checker || {},
            calculator: shippingMethod.calculator || {},
        });
        this.selectedChecker = shippingMethod.checker;
        this.selectedCalculator = shippingMethod.calculator;
    }
}
