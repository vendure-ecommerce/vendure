import { getConfig } from '../config/config-helpers';

export const ENABLE_INSTRUMENTATION_ENV_VAR = 'VENDURE_ENABLE_INSTRUMENTATION';

const INSTRUMENTED_CLASS = Symbol('InstrumentedClassTarget');

export function Instrument(): ClassDecorator {
    return function (target: any) {
        // Since the instrumentation is not "free" (it will wrap all instrumented classes in a
        // Proxy, which has some overhead), we will only do this if explicitly requested by the
        // presence of this env var. The `@vendure/telemetry` package sets this in its configuration,
        // which will be run before any of the Vendure code is loaded.
        if (process.env[ENABLE_INSTRUMENTATION_ENV_VAR] == null) {
            return target;
        }
        const InstrumentedClass = class extends (target as new (...args: any[]) => any) {
            constructor(...args: any[]) {
                // eslint-disable-next-line constructor-super
                super(...args);
                const config = getConfig();
                const { instrumentationStrategy } = config.systemOptions;
                if (!instrumentationStrategy) {
                    return this;
                }
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const instance = this;
                return new Proxy(this, {
                    get: (obj, prop) => {
                        const original = obj[prop as string];
                        if (typeof original === 'function') {
                            return function (...methodArgs: any[]) {
                                const applyOriginalFunction =
                                    original.constructor.name === 'AsyncFunction'
                                        ? async () => await original.apply(obj, methodArgs)
                                        : () => original.apply(obj, methodArgs);
                                const wrappedMethodArgs = {
                                    instance,
                                    target,
                                    methodName: String(prop),
                                    args: methodArgs,
                                    applyOriginalFunction,
                                };
                                return instrumentationStrategy.wrapMethod(wrappedMethodArgs);
                            };
                        }
                        return original;
                    },
                });
            }
        };

        // Set the name property of ProxiedClass to match the target's name
        Object.defineProperty(InstrumentedClass, 'name', { value: target.name });
        Object.defineProperty(InstrumentedClass, INSTRUMENTED_CLASS, { value: target });

        return InstrumentedClass;
    };
}

export function getInstrumentedClassTarget(input: any) {
    return input[INSTRUMENTED_CLASS];
}
