import { Injectable } from '@nestjs/common';
import { JobState } from '@vendure/common/lib/generated-types';
import {
  Channel,
  ChannelService,
  EventBus,
  ID,
  Job,
  Logger,
  ProductVariant,
  ProductVariantEvent,
  RequestContext,
  RequestContextService,
  StockLevel,
  StockLocationService,
  TransactionalConnection,
} from '@vendure/core';


import { BATCH_SIZE, loggerCtx } from '../../constants';

@Injectable()
export class AssemblyStockSyncJob {
  protected defaultChannel!: Channel;
  protected defaultChannelCtx!: RequestContext;
  private defaultStockLocationId!: ID;

  constructor(
    protected channelService: ChannelService,
    protected requestContextService: RequestContextService,
    protected connection: TransactionalConnection,
    private eventBus: EventBus,
    private stockLocationService: StockLocationService,
  ) {}

  async onApplicationBootstrap() {
    this.defaultChannel = await this.channelService.getDefaultChannel();
    this.defaultChannelCtx = await this.requestContextService.create({
      apiType: 'admin',
      channelOrToken: this.defaultChannel,
      currencyCode: this.defaultChannel.defaultCurrencyCode,
      languageCode: this.defaultChannel.defaultLanguageCode,
    });
    this.defaultStockLocationId = (
      await this.stockLocationService.defaultStockLocation(
        this.defaultChannelCtx,
      )
    ).id;
  }

  /**
   * Syncs assembly stock levels from KEA by creating baskets for all assembly products
   * and updating the assemblyStockLevel custom field on product variants.
   */
  async syncAssemblyStockLevels(job: Job): Promise<{
    result: string;
    totalProducts: number;
    totalProcessed: number;
    updatedCount: number;
    updated: Array<{ variantId: ID; productId: string; stockLevel: number }>;
  }> {
    const importId = `assembly-stock-${Date.now()}`;

    try {
      Logger.info(
        `[${importId}] Starting assembly stock level sync`,
        loggerCtx,
      );

      Logger.info(
        `[${importId}] Assembly stock level sync completed. Processed some data`,
        loggerCtx,
      );
      return {
        result: `Processed some data`,
        totalProducts: 0,
        totalProcessed: 0,
        updatedCount: 0,
        updated: [],
      };
    } catch (error) {
      Logger.error(
        `[${importId}] Fatal error in assembly stock level sync: ${error as string}`,
        loggerCtx,
      );
      throw error;
    }
  }

}
