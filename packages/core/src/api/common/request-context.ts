import { CurrencyCode, LanguageCode, Permission } from '@vendure/common/lib/generated-types';
import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';
import { isObject } from '@vendure/common/lib/shared-utils';
import { Request } from 'express';
import { TFunction } from 'i18next';

import { idsAreEqual } from '../../common/utils';
import { CachedSession } from '../../config/session-cache/session-cache-strategy';
import { Channel } from '../../entity/channel/channel.entity';

import { ApiType } from './get-api-type';

export type SerializedRequestContext = {
    _req?: any;
    _session: JsonCompatible<Required<CachedSession>>;
    _apiType: ApiType;
    _channel: JsonCompatible<Channel>;
    _languageCode: LanguageCode;
    _isAuthorized: boolean;
    _authorizedAsOwnerOnly: boolean;
};

/**
 * @description
 * The RequestContext holds information relevant to the current request, which may be
 * required at various points of the stack.
 *
 * It is a good practice to inject the RequestContext (using the {@link Ctx} decorator) into
 * _all_ resolvers & REST handler, and then pass it through to the service layer.
 *
 * This allows the service layer to access information about the current user, the active language,
 * the active Channel, and so on. In addition, the {@link TransactionalConnection} relies on the
 * presence of the RequestContext object in order to correctly handle per-request database transactions.
 *
 * @example
 * ```ts
 * \@Query()
 * myQuery(\@Ctx() ctx: RequestContext) {
 *   return this.myService.getData(ctx);
 * }
 * ```
 * @docsCategory request
 */
export class RequestContext {
    private readonly _languageCode: LanguageCode;
    private readonly _currencyCode: CurrencyCode;
    private readonly _channel: Channel;
    private readonly _session?: CachedSession;
    private readonly _isAuthorized: boolean;
    private readonly _authorizedAsOwnerOnly: boolean;
    private readonly _translationFn: TFunction;
    private readonly _apiType: ApiType;
    private readonly _req?: Request;

    /**
     * @internal
     */
    constructor(options: {
        req?: Request;
        apiType: ApiType;
        channel: Channel;
        session?: CachedSession;
        languageCode?: LanguageCode;
        currencyCode?: CurrencyCode;
        isAuthorized: boolean;
        authorizedAsOwnerOnly: boolean;
        translationFn?: TFunction;
    }) {
        const { req, apiType, channel, session, languageCode, currencyCode, translationFn } = options;
        this._req = req;
        this._apiType = apiType;
        this._channel = channel;
        this._session = session;
        this._languageCode = languageCode || (channel && channel.defaultLanguageCode);
        this._currencyCode = currencyCode || (channel && channel.defaultCurrencyCode);
        this._isAuthorized = options.isAuthorized;
        this._authorizedAsOwnerOnly = options.authorizedAsOwnerOnly;
        this._translationFn = translationFn || (((key: string) => key) as any);
    }

    /**
     * @description
     * Creates an "empty" RequestContext object. This is only intended to be used
     * when a service method must be called outside the normal request-response
     * cycle, e.g. when programmatically populating data. Usually a better alternative
     * is to use the {@link RequestContextService} `create()` method, which allows more control
     * over the resulting RequestContext object.
     */
    static empty(): RequestContext {
        return new RequestContext({
            apiType: 'admin',
            authorizedAsOwnerOnly: false,
            channel: new Channel(),
            isAuthorized: true,
        });
    }

    /**
     * @description
     * Creates a new RequestContext object from a serialized object created by the
     * `serialize()` method.
     */
    static deserialize(ctxObject: SerializedRequestContext): RequestContext {
        return new RequestContext({
            req: ctxObject._req,
            apiType: ctxObject._apiType,
            channel: new Channel(ctxObject._channel),
            session: {
                ...ctxObject._session,
                expires: ctxObject._session?.expires && new Date(ctxObject._session.expires),
            },
            languageCode: ctxObject._languageCode,
            isAuthorized: ctxObject._isAuthorized,
            authorizedAsOwnerOnly: ctxObject._authorizedAsOwnerOnly,
        });
    }

