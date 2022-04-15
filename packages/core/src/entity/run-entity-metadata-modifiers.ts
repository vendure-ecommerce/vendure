import { getMetadataArgsStorage } from 'typeorm';

import { VendureConfig } from '../config/index';

export async function runEntityMetadataModifiers(config: VendureConfig) {
    if (config.entityOptions?.metadataModifiers?.length) {
        const metadataArgsStorage = getMetadataArgsStorage();
        for (const modifier of config.entityOptions.metadataModifiers) {
            await modifier(metadataArgsStorage);
        }
    }
}
