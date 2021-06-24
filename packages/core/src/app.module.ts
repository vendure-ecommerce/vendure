import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { Middleware, MiddlewareHandler } from './common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { Logger } from './config/logger/vendure-logger';
import { HealthCheckModule } from './health-check/health-check.module';
import { I18nModule } from './i18n/i18n.module';
import { I18nService } from './i18n/i18n.service';
import { PluginModule } from './plugin/plugin.module';
import { ProcessContextModule } from './process-context/process-context.module';
import { ServiceModule } from './service/service.module';

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
        const defaultMiddleware: Middleware[] = [
            { handler: i18nextHandler, route: adminApiPath },
            { handler: i18nextHandler, route: shopApiPath },
        ];
        const allMiddleware = defaultMiddleware.concat(middleware);
        const consumableMiddlewares = allMiddleware.filter(mid => !mid.beforeListen);
        const middlewareByRoute = this.groupMiddlewareByRoute(consumableMiddlewares);
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
    private groupMiddlewareByRoute(middlewareArray: Middleware[]): { [route: string]: MiddlewareHandler[] } {
        const result = {} as { [route: string]: MiddlewareHandler[] };
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
