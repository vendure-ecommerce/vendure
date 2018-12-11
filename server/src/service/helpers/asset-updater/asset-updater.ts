import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Asset, VendureEntity } from '../../../entity';
import { AssetService } from '../../services/asset.service';

export interface EntityWithAssets extends VendureEntity {
    featuredAsset: Asset;
    assets: Asset[];
}

export interface AssetInput {
    featuredAssetId?: string | null;
    assetIds?: string[] | null;
}

@Injectable()
export class AssetUpdater {
    constructor(@InjectConnection() private connection: Connection, private assetService: AssetService) {}

    /**
     * Updates the assets / featuredAsset of an entity, ensuring that only valid assetIds are used.
     */
    async updateEntityAssets<T extends EntityWithAssets>(product: T, input: AssetInput) {
        if (input.assetIds || input.featuredAssetId) {
            if (input.assetIds) {
                const assets = await this.assetService.findByIds(input.assetIds);
                product.assets = assets;
            }
            if (input.featuredAssetId) {
                const featuredAsset = await this.assetService.findOne(input.featuredAssetId);
                if (featuredAsset) {
                    product.featuredAsset = featuredAsset;
                }
            }
        }
    }
}
