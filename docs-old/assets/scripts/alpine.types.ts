declare global {
    interface Window {
        Components: any;
    }
}

export interface AlpineContext {
    $el?: Element;
    $refs?: { [name: string]: Element; };
    $event?: Event;
    $dispatch?: (name: string, data: any) => void;
    $watch?: (prop: string, handler: (value: any) => void) => void;
    $nextTick?: (handler: () => void) => void;
    [prop: string]: any;
}

export interface AlpineEvent extends Event {
    detail: any;
}
