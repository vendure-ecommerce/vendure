import { DynamicModule, Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { getConfig } from '../config/config-helpers';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Logger } from '../config/logger/vendure-logger';

import { createDynamicGraphQlModulesForPlugins } from './dynamic-plugin-api.module';
import {
    getPluginModules,
    getWorkerControllers,
    hasLifecycleMethod,
    isDynamicModule,
} from './plugin-metadata';
import { PluginLifecycleMethods } from './vendure-plugin';

export enum PluginProcessContext {
    Main,
    Worker,
}

const PLUGIN_PROCESS_CONTEXT = 'PLUGIN_PROCESS_CONTEXT';

/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules and in responsible for executing any lifecycle methods defined by the plugins.
 */
@Module({
    imports: [ConfigModule],
})
export class PluginModule implements OnModuleInit, OnModuleDestroy {
    static forShop(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{ provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Main }],
            imports: [...getConfig().plugins, ...createDynamicGraphQlModulesForPlugins('shop')],
        };
    }

    static forAdmin(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{ provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Main }],
            imports: [...getConfig().plugins, ...createDynamicGraphQlModulesForPlugins('admin')],
        };
    }

    static forRoot(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{ provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Main }],
            imports: [...getConfig().plugins],
        };
    }

    static forWorker(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{ provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Worker }],
            imports: [...pluginsWithWorkerControllers()],
        };
    }

    private static mainBootstrapHasRun = false;
    private static mainCloseHasRun = false;
    private static workerBootstrapHasRun = false;
    private static workerCloseHasRun = false;

    constructor(
        @Inject(PLUGIN_PROCESS_CONTEXT) private processContext: PluginProcessContext,
        private moduleRef: ModuleRef,
        private configService: ConfigService,
    ) {}

    async onModuleInit() {
        if (!PluginModule.mainBootstrapHasRun && this.processContext === PluginProcessContext.Main) {
            PluginModule.mainBootstrapHasRun = true;
            this.runPluginLifecycleMethods('onVendureBootstrap', instance => {
                const pluginName = instance.constructor.name || '(anonymous plugin)';
                Logger.verbose(`Bootstrapped plugin ${pluginName}`);
            });
        }
        if (!PluginModule.workerBootstrapHasRun && this.processContext === PluginProcessContext.Worker) {
            PluginModule.workerBootstrapHasRun = true;
            this.runPluginLifecycleMethods('onVendureWorkerBootstrap');
        }
    }

    async onModuleDestroy() {
        if (!PluginModule.mainCloseHasRun && this.processContext === PluginProcessContext.Main) {
            PluginModule.mainCloseHasRun = true;
            await this.runPluginLifecycleMethods('onVendureClose');
        }
        if (!PluginModule.workerCloseHasRun && this.processContext === PluginProcessContext.Worker) {
            PluginModule.workerCloseHasRun = true;
            this.runPluginLifecycleMethods('onVendureWorkerClose');
        }
    }

    private async runPluginLifecycleMethods(
        lifecycleMethod: keyof PluginLifecycleMethods,
        afterRun?: (instance: any) => void,
    ) {
        for (const plugin of getPluginModules(this.configService.plugins)) {
            let instance: any;
            try {
                instance = this.moduleRef.get(plugin, { strict: false });
            } catch (e) {
                Logger.error(`Could not find ${plugin.name}`, undefined, e.stack);
            }
            if (instance) {
                if (hasLifecycleMethod(instance, lifecycleMethod)) {
                    await instance[lifecycleMethod]();
                }
                if (typeof afterRun === 'function') {
                    afterRun(instance);
                }
            }
        }
    }
}

function pluginsWithWorkerControllers(): DynamicModule[] {
    return getConfig().plugins.map(plugin => {
        const controllers = getWorkerControllers(plugin);
        if (isDynamicModule(plugin)) {
            return {
                ...plugin,
                controllers,
            };
        } else {
            return {
                module: plugin,
                controllers,
            };
        }
    });
}
