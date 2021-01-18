import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Asset, BaseDetailComponent, GetAsset, LanguageCode } from '@vendure/admin-ui/core';
import { DataService, NotificationService, ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-asset-detail',
    templateUrl: './asset-detail.component.html',
    styleUrls: ['./asset-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDetailComponent extends BaseDetailComponent<GetAsset.Asset> implements OnInit, OnDestroy {
    detailForm = new FormGroup({});

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private notificationService: NotificationService,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
    ) {
        super(route, router, serverConfigService, dataService);
    }

    ngOnInit() {
        this.detailForm = new FormGroup({
            name: new FormControl(''),
            tags: new FormControl([]),
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

    protected setFormValues(entity: GetAsset.Asset, languageCode: LanguageCode): void {
        this.detailForm.get('name')?.setValue(entity.name);
        this.detailForm.get('tags')?.setValue(entity.tags);
    }
}
