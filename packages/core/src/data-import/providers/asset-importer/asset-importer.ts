import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { ConfigService } from '../../../config/config.service';
import { Asset } from '../../../entity/asset/asset.entity';
import { AssetService } from '../../../service/services/asset.service';

@Injectable()
export class AssetImporter {
    private assetMap = new Map<string, Asset>();

    constructor(private configService: ConfigService, private assetService: AssetService) {}

    /**
     * Creates Asset entities for the given paths, using the assetMap cache to prevent the
     * creation of duplicates.
     */
    async getAssets(assetPaths: string[]): Promise<{ assets: Asset[]; errors: string[] }> {
        const assets: Asset[] = [];
        const errors: string[] = [];
        const { importAssetsDir } = this.configService.importExportOptions;
        const uniqueAssetPaths = new Set(assetPaths);
        for (const assetPath of uniqueAssetPaths.values()) {
            const cachedAsset = this.assetMap.get(assetPath);
            if (cachedAsset) {
                assets.push(cachedAsset);
            } else {
                const filename = path.join(importAssetsDir, assetPath);

                if (fs.existsSync(filename)) {
                    const fileStat = fs.statSync(filename);
                    if (fileStat.isFile()) {
                        try {
                            const stream = fs.createReadStream(filename);
                            const asset = (await this.assetService.createFromFileStream(stream)) as Asset;
                            this.assetMap.set(assetPath, asset);
                            assets.push(asset);
                        } catch (err) {
                            errors.push(err.toString());
                        }
                    }
                } else {
                    errors.push(`File "${filename}" does not exist`);
                }
            }
        }
        return { assets, errors };
    }
}
