import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { Route } from '@angular/router';
import { BreadcrumbValue, ComponentRegistryService } from '@vendure/admin-ui/core';
import { ElementType } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ReactFormInputComponent } from './components/react-form-input.component';
import { ReactRouteComponent, ROUTE_COMPONENT_OPTIONS } from './components/react-route.component';
import { ReactRouteComponentOptions } from './types';

export function registerReactFormInputComponent(id: string, component: ElementType): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: ComponentRegistryService) => () => {
            registry.registerInputComponent(id, ReactFormInputComponent, { component });
        },
        deps: [ComponentRegistryService],
    };
}

export function registerReactRouteComponent(options: {
    component: ElementType;
    title?: string;
    breadcrumb?: BreadcrumbValue;
    path?: string;
    props?: Record<string, any>;
    routeConfig?: Route;
}): Route {
    const breadcrumbSubject$ = new BehaviorSubject<BreadcrumbValue>(options.breadcrumb ?? '');
    const titleSubject$ = new BehaviorSubject<string | undefined>(options.title);
    return {
        path: options.path ?? '',
        providers: [
            {
                provide: ROUTE_COMPONENT_OPTIONS,
                useValue: {
                    component: options.component,
                    title$: titleSubject$,
                    breadcrumb$: breadcrumbSubject$,
                    props: options.props,
                } satisfies ReactRouteComponentOptions,
            },
            ...(options.routeConfig?.providers ?? []),
        ],
        data: {
            breadcrumb: breadcrumbSubject$,
            ...(options.routeConfig?.data ?? {}),
        },
        ...(options.routeConfig ?? {}),
        component: ReactRouteComponent,
    };
}
