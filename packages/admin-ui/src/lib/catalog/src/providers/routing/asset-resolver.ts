import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AssetFragment, AssetType, BaseEntityResolver, DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class AssetResolver extends BaseEntityResolver<AssetFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Asset' as const,
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                type: AssetType.IMAGE,
                fileSize: 0,
                mimeType: '',
                width: 0,
                height: 0,
                source: '',
                preview: '',
                focalPoint: null,
            },
            id => dataService.product.getAsset(id).mapStream(data => data.asset),
        );
    }
}
