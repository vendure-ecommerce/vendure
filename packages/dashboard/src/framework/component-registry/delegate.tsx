import React from "react";
import { ComponentTypePath, TypeRegistryCategories, TypeRegistryTypes, useComponentRegistry } from "./component-registry.js";

export type DelegateProps<
    T extends TypeRegistryTypes,
    U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
> = {
    component: ComponentTypePath<T, TypeRegistryCategories<T>>;
    value: any;
    // rest of the props are passed to the component
    [key: string]: any;
}

/**
 * @description
 * This component is used to delegate the rendering of a component to the component registry.
 * 
 * @example
 * ```ts
 * <Delegate component="money.display.default" value={100} />
 * ```
 * 
 * @returns 
 */
export function Delegate<
    T extends TypeRegistryTypes,
    U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
>(props: DelegateProps<T, U>): React.ReactNode {
    const { getComponent } = useComponentRegistry();
    const Component = getComponent(props.component);
    const { value, ...rest } = props;
    return <Component value={value} {...rest} />;
}


