import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { RequestContext } from '../../../api/index';
import { ConfigService } from '../../../config/config.service';
import { Asset } from '../../../entity/asset/asset.entity';
import { AssetService } from '../../../service/services/asset.service';

/**
 * @description
 * This service creates new {@link Asset} entities based on string paths provided in the CSV
 * import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
 * with the asset path. This service is used internally by the {@link Importer} service.
 *
 * @docsCategory import-export
 */
@Injectable()
export class AssetImporter {
    private assetMap = new Map<string, Asset>();

    /** @internal */
    constructor(private configService: ConfigService, private assetService: AssetService) {}

    /**
     * @description
     * Creates Asset entities for the given paths, using the assetMap cache to prevent the
     * creation of duplicates.
     */
    async getAssets(
        assetPaths: string[],
        ctx?: RequestContext,
    ): Promise<{ assets: Asset[]; errors: string[] }> {
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
                            const asset = (await this.assetService.createFromFileStream(
                                stream,
                                ctx,
                            )) as Asset;
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