    /**
     * @description
     * Returns `true` if there is an active Session & User associated with this request,
     * and that User has the specified permissions on the active Channel.
     */
    userHasPermissions(permissions: Permission[]): boolean {
        const user = this.session?.user;
        if (!user || !this.channelId) {
            return false;
        }
        const permissionsOnChannel = user.channelPermissions.find(c => idsAreEqual(c.id, this.channelId));
        if (permissionsOnChannel) {
            return this.arraysIntersect(permissionsOnChannel.permissions, permissions);
        }
        return false;
    }

    /**
     * @description
     * Serializes the RequestContext object into a JSON-compatible simple object.
     * This is useful when you need to send a RequestContext object to another
     * process, e.g. to pass it to the Job Queue via the {@link JobQueueService}.
     */
    serialize(): SerializedRequestContext {
        const serializableThis: any = Object.assign({}, this);
        if (this._req) {
            serializableThis._req = this.shallowCloneRequestObject(this._req);
        }
        return JSON.parse(JSON.stringify(serializableThis));
    }

    /**
     * @description
     * Creates a shallow copy of the RequestContext instance. This means that
     * mutations to the copy itself will not affect the original, but deep mutations
     * (e.g. copy.channel.code = 'new') *will* also affect the original.
     */
    copy(): RequestContext {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    /**
     * @description
     * The raw Express request object.
     */
    get req(): Request | undefined {
        return this._req;
    }

    /**
     * @description
     * Signals which API this request was received by, e.g. `admin` or `shop`.
     */
    get apiType(): ApiType {
        return this._apiType;
    }

    /**
     * @description
     * The active {@link Channel} of this request.
     */
    get channel(): Channel {
        return this._channel;
    }

    get channelId(): ID {
        return this._channel.id;
    }

    get languageCode(): LanguageCode {
        return this._languageCode;
    }

    get currencyCode(): CurrencyCode {
        return this._currencyCode;
    }

    get session(): CachedSession | undefined {
        return this._session;
    }

    get activeUserId(): ID | undefined {
        return this.session?.user?.id;
    }

    /**
     * @description
     * True if the current session is authorized to access the current resolver method.
     *
     * @deprecated Use `userHasPermissions()` method instead.
     */
    get isAuthorized(): boolean {
        return this._isAuthorized;
    }

    /**
     * @description
     * True if the current anonymous session is only authorized to operate on entities that
     * are owned by the current session.
     */
    get authorizedAsOwnerOnly(): boolean {
        return this._authorizedAsOwnerOnly;
    }

    /**
     * @description
     * Translate the given i18n key
     */
    translate(key: string, variables?: { [k: string]: any }): string {
        try {
            return this._translationFn(key, variables);
        } catch (e: any) {
            return `Translation format error: ${JSON.stringify(e.message)}). Original key: ${key}`;
        }
    }

    /**
     * Returns true if any element of arr1 appears in arr2.
     */
    private arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
        return arr1.reduce((intersects, role) => {
            return intersects || arr2.includes(role);
        }, false as boolean);
    }

    /**
     * The Express "Request" object is huge and contains many circular
     * references. We will preserve just a subset of the whole, by preserving
     * only the serializable properties up to 2 levels deep.
     * @private
     */
    private shallowCloneRequestObject(req: Request) {
        function copySimpleFieldsToDepth(target: any, maxDepth: number, depth: number = 0) {
            const result: any = {};
            // eslint-disable-next-line guard-for-in
            for (const key in target) {
                if (key === 'host' && depth === 0) {
                    // avoid Express "deprecated: req.host" warning
                    continue;
                }
                let val: any;
                try {
                    val = target[key];
                } catch (e: any) {
                    val = String(e);
                }

                if (Array.isArray(val)) {
                    depth++;
                    result[key] = val.map(v => {
                        if (!isObject(v) && typeof val !== 'function') {
                            return v;
                        } else {
                            return copySimpleFieldsToDepth(v, maxDepth, depth);
                        }
                    });
                    depth--;
                } else if (!isObject(val) && typeof val !== 'function') {
                    result[key] = val;
                } else if (depth < maxDepth) {
                    depth++;
                    result[key] = copySimpleFieldsToDepth(val, maxDepth, depth);
                    depth--;
                }
            }
            return result;
        }
        return copySimpleFieldsToDepth(req, 1);
    }
}
