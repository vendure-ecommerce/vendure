import { Injectable, Type } from '@angular/core';
import { Route } from '@angular/router';
import { PageLocationId } from '../../common/component-registry-types';

export interface PageTabConfig {
    location: PageLocationId;
    tabIcon?: string;
    route: string;
    tab: string;
    component: Type<any>;
}

@Injectable({
    providedIn: 'root',
})
export class PageService {
    private registry = new Map<PageLocationId, PageTabConfig[]>();

    registerPageTab(config: PageTabConfig) {
        if (!this.registry.has(config.location)) {
            this.registry.set(config.location, []);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pages = this.registry.get(config.location)!;
        if (pages.find(p => p.tab === config.tab)) {
            throw new Error(`A page with the tab "${config.tab}" has already been registered`);
        }
        pages.push(config);
    }

    getPageTabRoutes(location: PageLocationId): Route[] {
        const configs = this.registry.get(location) || [];
        return configs.map(config => ({
            path: config.route || '',
            pathMatch: config.route ? 'prefix' : 'full',
            component: config.component,
        }));
    }

    getPageTabs(location: PageLocationId): PageTabConfig[] {
        return this.registry.get(location) || [];
    }
}
