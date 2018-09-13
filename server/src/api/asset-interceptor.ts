import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Type } from 'shared/shared-types';

import { AssetStorageStrategy } from '../config/asset-storage-strategy/asset-storage-strategy';
import { ConfigService } from '../config/config.service';
import { Asset } from '../entity/asset/asset.entity';

/**
 * Transforms outputs so that any Asset instances are run through the {@link AssetStorageStrategy.toAbsoluteUrl}
 * method before being returned in the response.
 */
@Injectable()
export class AssetInterceptor implements NestInterceptor {
    private readonly toAbsoluteUrl: AssetStorageStrategy['toAbsoluteUrl'] | undefined;

    constructor(private configService: ConfigService) {
        const { assetStorageStrategy } = this.configService;
        if (assetStorageStrategy.toAbsoluteUrl) {
            this.toAbsoluteUrl = assetStorageStrategy.toAbsoluteUrl.bind(assetStorageStrategy);
        }
    }

    intercept<T = any>(context: ExecutionContext, call$: Observable<T>): Observable<T> {
        const toAbsoluteUrl = this.toAbsoluteUrl;
        if (toAbsoluteUrl === undefined) {
            return call$;
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        const request = ctx.req;
        return call$.pipe(
            map(data => {
                visitType(data, Asset, asset => {
                    asset.preview = toAbsoluteUrl(request, asset.preview);
                    asset.source = toAbsoluteUrl(request, asset.source);
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
function visitType<T>(obj: any, type: Type<T>, visit: (instance: T) => void) {
    const keys = Object.keys(obj || {});
    for (const key of keys) {
        const value = obj[key];
        if (value instanceof type) {
            visit(value);
        } else {
            if (typeof value === 'object') {
                visitType(value, type, visit);
            }
        }
    }
}
