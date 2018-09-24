import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'shared/shared-constants';

import { ConfigService } from '../../config/config.service';

/**
 * Transfers auth tokens from response body to headers.
 */
@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private configService: ConfigService) {}

    /**
     * If a resolver returns an object with keys matching the token keys, these values
     * are removed from the response and transferred to the header.
     */
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        return call$.pipe(
            map(data => {
                const ctx = GqlExecutionContext.create(context).getContext();
                this.transferKeyToResponseHeader(AUTH_TOKEN_KEY, data, ctx.res);
                this.transferKeyToResponseHeader(REFRESH_TOKEN_KEY, data, ctx.res);
                return data;
            }),
        );
    }

    private transferKeyToResponseHeader(key: string, data: any | null, response: Response) {
        if (data && data.hasOwnProperty(key)) {
            const authToken = data[key];
            delete data[key];
            response.set(key, authToken);
        }
    }
}
