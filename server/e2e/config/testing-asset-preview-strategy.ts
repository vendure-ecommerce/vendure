import { AssetPreviewStrategy } from '../../src/config/asset-preview-strategy/asset-preview-strategy';

/**
 * A mock preview strategy which returns a new Buffer without doing any actual work.
 */
export class TestingAssetPreviewStrategy implements AssetPreviewStrategy {
    generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer> {
        return Promise.resolve(Buffer.from('test'));
    }
}
