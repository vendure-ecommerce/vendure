import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfigArgSubset, ConfigArgType } from '@vendure/common/lib/shared-types';
import { mergeMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import { ConfigArg, PaymentMethod, UpdatePaymentMethodInput } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-payment-method-detail',
    templateUrl: './payment-method-detail.component.html',
    styleUrls: ['./payment-method-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodDetailComponent extends BaseDetailComponent<PaymentMethod.Fragment>
    implements OnInit, OnDestroy {
    detailForm: FormGroup;

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
            enabled: [true, Validators.required],
            configArgs: this.formBuilder.group({}),
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    getType(arg: PaymentMethod.ConfigArgs): ConfigArgSubset<'int' | 'string' | 'boolean'> {
        return arg.type as any;
    }

    save() {
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id, configArgs }) => {
                    const formValue = this.detailForm.value;
                    const input: UpdatePaymentMethodInput = {
                        id,
                        code: formValue.code,
                        enabled: formValue.enabled,
                        configArgs: Object.entries<any>(formValue.configArgs).map(([name, value], i) => ({
                            name,
                            value: value.toString(),
                            type: configArgs[i].type,
                        })),
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
            code: paymentMethod.code,
            enabled: paymentMethod.enabled,
        });
        const configArgsGroup = this.detailForm.get('configArgs') as FormGroup;
        if (configArgsGroup) {
            for (const arg of paymentMethod.configArgs) {
                const control = configArgsGroup.get(arg.name);
                if (control) {
                    control.patchValue(this.parseArgValue(arg));
                } else {
                    configArgsGroup.addControl(arg.name, this.formBuilder.control(this.parseArgValue(arg)));
                }
            }
        }
    }

    private parseArgValue(arg: ConfigArg): string | number | boolean {
        switch (arg.type) {
            case 'int':
                return Number.parseInt(arg.value || '0', 10);
            case 'boolean':
                return arg.value === 'false' ? false : true;
            default:
                return arg.value || '';
        }
    }
}
