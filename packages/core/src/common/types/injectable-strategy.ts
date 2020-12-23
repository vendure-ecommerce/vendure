import { Injector } from '../injector';

/**
 * @description
 * This interface defines the setup and teardown hooks available to the
 * various strategies used to configure Vendure.
 *
 * @docsCategory common
 */
export interface InjectableStrategy {
    /**
     * @description
     * Defines setup logic to be run during application bootstrap. Receives
     * the {@link Injector} as an argument, which allows application providers
     * to be used as part of the setup. This hook will be called on both the
     * main server and the worker processes. If you have code which should only
     * run on either the server on the worker, then inject the {@link ProcessContext}
     * to check the current context.
     *
     * @example
     * ```TypeScript
     * async init(injector: Injector) {
     *   const processContext = injector.get(ProcessContext);
     *   if (processContext.isServer) {
     *     const myService = injector.get(MyService);
     *     await myService.doSomething();
     *   }
     * }
     * ```
     */
    init?: (injector: Injector) => void | Promise<void>;

    /**
     * @description
     * Defines teardown logic to be run before application shutdown.
     */
    destroy?: () => void | Promise<void>;
}
