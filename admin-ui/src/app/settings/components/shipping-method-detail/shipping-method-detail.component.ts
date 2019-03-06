import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import {
    ConfigurableOperation,
    ConfigurableOperationInput,
    CreateShippingMethodInput,
    ShippingMethod,
    UpdateShippingMethodInput,
} from 'shared/generated-types';
import { normalizeString } from 'shared/normalize-string';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-shipping-method-detail',
    templateUrl: './shipping-method-detail.component.html',
    styleUrls: ['./shipping-method-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodDetailComponent extends BaseDetailComponent<ShippingMethod.Fragment>
    implements OnInit, OnDestroy {
    detailForm: FormGroup;
    checkers: ConfigurableOperation[] = [];
    calculators: ConfigurableOperation[] = [];
    selectedChecker?: ConfigurableOperation;
    selectedCalculator?: ConfigurableOperation;

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
        this.dataService.shippingMethod.getShippingMethodOperations().single$.subscribe(data => {
            this.checkers = data.shippingEligibilityCheckers;
            this.calculators = data.shippingCalculators;
            this.changeDetector.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    selectChecker(checker: ConfigurableOperation) {
        this.selectedChecker = checker;
    }

    selectCalculator(calculator: ConfigurableOperation) {
        this.selectedCalculator = calculator;
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

    /**
     * Maps an array of conditions or actions to the input format expected by the GraphQL API.
     */
    private toAdjustmentOperationInput(
        operation: ConfigurableOperation,
        formValueOperations: any,
    ): ConfigurableOperationInput {
        return {
            code: operation.code,
            arguments: Object.values(formValueOperations.args || {}).map((value, j) => ({
                name: operation.args[j].name,
                value: value.toString(),
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
