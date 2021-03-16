import { RequestContext } from '../api';

/**
 * @description
 * This service is used to cache arbitrary data relative to an ongoing request.
 * It does this by using a WeakMap bound to the current RequestContext, so the cached
 * data is available for the duration of the request. Once the request completes, the
 * cached data will be automatically garbage-collected.
 */
export class RequestContextCacheService {
    private caches = new WeakMap<RequestContext, Map<any, any>>();

    set<T = any>(ctx: RequestContext, key: any, val: T): void {
        this.getContextCache(ctx).set(key, val);
    }

    get<T = any>(ctx: RequestContext, key: any): T | undefined;
    get<T = any>(ctx: RequestContext, key: any, getDefault?: () => Promise<T>): Promise<T>;
    get<T = any>(ctx: RequestContext, key: any, getDefault?: () => Promise<T>): Promise<T> | T | undefined {
        const ctxCache = this.getContextCache(ctx);
        const result = ctxCache.get(key);
        if (result) {
            return result;
        }
        if (getDefault) {
            return getDefault().then(defaultResult => {
                ctxCache.set(key, defaultResult);
                return defaultResult;
            });
        } else {
            return;
        }
    }

    private getContextCache(ctx: RequestContext): Map<any, any> {
        let ctxCache = this.caches.get(ctx);
        if (!ctxCache) {
            ctxCache = new Map<any, any>();
            this.caches.set(ctx, ctxCache);
        }
        return ctxCache;
    }
}
