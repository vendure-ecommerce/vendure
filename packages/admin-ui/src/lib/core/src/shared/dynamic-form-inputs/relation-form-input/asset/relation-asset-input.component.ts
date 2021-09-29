import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { GetAsset, RelationCustomFieldConfig } from '../../../../common/generated-types';
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
export class RelationAssetInputComponent implements OnInit {
    @Input() readonly: boolean;
    @Input() parentFormControl: FormControl;
    @Input() config: RelationCustomFieldConfig;
    asset$: Observable<GetAsset.Asset | undefined>;

    constructor(private modalService: ModalService, private dataService: DataService) {}

    ngOnInit() {
        this.asset$ = this.parentFormControl.valueChanges.pipe(
            startWith(this.parentFormControl.value),
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
                    this.parentFormControl.setValue(result[0]);
                    this.parentFormControl.markAsDirty();
                }
            });
    }

    remove() {
        this.parentFormControl.setValue(null);
        this.parentFormControl.markAsDirty();
    }

    previewAsset(asset: GetAsset.Asset) {
        this.modalService
            .fromComponent(AssetPreviewDialogComponent, {
                size: 'xl',
                closable: true,
                locals: { asset },
            })
            .subscribe();
    }
}
