import { Injectable } from '@nestjs/common';
import {
    AssetListOptions,
    AssetType,
    AssignAssetsToChannelInput,
    CreateAssetInput,
    CreateAssetResult,
    DeletionResponse,
    DeletionResult,
    LogicalOperator,
    Permission,
    UpdateAssetInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { ReadStream } from 'fs-extra';
import mime from 'mime-types';
import path from 'path';
import { Readable, Stream } from 'stream';
import { camelCase } from 'typeorm/util/StringUtils';

import { RequestContext } from '../../api/common/request-context';
import { isGraphQlErrorResult } from '../../common/error/error-result';
import { ForbiddenError, InternalServerError } from '../../common/error/errors';
import { MimeTypeError } from '../../common/error/generated-graphql-admin-errors';
import { ChannelAware } from '../../common/types/common-types';
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
import { AssetChannelEvent } from '../../event-bus/events/asset-channel-event';
import { AssetEvent } from '../../event-bus/events/asset-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';
import { RoleService } from './role.service';
import { TagService } from './tag.service';

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
        private tagService: TagService,
        private channelService: ChannelService,
        private roleService: RoleService,
        private customFieldRelationService: CustomFieldRelationService,
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
        return this.connection.findOneInChannel(ctx, Asset, id, ctx.channelId);
    }

    findAll(ctx: RequestContext, options?: AssetListOptions): Promise<PaginatedList<Asset>> {
        const qb = this.listQueryBuilder.build(Asset, options, {
            ctx,
            relations: options?.tags ? ['tags', 'channels'] : ['channels'],
            channelId: ctx.channelId,
        });
        const tags = options?.tags;
        if (tags && tags.length) {
            const operator = options?.tagsOperator ?? LogicalOperator.AND;
            const subquery = qb.connection
                .createQueryBuilder()
                .select('asset.id')
                .from(Asset, 'asset')
                .leftJoin('asset.tags', 'tags')
                .where(`tags.value IN (:...tags)`);

            if (operator === LogicalOperator.AND) {
                subquery.groupBy('asset.id').having('COUNT(asset.id) = :tagCount');
            }

            qb.andWhere(`asset.id IN (${subquery.getQuery()})`).setParameters({
                tags,
                tagCount: tags.length,
            });
        }
        return qb.getManyAndCount().then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
    }

    async getFeaturedAsset<T extends Omit<EntityWithAssets, 'assets'>>(
        ctx: RequestContext,
        entity: T,
    ): Promise<Asset | undefined> {
        const entityType: Type<T> = Object.getPrototypeOf(entity).constructor;
        let entityWithFeaturedAsset: T | undefined;

        if (this.channelService.isChannelAware(entity)) {
            entityWithFeaturedAsset = await this.connection.findOneInChannel(
                ctx,
                entityType as Type<T & ChannelAware>,
                entity.id,
                ctx.channelId,
                {
                    relations: ['featuredAsset'],
                },
            );
        } else {
            entityWithFeaturedAsset = await this.connection
                .getRepository(ctx, entityType)
                .findOne(entity.id, {
                    relations: ['featuredAsset'],
                });
        }
        return (entityWithFeaturedAsset && entityWithFeaturedAsset.featuredAsset) || undefined;
    }

    async getEntityAssets<T extends EntityWithAssets>(
        ctx: RequestContext,
        entity: T,
    ): Promise<Asset[] | undefined> {
        let orderableAssets = entity.assets;
        if (!orderableAssets) {
            const entityType: Type<EntityWithAssets> = Object.getPrototypeOf(entity).constructor;
            const entityWithAssets = await this.connection
                .getRepository(ctx, entityType)
                .createQueryBuilder('entity')
                .leftJoinAndSelect('entity.assets', 'orderable_asset')
                .leftJoinAndSelect('orderable_asset.asset', 'asset')
                .leftJoinAndSelect('asset.channels', 'asset_channel')
                .where('entity.id = :id', { id: entity.id })
                .andWhere('asset_channel.id = :channelId', { channelId: ctx.channelId })
                .getOne();

            orderableAssets = entityWithAssets?.assets ?? [];
        } else if (0 < orderableAssets.length) {
            // the Assets are already loaded, but we need to limit them by Channel
            if (orderableAssets[0].asset?.channels) {
                orderableAssets = orderableAssets.filter(
                    a => !!a.asset.channels.map(c => c.id).find(id => idsAreEqual(id, ctx.channelId)),
                );
            } else {
                const assetsInChannel = await this.connection
                    .getRepository(ctx, Asset)
                    .createQueryBuilder('asset')
                    .leftJoinAndSelect('asset.channels', 'asset_channel')
                    .where('asset.id IN (:...ids)', { ids: orderableAssets.map(a => a.assetId) })
                    .andWhere('asset_channel.id = :channelId', { channelId: ctx.channelId })
                    .getMany();

                orderableAssets = orderableAssets.filter(
                    oa => !!assetsInChannel.find(a => idsAreEqual(a.id, oa.assetId)),
                );
            }
        } else {
            orderableAssets = [];
        }
        return orderableAssets.sort((a, b) => a.position - b.position).map(a => a.asset);
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
        const { assetIds } = input;
        if (assetIds && assetIds.length) {
            const assets = await this.connection.findByIdsInChannel(ctx, Asset, assetIds, ctx.channelId, {});
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
        return new Promise(async (resolve, reject) => {
            const { createReadStream, filename, mimetype } = await input.file;
            const stream = createReadStream();
            stream.on('error', (err: any) => {
                reject(err);
            });
            const result = await this.createAssetInternal(
                ctx,
                stream,
                filename,
                mimetype,
                input.customFields,
            );
            if (isGraphQlErrorResult(result)) {
                resolve(result);
                return;
            }
            await this.customFieldRelationService.updateRelations(ctx, Asset, input, result);
            if (input.tags) {
                const tags = await this.tagService.valuesToTags(ctx, input.tags);
                result.tags = tags;
                await this.connection.getRepository(ctx, Asset).save(result);
            }
            this.eventBus.publish(new AssetEvent(ctx, result, 'created'));
            resolve(result);
        });
    }

    async update(ctx: RequestContext, input: UpdateAssetInput): Promise<Asset> {
        const asset = await this.connection.getEntityOrThrow(ctx, Asset, input.id);
        if (input.focalPoint) {
            const to3dp = (x: number) => +x.toFixed(3);
            input.focalPoint.x = to3dp(input.focalPoint.x);
            input.focalPoint.y = to3dp(input.focalPoint.y);
        }
        patchEntity(asset, omit(input, ['tags']));
        await this.customFieldRelationService.updateRelations(ctx, Asset, input, asset);
        if (input.tags) {
            asset.tags = await this.tagService.valuesToTags(ctx, input.tags);
        }
        const updatedAsset = await this.connection.getRepository(ctx, Asset).save(asset);
        this.eventBus.publish(new AssetEvent(ctx, updatedAsset, 'updated'));
        return updatedAsset;
    }

    async delete(
        ctx: RequestContext,
        ids: ID[],
        force: boolean = false,
        deleteFromAllChannels: boolean = false,
    ): Promise<DeletionResponse> {
        const assets = await this.connection.findByIdsInChannel(ctx, Asset, ids, ctx.channelId, {
            relations: ['channels'],
        });
        let channelsOfAssets: ID[] = [];
        assets.forEach(a => a.channels.forEach(c => channelsOfAssets.push(c.id)));
        channelsOfAssets = unique(channelsOfAssets);
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
        const hasDeleteAllPermission = await this.hasDeletePermissionForChannels(ctx, channelsOfAssets);
        if (deleteFromAllChannels && !hasDeleteAllPermission) {
            throw new ForbiddenError();
        }
        if (!deleteFromAllChannels) {
            await Promise.all(
                assets.map(async asset => {
                    await this.channelService.removeFromChannels(ctx, Asset, asset.id, [ctx.channelId]);
                    this.eventBus.publish(new AssetChannelEvent(ctx, asset, ctx.channelId, 'removed'));
                }),
            );
            const isOnlyChannel = channelsOfAssets.length === 1;
            if (isOnlyChannel) {
                // only channel, so also delete asset
                await this.deleteUnconditional(ctx, assets);
            }
            return {
                result: DeletionResult.DELETED,
            };
        }
        // This leaves us with deleteFromAllChannels with force or deleteFromAllChannels with no current usages
        await Promise.all(
            assets.map(async asset => {
                await this.channelService.removeFromChannels(ctx, Asset, asset.id, channelsOfAssets);
                this.eventBus.publish(new AssetChannelEvent(ctx, asset, ctx.channelId, 'removed'));
            }),
        );
        return this.deleteUnconditional(ctx, assets);
    }

    async assignToChannel(ctx: RequestContext, input: AssignAssetsToChannelInput): Promise<Asset[]> {
        const hasPermission = await this.roleService.userHasPermissionOnChannel(
            ctx,
            input.channelId,
            Permission.UpdateCatalog,
        );
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const assets = await this.connection.findByIdsInChannel(
            ctx,
            Asset,
            input.assetIds,
            ctx.channelId,
            {},
        );
        await Promise.all(
            assets.map(async asset => {
                await this.channelService.assignToChannels(ctx, Asset, asset.id, [input.channelId]);
                return this.eventBus.publish(new AssetChannelEvent(ctx, asset, input.channelId, 'assigned'));
            }),
        );
        return this.connection.findByIdsInChannel(
            ctx,
            Asset,
            assets.map(a => a.id),
            ctx.channelId,
            {},
        );
    }

    /**
     * Create an Asset from a file stream created during data import.
     */
    async createFromFileStream(stream: ReadStream): Promise<CreateAssetResult>;
    async createFromFileStream(stream: Readable, filePath: string): Promise<CreateAssetResult>;
    async createFromFileStream(
        stream: ReadStream | Readable,
        maybeFilePath?: string,
    ): Promise<CreateAssetResult> {
        const filePath = stream instanceof ReadStream ? stream.path : maybeFilePath;
        if (typeof filePath === 'string') {
            const filename = path.basename(filePath);
            const mimetype = mime.lookup(filename) || 'application/octet-stream';
            return this.createAssetInternal(RequestContext.empty(), stream, filename, mimetype);
        } else {
            throw new InternalServerError(`error.path-should-be-a-string-got-buffer`);
        }
    }

    /**
     * Unconditionally delete given assets.
     * Does not remove assets from channels
     */
    private async deleteUnconditional(ctx: RequestContext, assets: Asset[]): Promise<DeletionResponse> {
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
     * Check if current user has permissions to delete assets from all channels
     */
    private async hasDeletePermissionForChannels(ctx: RequestContext, channelIds: ID[]): Promise<boolean> {
        const permissions = await Promise.all(
            channelIds.map(async channelId => {
                return this.roleService.userHasPermissionOnChannel(ctx, channelId, Permission.DeleteCatalog);
            }),
        );
        return !permissions.includes(false);
    }

    private async createAssetInternal(
        ctx: RequestContext,
        stream: Stream,
        filename: string,
        mimetype: string,
        customFields?: { [key: string]: any },
    ): Promise<Asset | MimeTypeError> {
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
            preview = await assetPreviewStrategy.generatePreviewImage(ctx, mimetype, sourceFile);
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
            customFields,
        });
        this.channelService.assignToCurrentChannel(asset, ctx);
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
                return `${camelCase(entityName)}Id`;
        }
    }

    private validateMimeType(mimeType: string): boolean {
        const [type, subtype] = mimeType.split('/');
        const typeMatches = this.permittedMimeTypes.filter(t => t.type === type);

        for (const match of typeMatches) {
            if (match.subtype === subtype || match.subtype === '*') {
                return true;
            }
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
