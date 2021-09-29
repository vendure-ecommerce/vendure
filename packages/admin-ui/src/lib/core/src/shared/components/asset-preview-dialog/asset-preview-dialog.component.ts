import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AssetFragment, GetAsset, GetAssetList, UpdateAssetInput } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { Dialog } from '../../../providers/modal/modal.service';

type AssetLike = GetAssetList.Items | AssetFragment;

@Component({
    selector: 'vdr-asset-preview-dialog',
    templateUrl: './asset-preview-dialog.component.html',
    styleUrls: ['./asset-preview-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewDialogComponent implements Dialog<void>, OnInit {
    constructor(private dataService: DataService) {}
    asset: AssetLike;
    assetChanges?: UpdateAssetInput;
    resolveWith: (result?: void) => void;
    assetWithTags$: Observable<GetAsset.Asset>;

    ngOnInit() {
        this.assetWithTags$ = of(this.asset).pipe(
            mergeMap(asset => {
                if (this.hasTags(asset)) {
                    return of(asset);
                } else {
                    // tslint:disable-next-line:no-non-null-assertion
                    return this.dataService.product.getAsset(asset.id).mapSingle(data => data.asset!);
                }
            }),
        );
    }

    private hasTags(asset: AssetLike): asset is GetAssetList.Items {
        return asset.hasOwnProperty('tags');
    }
}
