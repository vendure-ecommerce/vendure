import { DocumentNode } from 'graphql';

export interface DashboardBaseRouteDefinition {
    id: string;
    title?: string;
}

export interface DashboardListRouteDefinition extends DashboardBaseRouteDefinition {
    listQuery: DocumentNode;
}

export type DashboardRouteDefinition = DashboardListRouteDefinition;

export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
}

export function defineDashboardExtension(extension: DashboardExtension) {
    return extension;
}
