import { INestApplication, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TcpClientOptions, Transport } from '@nestjs/microservices';
import { Type } from '@vendure/common/lib/shared-types';
import { ConnectionOptions, EntitySubscriberInterface } from 'typeorm';

import { InternalServerError } from './common/error/errors';
import { ReadOnlyRequired } from './common/types/common-types';
import { getConfig, setConfig } from './config/config-helpers';
import { DefaultLogger } from './config/logger/default-logger';
import { Logger } from './config/logger/vendure-logger';
import { RuntimeVendureConfig, VendureConfig } from './config/vendure-config';
import { coreEntitiesMap } from './entity/entities';
import { registerCustomEntityFields } from './entity/register-custom-entity-fields';
import { setEntityIdStrategy } from './entity/set-entity-id-strategy';
import { validateCustomFieldsConfig } from './entity/validate-custom-fields-config';
import { getConfigurationFunction, getEntitiesFromPlugins } from './plugin/plugin-metadata';
import { logProxyMiddlewares } from './plugin/plugin-utils';

export type VendureBootstrapFunction = (config: VendureConfig) => Promise<INestApplication>;

/**
 * @description
 * Bootstraps the Vendure server. This is the entry point to the application.
 *
 * @example
 * ```TypeScript
 * import { bootstrap } from '\@vendure/core';
 * import { config } from './vendure-config';
 *
 * bootstrap(config).catch(err => {
 *     console.log(err);
 * });
 * ```
 * @docsCategory
 * */
export async function bootstrap(userConfig: Partial<VendureConfig>): Promise<INestApplication> {
    const config = await preBootstrapConfig(userConfig);
    Logger.useLogger(config.logger);
    Logger.info(`Bootstrapping Vendure Server (pid: ${process.pid})...`);

    // The AppModule *must* be loaded only after the entities have been set in the
    // config, so that they are available when the AppModule decorator is evaluated.
    // tslint:disable-next-line:whitespace
    const appModule = await import('./app.module');
    DefaultLogger.hideNestBoostrapLogs();
    const app = await NestFactory.create(appModule.AppModule, {
        cors: config.cors,
        logger: new Logger(),
    });
    DefaultLogger.restoreOriginalLogLevel();
    app.useLogger(new Logger());
    await app.listen(config.port, config.hostname);
    app.enableShutdownHooks();
    if (config.workerOptions.runInMainProcess) {
        try {
            const worker = await bootstrapWorkerInternal(config);
            Logger.warn(`Worker is running in main process. This is not recommended for production.`);
            Logger.warn(`[VendureConfig.workerOptions.runInMainProcess = true]`);
            closeWorkerOnAppClose(app, worker);
        } catch (e) {
            Logger.error(`Could not start the worker process: ${e.message}`, 'Vendure Worker');
        }
    }
    logWelcomeMessage(config);
    return app;
}

/**
 * @description
 * Bootstraps the Vendure worker. Read more about the [Vendure Worker]({{< relref "vendure-worker" >}}) or see the worker-specific options
 * defined in {@link WorkerOptions}.
 *
 * @example
 * ```TypeScript
 * import { bootstrapWorker } from '\@vendure/core';
 * import { config } from './vendure-config';
 *
 * bootstrapWorker(config).catch(err => {
 *     console.log(err);
 * });
 * ```
 * @docsCategory worker
 * */
export async function bootstrapWorker(userConfig: Partial<VendureConfig>): Promise<INestMicroservice> {
    if (userConfig.workerOptions && userConfig.workerOptions.runInMainProcess === true) {
        Logger.useLogger(userConfig.logger || new DefaultLogger());
        const errorMessage = `Cannot bootstrap worker when "runInMainProcess" is set to true`;
        Logger.error(errorMessage, 'Vendure Worker');
        throw new Error(errorMessage);
    } else {
        try {
            const vendureConfig = await preBootstrapConfig(userConfig);
            return await bootstrapWorkerInternal(vendureConfig);
        } catch (e) {
            Logger.error(`Could not start the worker process: ${e.message}`, 'Vendure Worker');
            throw e;
        }
    }
}

async function bootstrapWorkerInternal(
    vendureConfig: ReadOnlyRequired<VendureConfig>,
): Promise<INestMicroservice> {
    const config = disableSynchronize(vendureConfig);
    if (!config.workerOptions.runInMainProcess && (config.logger as any).setDefaultContext) {
        (config.logger as any).setDefaultContext('Vendure Worker');
    }
    Logger.useLogger(config.logger);
    Logger.info(`Bootstrapping Vendure Worker (pid: ${process.pid})...`);

    const workerModule = await import('./worker/worker.module');
    DefaultLogger.hideNestBoostrapLogs();
    const workerApp = await NestFactory.createMicroservice(workerModule.WorkerModule, {
        transport: config.workerOptions.transport,
        logger: new Logger(),
        options: config.workerOptions.options,
    });
    DefaultLogger.restoreOriginalLogLevel();
    workerApp.useLogger(new Logger());
    workerApp.enableShutdownHooks();

    // A work-around to correctly handle errors when attempting to start the
    // microservice server listening.
    // See https://github.com/nestjs/nest/issues/2777
    // TODO: Remove if & when the above issue is resolved.
    await new Promise((resolve, reject) => {
        const tcpServer = (workerApp as any).server.server;
        if (tcpServer) {
            tcpServer.on('error', (e: any) => {
                reject(e);
            });
        }
        workerApp.listenAsync().then(resolve);
    });
    workerWelcomeMessage(config);
    return workerApp;
}

