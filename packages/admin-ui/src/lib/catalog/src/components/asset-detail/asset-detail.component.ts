import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    BaseDetailComponent,
    CustomFieldConfig,
    DataService,
    GetAssetQuery,
    LanguageCode,
    NotificationService,
    ServerConfigService,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-asset-detail',
    templateUrl: './asset-detail.component.html',
    styleUrls: ['./asset-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDetailComponent
    extends BaseDetailComponent<NonNullable<GetAssetQuery['asset']>>
    implements OnInit, OnDestroy
{
    detailForm = new UntypedFormGroup({});
    customFields: CustomFieldConfig[];

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private notificationService: NotificationService,
        protected dataService: DataService,
        private formBuilder: UntypedFormBuilder,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Asset');
    }

    ngOnInit() {
        this.detailForm = new UntypedFormGroup({
            name: new UntypedFormControl(''),
            tags: new UntypedFormControl([]),
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    onAssetChange(event: { id: string; name: string; tags: string[] }) {
        this.detailForm.get('name')?.setValue(event.name);
        this.detailForm.get('tags')?.setValue(event.tags);
        this.detailForm.markAsDirty();
    }

    save() {
        this.dataService.product
            .updateAsset({
                id: this.id,
                name: this.detailForm.value.name,
                tags: this.detailForm.value.tags,
                customFields: this.detailForm.value.customFields,
            })
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-update-success'), { entity: 'Asset' });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Asset',
                    });
                },
            );
    }

    protected setFormValues(entity: NonNullable<GetAssetQuery['asset']>, languageCode: LanguageCode): void {
        this.detailForm.get('name')?.setValue(entity.name);
        this.detailForm.get('tags')?.setValue(entity.tags);
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get(['customFields']), entity);
        }
    }
}
