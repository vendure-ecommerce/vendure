import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';

import { ApiModule } from './api/api.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { Logger } from './config/logger/vendure-logger';
import { HealthCheckModule } from './health-check/health-check.module';
import { I18nModule } from './i18n/i18n.module';
import { I18nService } from './i18n/i18n.service';
import { PluginModule } from './plugin/plugin.module';
import { ProcessContextModule } from './process-context/process-context.module';
import { ServiceModule } from './service/service.module';

// tslint:disable-next-line:ban-types
type Middleware = Type<any> | Function;

@Module({
    imports: [
        ProcessContextModule,
        ConfigModule,
        I18nModule,
        ApiModule,
        PluginModule.forRoot(),
        HealthCheckModule,
        ServiceModule.forRoot(),
    ],
})
export class AppModule implements NestModule, OnApplicationShutdown {
    constructor(private configService: ConfigService, private i18nService: I18nService) {}

    configure(consumer: MiddlewareConsumer) {
        const { adminApiPath, shopApiPath, middleware } = this.configService.apiOptions;
        const i18nextHandler = this.i18nService.handle();
        const defaultMiddleware: Array<{ handler: Middleware; route?: string }> = [
            { handler: i18nextHandler, route: adminApiPath },
            { handler: i18nextHandler, route: shopApiPath },
        ];
        const allMiddleware = defaultMiddleware.concat(middleware);
        const middlewareByRoute = this.groupMiddlewareByRoute(allMiddleware);
        for (const [route, handlers] of Object.entries(middlewareByRoute)) {
            consumer.apply(...handlers).forRoutes(route);
        }
    }

    async onApplicationShutdown(signal?: string) {
        if (signal) {
            Logger.info('Received shutdown signal:' + signal);
        }
    }

    /**
     * Groups middleware handlers together in an object with the route as the key.
     */
    private groupMiddlewareByRoute(
        middlewareArray: Array<{ handler: Middleware; route?: string }>,
    ): { [route: string]: Middleware[] } {
        const result = {} as { [route: string]: Middleware[] };
        for (const middleware of middlewareArray) {
            const route = middleware.route || this.configService.apiOptions.adminApiPath;
            if (!result[route]) {
                result[route] = [];
            }
            result[route].push(middleware.handler);
        }
        return result;
    }
}
