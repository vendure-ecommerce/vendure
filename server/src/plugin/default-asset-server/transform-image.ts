import { Request } from 'express';
import * as sharp from 'sharp';

import { ImageTransformMode, ImageTransformPreset } from './default-asset-server-plugin';

/**
 * Applies transforms to the gifen image according to the query params passed.
 */
export async function transformImage(
    originalImage: Buffer,
    queryParams: Record<string, string>,
    presets: ImageTransformPreset[],
): Promise<sharp.SharpInstance> {
    let width = +queryParams.w || undefined;
    let height = +queryParams.h || undefined;
    let mode = queryParams.mode || 'crop';
    if (queryParams.preset) {
        const matchingPreset = presets.find(p => p.name === queryParams.preset);
        if (matchingPreset) {
            width = matchingPreset.width;
            height = matchingPreset.height;
            mode = matchingPreset.mode;
        }
    }
    const image = sharp(originalImage).resize(width, height);
    if (mode === 'crop') {
        image.crop(sharp.strategy.entropy);
    } else {
        image.max();
    }
    return image;
}
