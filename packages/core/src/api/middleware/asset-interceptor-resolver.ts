import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Asset } from '../../../../common/lib/generated-types';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { RequestContext } from '../common/request-context';

const loggerCtx = 'AssetInterceptorResolver';

@Resolver('Asset')
export class AssetInterceptorResolver {
    constructor(private configService: ConfigService) {}

    @ResolveField('preview')
    resolvePreview(@Parent() asset: Asset, @Context() ctx: RequestContext): string {
        const { assetOptions } = this.configService;
        const strategy = assetOptions.assetStorageStrategy;

        if (strategy.toAbsoluteUrl) {
            const req = ctx.req;
            try {
                return strategy.toAbsoluteUrl(req, asset.preview);
            } catch (e: unknown) {
                // Log the error and return the original value as a fallback
                const message = e instanceof Error ? e.message : String(e);
                Logger.error(
                    `Error applying toAbsoluteUrl to Asset preview (ID: ${asset.id}): ${message}`,
                    loggerCtx,
                );
                return asset.preview;
            }
        } else {
            return asset.preview;
        }
    }

    @ResolveField('source')
    resolveSource(@Parent() asset: Asset, @Context() ctx: RequestContext): string {
        const { assetOptions } = this.configService;
        const strategy = assetOptions.assetStorageStrategy;

        if (strategy.toAbsoluteUrl) {
            const req = ctx.req;
            try {
                return strategy.toAbsoluteUrl(req, asset.source);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                Logger.error(
                    `Error applying toAbsoluteUrl to Asset source (ID: ${asset.id}): ${message}`,
                    loggerCtx,
                );
                return asset.source;
            }
        } else {
            return asset.source;
        }
    }
}
