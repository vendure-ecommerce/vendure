import * as path from 'path';
import { AssetType } from 'shared/generated-types';
import * as sharp from 'sharp';

import { getAssetType } from '../../common/utils';
import { AssetPreviewStrategy } from '../../config/asset-preview-strategy/asset-preview-strategy';

export class DefaultAssetPreviewStrategy implements AssetPreviewStrategy {
    constructor(
        private config: {
            maxHeight: number;
            maxWidth: number;
        },
    ) {}

    async generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer> {
        const assetType = getAssetType(mimeType);
        const { maxWidth, maxHeight } = this.config;

        if (assetType === AssetType.IMAGE) {
            const image = sharp(data);
            const metadata = await image.metadata();
            const width = metadata.width || 0;
            const height = metadata.height || 0;
            if (maxWidth < width || maxHeight < height) {
                return image
                    .resize(maxWidth, maxHeight)
                    .max()
                    .toBuffer();
            } else {
                return data;
            }
        } else {
            return sharp(path.join(__dirname, 'file-icon.png'))
                .resize(800, 800)
                .overlayWith(this.generateMimeTypeOverlay(mimeType), {
                    gravity: sharp.gravity.center,
                })
                .min()
                .toBuffer();
        }
    }

    private generateMimeTypeOverlay(mimeType: string): Buffer {
        return Buffer.from(`
            <svg xmlns="http://www.w3.org/2000/svg" height="150" width="800">
            <style>
                text {
                   font-size: 64px;
                   font-family: Arial, sans-serif;
                   fill: #666;
                }
              </style>

              <text x="400" y="110"  text-anchor="middle" width="800">${mimeType}</text>
            </svg>`);
    }
}
