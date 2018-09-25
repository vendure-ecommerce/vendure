import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '../../config/config.service';
import { User } from '../../entity/user/user.entity';
import { I18nError } from '../../i18n/i18n-error';
import { ChannelService } from '../../service/providers/channel.service';

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
    fromRequest(req: Request & { user?: User }): RequestContext {
        const tokenKey = this.configService.channelTokenKey;
        let channelTokenKey = '';
        if (req && req.query && req.query[tokenKey]) {
            channelTokenKey = req.query[tokenKey];
        } else if (req && req.headers && req.headers[tokenKey]) {
            channelTokenKey = req.headers[tokenKey] as string;
        } else if (req && req.user) {
            channelTokenKey = req.user.roles[0].channels[0].token;
        }
        if (channelTokenKey) {
            const channel = this.channelService.getChannelFromToken(channelTokenKey);
            return new RequestContext(channel);
        }
        throw new I18nError(`error.unexpected-request-context`);
    }
}
