import { BooleanDisplayCheckbox } from '@/framework/internal/component-registry/data-types/boolean.js';
import { DateTime } from './data-types/date-time.js';

export interface ComponentRegistryEntry {
    component: React.ComponentType<any>;
}

interface ComponentRegistry {
    type: {
        [dataType: string]: {
            display: {
                [id: string]: ComponentRegistryEntry;
            };
        };
    };
}

export const COMPONENT_REGISTRY = {
    type: {
        boolean: {
            display: {
                default: {
                    component: BooleanDisplayCheckbox,
                },
            },
        },
        dateTime: {
            display: {
                default: {
                    component: DateTime,
                },
            },
        },
    },
} satisfies ComponentRegistry;

type TypeRegistry = (typeof COMPONENT_REGISTRY)['type'];
type TypeRegistryTypes = keyof TypeRegistry;
type TypeRegistryCategories<T extends TypeRegistryTypes> = {
    [K in keyof TypeRegistry[T]]: K;
}[keyof TypeRegistry[T]];
type TypeRegistryComponents<
    T extends TypeRegistryTypes,
    U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
> = {
    [K in keyof TypeRegistry[T][U]]: K;
}[keyof TypeRegistry[T][U]];
type NonDefaultComponents<
    T extends TypeRegistryTypes,
    U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
> = {
    [K in TypeRegistryComponents<T, U>]: K extends 'default' ? never : `${T}.${U & string}.${K & string}`;
}[keyof TypeRegistry[T][U]];

type ComponentTypePath<
    T extends TypeRegistryTypes,
    U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
> = `${T}.${U & string}` | `${NonDefaultComponents<T, U>}`;

export function useComponentRegistry() {
    function getComponent<
        T extends TypeRegistryTypes,
        U extends TypeRegistryCategories<T> = TypeRegistryCategories<T>,
    >(path: ComponentTypePath<T>): React.ComponentType<{ value: any }> {
        const [type, category, componentKey] = path.split('.') as [T, U, string];
        const availableComponents = COMPONENT_REGISTRY.type[type][category] as any;
        const componentEntry = availableComponents[componentKey ?? 'default'] as
            | ComponentRegistryEntry
            | undefined;
        if (!componentEntry) {
            throw new Error(`Component not found for path: ${path}`);
        }
        return componentEntry.component;
    }

    return {
        getComponent,
    };
}
