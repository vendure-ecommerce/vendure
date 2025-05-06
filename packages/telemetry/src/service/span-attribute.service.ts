import { Injectable } from '@nestjs/common';
import { AttributeValue } from '@opentelemetry/api';
import { Type } from '@vendure/common/lib/shared-types';
import { getInstrumentedClassTarget } from '@vendure/core';

/**
 * Extracts only the method names from a class type T
 */
export type MethodNames<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type Unwrap<T> = T extends Promise<infer U> ? U : T;

export type SetAttributeFn = (key: string, value: AttributeValue) => void;

type MethodType<T, K extends keyof T> = T[K] extends (...args: any[]) => any ? T[K] : never;

export interface InstrumentedMethodHooks<T, Method extends MethodNames<T>> {
    pre?: (args: Parameters<MethodType<T, Method>>, setAttribute: SetAttributeFn) => void;
    post?: (result: Unwrap<ReturnType<MethodType<T, Method>>>, setAttribute: SetAttributeFn) => void;
}

export type MethodHooksForType<T> = {
    [K in MethodNames<T>]?: InstrumentedMethodHooks<T, K>;
};

@Injectable()
export class SpanAttributeService {
    private hooksMap = new Map<any, { [methodName: string]: InstrumentedMethodHooks<any, any> }>();

    registerHooks<T>(target: Type<T>, hooks: MethodHooksForType<T>): void {
        const actualTarget = getInstrumentedClassTarget(target) ?? target;
        const existingHooks = this.hooksMap.get(actualTarget);
        const combinedHooks = {
            ...existingHooks,
            ...hooks,
        };
        this.hooksMap.set(actualTarget, combinedHooks);
    }

    getHooks<T>(target: T, methodName: string): InstrumentedMethodHooks<T, any> | undefined {
        return this.hooksMap.get(target)?.[methodName];
    }
}
