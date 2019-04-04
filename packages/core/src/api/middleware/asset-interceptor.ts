import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Type } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';
import { ConfigService } from '../../config/config.service';
import { Asset } from '../../entity/asset/asset.entity';

/**
 * Transforms outputs so that any Asset instances are run through the {@link AssetStorageStrategy.toAbsoluteUrl}
 * method before being returned in the response.
 */
@Injectable()
export class AssetInterceptor implements NestInterceptor {
    private readonly toAbsoluteUrl: AssetStorageStrategy['toAbsoluteUrl'] | undefined;

    constructor(private configService: ConfigService) {
        const { assetOptions } = this.configService;
        if (assetOptions.assetStorageStrategy.toAbsoluteUrl) {
            this.toAbsoluteUrl = assetOptions.assetStorageStrategy.toAbsoluteUrl.bind(
                assetOptions.assetStorageStrategy,
            );
        }
    }

    intercept<T = any>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
        const toAbsoluteUrl = this.toAbsoluteUrl;
        if (toAbsoluteUrl === undefined) {
            return next.handle();
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        const request = ctx.req;
        return next.handle().pipe(
            map(data => {
                visitType(data, [Asset, 'productPreview', 'productVariantPreview'], asset => {
                    if (asset instanceof Asset) {
                        asset.preview = toAbsoluteUrl(request, asset.preview);
                        asset.source = toAbsoluteUrl(request, asset.source);
                    } else {
                        asset = toAbsoluteUrl(request, asset);
                    }
                    return asset;
                });
                return data;
            }),
        );
    }
}

/**
 * Traverses the object and when encountering a property with a value which
 * is an instance of class T, invokes the visitor function on that value.
 */
function visitType<T>(obj: any, types: Array<Type<T> | string>, visit: (instance: T | string) => T | string) {
    const keys = Object.keys(obj || {});
    for (const key of keys) {
        const value = obj[key];

        for (const type of types) {
            if (typeof type === 'string') {
                if (type === key) {
                    obj[key] = visit(value);
                }
            } else if (value instanceof type) {
                visit(value);
            }
        }
        if (typeof value === 'object') {
            visitType(value, types, visit);
        }
    }
}
