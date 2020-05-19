import { INestApplication, INestMicroservice } from '@nestjs/common';
import {
    BeforeVendureBootstrap,
    BeforeVendureWorkerBootstrap,
    OnVendureBootstrap,
    OnVendureClose,
    OnVendureWorkerBootstrap,
    OnVendureWorkerClose,
} from '@vendure/core';

export class TestPluginWithAllLifecycleHooks
    implements
        BeforeVendureBootstrap,
        BeforeVendureWorkerBootstrap,
        OnVendureBootstrap,
        OnVendureWorkerBootstrap,
        OnVendureClose,
        OnVendureWorkerClose {
    private static onConstructorFn: any;
    private static onBeforeBootstrapFn: any;
    private static onBeforeWorkerBootstrapFn: any;
    private static onBootstrapFn: any;
    private static onWorkerBootstrapFn: any;
    private static onCloseFn: any;
    private static onWorkerCloseFn: any;

    static init(
        constructorFn: any,
        beforeBootstrapFn: any,
        beforeWorkerBootstrapFn: any,
        bootstrapFn: any,
        workerBootstrapFn: any,
        closeFn: any,
        workerCloseFn: any,
    ) {
        this.onConstructorFn = constructorFn;
        this.onBeforeBootstrapFn = beforeBootstrapFn;
        this.onBeforeWorkerBootstrapFn = beforeWorkerBootstrapFn;
        this.onBootstrapFn = bootstrapFn;
        this.onWorkerBootstrapFn = workerBootstrapFn;
        this.onCloseFn = closeFn;
        this.onWorkerCloseFn = workerCloseFn;
        return this;
    }

    constructor() {
        TestPluginWithAllLifecycleHooks.onConstructorFn();
    }

    static beforeVendureBootstrap(app: INestApplication): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onBeforeBootstrapFn(app);
    }

    static beforeVendureWorkerBootstrap(app: INestMicroservice): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onBeforeWorkerBootstrapFn(app);
    }

    onVendureBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onBootstrapFn();
    }

    onVendureWorkerBootstrap(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerBootstrapFn();
    }

    onVendureClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onCloseFn();
        this.resetSpies();
    }

    onVendureWorkerClose(): void | Promise<void> {
        TestPluginWithAllLifecycleHooks.onWorkerCloseFn();
        this.resetSpies();
    }

    /**
     * This is required because on the first run, the Vendure server will be bootstrapped twice -
     * once to populate the database and the second time for the actual tests. Thus the call counts
     * for the plugin lifecycles will be doubled. This method resets them after the initial
     * (population) run.
     */
    private resetSpies() {
        TestPluginWithAllLifecycleHooks.onConstructorFn.mockClear();
        TestPluginWithAllLifecycleHooks.onBeforeBootstrapFn.mockClear();
        TestPluginWithAllLifecycleHooks.onBeforeWorkerBootstrapFn.mockClear();
        TestPluginWithAllLifecycleHooks.onBootstrapFn.mockClear();
        TestPluginWithAllLifecycleHooks.onWorkerBootstrapFn.mockClear();
    }
}
