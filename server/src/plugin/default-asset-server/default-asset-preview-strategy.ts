import * as sharp from 'sharp';
import { Stream } from 'stream';

import { AssetPreviewStrategy } from '../../config/asset-preview-strategy/asset-preview-strategy';

export class DefaultAssetPreviewStrategy implements AssetPreviewStrategy {
    constructor(
        private config: {
            maxHeight: number;
            maxWidth: number;
        },
    ) {}

    async generatePreviewImage(mimetype: string, data: Buffer): Promise<Buffer> {
        const image = sharp(data);
        const metadata = await image.metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;
        const { maxWidth, maxHeight } = this.config;
        if (maxWidth < width || maxHeight < height) {
            return image
                .resize(maxWidth, maxHeight)
                .max()
                .toBuffer();
        }
        return data;
    }
}
