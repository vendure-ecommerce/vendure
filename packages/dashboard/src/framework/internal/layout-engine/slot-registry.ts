import { ComponentType } from 'react';

export type PredefinedSlotName = 'product_detail' | 'order_detail' | 'seller_detail';

export type SlotIdMap = {
    product_detail: 'main' | 'side';
    order_detail: 'main' | 'side';
    seller_detail: 'main' | 'side';
};

export type SlotId<T extends PredefinedSlotName> = SlotIdMap[T];

export type SlotRegistry = {
    [SlotName in PredefinedSlotName]: {
        [ID in SlotId<SlotName>]?: Array<{
            priority: number;
            component: () => Promise<ComponentType<any>>;
            props: Record<string, any>;
        }>;
    };
} & {
    [customSlot: string]: {
        [customId: string]: Array<{
            priority: number;
            component: () => Promise<ComponentType<any>>;
            props: Record<string, any>;
        }>;
    };
};

let globalSlotRegistry: SlotRegistry = {} as SlotRegistry;

export function registerDefaultSlots(registry: Partial<SlotRegistry>) {
    globalSlotRegistry = registry as SlotRegistry;
}

export function getSlotRegistry(): SlotRegistry {
    return globalSlotRegistry;
}

export function registerSlot<T extends PredefinedSlotName>(
    slotName: T,
    slotId: SlotId<T>,
    priority: number,
    component: () => Promise<ComponentType<any>>,
    props: Record<string, any>,
): void;
export function registerSlot(
    slotName: string,
    slotId: string,
    priority: number,
    component: () => Promise<ComponentType<any>>,
    props: Record<string, any>,
): void;
export function registerSlot(
    slotName: string,
    slotId: string,
    priority: number,
    component: () => Promise<ComponentType<any>>,
    props: Record<string, any> = {},
) {
    if (!globalSlotRegistry[slotName]) {
        globalSlotRegistry[slotName] = {};
    }
    if (!globalSlotRegistry[slotName][slotId]) {
        globalSlotRegistry[slotName][slotId] = [];
    }
    globalSlotRegistry[slotName][slotId].push({ priority, component, props });
}

export function unregisterSlot<T extends PredefinedSlotName>(slotName: T, slotId: SlotId<T>): void;
export function unregisterSlot(slotName: string, slotId: string): void;
export function unregisterSlot(slotName: string, slotId: string) {
    if (globalSlotRegistry[slotName]) {
        delete globalSlotRegistry[slotName][slotId];
    }
}

export function getSlotComponent<T extends PredefinedSlotName>(
    slotName: T,
    slotId: SlotId<T>,
): () => Promise<ComponentType<any>> | undefined;
export function getSlotComponent(
    slotName: string,
    slotId: string,
): () => Promise<ComponentType<any>> | undefined;
export function getSlotComponent(slotName: string, slotId: string) {
    return globalSlotRegistry[slotName]?.[slotId]?.[0]?.component;
}
