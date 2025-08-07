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
        const parent = Object.getPrototypeOf(target);
        if (!parent || typeof parent[propertyKey] !== 'function') {
            const className = target.constructor.name;

            const parentConstructor = parent?.constructor as { name: string } | undefined;
            const parentClassName = parentConstructor?.name ?? '[No Superclass]';
            throw new Error(
                `The method "${String(
                    propertyKey,
                )}" in class "${className}" is marked with @Override but does not override any method in the superclass "${parentClassName}".`,
            );
        }
    };
}
