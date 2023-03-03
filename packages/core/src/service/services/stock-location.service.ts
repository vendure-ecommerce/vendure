import { Injectable } from '@nestjs/common';
import {
    CreateStockLocationInput,
    DeleteStockLocationInput,
    UpdateStockLocationInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RelationPaths, RequestContext } from '../../api/index';
import { RequestContextCacheService } from '../../cache/index';
import { ListQueryOptions } from '../../common/index';
import { ConfigService } from '../../config/index';
import { TransactionalConnection } from '../../connection/index';
import { Order, OrderLine } from '../../entity/index';
import { StockLocation } from '../../entity/stock-location/stock-location.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { RequestContextService } from '../helpers/request-context/request-context.service';

import { ChannelService } from './channel.service';

@Injectable()
export class StockLocationService {
    constructor(
        private requestContextService: RequestContextService,
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
        private configService: ConfigService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    async initStockLocations() {
        await this.ensureDefaultStockLocationExists();
    }

    findOne(ctx: RequestContext, stockLocationId: ID): Promise<StockLocation | undefined> {
        return this.connection.getRepository(ctx, StockLocation).findOne(stockLocationId);
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<StockLocation>,
        relations?: RelationPaths<StockLocation>,
    ): Promise<PaginatedList<StockLocation>> {
        return this.listQueryBuilder
            .build(StockLocation, options, {
                relations,
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    create(ctx: RequestContext, input: CreateStockLocationInput): Promise<StockLocation> {
        return this.connection.getRepository(ctx, StockLocation).save(
            new StockLocation({
                name: input.name,
                description: input.description,
            }),
        );
    }

    async update(ctx: RequestContext, input: UpdateStockLocationInput): Promise<StockLocation> {
        const stockLocation = await this.connection.getEntityOrThrow(ctx, StockLocation, input.id);
        if (input.name) {
            stockLocation.name = input.name;
        }
        if (input.description) {
            stockLocation.description = input.description;
        }
        return this.connection.getRepository(ctx, StockLocation).save(stockLocation);
    }

    async delete(ctx: RequestContext, input: DeleteStockLocationInput): Promise<StockLocation> {
        const stockLocation = await this.connection.getEntityOrThrow(ctx, StockLocation, input.id);
        await this.connection.getRepository(ctx, StockLocation).remove(stockLocation);
        return stockLocation;
    }

    getAllStockLocations(ctx: RequestContext) {
        return this.requestContextCache.get(ctx, `StockLocationService.getAllStockLocations`, () =>
            this.connection.getRepository(ctx, StockLocation).find(),
        );
    }

    defaultStockLocation(ctx: RequestContext) {
        return this.connection
            .getRepository(ctx, StockLocation)
            .find({ order: { createdAt: 'ASC' } })
            .then(items => items[0]);
    }

    async getAllocationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLocations = await this.getAllStockLocations(ctx);
        const allocationLocations = await stockLocationStrategy.forAllocation(
            ctx,
            stockLocations,
            orderLine,
            quantity,
        );
        return allocationLocations;
    }

    async getReleaseLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLocations = await this.getAllStockLocations(ctx);
        const releaseLocations = await stockLocationStrategy.forRelease(
            ctx,
            stockLocations,
            orderLine,
            quantity,
        );
        return releaseLocations;
    }

    async getSaleLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLocations = await this.getAllStockLocations(ctx);
        const saleLocations = await stockLocationStrategy.forSale(ctx, stockLocations, orderLine, quantity);
        return saleLocations;
    }

    async getCancellationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLocations = await this.getAllStockLocations(ctx);
        const cancellationLocations = await stockLocationStrategy.forCancellation(
            ctx,
            stockLocations,
            orderLine,
            quantity,
        );
        return cancellationLocations;
    }

    private async ensureDefaultStockLocationExists() {
        const ctx = await this.requestContextService.create({
            apiType: 'admin',
        });
        const stockLocations = await this.connection.getRepository(ctx, StockLocation).find();
        if (stockLocations.length === 0) {
            const defaultStockLocation = await this.connection.getRepository(ctx, StockLocation).save(
                new StockLocation({
                    name: 'Default Stock Location',
                    description: 'The default stock location',
                }),
            );
            await this.channelService.assignToCurrentChannel(defaultStockLocation, ctx);
        }
    }
}
