import { RequestContext } from '../api';

export class RequestContextCacheService {
    private caches = new WeakMap<RequestContext, Map<any, any>>();

    async set(ctx: RequestContext, key: any, val: any): Promise<void> {
        this.getContextCache(ctx).set(key, val);
    }

    async get(ctx: RequestContext, key: any, getDefault?: () => Promise<any>): Promise<any> {
        const ctxCache = this.getContextCache(ctx);
        let result = ctxCache.get(key);
        if (!result && getDefault) {
            result = await getDefault();
            ctxCache.set(key, result);
        }
        return result;
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
