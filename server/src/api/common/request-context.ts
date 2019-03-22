import i18next from 'i18next';

import { LanguageCode } from '../../../../shared/generated-types';
import { ID } from '../../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Channel } from '../../entity/channel/channel.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';

/**
 * The RequestContext is intended to hold information relevant to the current request, which may be
 * required at various points of the stack.
 */
export class RequestContext {
    private readonly _languageCode: LanguageCode;
    private readonly _channel: Channel;
    private readonly _session?: Session;
    private readonly _isAuthorized: boolean;
    private readonly _authorizedAsOwnerOnly: boolean;
    private readonly _translationFn: i18next.TranslationFunction;

    constructor(options: {
        channel: Channel;
        session?: Session;
        languageCode?: LanguageCode;
        isAuthorized: boolean;
        authorizedAsOwnerOnly: boolean;
        translationFn?: i18next.TranslationFunction;
    }) {
        const { channel, session, languageCode, translationFn } = options;
        this._channel = channel;
        this._session = session;
        this._languageCode =
            languageCode || (channel && channel.defaultLanguageCode) || DEFAULT_LANGUAGE_CODE;
        this._isAuthorized = options.isAuthorized;
        this._authorizedAsOwnerOnly = options.authorizedAsOwnerOnly;
        this._translationFn = translationFn || (((key: string) => key) as any);
    }

    get channel(): Channel {
        return this._channel;
    }

    get channelId(): ID {
        return this._channel.id;
    }

    get languageCode(): LanguageCode {
        return this._languageCode;
    }

    get session(): Session | undefined {
        return this._session;
    }

    get activeUserId(): ID | undefined {
        const user = this.activeUser;
        if (user) {
            return user.id;
        }
    }

    get activeUser(): User | undefined {
        if (this.session) {
            if (this.isAuthenticatedSession(this.session)) {
                return this.session.user;
            }
        }
    }

    /**
     * True if the current session is authorized to access the current resolver method.
     */
    get isAuthorized(): boolean {
        return this._isAuthorized;
    }

    /**
     * True if the current anonymous session is only authorized to operate on entities that
     * are owned by the current session.
     */
    get authorizedAsOwnerOnly(): boolean {
        return this._authorizedAsOwnerOnly;
    }

    /**
     * Translate the given i18n key
     */
    translate(key: string, variables?: { [k: string]: any }): string {
        try {
            return this._translationFn(key, variables);
        } catch (e) {
            return `Translation format error: ${e.message}). Original key: ${key}`;
        }
    }

    private isAuthenticatedSession(session: Session): session is AuthenticatedSession {
        return session.hasOwnProperty('user');
    }
}
