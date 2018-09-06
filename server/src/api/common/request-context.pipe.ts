import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { I18nError } from '../../i18n/i18n-error';
import { ChannelService } from '../../service/channel.service';

import { RequestContext } from './request-context';
import { RequestContextService } from './request-context.service';

/**
 * Creates a new RequestContext based on the token passed in the query string of the request.
 */
@Injectable()
export class RequestContextPipe implements PipeTransform<any, RequestContext> {
    constructor(private requestContextService: RequestContextService) {}

    transform(value: any, metadata: ArgumentMetadata) {
        return this.requestContextService.fromRequest(value.req);
    }
}
