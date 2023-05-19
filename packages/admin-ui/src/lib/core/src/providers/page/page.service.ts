import { Injectable, Type } from '@angular/core';
import { Route } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseDetailComponent, detailComponentWithResolver } from '../../common/base-detail.component';
import { PageLocationId } from '../../common/component-registry-types';
import { CanDeactivateDetailGuard } from '../../shared/providers/routing/can-deactivate-detail-guard';

export interface PageTabConfig {
    location: PageLocationId;
    tabIcon?: string;
    route: string;
    tab: string;
    component: Type<any> | ReturnType<typeof detailComponentWithResolver>;
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
            const route: Route = {
                path: config.route || '',
                pathMatch: config.route ? 'prefix' : 'full',
            };

            let component: Type<any>;
            if (isComponentWithResolver(config.component)) {
                const { component: cmp, breadcrumbFn, resolveFn } = config.component;
                component = cmp;
                route.resolve = { detail: config.component.resolveFn };
                route.data = {
                    breadcrumb: data => breadcrumbFn(data.detail.result),
                };
            } else {
                component = config.component;
            }
            const guards =
                typeof component.prototype.canDeactivate === 'function' ? [CanDeactivateDetailGuard] : [];
            route.component = component;
            route.canDeactivate = guards;

            return route;
        });
    }

    getPageTabs(location: PageLocationId): PageTabConfig[] {
        return this.registry.get(location) || [];
    }
}

function isComponentWithResolver(input: any): input is ReturnType<typeof detailComponentWithResolver> {
    return input && input.hasOwnProperty('resolveFn');
}
