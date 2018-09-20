import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateAssetInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../../common/types/common-types';
import { getAssetType } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Asset } from '../../entity/asset/asset.entity';

import { buildListQuery } from '../helpers/build-list-query';

@Injectable()
export class AssetService {
    constructor(@InjectConnection() private connection: Connection, private configService: ConfigService) {}

    findOne(id: ID): Promise<Asset | undefined> {
        return this.connection.getRepository(Asset).findOne(id);
    }

    findByIds(ids: ID[]): Promise<Asset[]> {
        return this.connection.getRepository(Asset).findByIds(ids);
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
        const { assetNamingStrategy } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetNamingStrategy.generateSourceFileName(name, conflict),
        );
    }

    private async getPreviewFileName(fileName: string): Promise<string> {
        const { assetNamingStrategy } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetNamingStrategy.generatePreviewFileName(name, conflict),
        );
    }

    private async generateUniqueName(
        inputFileName: string,
        generateNameFn: (fileName: string, conflictName?: string) => string,
    ): Promise<string> {
        const { assetStorageStrategy } = this.configService;
        let outputFileName: string | undefined;
        do {
            outputFileName = generateNameFn(inputFileName, outputFileName);
        } while (await assetStorageStrategy.fileExists(outputFileName));
        return outputFileName;
    }
}
