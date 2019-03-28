import { Response } from 'express-serve-static-core';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLExtension, GraphQLResponse } from 'graphql-extensions';

import { I18nRequest, I18nService } from '../../i18n/i18n.service';
import { IdCodecService } from '../common/id-codec.service';

/**
 * Encodes the ids of outgoing responses according to the configured EntityIdStrategy.
 *
 * This is done here and not via a Nest Interceptor because we only need to do the
 * encoding once, just before the response is sent. Doing the encoding in an interceptor's
 * `intercept()` method causes the encoding to be performed once for each GraphQL
 * property resolver in the hierarchy.
 */
export class IdEncoderExtension implements GraphQLExtension {
    constructor(private idCodecService: IdCodecService) {}

    willSendResponse(o: {
        graphqlResponse: GraphQLResponse;
        context: { req: I18nRequest; res: Response };
    }): void | {
        graphqlResponse: GraphQLResponse;
        context: { req: I18nRequest; res: Response };
    } {
        o.graphqlResponse.data = this.idCodecService.encode(o.graphqlResponse.data);
        return o;
    }
}
