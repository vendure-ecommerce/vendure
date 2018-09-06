import { LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Channel } from '../../entity/channel/channel.entity';

/**
 * The RequestContext is intended to hold information relevant to the current request, which may be
 * required at various points of the stack. Primarily, the current token and active Channel id is
 * exposed, as well as the active language.
 */
export class RequestContext {
    get channel(): Channel {
        return this._channel || ({} as any);
    }

    get channelId(): ID | undefined {
        return this._channel && this._channel.id;
    }

    get languageCode(): LanguageCode {
        if (this._languageCode) {
            return this._languageCode;
        } else if (this._channel) {
            return this._channel.defaultLanguageCode;
        } else {
            return DEFAULT_LANGUAGE_CODE;
        }
    }

    private _languageCode: LanguageCode;

    constructor(private _channel?: Channel) {}

    setLanguageCode(value: LanguageCode | null | undefined) {
        if (value) {
            this._languageCode = value;
        }
    }
}
