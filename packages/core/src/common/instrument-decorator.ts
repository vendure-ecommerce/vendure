import { getConfig } from '../config';

export function Instrument(): ClassDecorator {
    return function (target: Type<any>) {
        return class extends (target as new (...args: any[]) => any) {
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
                        const original = obj[prop];
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
    };
}
