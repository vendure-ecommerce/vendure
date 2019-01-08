import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ReadStream } from 'fs-extra';
import mime from 'mime-types';
import path from 'path';
import { Stream } from 'stream';
import { Connection } from 'typeorm';

import { CreateAssetInput } from '../../../../shared/generated-types';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { InternalServerError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { getAssetType } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Asset } from '../../entity/asset/asset.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';

@Injectable()
export class AssetService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findOne(id: ID): Promise<Asset | undefined> {
        return this.connection.getRepository(Asset).findOne(id);
    }

    findByIds(ids: ID[]): Promise<Asset[]> {
        return this.connection.getRepository(Asset).findByIds(ids);
    }

    findAll(options?: ListQueryOptions<Asset>): Promise<PaginatedList<Asset>> {
        return this.listQueryBuilder
            .build(Asset, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    /**
     * Create an Asset based on a file uploaded via the GraphQL API.
     */
    async create(input: CreateAssetInput): Promise<Asset> {
        const { createReadStream, filename, mimetype } = await input.file;
        const stream = createReadStream();
        return this.createAssetInternal(stream, filename, mimetype);
    }

    /**
     * Create an Asset from a file stream created during data import.
     */
    async createFromFileStream(stream: ReadStream): Promise<Asset> {
        const filePath = stream.path;
        if (typeof filePath === 'string') {
            const filename = path.basename(filePath);
            const mimetype = mime.lookup(filename) || 'application/octet-stream';
            return this.createAssetInternal(stream, filename, mimetype);
        } else {
            throw new InternalServerError(`error.path-should-be-a-string-got-buffer`);
        }
    }

    private async createAssetInternal(stream: Stream, filename: string, mimetype: string): Promise<Asset> {
        const { assetOptions } = this.configService;
        const { assetPreviewStrategy, assetStorageStrategy } = assetOptions;
        const sourceFileName = await this.getSourceFileName(filename);
        const previewFileName = await this.getPreviewFileName(sourceFileName);

        const sourceFileIdentifier = await assetStorageStrategy.writeFileFromStream(sourceFileName, stream);
        const sourceFile = await assetStorageStrategy.readFileToBuffer(sourceFileIdentifier);
        const preview = await assetPreviewStrategy.generatePreviewImage(mimetype, sourceFile);
        const previewFileIdentifier = await assetStorageStrategy.writeFileFromBuffer(
            previewFileName,
            preview,
        );

        const asset = new Asset({
            type: getAssetType(mimetype),
            name: sourceFileName,
            fileSize: sourceFile.byteLength,
            mimeType: mimetype,
            source: sourceFileIdentifier,
            preview: previewFileIdentifier,
        });
        return this.connection.manager.save(asset);
    }

    private async getSourceFileName(fileName: string): Promise<string> {
        const { assetOptions } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetOptions.assetNamingStrategy.generateSourceFileName(name, conflict),
        );
    }

    private async getPreviewFileName(fileName: string): Promise<string> {
        const { assetOptions } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetOptions.assetNamingStrategy.generatePreviewFileName(name, conflict),
        );
    }

    private async generateUniqueName(
        inputFileName: string,
        generateNameFn: (fileName: string, conflictName?: string) => string,
    ): Promise<string> {
        const { assetOptions } = this.configService;
        let outputFileName: string | undefined;
        do {
            outputFileName = generateNameFn(inputFileName, outputFileName);
        } while (await assetOptions.assetStorageStrategy.fileExists(outputFileName));
        return outputFileName;
    }
}
