import { Injectable } from '@nestjs/common';

import { I18nError } from '../../i18n/i18n-error';
import { ChannelService } from '../../service/channel.service';

import { RequestContext } from './request-context';

/**
 * Creates new RequestContext instances.
 */
@Injectable()
export class RequestContextService {
    constructor(private channelService: ChannelService) {}

    /**
     * Creates a new RequestContext based on an Express request object.
     */
    fromRequest(req: any): RequestContext {
        if (req && req.query) {
            const token = req.query.token;
            const channel = this.channelService.getChannelFromToken(token);
            return new RequestContext(channel);
        }
        throw new I18nError(`error.unexpected-request-context`);
    }
}
