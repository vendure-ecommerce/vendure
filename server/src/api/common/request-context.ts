import { LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Channel } from '../../entity/channel/channel.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';

/**
 * The RequestContext is intended to hold information relevant to the current request, which may be
 * required at various points of the stack.
 */
export class RequestContext {
    get channel(): Channel {
        return this._channel;
    }

    get channelId(): ID | undefined {
        return this._channel.id;
    }

    get languageCode(): LanguageCode {
        return this._languageCode;
    }

    get user(): User | undefined {
        return this._user;
    }

    private readonly _languageCode: LanguageCode;
    private readonly _channel: Channel;
    private readonly _session?: Session;
    private readonly _user?: User;

    constructor(options: { channel: Channel; user?: User; session?: Session; languageCode?: LanguageCode }) {
        const { channel, session, languageCode, user } = options;
        this._channel = channel;
        this._session = session;
        this._user = user;
        this._languageCode =
            languageCode || (channel && channel.defaultLanguageCode) || DEFAULT_LANGUAGE_CODE;
    }
}
