import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as path from 'path';
import { AssetType, CreateAssetInput } from 'shared/generated-types';
import { normalizeString } from 'shared/normalize-string';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../common/types/common-types';
import { getAssetType } from '../common/utils';
import { ConfigService } from '../config/config.service';
import { Asset } from '../entity/asset/asset.entity';

import { buildListQuery } from './helpers/build-list-query';

@Injectable()
export class AssetService {
    constructor(@InjectConnection() private connection: Connection, private configService: ConfigService) {}

    findOne(id: ID): Promise<Asset | undefined> {
        return this.connection.getRepository(Asset).findOne(id);
    }

    findAll(options?: ListQueryOptions<Asset>): Promise<PaginatedList<Asset>> {
        return buildListQuery(this.connection, Asset, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async create(input: CreateAssetInput): Promise<Asset> {
        const { stream, filename, mimetype, encoding } = await input.file;
        const { assetPreviewStrategy, assetStorageStrategy } = this.configService;
        const normalizedFileName = this.normalizeFileName(filename);

        const sourceFileName = await assetStorageStrategy.writeFileFromStream(normalizedFileName, stream);
        const sourceFile = await assetStorageStrategy.readFileToBuffer(sourceFileName);
        const preview = await assetPreviewStrategy.generatePreviewImage(mimetype, sourceFile);
        const previewFileName = await assetStorageStrategy.writeFileFromBuffer(
            this.getPreviewFileName(mimetype, normalizedFileName),
            preview,
        );

        const asset = new Asset({
            type: getAssetType(mimetype),
            name: filename,
            fileSize: sourceFile.byteLength,
            mimeType: mimetype,
            source: sourceFileName,
            preview: previewFileName,
        });
        return this.connection.manager.save(asset);
    }

    private normalizeFileName(fileName: string): string {
        const normalized = normalizeString(fileName, '-');
        const randomPart = Math.random()
            .toString(8)
            .substr(2, 8);
        return this.addSuffix(normalized, `-${randomPart}`);
    }

    private getPreviewFileName(mimeType: string, sourceFileName: string): string {
        const previewSuffix = '__preview';
        switch (getAssetType(mimeType)) {
            case AssetType.IMAGE:
                return this.addSuffix(sourceFileName, previewSuffix);
            default:
                return this.addSuffix(`${sourceFileName}.png`, previewSuffix);
        }
    }

    private addSuffix(fileName: string, suffix: string): string {
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        return `${baseName}${suffix}${ext}`;
    }
}
