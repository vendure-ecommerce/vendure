import { I18nError } from '../../i18n/i18n-error';

import { AssetPreviewStrategy } from './asset-preview-strategy';

/**
 * A placeholder strategy which will simply throw an error when used.
 */
export class NoAssetPreviewStrategy implements AssetPreviewStrategy {
    generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer> {
        throw new I18nError('error.no-asset-preview-strategy-configured');
    }
}
