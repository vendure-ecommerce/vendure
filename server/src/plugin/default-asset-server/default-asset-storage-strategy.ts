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
    private uploadPath: string;

    constructor(uploadDir: string = 'assets') {
        this.setAbsoluteUploadPath(uploadDir);
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

    readFileToBuffer(identifier: string): Promise<Buffer> {
        return fs.readFile(this.identifierToFilePath(identifier));
    }

    readFileToStream(identifier: string): Promise<Stream> {
        const readStream = fs.createReadStream(this.identifierToFilePath(identifier), 'binary');
        return Promise.resolve(readStream);
    }

    toAbsoluteUrl(request: Request, identifier: string): string {
        return `${request.protocol}://${request.get('host')}/${identifier}`;
    }

    private setAbsoluteUploadPath(uploadDir: string): string {
        this.uploadPath = uploadDir;
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath);
        }
        return this.uploadPath;
    }

    private filePathToIdentifier(filePath: string): string {
        return `${path.basename(this.uploadPath)}/${path.basename(filePath)}`;
    }

    private identifierToFilePath(identifier: string): string {
        return path.join(this.uploadPath, path.basename(identifier));
    }
}
