import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ConfigArgDefinition,
    configurableDefinitionToInstance,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    CreatePaymentMethodInput,
    DataService,
    encodeConfigArgValue,
    getConfigArgValue,
    NotificationService,
    PaymentMethod,
    Permission,
    ServerConfigService,
    toConfigurableOperationInput,
    UpdatePaymentMethodInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { combineLatest } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-payment-method-detail',
    templateUrl: './payment-method-detail.component.html',
    styleUrls: ['./payment-method-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodDetailComponent
    extends BaseDetailComponent<PaymentMethod.Fragment>
    implements OnInit, OnDestroy {
    detailForm: FormGroup;
    checkers: ConfigurableOperationDefinition[] = [];
    handlers: ConfigurableOperationDefinition[] = [];
    selectedChecker?: ConfigurableOperation | null;
    selectedCheckerDefinition?: ConfigurableOperationDefinition;
    selectedHandler?: ConfigurableOperation | null;
    selectedHandlerDefinition?: ConfigurableOperationDefinition;
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdatePaymentMethod];

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
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: '',
            enabled: [true, Validators.required],
            checker: {},
            handler: {},
        });
    }

    ngOnInit() {
        this.init();
        combineLatest([
            this.dataService.settings.getPaymentMethodOperations().single$,
            this.entity$.pipe(take(1)),
        ]).subscribe(([data, entity]) => {
            this.checkers = data.paymentMethodEligibilityCheckers;
            this.handlers = data.paymentMethodHandlers;
            this.changeDetector.markForCheck();
            this.selectedCheckerDefinition = data.paymentMethodEligibilityCheckers.find(
                c => c.code === (entity.checker && entity.checker.code),
            );
            this.selectedHandlerDefinition = data.paymentMethodHandlers.find(
                c => c.code === (entity.handler && entity.handler.code),
            );
        });
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

    configArgsIsPopulated(): boolean {
        const configArgsGroup = this.detailForm.get('configArgs') as FormGroup | undefined;
        if (!configArgsGroup) {
            return false;
        }
        return 0 < Object.keys(configArgsGroup.controls).length;
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

    selectHandler(handler: ConfigurableOperationDefinition) {
        this.selectedHandlerDefinition = handler;
        this.selectedHandler = configurableDefinitionToInstance(handler);
        const formControl = this.detailForm.get('handler');
        if (formControl) {
            formControl.clearValidators();
            formControl.updateValueAndValidity({ onlySelf: true });
            formControl.patchValue(this.selectedHandler);
        }
        this.detailForm.markAsDirty();
    }

    removeChecker() {
        this.selectedChecker = null;
        this.detailForm.markAsDirty();
    }

    removeHandler() {
        this.selectedHandler = null;
        this.detailForm.markAsDirty();
    }

    create() {
        const selectedChecker = this.selectedChecker;
        const selectedHandler = this.selectedHandler;
        if (!selectedHandler) {
            return;
        }
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const input: CreatePaymentMethodInput = {
                        name: formValue.name,
                        code: formValue.code,
                        description: formValue.description,
                        enabled: formValue.enabled,
                        checker: selectedChecker
                            ? toConfigurableOperationInput(selectedChecker, formValue.checker)
                            : null,
                        handler: toConfigurableOperationInput(selectedHandler, formValue.handler),
                    };
                    return this.dataService.settings.createPaymentMethod(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'PaymentMethod',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createPaymentMethod.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'PaymentMethod',
                    });
                },
            );
    }

    save() {
        const selectedChecker = this.selectedChecker;
        const selectedHandler = this.selectedHandler;
        if (!selectedHandler) {
            return;
        }
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const input: UpdatePaymentMethodInput = {
                        id,
                        name: formValue.name,
                        code: formValue.code,
                        description: formValue.description,
                        enabled: formValue.enabled,
                        checker: selectedChecker
                            ? toConfigurableOperationInput(selectedChecker, formValue.checker)
                            : null,
                        handler: toConfigurableOperationInput(selectedHandler, formValue.handler),
                    };
                    return this.dataService.settings.updatePaymentMethod(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'PaymentMethod',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'PaymentMethod',
                    });
                },
            );
    }

    protected setFormValues(paymentMethod: PaymentMethod.Fragment): void {
        this.detailForm.patchValue({
            name: paymentMethod.name,
            code: paymentMethod.code,
            description: paymentMethod.description,
            enabled: paymentMethod.enabled,
            checker: paymentMethod.checker || {},
            handler: paymentMethod.handler || {},
        });
        if (!this.selectedChecker) {
            this.selectedChecker = paymentMethod.checker && {
                code: paymentMethod.checker.code,
                args: paymentMethod.checker.args.map(a => ({ ...a, value: getConfigArgValue(a.value) })),
            };
        }
        if (!this.selectedHandler) {
            this.selectedHandler = paymentMethod.handler && {
                code: paymentMethod.handler.code,
                args: paymentMethod.handler.args.map(a => ({ ...a, value: getConfigArgValue(a.value) })),
            };
        }
    }
}
