import Jimp = require('jimp');
import { Stream } from 'stream';

import { AssetPreviewStrategy } from './asset-preview-strategy';

export class DefaultAssetPreviewStrategy implements AssetPreviewStrategy {
    constructor(
        private config: {
            maxHeight: number;
            maxWidth: number;
        },
    ) {}

    async generatePreviewImage(mimetype: string, data: Buffer): Promise<Buffer> {
        const image = await Jimp.read(data);
        const { maxWidth, maxHeight } = this.config;
        if (maxWidth < image.getWidth() || maxHeight < image.getHeight()) {
            image.scaleToFit(maxWidth, maxHeight);
            return image.getBufferAsync(image.getMIME());
        }
        return data;
    }
}
