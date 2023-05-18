import { Injectable, Type } from '@angular/core';
import { Route } from '@angular/router';
import { BaseDetailComponent } from '../../common/base-detail.component';
import { PageLocationId } from '../../common/component-registry-types';
import { CanDeactivateDetailGuard } from '../../shared/providers/routing/can-deactivate-detail-guard';

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
        return configs.map(config => {
            const guards =
                typeof config.component.prototype.canDeactivate === 'function'
                    ? [CanDeactivateDetailGuard]
                    : [];
            return {
                path: config.route || '',
                pathMatch: config.route ? 'prefix' : 'full',
                component: config.component,
                canDeactivate: guards,
            };
        });
    }

    getPageTabs(location: PageLocationId): PageTabConfig[] {
        return this.registry.get(location) || [];
    }
}
