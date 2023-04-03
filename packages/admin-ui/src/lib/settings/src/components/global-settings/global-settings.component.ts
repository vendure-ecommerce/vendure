import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CustomFieldConfig,
    DataService,
    GlobalSettings,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Component({
    selector: 'vdr-global-settings',
    templateUrl: './global-settings.component.html',
    styleUrls: ['./global-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsComponent extends BaseDetailComponent<GlobalSettings> implements OnInit {
    detailForm: UntypedFormGroup;
    customFields: CustomFieldConfig[];
    languageCodes = Object.values(LanguageCode);
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdateGlobalSettings];

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: UntypedFormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('GlobalSettings');
        this.detailForm = this.formBuilder.group({
            availableLanguages: [''],
            trackInventory: false,
            outOfStockThreshold: [0, Validators.required],
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

    save() {
        if (!this.detailForm.dirty) {
            return;
        }

        this.dataService.settings
            .updateGlobalSettings(this.detailForm.value)
            .pipe(
                tap(({ updateGlobalSettings }) => {
                    switch (updateGlobalSettings.__typename) {
                        case 'GlobalSettings':
                            this.detailForm.markAsPristine();
                            this.changeDetector.markForCheck();
                            this.notificationService.success(_('common.notify-update-success'), {
                                entity: 'Settings',
                            });
                            break;
                        case 'ChannelDefaultLanguageError':
                            this.notificationService.error(updateGlobalSettings.message);
                    }
                }),
                switchMap(() => this.serverConfigService.refreshGlobalSettings()),
                withLatestFrom(this.dataService.client.uiState().single$),
            )
            .subscribe(([{ globalSettings }, { uiState }]) => {
                const availableLangs = globalSettings.availableLanguages;
                if (availableLangs.length && !availableLangs.includes(uiState.contentLanguage)) {
                    this.dataService.client.setContentLanguage(availableLangs[0]).subscribe();
                }
            });
    }

    protected setFormValues(entity: GlobalSettings, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            availableLanguages: entity.availableLanguages,
            trackInventory: entity.trackInventory,
            outOfStockThreshold: entity.outOfStockThreshold,
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity);
        }
    }
}
