import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Administrator,
    BaseDetailComponent,
    CustomFieldConfig,
    DataService,
    GetActiveAdministratorQuery,
    LanguageCode,
    NotificationService,
    ServerConfigService,
    UpdateActiveAdministratorInput,
} from '@vendure/admin-ui/core';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent
    extends BaseDetailComponent<NonNullable<GetActiveAdministratorQuery['activeAdministrator']>>
    implements OnInit, OnDestroy
{
    customFields: CustomFieldConfig[];
    detailForm: FormGroup;

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
        this.customFields = this.getCustomFieldConfig('Administrator');
        this.detailForm = this.formBuilder.group({
            emailAddress: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: [''],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    save() {
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const administrator: UpdateActiveAdministratorInput = {
                        emailAddress: formValue.emailAddress,
                        firstName: formValue.firstName,
                        lastName: formValue.lastName,
                        password: formValue.password,
                        customFields: formValue.customFields,
                    };
                    return this.dataService.administrator.updateActiveAdministrator(administrator);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Administrator',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }

    protected setFormValues(administrator: Administrator, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            emailAddress: administrator.emailAddress,
            firstName: administrator.firstName,
            lastName: administrator.lastName,
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get('customFields'),
                administrator,
            );
        }
    }
}
