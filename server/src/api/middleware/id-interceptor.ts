import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { DECODE_METADATA_KEY } from '../decorators/decode.decorator';

import { IdCodec } from '../common/id-codec';

/**
 * This interceptor automatically decodes incoming requests and encodes outgoing requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
@Injectable()
export class IdInterceptor implements NestInterceptor {
    private codec: IdCodec;

    constructor(private configService: ConfigService, private readonly reflector: Reflector) {
        this.codec = new IdCodec(this.configService.entityIdStrategy);
    }

    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        const args = GqlExecutionContext.create(context).getArgs();
        const transformKeys = this.reflector.get<string[]>(DECODE_METADATA_KEY, context.getHandler());

        Object.assign(args, this.codec.decode(args, transformKeys));
        return call$.pipe(map(data => this.codec.encode(data)));
    }
}
