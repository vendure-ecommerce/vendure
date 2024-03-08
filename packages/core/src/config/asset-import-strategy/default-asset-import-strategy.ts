import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import path from 'path';
import { from, lastValueFrom } from 'rxjs';
import { delay, retryWhen, take, tap } from 'rxjs/operators';
import { Readable } from 'stream';
import { URL } from 'url';

import { Injector } from '../../common/injector';
import { ConfigService } from '../config.service';
import { Logger } from '../logger/vendure-logger';

import { AssetImportStrategy } from './asset-import-strategy';

function fetchUrl(urlString: string): Promise<Readable> {
    return new Promise((resolve, reject) => {
        const url = new URL(urlString);
        const get = url.protocol.startsWith('https') ? https.get : http.get;
        get(
            url,
            {
                timeout: 5000,
            },
            res => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    Logger.error(
                        `Failed to fetch "${urlString.substr(0, 100)}", statusCode: ${
                            statusCode || 'unknown'
                        }`,
                    );
                    reject(new Error(`Request failed. Status code: ${statusCode || 'unknown'}`));
                } else {
                    resolve(res);
                }
            },
        );
    });
}

/**
 * @description
 * The DefaultAssetImportStrategy is able to import paths from the local filesystem (taking into account the
 * `importExportOptions.importAssetsDir` setting) as well as remote http/https urls.
 *
 * @since 1.7.0
 * @docsCategory import-export
 */
export class DefaultAssetImportStrategy implements AssetImportStrategy {
    private configService: ConfigService;

    constructor(
        private options?: {
            retryDelayMs: number;
            retryCount: number;
        },
    ) {}

    init(injector: Injector) {
        this.configService = injector.get(ConfigService);
    }

    getStreamFromPath(assetPath: string) {
        if (/^https?:\/\//.test(assetPath)) {
            return this.getStreamFromUrl(assetPath);
        } else {
            return this.getStreamFromLocalFile(assetPath);
        }
    }

    private getStreamFromUrl(assetUrl: string): Promise<Readable> {
        const { retryCount, retryDelayMs } = this.options ?? {};
        return lastValueFrom(
            from(fetchUrl(assetUrl)).pipe(
                retryWhen(errors =>
                    errors.pipe(
                        tap(value => {
                            Logger.verbose(value);
                            Logger.verbose(`DefaultAssetImportStrategy: retrying fetchUrl for ${assetUrl}`);
                        }),
                        delay(retryDelayMs ?? 200),
                        take(retryCount ?? 3),
                    ),
                ),
            ),
        );
    }

    private getStreamFromLocalFile(assetPath: string): Readable {
        const { importAssetsDir } = this.configService.importExportOptions;
        const filename = path.join(importAssetsDir, assetPath);

        if (fs.existsSync(filename)) {
            const fileStat = fs.statSync(filename);
            if (fileStat.isFile()) {
                try {
                    const stream = fs.createReadStream(filename);
                    return stream;
                } catch (err) {
                    throw err;
                }
            } else {
                throw new Error(`Could not find file "${filename}"`);
            }
        } else {
            throw new Error(`File "${filename}" does not exist`);
        }
    }
}