/**
 * Setting the global config must be done prior to loading the AppModule.
 */
export async function preBootstrapConfig(
    userConfig: Partial<VendureConfig>,
): Promise<ReadOnlyRequired<VendureConfig>> {
    if (userConfig) {
        setConfig(userConfig);
    }

    const entities = await getAllEntities(userConfig);
    const { coreSubscribersMap } = await import('./entity/subscribers');
    setConfig({
        dbConnectionOptions: {
            entities,
            subscribers: Object.values(coreSubscribersMap) as Array<Type<EntitySubscriberInterface>>,
        },
    });

    let config = getConfig();
    setEntityIdStrategy(config.entityIdStrategy, entities);
    const customFieldValidationResult = validateCustomFieldsConfig(config.customFields, entities);
    if (!customFieldValidationResult.valid) {
        process.exitCode = 1;
        throw new Error(`CustomFields config error:\n- ` + customFieldValidationResult.errors.join('\n- '));
    }
    config = await runPluginConfigurations(config);
    registerCustomEntityFields(config);
    setExposedHeaders(config);
    return config;
}

/**
 * Initialize any configured plugins.
 */
async function runPluginConfigurations(config: RuntimeVendureConfig): Promise<RuntimeVendureConfig> {
    for (const plugin of config.plugins) {
        const configFn = getConfigurationFunction(plugin);
        if (typeof configFn === 'function') {
            config = await configFn(config);
        }
    }
    return config;
}

/**
 * Returns an array of core entities and any additional entities defined in plugins.
 */
export async function getAllEntities(userConfig: Partial<VendureConfig>): Promise<Array<Type<any>>> {
    const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;
    const pluginEntities = getEntitiesFromPlugins(userConfig.plugins);

    const allEntities: Array<Type<any>> = coreEntities;

    // Check to ensure that no plugins are defining entities with names
    // which conflict with existing entities.
    for (const pluginEntity of pluginEntities) {
        if (allEntities.find(e => e.name === pluginEntity.name)) {
            throw new InternalServerError(`error.entity-name-conflict`, { entityName: pluginEntity.name });
        } else {
            allEntities.push(pluginEntity);
        }
    }
    return allEntities;
}

/**
 * If the 'bearer' tokenMethod is being used, then we automatically expose the authTokenHeaderKey header
 * in the CORS options, making sure to preserve any user-configured exposedHeaders.
 */
function setExposedHeaders(config: ReadOnlyRequired<VendureConfig>) {
    if (config.authOptions.tokenMethod === 'bearer') {
        const authTokenHeaderKey = config.authOptions.authTokenHeaderKey as string;
        const corsOptions = config.cors;
        if (typeof corsOptions !== 'boolean') {
            const { exposedHeaders } = corsOptions;
            let exposedHeadersWithAuthKey: string[];
            if (!exposedHeaders) {
                exposedHeadersWithAuthKey = [authTokenHeaderKey];
            } else if (typeof exposedHeaders === 'string') {
                exposedHeadersWithAuthKey = exposedHeaders
                    .split(',')
                    .map(x => x.trim())
                    .concat(authTokenHeaderKey);
            } else {
                exposedHeadersWithAuthKey = exposedHeaders.concat(authTokenHeaderKey);
            }
            corsOptions.exposedHeaders = exposedHeadersWithAuthKey;
        }
    }
}

/**
 * Monkey-patches the app's .close() method to also close the worker microservice
 * instance too.
 */
function closeWorkerOnAppClose(app: INestApplication, worker: INestMicroservice) {
    // A Nest app is a nested Proxy. By getting the prototype we are
    // able to access and override the actual close() method.
    const appPrototype = Object.getPrototypeOf(app);
    const appClose = appPrototype.close.bind(app);
    appPrototype.close = async () => {
        await worker.close();
        await appClose();
    };
}

function workerWelcomeMessage(config: VendureConfig) {
    let transportString = '';
    let connectionString = '';
    const transport = (config.workerOptions && config.workerOptions.transport) || Transport.TCP;
    transportString = ` with ${Transport[transport]} transport`;
    const options = (config.workerOptions as TcpClientOptions).options;
    if (options) {
        const { host, port } = options;
        connectionString = ` at ${host || 'localhost'}:${port}`;
    }
    Logger.info(`Vendure Worker started${transportString}${connectionString}`);
}

function logWelcomeMessage(config: VendureConfig) {
    let version: string;
    try {
        version = require('../package.json').version;
    } catch (e) {
        version = ' unknown';
    }
    Logger.info(`=================================================`);
    Logger.info(`Vendure server (v${version}) now running on port ${config.port}`);
    Logger.info(`Shop API: http://localhost:${config.port}/${config.shopApiPath}`);
    Logger.info(`Admin API: http://localhost:${config.port}/${config.adminApiPath}`);
    logProxyMiddlewares(config);
    Logger.info(`=================================================`);
}

/**
 * Fix race condition when modifying DB
 * See: https://github.com/vendure-ecommerce/vendure/issues/152
 */
function disableSynchronize(userConfig: ReadOnlyRequired<VendureConfig>): ReadOnlyRequired<VendureConfig> {
    const config = { ...userConfig };
    config.dbConnectionOptions = {
        ...userConfig.dbConnectionOptions,
        synchronize: false,
    } as ConnectionOptions;
    return config;
}
