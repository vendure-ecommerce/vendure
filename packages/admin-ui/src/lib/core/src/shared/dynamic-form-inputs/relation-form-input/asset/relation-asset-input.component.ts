import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { FormInputComponent } from '../../../../common/component-registry-types';
import { GetAssetQuery, RelationCustomFieldConfig } from '../../../../common/generated-types';
import { DataService } from '../../../../data/providers/data.service';
import { ModalService } from '../../../../providers/modal/modal.service';
import { AssetPickerDialogComponent } from '../../../components/asset-picker-dialog/asset-picker-dialog.component';
import { AssetPreviewDialogComponent } from '../../../components/asset-preview-dialog/asset-preview-dialog.component';

@Component({
    selector: 'vdr-relation-asset-input',
    templateUrl: './relation-asset-input.component.html',
    styleUrls: ['./relation-asset-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationAssetInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'asset-form-input';
    @Input() readonly: boolean;
    @Input('parentFormControl') formControl: FormControl;
    @Input() config: RelationCustomFieldConfig;
    asset$: Observable<GetAssetQuery['asset'] | undefined>;

    constructor(private modalService: ModalService, private dataService: DataService) {}

    ngOnInit() {
        this.asset$ = this.formControl.valueChanges.pipe(
            startWith(this.formControl.value),
            map(asset => asset?.id),
            distinctUntilChanged(),
            switchMap(id => {
                if (id) {
                    return this.dataService.product.getAsset(id).mapStream(data => data.asset || undefined);
                } else {
                    return of(undefined);
                }
            }),
        );
    }

    selectAsset() {
        this.modalService
            .fromComponent(AssetPickerDialogComponent, {
                size: 'xl',
                locals: {
                    multiSelect: false,
                },
            })
            .subscribe(result => {
                if (result && result.length) {
                    this.formControl.setValue(result[0]);
                    this.formControl.markAsDirty();
                }
            });
    }

    remove() {
        this.formControl.setValue(null);
        this.formControl.markAsDirty();
    }

    previewAsset(asset: NonNullable<GetAssetQuery['asset']>) {
        this.modalService
            .fromComponent(AssetPreviewDialogComponent, {
                size: 'xl',
                closable: true,
                locals: { asset },
            })
            .subscribe();
    }
}
