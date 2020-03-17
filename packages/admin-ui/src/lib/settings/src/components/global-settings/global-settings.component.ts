import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { switchMap } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import { CustomFieldConfig, GlobalSettings, LanguageCode, Permission } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-global-settings',
    templateUrl: './global-settings.component.html',
    styleUrls: ['./global-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsComponent extends BaseDetailComponent<GlobalSettings> implements OnInit {
    detailForm: FormGroup;
    customFields: CustomFieldConfig[];
    languageCodes = Object.values(LanguageCode);

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
        this.customFields = this.getCustomFieldConfig('GlobalSettings');
        this.detailForm = this.formBuilder.group({
            availableLanguages: [''],
            trackInventory: false,
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit(): void {
        this.init();
        this.dataService.client.userStatus().single$.subscribe(({ userStatus }) => {
            if (!userStatus.permissions.includes(Permission.UpdateSettings)) {
                const languagesSelect = this.detailForm.get('availableLanguages');
                if (languagesSelect) {
                    languagesSelect.disable();
                }
            }
        });
    }

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['customFields', name]);
    }

    save() {
        if (!this.detailForm.dirty) {
            return;
        }

        this.dataService.settings
            .updateGlobalSettings(this.detailForm.value)
            .pipe(switchMap(() => this.serverConfigService.refreshGlobalSettings()))
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Settings',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Settings',
                    });
                },
            );
    }

    protected setFormValues(entity: GlobalSettings, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            availableLanguages: entity.availableLanguages,
            trackInventory: entity.trackInventory,
        });
        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get('customFields') as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = (entity as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }
    }
}
