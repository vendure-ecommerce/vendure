import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface ContextMenuConfig {
    iconShape?: string;
    title: string;
    element: Element;
    coords: { left: number; right: number; top: number; bottom: number };
    items: ContextMenuItem[];
}

export interface ContextMenuItem {
    separator?: boolean;
    iconClass?: string;
    label: string;
    enabled: boolean;
    onClick: () => void;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
    contextMenu$: Observable<ContextMenuConfig | undefined>;
    private setContextMenuConfig$ = new Subject<ContextMenuConfig | undefined>();
    constructor() {
        this.contextMenu$ = this.setContextMenuConfig$.asObservable().pipe(
            distinctUntilChanged((a, b) => {
                if (a == null && b == null) {
                    return true;
                }
                if (a?.element === b?.element) {
                    if (a?.items.map(i => i.enabled).join(',') === b?.items.map(i => i.enabled).join(',')) {
                        return true;
                    }
                }
                return false;
            }),
        );
    }

    setContextMenu(config: ContextMenuConfig) {
        this.setContextMenuConfig$.next(config);
    }

    clearContextMenu() {
        this.setContextMenuConfig$.next();
    }
}
