import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IdCodecService } from '../common/id-codec.service';
import { DECODE_METADATA_KEY } from '../decorators/decode.decorator';

/**
 * This interceptor automatically decodes incoming requests and encodes outgoing requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
@Injectable()
export class IdInterceptor implements NestInterceptor {
    constructor(private idCodecService: IdCodecService, private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        const args = GqlExecutionContext.create(context).getArgs();
        const transformKeys = this.reflector.get<string[]>(DECODE_METADATA_KEY, context.getHandler());

        Object.assign(args, this.idCodecService.decode(args, transformKeys));
        return call$.pipe(map(data => this.idCodecService.encode(data)));
    }
}
