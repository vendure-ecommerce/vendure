import { Type } from '@angular/core';
import { ResolveFn, Route } from '@angular/router';
import { ResultOf, TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseDetailComponent, createBaseDetailResolveFn } from '../common/base-detail.component';
import { BreadcrumbValue } from '../providers/breadcrumb/breadcrumb.service';
import { ROUTE_COMPONENT_OPTIONS, RouteComponent } from './components/route.component';
import { RouteComponentOptions } from './types';

export type RegisterRouteComponentOptions<
    Component extends any | BaseDetailComponent<Entity>,
    Entity extends { id: string; updatedAt?: string },
    T extends DocumentNode | TypedDocumentNode<any, { id: string }>,
    Field extends keyof ResultOf<T>,
    R extends Field,
> = {
    component: Type<Component> | Component;
    title?: string;
    breadcrumb?: BreadcrumbValue;
    path?: string;
    query?: T;
    getBreadcrumbs?: (entity: Exclude<ResultOf<T>[R], 'Query'>) => BreadcrumbValue;
    entityKey?: Component extends BaseDetailComponent<Entity> ? R : undefined;
    variables?: T extends TypedDocumentNode<any, infer V> ? Omit<V, 'id'> : never;
    routeConfig?: Route;
} & (Component extends BaseDetailComponent<Entity> ? { entityKey: R } : unknown);

export function registerRouteComponent<
    Component extends any | BaseDetailComponent<Entity>,
    Entity extends { id: string; updatedAt?: string },
    T extends DocumentNode | TypedDocumentNode<any, { id: string }>,
    Field extends keyof ResultOf<T>,
    R extends Field,
>(options: RegisterRouteComponentOptions<Component, Entity, T, Field, R>) {
    const { query, entityKey, variables, getBreadcrumbs } = options;

    const breadcrumbSubject$ = new BehaviorSubject<BreadcrumbValue>(options.breadcrumb ?? '');
    const titleSubject$ = new BehaviorSubject<string | undefined>(options.title);

    const resolveFn:
        | ResolveFn<{
              entity: Observable<ResultOf<T>[Field] | null>;
              result?: ResultOf<T>;
          }>
        | undefined =
        query && entityKey
            ? createBaseDetailResolveFn({
                  query,
                  entityKey,
                  variables,
              })
            : undefined;

    return {
        path: options.path ?? '',
        providers: [
            {
                provide: ROUTE_COMPONENT_OPTIONS,
                useValue: {
                    component: options.component,
                    title$: titleSubject$,
                    breadcrumb$: breadcrumbSubject$,
                } satisfies RouteComponentOptions,
            },
            ...(options.routeConfig?.providers ?? []),
        ],
        ...(options.routeConfig ?? {}),
        resolve: { ...(resolveFn ? { detail: resolveFn } : {}), ...(options.routeConfig?.resolve ?? {}) },
        data: {
            breadcrumb: breadcrumbSubject$,
            ...(options.routeConfig?.data ?? {}),
            ...(getBreadcrumbs
                ? {
                      breadcrumb: data =>
                          data.detail.entity.pipe(map((entity: any) => getBreadcrumbs(entity))),
                  }
                : {}),
            ...(options.routeConfig?.data ?? {}),
        },
        component: RouteComponent,
    } satisfies Route;
}
