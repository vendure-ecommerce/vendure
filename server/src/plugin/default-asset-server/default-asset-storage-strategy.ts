import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Stream } from 'stream';

import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';

/**
 * A persistence strategy which saves files to the local file system.
 */
export class DefaultAssetStorageStrategy implements AssetStorageStrategy {
    constructor(private readonly uploadPath: string, private readonly route: string) {
        this.ensureUploadPathExists(this.uploadPath);
    }

    writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        const filePath = path.join(this.uploadPath, fileName);
        const writeStream = fs.createWriteStream(filePath, 'binary');
        return new Promise<string>((resolve, reject) => {
            data.pipe(writeStream);
            writeStream.on('close', () => resolve(this.filePathToIdentifier(filePath)));
            writeStream.on('error', reject);
        });
    }

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        const filePath = path.join(this.uploadPath, fileName);
        await fs.writeFile(filePath, data, 'binary');
        return this.filePathToIdentifier(filePath);
    }

    fileExists(fileName: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.access(this.identifierToFilePath(fileName), fs.constants.F_OK, err => {
                resolve(!err);
            });
        });
    }

    readFileToBuffer(identifier: string): Promise<Buffer> {
        return fs.readFile(this.identifierToFilePath(identifier));
    }

    readFileToStream(identifier: string): Promise<Stream> {
        const readStream = fs.createReadStream(this.identifierToFilePath(identifier), 'binary');
        return Promise.resolve(readStream);
    }

    toAbsoluteUrl(request: Request, identifier: string): string {
        if (!identifier) {
            return '';
        }
        return `${request.protocol}://${request.get('host')}/${this.route}/${identifier}`;
    }

    private ensureUploadPathExists(uploadDir: string): void {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath);
        }
        const cachePath = path.join(this.uploadPath, 'cache');
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath);
        }
    }

    private filePathToIdentifier(filePath: string): string {
        return `${path.basename(filePath)}`;
    }

    private identifierToFilePath(identifier: string): string {
        return path.join(this.uploadPath, path.basename(identifier));
    }
}
