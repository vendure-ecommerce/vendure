import { AssetType } from '@vendure/common/lib/generated-types';
import { AssetPreviewStrategy, getAssetType, Logger, RequestContext } from '@vendure/core';
import path from 'path';
import sharp from 'sharp';

import { loggerCtx } from './constants';

/**
 * @description
 * This {@link AssetPreviewStrategy} uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
 * preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
 * overlay will be generated.
 *
 * @docsCategory AssetServerPlugin
 * @docsPage SharpAssetPreviewStrategy
 */
interface SharpAssetPreviewConfig {
    /**
     * @description
     * The max height in pixels of a generated preview image.
     *
     * @default 1600
     */
    maxHeight?: number;
    /**
     * @description
     * The max width in pixels of a generated preview image.
     *
     * @default 1600
     */
    maxWidth?: number;
}

/**
 * @description
 * This {@link AssetPreviewStrategy} uses the [Sharp library](https://sharp.pixelplumbing.com/) to generate
 * preview images of uploaded binary files. For non-image binaries, a generic "file" icon with the mime type
 * overlay will be generated.
 *
 * @docsCategory AssetServerPlugin
 * @docsPage SharpAssetPreviewStrategy
 * @docsWeight 0
 */
export class SharpAssetPreviewStrategy implements AssetPreviewStrategy {
    constructor(private config: SharpAssetPreviewConfig) {}
    private readonly defaultConfig: Required<SharpAssetPreviewConfig> = {
        maxHeight: 1600,
        maxWidth: 1600,
    };

    async generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer): Promise<Buffer> {
        const assetType = getAssetType(mimeType);
        const config = {
            ...this.defaultConfig,
            ...this.config,
        };
        const { maxWidth, maxHeight } = config;

        if (assetType === AssetType.IMAGE) {
            try {
                const image = sharp(data);
                const metadata = await image.metadata();
                const width = metadata.width || 0;
                const height = metadata.height || 0;
                if (maxWidth < width || maxHeight < height) {
                    return image.rotate().resize(maxWidth, maxHeight, { fit: 'inside' }).toBuffer();
                } else {
                    if (mimeType === 'image/svg+xml') {
                        // Convert the SVG to a raster for the preview
                        return image.toBuffer();
                    } else {
                        return image.rotate().toBuffer();
                    }
                }
            } catch (err: any) {
                Logger.error(
                    `An error occurred when generating preview for image with mimeType ${mimeType}: ${
                        err.message ?? err.toString()
                    }`,
                    loggerCtx,
                );
                return this.generateBinaryFilePreview(mimeType);
            }
        } else {
            return this.generateBinaryFilePreview(mimeType);
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

    private generateBinaryFilePreview(mimeType: string): Promise<Buffer> {
        return sharp(path.join(__dirname, 'file-icon.png'))
            .resize(800, 800, { fit: 'outside' })
            .composite([
                {
                    input: this.generateMimeTypeOverlay(mimeType),
                    gravity: sharp.gravity.center,
                },
            ])
            .toBuffer();
    }
}
