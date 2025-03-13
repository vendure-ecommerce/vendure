import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { ListPageProps, ListQueryOptionsShape, ListQueryShape } from '@/framework/page/list-page.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import React from 'react';

export interface DashboardBaseRouteDefinition {
    id: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    title: string | React.ReactElement;
}

export interface DashboardListRouteDefinition<
    T extends TypedDocumentNode<U, V> = TypedDocumentNode<any, any>,
    U extends ListQueryShape = any,
    V extends ListQueryOptionsShape = any,
> extends DashboardBaseRouteDefinition,
        Omit<ListPageProps<T, U, V>, 'route'> {
    path: string;
}

export type DashboardRouteDefinition = DashboardListRouteDefinition;

export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
}
