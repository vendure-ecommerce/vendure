import { ExecutionContext, Injectable, NestInterceptor, ReflectMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';

import { IdCodec } from './id-codec';

const DECODE_METADATA_KEY = '__decode__';

/**
 * Attatches metadata to the resolver defining which keys are ids which need to be decoded.
 * By default, all keys named "id" will be implicitly decoded, but some operations have ID arguments
 * which are not named "id", e.g. assignRoleToAdministrator, where there are 2 ID arguments passed.
 *
 * @example
 * ```
 *  @Query()
 *  @Decode('administratorId', 'roleId')
 *  assignRoleToAdministrator(@Args() args) {
 *      // ...
 *  }
 * ```
 */
export const Decode = (...transformKeys: string[]) => ReflectMetadata(DECODE_METADATA_KEY, transformKeys);

/**
 * This interceptor automatically decodes incoming requests and encodes outgoing requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
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
