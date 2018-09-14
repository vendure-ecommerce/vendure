import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestHandler } from 'express';
import { GraphQLDateTime } from 'graphql-iso-date';

import { ApiModule } from './api/api.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { validateCustomFieldsConfig } from './entity/custom-entity-fields';
import { I18nModule } from './i18n/i18n.module';
import { I18nService } from './i18n/i18n.service';

@Module({
    imports: [ConfigModule, I18nModule, ApiModule],
})
export class AppModule implements NestModule {
    constructor(private configService: ConfigService, private i18nService: I18nService) {}

    configure(consumer: MiddlewareConsumer) {
        validateCustomFieldsConfig(this.configService.customFields);

        const defaultMiddleware: Array<{ handler: RequestHandler; route?: string }> = [
            { handler: this.i18nService.handle(), route: this.configService.apiPath },
        ];
        const allMiddleware = defaultMiddleware.concat(this.configService.middleware);
        const middlewareByRoute = this.groupMiddlewareByRoute(allMiddleware);
        for (const [route, handlers] of Object.entries(middlewareByRoute)) {
            consumer.apply(...handlers).forRoutes(route);
        }
    }

    /**
     * Groups middleware handlers together in an object with the route as the key.
     */
    private groupMiddlewareByRoute(
        middlewareArray: Array<{ handler: RequestHandler; route?: string }>,
    ): { [route: string]: RequestHandler[] } {
        const result = {} as { [route: string]: RequestHandler[] };
        for (const middleware of middlewareArray) {
            const route = middleware.route || this.configService.apiPath;
            if (!result[route]) {
                result[route] = [];
            }
            result[route].push(middleware.handler);
        }
        return result;
    }
}
