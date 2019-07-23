import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { IdCodecService } from '../common/id-codec.service';
import { parseContext } from '../common/parse-context';
import { DECODE_METADATA_KEY } from '../decorators/decode.decorator';

/**
 * This interceptor automatically decodes incoming requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
@Injectable()
export class IdInterceptor implements NestInterceptor {
    constructor(private idCodecService: IdCodecService, private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const { isGraphQL } = parseContext(context);
        if (isGraphQL) {
            const args = GqlExecutionContext.create(context).getArgs();
            const transformKeys = this.reflector.get<string[]>(DECODE_METADATA_KEY, context.getHandler());
            const gqlRoot = context.getArgByIndex(0);
            if (!gqlRoot) {
                // Only need to decode ids if this is a root query/mutation.
                // Internal (property-resolver) requests can then be assumed to
                // be already decoded.
                Object.assign(args, this.idCodecService.decode(args, transformKeys));
            }
        }
        return next.handle();
    }
}
