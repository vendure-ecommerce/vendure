import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { I18nError } from '../../i18n/i18n-error';
import { ChannelService } from '../../service/channel.service';

import { RequestContext } from './request-context';

/**
 * Creates a new RequestContext based on the token passed in the query string of the request.
 */
@Injectable()
export class RequestContextPipe implements PipeTransform<any, RequestContext> {
    constructor(private channelService: ChannelService) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const v = value;
        if (value.req && value.req.query) {
            const token = value.req.query.token;

            const ctx = new RequestContext(value.req.query.token);
            const channel = this.channelService.getChannelFromToken(token);
            if (channel) {
                ctx.channelId = channel.id;
            }
            return ctx;
        }
        throw new I18nError(`error.unexpected-request-context`);
    }
}
