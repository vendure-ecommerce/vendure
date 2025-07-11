import React from "react";
import { useComponentRegistry } from "./component-registry.js";

export type DisplayComponentProps<
    T extends keyof (typeof COMPONENT_REGISTRY)['dataDisplay'] | string,
> = {
    id: T;
    value: any;
    // rest of the props are passed to the component
    [key: string]: any;
}


export type InputComponentProps<
    T extends keyof (typeof COMPONENT_REGISTRY)['dataInput'] | string,
> = {
    id: T;
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
export function DisplayComponent<
    T extends keyof (typeof COMPONENT_REGISTRY)['dataDisplay'] | string,
>(props: Readonly<DisplayComponentProps<T>>): React.ReactNode {   
    const { getDisplayComponent } = useComponentRegistry();
    const Component = getDisplayComponent(props.id);
    if (!Component) {
        throw new Error(`Component with id ${props.id} not found`);
    }
    const { value, ...rest } = props;
    return <Component value={value} {...rest} />;
}

export function InputComponent<
    T extends keyof (typeof COMPONENT_REGISTRY)['dataInput'] | string,
>(props: Readonly<InputComponentProps<T>>): React.ReactNode {
    const { getInputComponent } = useComponentRegistry();
    const Component = getInputComponent(props.id);
    if (!Component) {
        throw new Error(`Component with id ${props.id} not found`);
    }
    const { value, onChange, ...rest } = props;
    return <Component value={value} onChange={onChange} {...rest} />;
}       


