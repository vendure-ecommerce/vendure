import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Asset, AssetType } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class AssetResolver extends BaseEntityResolver<Asset.Fragment> {
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
            },
            id => dataService.product.getAsset(id).mapStream(data => data.asset),
        );
    }
}
