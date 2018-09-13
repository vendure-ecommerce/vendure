import { INestApplication, INestExpressApplication } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Stream } from 'stream';

import { AssetStorageStrategy } from './asset-storage-strategy';

/**
 * A persistence strategy which saves files to the local file system and
 * adds a static route to the server config to serve them.
 */
export class LocalAssetStorageStrategy implements AssetStorageStrategy {
    private uploadPath: string;

    constructor(public uploadDir: string = 'assets') {}

    async init(app: INestApplication & INestExpressApplication): Promise<any> {
        // tslint:disable-next-line
        const uploadPath = this.setAbsoluteUploadPath(path.join(path.basename(require.main!.filename), '..'));
        app.useStaticAssets(uploadPath, {
            prefix: `/${this.uploadDir}`,
        });
    }

    setAbsoluteUploadPath(rootDir: string): string {
        this.uploadPath = path.join(rootDir, this.uploadDir);
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath);
        }
        return this.uploadPath;
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

    private filePathToIdentifier(filePath: string): string {
        return `${this.uploadDir}/${path.basename(filePath)}`;
    }

    private identifierToFilePath(identifier: string): string {
        return path.join(this.uploadPath, path.basename(identifier));
    }
}
