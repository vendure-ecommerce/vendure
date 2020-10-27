import { Injectable } from '@nestjs/common';
import {
    AssetType,
    CreateAssetInput,
    CreateAssetResult,
    DeletionResponse,
    DeletionResult,
    UpdateAssetInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { ReadStream } from 'fs-extra';
import mime from 'mime-types';
import path from 'path';
import { Stream } from 'stream';

import { RequestContext } from '../../api/common/request-context';
import { isGraphQlErrorResult } from '../../common/error/error-result';
import { InternalServerError } from '../../common/error/errors';
import { MimeTypeError } from '../../common/error/generated-graphql-admin-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { getAssetType, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { Asset } from '../../entity/asset/asset.entity';
import { OrderableAsset } from '../../entity/asset/orderable-asset.entity';
import { VendureEntity } from '../../entity/base/base.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { AssetEvent } from '../../event-bus/events/asset-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';
// tslint:disable-next-line:no-var-requires
const sizeOf = require('image-size');

export interface EntityWithAssets extends VendureEntity {
    featuredAsset: Asset | null;
    assets: OrderableAsset[];
}

export interface EntityAssetInput {
    assetIds?: ID[] | null;
    featuredAssetId?: ID | null;
}

@Injectable()
export class AssetService {
    private permittedMimeTypes: Array<{ type: string; subtype: string }> = [];

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private eventBus: EventBus,
    ) {
        this.permittedMimeTypes = this.configService.assetOptions.permittedFileTypes
            .map(val => (/\.[\w]+/.test(val) ? mime.lookup(val) || undefined : val))
            .filter(notNullOrUndefined)
            .map(val => {
                const [type, subtype] = val.split('/');
                return { type, subtype };
            });
    }

    findOne(ctx: RequestContext, id: ID): Promise<Asset | undefined> {
        return this.connection.getRepository(ctx, Asset).findOne(id);
    }

    findAll(ctx: RequestContext, options?: ListQueryOptions<Asset>): Promise<PaginatedList<Asset>> {
        return this.listQueryBuilder
            .build(Asset, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async getFeaturedAsset<T extends Omit<EntityWithAssets, 'assets'>>(
        ctx: RequestContext,
        entity: T,
    ): Promise<Asset | undefined> {
        const entityType: Type<EntityWithAssets> = Object.getPrototypeOf(entity).constructor;
        const entityWithFeaturedAsset = await this.connection
            .getRepository(ctx, entityType)
            .findOne(entity.id, {
                relations: ['featuredAsset'],
            });
        return (entityWithFeaturedAsset && entityWithFeaturedAsset.featuredAsset) || undefined;
    }

    async getEntityAssets<T extends EntityWithAssets>(
        ctx: RequestContext,
        entity: T,
    ): Promise<Asset[] | undefined> {
        let assets = entity.assets;
        if (!assets) {
            const entityType: Type<EntityWithAssets> = Object.getPrototypeOf(entity).constructor;
            const entityWithAssets = await this.connection.getRepository(ctx, entityType).findOne(entity.id, {
                relations: ['assets'],
            });
            assets = (entityWithAssets && entityWithAssets.assets) || [];
        }
        return assets.sort((a, b) => a.position - b.position).map(a => a.asset);
    }

    async updateFeaturedAsset<T extends EntityWithAssets>(
        ctx: RequestContext,
        entity: T,
        input: EntityAssetInput,
    ): Promise<T> {
        const { assetIds, featuredAssetId } = input;
        if (featuredAssetId === null || (assetIds && assetIds.length === 0)) {
            entity.featuredAsset = null;
            return entity;
        }
        if (featuredAssetId === undefined) {
            return entity;
        }
        const featuredAsset = await this.findOne(ctx, featuredAssetId);
        if (featuredAsset) {
            entity.featuredAsset = featuredAsset;
        }
        return entity;
    }

    /**
     * Updates the assets / featuredAsset of an entity, ensuring that only valid assetIds are used.
     */
    async updateEntityAssets<T extends EntityWithAssets>(
        ctx: RequestContext,
        entity: T,
        input: EntityAssetInput,
    ): Promise<T> {
        if (!entity.id) {
            throw new InternalServerError('error.entity-must-have-an-id');
        }
        const { assetIds, featuredAssetId } = input;
        if (assetIds && assetIds.length) {
            const assets = await this.connection.getRepository(ctx, Asset).findByIds(assetIds);
            const sortedAssets = assetIds
                .map(id => assets.find(a => idsAreEqual(a.id, id)))
                .filter(notNullOrUndefined);
            await this.removeExistingOrderableAssets(ctx, entity);
            entity.assets = await this.createOrderableAssets(ctx, entity, sortedAssets);
        } else if (assetIds && assetIds.length === 0) {
            await this.removeExistingOrderableAssets(ctx, entity);
        }
        return entity;
    }

    /**
     * Create an Asset based on a file uploaded via the GraphQL API.
     */
    async create(ctx: RequestContext, input: CreateAssetInput): Promise<CreateAssetResult> {
        const { createReadStream, filename, mimetype } = await input.file;
        const stream = createReadStream();
        const result = await this.createAssetInternal(ctx, stream, filename, mimetype);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        this.eventBus.publish(new AssetEvent(ctx, result, 'created'));
        return result;
    }

    async update(ctx: RequestContext, input: UpdateAssetInput): Promise<Asset> {
        const asset = await this.connection.getEntityOrThrow(ctx, Asset, input.id);
        if (input.focalPoint) {
            const to3dp = (x: number) => +x.toFixed(3);
            input.focalPoint.x = to3dp(input.focalPoint.x);
            input.focalPoint.y = to3dp(input.focalPoint.y);
        }
        patchEntity(asset, input);
        const updatedAsset = await this.connection.getRepository(ctx, Asset).save(asset);
        this.eventBus.publish(new AssetEvent(ctx, updatedAsset, 'updated'));
        return updatedAsset;
    }

    async delete(ctx: RequestContext, ids: ID[], force: boolean = false): Promise<DeletionResponse> {
        const assets = await this.connection.getRepository(ctx, Asset).findByIds(ids);
        const usageCount = {
            products: 0,
            variants: 0,
            collections: 0,
        };
        for (const asset of assets) {
            const usages = await this.findAssetUsages(ctx, asset);
            usageCount.products += usages.products.length;
            usageCount.variants += usages.variants.length;
            usageCount.collections += usages.collections.length;
        }
        const hasUsages = !!(usageCount.products || usageCount.variants || usageCount.collections);
        if (hasUsages && !force) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: ctx.translate('message.asset-to-be-deleted-is-featured', {
                    assetCount: assets.length,
                    products: usageCount.products,
                    variants: usageCount.variants,
                    collections: usageCount.collections,
                }),
            };
        }
        for (const asset of assets) {
            // Create a new asset so that the id is still available
            // after deletion (the .remove() method sets it to undefined)
            const deletedAsset = new Asset(asset);
            await this.connection.getRepository(ctx, Asset).remove(asset);
            try {
                await this.configService.assetOptions.assetStorageStrategy.deleteFile(asset.source);
                await this.configService.assetOptions.assetStorageStrategy.deleteFile(asset.preview);
            } catch (e) {
                Logger.error(`error.could-not-delete-asset-file`, undefined, e.stack);
            }
            this.eventBus.publish(new AssetEvent(ctx, deletedAsset, 'deleted'));
        }
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * Create an Asset from a file stream created during data import.
     */
    async createFromFileStream(stream: ReadStream): Promise<CreateAssetResult> {
        const filePath = stream.path;
        if (typeof filePath === 'string') {
            const filename = path.basename(filePath);
            const mimetype = mime.lookup(filename) || 'application/octet-stream';
            return this.createAssetInternal(RequestContext.empty(), stream, filename, mimetype);
        } else {
            throw new InternalServerError(`error.path-should-be-a-string-got-buffer`);
        }
    }

    private async createAssetInternal(
        ctx: RequestContext,
        stream: Stream,
        filename: string,
        mimetype: string,
    ): Promise<CreateAssetResult> {
        const { assetOptions } = this.configService;
        if (!this.validateMimeType(mimetype)) {
            return new MimeTypeError(filename, mimetype);
        }
        const { assetPreviewStrategy, assetStorageStrategy } = assetOptions;
        const sourceFileName = await this.getSourceFileName(ctx, filename);
        const previewFileName = await this.getPreviewFileName(ctx, sourceFileName);

        const sourceFileIdentifier = await assetStorageStrategy.writeFileFromStream(sourceFileName, stream);
        const sourceFile = await assetStorageStrategy.readFileToBuffer(sourceFileIdentifier);
        let preview: Buffer;
        try {
            preview = await assetPreviewStrategy.generatePreviewImage(mimetype, sourceFile);
        } catch (e) {
            Logger.error(`Could not create Asset preview image: ${e.message}`);
            throw e;
        }
        const previewFileIdentifier = await assetStorageStrategy.writeFileFromBuffer(
            previewFileName,
            preview,
        );
        const type = getAssetType(mimetype);
        const { width, height } = this.getDimensions(type === AssetType.IMAGE ? sourceFile : preview);

        const asset = new Asset({
            type,
            width,
            height,
            name: path.basename(sourceFileName),
            fileSize: sourceFile.byteLength,
            mimeType: mimetype,
            source: sourceFileIdentifier,
            preview: previewFileIdentifier,
            focalPoint: null,
        });
        return this.connection.getRepository(ctx, Asset).save(asset);
    }

    private async getSourceFileName(ctx: RequestContext, fileName: string): Promise<string> {
        const { assetOptions } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetOptions.assetNamingStrategy.generateSourceFileName(ctx, name, conflict),
        );
    }

    private async getPreviewFileName(ctx: RequestContext, fileName: string): Promise<string> {
        const { assetOptions } = this.configService;
        return this.generateUniqueName(fileName, (name, conflict) =>
            assetOptions.assetNamingStrategy.generatePreviewFileName(ctx, name, conflict),
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

    private getDimensions(imageFile: Buffer): { width: number; height: number } {
        try {
            const { width, height } = sizeOf(imageFile);
            return { width, height };
        } catch (e) {
            Logger.error(`Could not determine Asset dimensions: ` + e);
            return { width: 0, height: 0 };
        }
    }

    private createOrderableAssets(
        ctx: RequestContext,
        entity: EntityWithAssets,
        assets: Asset[],
    ): Promise<OrderableAsset[]> {
        const orderableAssets = assets.map((asset, i) => this.getOrderableAsset(ctx, entity, asset, i));
        return this.connection.getRepository(ctx, orderableAssets[0].constructor).save(orderableAssets);
    }

    private getOrderableAsset(
        ctx: RequestContext,
        entity: EntityWithAssets,
        asset: Asset,
        index: number,
    ): OrderableAsset {
        const entityIdProperty = this.getHostEntityIdProperty(entity);
        const orderableAssetType = this.getOrderableAssetType(ctx, entity);
        return new orderableAssetType({
            assetId: asset.id,
            position: index,
            [entityIdProperty]: entity.id,
        });
    }

    private async removeExistingOrderableAssets(ctx: RequestContext, entity: EntityWithAssets) {
        const propertyName = this.getHostEntityIdProperty(entity);
        const orderableAssetType = this.getOrderableAssetType(ctx, entity);
        await this.connection.getRepository(ctx, orderableAssetType).delete({
            [propertyName]: entity.id,
        });
    }

    private getOrderableAssetType(ctx: RequestContext, entity: EntityWithAssets): Type<OrderableAsset> {
        const assetRelation = this.connection
            .getRepository(ctx, entity.constructor)
            .metadata.relations.find(r => r.propertyName === 'assets');
        if (!assetRelation || typeof assetRelation.type === 'string') {
            throw new InternalServerError('error.could-not-find-matching-orderable-asset');
        }
        return assetRelation.type as Type<OrderableAsset>;
    }

    private getHostEntityIdProperty(entity: EntityWithAssets): string {
        const entityName = entity.constructor.name;
        switch (entityName) {
            case 'Product':
                return 'productId';
            case 'ProductVariant':
                return 'productVariantId';
            case 'Collection':
                return 'collectionId';
            default:
                throw new InternalServerError('error.could-not-find-matching-orderable-asset');
        }
    }

    private validateMimeType(mimeType: string): boolean {
        const [type, subtype] = mimeType.split('/');
        const typeMatch = this.permittedMimeTypes.find(t => t.type === type);
        if (typeMatch) {
            return typeMatch.subtype === subtype || typeMatch.subtype === '*';
        }
        return false;
    }

    /**
     * Find the entities which reference the given Asset as a featuredAsset.
     */
    private async findAssetUsages(
        ctx: RequestContext,
        asset: Asset,
    ): Promise<{ products: Product[]; variants: ProductVariant[]; collections: Collection[] }> {
        const products = await this.connection.getRepository(ctx, Product).find({
            where: {
                featuredAsset: asset,
                deletedAt: null,
            },
        });
        const variants = await this.connection.getRepository(ctx, ProductVariant).find({
            where: {
                featuredAsset: asset,
                deletedAt: null,
            },
        });
        const collections = await this.connection.getRepository(ctx, Collection).find({
            where: {
                featuredAsset: asset,
            },
        });
        return { products, variants, collections };
    }
}
