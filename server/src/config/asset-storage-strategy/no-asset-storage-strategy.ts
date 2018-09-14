import { Request } from 'express';
import { Stream } from 'stream';

import { I18nError } from '../../i18n/i18n-error';

import { AssetStorageStrategy } from './asset-storage-strategy';

const errorMessage = 'error.no-asset-storage-strategy-configured';

/**
 * A placeholder strategy which will simply throw an error when used.
 */
export class NoAssetStorageStrategy implements AssetStorageStrategy {
    writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        throw new I18nError(errorMessage);
    }

    writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        throw new I18nError(errorMessage);
    }

    readFileToBuffer(identifier: string): Promise<Buffer> {
        throw new I18nError(errorMessage);
    }

    readFileToStream(identifier: string): Promise<Stream> {
        throw new I18nError(errorMessage);
    }

    toAbsoluteUrl(request: Request, identifier: string): string {
        throw new I18nError(errorMessage);
    }
}
