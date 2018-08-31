import { LanguageCode } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';

/**
 * The RequestContext is intended to hold information relevant to the current request, which may be
 * required at various points of the stack. Primarily, the current token and active Channel id is
 * exposed, as well as the active language.
 */
export class RequestContext {
    get channelId(): ID {
        return this._channelId;
    }

    set channelId(value: ID) {
        this._channelId = value;
    }

    get token(): string {
        return this._token;
    }
    get languageCode(): LanguageCode {
        return this._languageCode;
    }

    private _languageCode: LanguageCode;
    private _channelId: ID;

    constructor(private _token: string) {
        this._languageCode = DEFAULT_LANGUAGE_CODE;
    }

    setLanguageCode(value: LanguageCode | null | undefined) {
        if (value) {
            this._languageCode = value;
        } else {
            this._languageCode = DEFAULT_LANGUAGE_CODE;
        }
    }
}
