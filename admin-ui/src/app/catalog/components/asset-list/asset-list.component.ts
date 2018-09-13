import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAssetList, GetAssetList_assets_items } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent extends BaseListComponent<GetAssetList, GetAssetList_assets_items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getAssetList(...args),
            data => data.assets,
        );
    }

    fileSelected(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length === 1) {
            this.dataService.product.createAsset(files[0]).subscribe(res => {
                // empty
            });
        }
    }
}
