import { getConfig } from '../config';

const INSTRUMENTED_CLASS = Symbol('InstrumentedClassTarget');

export function Instrument(): ClassDecorator {
    return function (target: any) {
        const InstrumentedClass = class extends (target as new (...args: any[]) => any) {
            constructor(...args: any[]) {
                // eslint-disable-next-line constructor-super
                super(...args);
                const config = getConfig();
                const { instrumentationStrategy } = config.systemOptions;
                if (!instrumentationStrategy) {
                    return this;
                }
                return new Proxy(this, {
                    get: (obj, prop) => {
                        const original = obj[prop as string];
                        if (typeof original === 'function') {
                            return function (...methodArgs: any[]) {
                                const wrappedMethodArgs = {
                                    target,
                                    methodName: String(prop),
                                    args: methodArgs,
                                    applyOriginalFunction: () => original.apply(obj, methodArgs),
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
