/**
 * @description
 * A method decorator which asserts that the decorated method is overriding a method of the superclass.
 * This is primarily to guard against cases where a method is intended to override a core service
 * method, but a typo in the method name means it does not.
 *
 * This decorator should be used in conjunction with the TypeScript `override` keyword for full
 * compile-time and run-time safety.
 *
 * @example
 * ```ts
 * import { Injectable } from '@nestjs/common';
 * import { ProductService, ID, RequestContext, Override } from '@vendure/core';
 *
 * @Injectable()
 * export class MyCustomProductService extends ProductService {
 *
 *   @Override()
 *   override async findOne(
 *     ctx: RequestContext,
 *     productId: ID,
 *   ): Promise<Product | undefined> {
 *     // custom logic
 *   }
 * }
 * ```
 *
 * @docsCategory decorators
 * @since 2.2.0
 */
export function Override(): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const isStatic = typeof target === 'function';
        const parentPrototype = Object.getPrototypeOf(target);

        // Check if the method exists on the parent
        if (!parentPrototype || typeof parentPrototype[propertyKey] !== 'function') {
            // If not, construct a helpful error message
            let className = '[AnonymousClass]';
            if (isStatic && typeof (target as { name: string }).name === 'string') {
                className = (target as { name: string }).name;
            } else if (!isStatic && typeof target.constructor.name === 'string') {
                className = target.constructor.name;
            }

            let superclassName = 'Object';
            const parentConstructor = isStatic ? parentPrototype : parentPrototype.constructor;
            if (parentConstructor && typeof (parentConstructor as { name: string }).name === 'string') {
                const name = (parentConstructor as { name: string }).name;
                if (name && name !== 'Function') {
                    superclassName = name;
                }
            }

            throw new Error(
                `The method "${String(
                    propertyKey,
                )}" in class "${className}" is marked with @Override but does not override any method in the superclass "${superclassName}".`,
            );
        }
    };
}
