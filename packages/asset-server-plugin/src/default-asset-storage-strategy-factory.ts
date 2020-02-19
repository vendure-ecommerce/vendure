import { Request } from 'express';

import { LocalAssetStorageStrategy } from './local-asset-storage-strategy';
import { AssetServerOptions } from './types';

/**
 * By default the AssetServerPlugin will configure and use the LocalStorageStrategy to persist Assets.
 */
export function defaultAssetStorageStrategyFactory(options: AssetServerOptions) {
    const { assetUrlPrefix, assetUploadDir, route } = options;
    const toAbsoluteUrlFn = (request: Request, identifier: string): string => {
        if (!identifier) {
            return '';
        }
        const prefix = assetUrlPrefix || `${request.protocol}://${request.get('host')}/${route}/`;
        return identifier.startsWith(prefix) ? identifier : `${prefix}${identifier}`;
    };
    return new LocalAssetStorageStrategy(assetUploadDir, toAbsoluteUrlFn);
}
