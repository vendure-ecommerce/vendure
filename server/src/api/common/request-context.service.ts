import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '../../config/config.service';
import { I18nError } from '../../i18n/i18n-error';
import { ChannelService } from '../../service/channel.service';

import { RequestContext } from './request-context';

/**
 * Creates new RequestContext instances.
 */
@Injectable()
export class RequestContextService {
    constructor(private channelService: ChannelService, private configService: ConfigService) {}

    /**
     * Creates a new RequestContext based on an Express request object.
     */
    fromRequest(req: Request): RequestContext {
        const tokenKey = this.configService.channelTokenKey;
        let token = '';
        if (req && req.query && req.query[tokenKey]) {
            token = req.query[tokenKey];
        } else if (req && req.headers && req.headers[tokenKey]) {
            token = req.headers[tokenKey] as string;
        }
        if (token) {
            const channel = this.channelService.getChannelFromToken(token);
            return new RequestContext(channel);
        }
        throw new I18nError(`error.unexpected-request-context`);
    }
}
