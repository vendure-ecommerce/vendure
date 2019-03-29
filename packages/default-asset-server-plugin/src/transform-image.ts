import sharp from 'sharp';
import { ResizeOptions } from 'sharp';

import { ImageTransformPreset } from './plugin';

/**
 * Applies transforms to the given image according to the query params passed.
 */
export async function transformImage(
    originalImage: Buffer,
    queryParams: Record<string, string>,
    presets: ImageTransformPreset[],
): Promise<sharp.Sharp> {
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
    const options: ResizeOptions = {};
    if (mode === 'crop') {
        options.position = sharp.strategy.entropy;
    } else {
        options.fit = 'inside';
    }
    return sharp(originalImage).resize(width, height, options);
}
