/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as LoginImport } from './routes/login';
import { Route as AboutImport } from './routes/about';
import { Route as AuthenticatedImport } from './routes/_authenticated';
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index';
import { Route as AuthenticatedDashboardImport } from './routes/_authenticated/dashboard';
import { Route as AuthenticatedSystemJobQueueImport } from './routes/_authenticated/_system/job-queue';
import { Route as AuthenticatedSystemHealthchecksImport } from './routes/_authenticated/_system/healthchecks';
import { Route as AuthenticatedStockLocationsStockLocationsImport } from './routes/_authenticated/_stock-locations/stock-locations';
import { Route as AuthenticatedRolesRolesImport } from './routes/_authenticated/_roles/roles';
import { Route as AuthenticatedProductsProductsImport } from './routes/_authenticated/_products/products';
import { Route as AuthenticatedProductVariantsProductVariantsImport } from './routes/_authenticated/_product-variants/product-variants';
import { Route as AuthenticatedOrdersOrdersImport } from './routes/_authenticated/_orders/orders';
import { Route as AuthenticatedFacetsFacetsImport } from './routes/_authenticated/_facets/facets';
import { Route as AuthenticatedCollectionsCollectionsImport } from './routes/_authenticated/_collections/collections';
import { Route as AuthenticatedChannelsChannelsImport } from './routes/_authenticated/_channels/channels';
import { Route as AuthenticatedAssetsAssetsImport } from './routes/_authenticated/_assets/assets';
import { Route as AuthenticatedAdministratorsAdministratorsImport } from './routes/_authenticated/_administrators/administrators';
import { Route as AuthenticatedProductsProductsIdImport } from './routes/_authenticated/_products/products_.$id';
import { Route as AuthenticatedProductVariantsProductVariantsIdImport } from './routes/_authenticated/_product-variants/product-variants_.$id';
import { Route as AuthenticatedFacetsFacetsIdImport } from './routes/_authenticated/_facets/facets_.$id';
import { Route as AuthenticatedCollectionsCollectionsIdImport } from './routes/_authenticated/_collections/collections_.$id';

// Create/Update Routes

const LoginRoute = LoginImport.update({
    id: '/login',
    path: '/login',
    getParentRoute: () => rootRoute,
} as any);

const AboutRoute = AboutImport.update({
    id: '/about',
    path: '/about',
    getParentRoute: () => rootRoute,
} as any);

const AuthenticatedRoute = AuthenticatedImport.update({
    id: '/_authenticated',
    getParentRoute: () => rootRoute,
} as any);

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedDashboardRoute = AuthenticatedDashboardImport.update({
    id: '/dashboard',
    path: '/dashboard',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedSystemJobQueueRoute = AuthenticatedSystemJobQueueImport.update({
    id: '/_system/job-queue',
    path: '/job-queue',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedSystemHealthchecksRoute = AuthenticatedSystemHealthchecksImport.update({
    id: '/_system/healthchecks',
    path: '/healthchecks',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedStockLocationsStockLocationsRoute = AuthenticatedStockLocationsStockLocationsImport.update(
    {
        id: '/_stock-locations/stock-locations',
        path: '/stock-locations',
        getParentRoute: () => AuthenticatedRoute,
    } as any,
);

const AuthenticatedRolesRolesRoute = AuthenticatedRolesRolesImport.update({
    id: '/_roles/roles',
    path: '/roles',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedProductsProductsRoute = AuthenticatedProductsProductsImport.update({
    id: '/_products/products',
    path: '/products',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedProductVariantsProductVariantsRoute =
    AuthenticatedProductVariantsProductVariantsImport.update({
        id: '/_product-variants/product-variants',
        path: '/product-variants',
        getParentRoute: () => AuthenticatedRoute,
    } as any);

const AuthenticatedOrdersOrdersRoute = AuthenticatedOrdersOrdersImport.update({
    id: '/_orders/orders',
    path: '/orders',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedFacetsFacetsRoute = AuthenticatedFacetsFacetsImport.update({
    id: '/_facets/facets',
    path: '/facets',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedCollectionsCollectionsRoute = AuthenticatedCollectionsCollectionsImport.update({
    id: '/_collections/collections',
    path: '/collections',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedChannelsChannelsRoute = AuthenticatedChannelsChannelsImport.update({
    id: '/_channels/channels',
    path: '/channels',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedAssetsAssetsRoute = AuthenticatedAssetsAssetsImport.update({
    id: '/_assets/assets',
    path: '/assets',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedAdministratorsAdministratorsRoute = AuthenticatedAdministratorsAdministratorsImport.update(
    {
        id: '/_administrators/administrators',
        path: '/administrators',
        getParentRoute: () => AuthenticatedRoute,
    } as any,
);

const AuthenticatedProductsProductsIdRoute = AuthenticatedProductsProductsIdImport.update({
    id: '/_products/products_/$id',
    path: '/products/$id',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedProductVariantsProductVariantsIdRoute =
    AuthenticatedProductVariantsProductVariantsIdImport.update({
        id: '/_product-variants/product-variants_/$id',
        path: '/product-variants/$id',
        getParentRoute: () => AuthenticatedRoute,
    } as any);

const AuthenticatedFacetsFacetsIdRoute = AuthenticatedFacetsFacetsIdImport.update({
    id: '/_facets/facets_/$id',
    path: '/facets/$id',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedCollectionsCollectionsIdRoute = AuthenticatedCollectionsCollectionsIdImport.update({
    id: '/_collections/collections_/$id',
    path: '/collections/$id',
    getParentRoute: () => AuthenticatedRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
    interface FileRoutesByPath {
        '/_authenticated': {
            id: '/_authenticated';
            path: '';
            fullPath: '';
            preLoaderRoute: typeof AuthenticatedImport;
            parentRoute: typeof rootRoute;
        };
        '/about': {
            id: '/about';
            path: '/about';
            fullPath: '/about';
            preLoaderRoute: typeof AboutImport;
            parentRoute: typeof rootRoute;
        };
        '/login': {
            id: '/login';
            path: '/login';
            fullPath: '/login';
            preLoaderRoute: typeof LoginImport;
            parentRoute: typeof rootRoute;
        };
        '/_authenticated/dashboard': {
            id: '/_authenticated/dashboard';
            path: '/dashboard';
            fullPath: '/dashboard';
            preLoaderRoute: typeof AuthenticatedDashboardImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/': {
            id: '/_authenticated/';
            path: '/';
            fullPath: '/';
            preLoaderRoute: typeof AuthenticatedIndexImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_administrators/administrators': {
            id: '/_authenticated/_administrators/administrators';
            path: '/administrators';
            fullPath: '/administrators';
            preLoaderRoute: typeof AuthenticatedAdministratorsAdministratorsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_assets/assets': {
            id: '/_authenticated/_assets/assets';
            path: '/assets';
            fullPath: '/assets';
            preLoaderRoute: typeof AuthenticatedAssetsAssetsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_channels/channels': {
            id: '/_authenticated/_channels/channels';
            path: '/channels';
            fullPath: '/channels';
            preLoaderRoute: typeof AuthenticatedChannelsChannelsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_collections/collections': {
            id: '/_authenticated/_collections/collections';
            path: '/collections';
            fullPath: '/collections';
            preLoaderRoute: typeof AuthenticatedCollectionsCollectionsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_facets/facets': {
            id: '/_authenticated/_facets/facets';
            path: '/facets';
            fullPath: '/facets';
            preLoaderRoute: typeof AuthenticatedFacetsFacetsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_orders/orders': {
            id: '/_authenticated/_orders/orders';
            path: '/orders';
            fullPath: '/orders';
            preLoaderRoute: typeof AuthenticatedOrdersOrdersImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_product-variants/product-variants': {
            id: '/_authenticated/_product-variants/product-variants';
            path: '/product-variants';
            fullPath: '/product-variants';
            preLoaderRoute: typeof AuthenticatedProductVariantsProductVariantsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_products/products': {
            id: '/_authenticated/_products/products';
            path: '/products';
            fullPath: '/products';
            preLoaderRoute: typeof AuthenticatedProductsProductsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_roles/roles': {
            id: '/_authenticated/_roles/roles';
            path: '/roles';
            fullPath: '/roles';
            preLoaderRoute: typeof AuthenticatedRolesRolesImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_stock-locations/stock-locations': {
            id: '/_authenticated/_stock-locations/stock-locations';
            path: '/stock-locations';
            fullPath: '/stock-locations';
            preLoaderRoute: typeof AuthenticatedStockLocationsStockLocationsImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_system/healthchecks': {
            id: '/_authenticated/_system/healthchecks';
            path: '/healthchecks';
            fullPath: '/healthchecks';
            preLoaderRoute: typeof AuthenticatedSystemHealthchecksImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_system/job-queue': {
            id: '/_authenticated/_system/job-queue';
            path: '/job-queue';
            fullPath: '/job-queue';
            preLoaderRoute: typeof AuthenticatedSystemJobQueueImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_collections/collections_/$id': {
            id: '/_authenticated/_collections/collections_/$id';
            path: '/collections/$id';
            fullPath: '/collections/$id';
            preLoaderRoute: typeof AuthenticatedCollectionsCollectionsIdImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_facets/facets_/$id': {
            id: '/_authenticated/_facets/facets_/$id';
            path: '/facets/$id';
            fullPath: '/facets/$id';
            preLoaderRoute: typeof AuthenticatedFacetsFacetsIdImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_product-variants/product-variants_/$id': {
            id: '/_authenticated/_product-variants/product-variants_/$id';
            path: '/product-variants/$id';
            fullPath: '/product-variants/$id';
            preLoaderRoute: typeof AuthenticatedProductVariantsProductVariantsIdImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_products/products_/$id': {
            id: '/_authenticated/_products/products_/$id';
            path: '/products/$id';
            fullPath: '/products/$id';
            preLoaderRoute: typeof AuthenticatedProductsProductsIdImport;
            parentRoute: typeof AuthenticatedImport;
        };
    }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
    AuthenticatedDashboardRoute: typeof AuthenticatedDashboardRoute;
    AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute;
    AuthenticatedAdministratorsAdministratorsRoute: typeof AuthenticatedAdministratorsAdministratorsRoute;
    AuthenticatedAssetsAssetsRoute: typeof AuthenticatedAssetsAssetsRoute;
    AuthenticatedChannelsChannelsRoute: typeof AuthenticatedChannelsChannelsRoute;
    AuthenticatedCollectionsCollectionsRoute: typeof AuthenticatedCollectionsCollectionsRoute;
    AuthenticatedFacetsFacetsRoute: typeof AuthenticatedFacetsFacetsRoute;
    AuthenticatedOrdersOrdersRoute: typeof AuthenticatedOrdersOrdersRoute;
    AuthenticatedProductVariantsProductVariantsRoute: typeof AuthenticatedProductVariantsProductVariantsRoute;
    AuthenticatedProductsProductsRoute: typeof AuthenticatedProductsProductsRoute;
    AuthenticatedRolesRolesRoute: typeof AuthenticatedRolesRolesRoute;
    AuthenticatedStockLocationsStockLocationsRoute: typeof AuthenticatedStockLocationsStockLocationsRoute;
    AuthenticatedSystemHealthchecksRoute: typeof AuthenticatedSystemHealthchecksRoute;
    AuthenticatedSystemJobQueueRoute: typeof AuthenticatedSystemJobQueueRoute;
    AuthenticatedCollectionsCollectionsIdRoute: typeof AuthenticatedCollectionsCollectionsIdRoute;
    AuthenticatedFacetsFacetsIdRoute: typeof AuthenticatedFacetsFacetsIdRoute;
    AuthenticatedProductVariantsProductVariantsIdRoute: typeof AuthenticatedProductVariantsProductVariantsIdRoute;
    AuthenticatedProductsProductsIdRoute: typeof AuthenticatedProductsProductsIdRoute;
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
    AuthenticatedDashboardRoute: AuthenticatedDashboardRoute,
    AuthenticatedIndexRoute: AuthenticatedIndexRoute,
    AuthenticatedAdministratorsAdministratorsRoute: AuthenticatedAdministratorsAdministratorsRoute,
    AuthenticatedAssetsAssetsRoute: AuthenticatedAssetsAssetsRoute,
    AuthenticatedChannelsChannelsRoute: AuthenticatedChannelsChannelsRoute,
    AuthenticatedCollectionsCollectionsRoute: AuthenticatedCollectionsCollectionsRoute,
    AuthenticatedFacetsFacetsRoute: AuthenticatedFacetsFacetsRoute,
    AuthenticatedOrdersOrdersRoute: AuthenticatedOrdersOrdersRoute,
    AuthenticatedProductVariantsProductVariantsRoute: AuthenticatedProductVariantsProductVariantsRoute,
    AuthenticatedProductsProductsRoute: AuthenticatedProductsProductsRoute,
    AuthenticatedRolesRolesRoute: AuthenticatedRolesRolesRoute,
    AuthenticatedStockLocationsStockLocationsRoute: AuthenticatedStockLocationsStockLocationsRoute,
    AuthenticatedSystemHealthchecksRoute: AuthenticatedSystemHealthchecksRoute,
    AuthenticatedSystemJobQueueRoute: AuthenticatedSystemJobQueueRoute,
    AuthenticatedCollectionsCollectionsIdRoute: AuthenticatedCollectionsCollectionsIdRoute,
    AuthenticatedFacetsFacetsIdRoute: AuthenticatedFacetsFacetsIdRoute,
    AuthenticatedProductVariantsProductVariantsIdRoute: AuthenticatedProductVariantsProductVariantsIdRoute,
    AuthenticatedProductsProductsIdRoute: AuthenticatedProductsProductsIdRoute,
};

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren);

export interface FileRoutesByFullPath {
    '': typeof AuthenticatedRouteWithChildren;
    '/about': typeof AboutRoute;
    '/login': typeof LoginRoute;
    '/dashboard': typeof AuthenticatedDashboardRoute;
    '/': typeof AuthenticatedIndexRoute;
    '/administrators': typeof AuthenticatedAdministratorsAdministratorsRoute;
    '/assets': typeof AuthenticatedAssetsAssetsRoute;
    '/channels': typeof AuthenticatedChannelsChannelsRoute;
    '/collections': typeof AuthenticatedCollectionsCollectionsRoute;
    '/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/products': typeof AuthenticatedProductsProductsRoute;
    '/roles': typeof AuthenticatedRolesRolesRoute;
    '/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/collections/$id': typeof AuthenticatedCollectionsCollectionsIdRoute;
    '/facets/$id': typeof AuthenticatedFacetsFacetsIdRoute;
    '/product-variants/$id': typeof AuthenticatedProductVariantsProductVariantsIdRoute;
    '/products/$id': typeof AuthenticatedProductsProductsIdRoute;
}

export interface FileRoutesByTo {
    '/about': typeof AboutRoute;
    '/login': typeof LoginRoute;
    '/dashboard': typeof AuthenticatedDashboardRoute;
    '/': typeof AuthenticatedIndexRoute;
    '/administrators': typeof AuthenticatedAdministratorsAdministratorsRoute;
    '/assets': typeof AuthenticatedAssetsAssetsRoute;
    '/channels': typeof AuthenticatedChannelsChannelsRoute;
    '/collections': typeof AuthenticatedCollectionsCollectionsRoute;
    '/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/products': typeof AuthenticatedProductsProductsRoute;
    '/roles': typeof AuthenticatedRolesRolesRoute;
    '/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/collections/$id': typeof AuthenticatedCollectionsCollectionsIdRoute;
    '/facets/$id': typeof AuthenticatedFacetsFacetsIdRoute;
    '/product-variants/$id': typeof AuthenticatedProductVariantsProductVariantsIdRoute;
    '/products/$id': typeof AuthenticatedProductsProductsIdRoute;
}

export interface FileRoutesById {
    __root__: typeof rootRoute;
    '/_authenticated': typeof AuthenticatedRouteWithChildren;
    '/about': typeof AboutRoute;
    '/login': typeof LoginRoute;
    '/_authenticated/dashboard': typeof AuthenticatedDashboardRoute;
    '/_authenticated/': typeof AuthenticatedIndexRoute;
    '/_authenticated/_administrators/administrators': typeof AuthenticatedAdministratorsAdministratorsRoute;
    '/_authenticated/_assets/assets': typeof AuthenticatedAssetsAssetsRoute;
    '/_authenticated/_channels/channels': typeof AuthenticatedChannelsChannelsRoute;
    '/_authenticated/_collections/collections': typeof AuthenticatedCollectionsCollectionsRoute;
    '/_authenticated/_facets/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/_authenticated/_orders/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/_authenticated/_product-variants/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/_authenticated/_products/products': typeof AuthenticatedProductsProductsRoute;
    '/_authenticated/_roles/roles': typeof AuthenticatedRolesRolesRoute;
    '/_authenticated/_stock-locations/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/_authenticated/_system/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/_authenticated/_system/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/_authenticated/_collections/collections_/$id': typeof AuthenticatedCollectionsCollectionsIdRoute;
    '/_authenticated/_facets/facets_/$id': typeof AuthenticatedFacetsFacetsIdRoute;
    '/_authenticated/_product-variants/product-variants_/$id': typeof AuthenticatedProductVariantsProductVariantsIdRoute;
    '/_authenticated/_products/products_/$id': typeof AuthenticatedProductsProductsIdRoute;
}

export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath;
    fullPaths:
        | ''
        | '/about'
        | '/login'
        | '/dashboard'
        | '/'
        | '/administrators'
        | '/assets'
        | '/channels'
        | '/collections'
        | '/facets'
        | '/orders'
        | '/product-variants'
        | '/products'
        | '/roles'
        | '/stock-locations'
        | '/healthchecks'
        | '/job-queue'
        | '/collections/$id'
        | '/facets/$id'
        | '/product-variants/$id'
        | '/products/$id';
    fileRoutesByTo: FileRoutesByTo;
    to:
        | '/about'
        | '/login'
        | '/dashboard'
        | '/'
        | '/administrators'
        | '/assets'
        | '/channels'
        | '/collections'
        | '/facets'
        | '/orders'
        | '/product-variants'
        | '/products'
        | '/roles'
        | '/stock-locations'
        | '/healthchecks'
        | '/job-queue'
        | '/collections/$id'
        | '/facets/$id'
        | '/product-variants/$id'
        | '/products/$id';
    id:
        | '__root__'
        | '/_authenticated'
        | '/about'
        | '/login'
        | '/_authenticated/dashboard'
        | '/_authenticated/'
        | '/_authenticated/_administrators/administrators'
        | '/_authenticated/_assets/assets'
        | '/_authenticated/_channels/channels'
        | '/_authenticated/_collections/collections'
        | '/_authenticated/_facets/facets'
        | '/_authenticated/_orders/orders'
        | '/_authenticated/_product-variants/product-variants'
        | '/_authenticated/_products/products'
        | '/_authenticated/_roles/roles'
        | '/_authenticated/_stock-locations/stock-locations'
        | '/_authenticated/_system/healthchecks'
        | '/_authenticated/_system/job-queue'
        | '/_authenticated/_collections/collections_/$id'
        | '/_authenticated/_facets/facets_/$id'
        | '/_authenticated/_product-variants/product-variants_/$id'
        | '/_authenticated/_products/products_/$id';
    fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
    AuthenticatedRoute: typeof AuthenticatedRouteWithChildren;
    AboutRoute: typeof AboutRoute;
    LoginRoute: typeof LoginRoute;
}

const rootRouteChildren: RootRouteChildren = {
    AuthenticatedRoute: AuthenticatedRouteWithChildren,
    AboutRoute: AboutRoute,
    LoginRoute: LoginRoute,
};

export const routeTree = rootRoute._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/about",
        "/login"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/dashboard",
        "/_authenticated/",
        "/_authenticated/_administrators/administrators",
        "/_authenticated/_assets/assets",
        "/_authenticated/_channels/channels",
        "/_authenticated/_collections/collections",
        "/_authenticated/_facets/facets",
        "/_authenticated/_orders/orders",
        "/_authenticated/_product-variants/product-variants",
        "/_authenticated/_products/products",
        "/_authenticated/_roles/roles",
        "/_authenticated/_stock-locations/stock-locations",
        "/_authenticated/_system/healthchecks",
        "/_authenticated/_system/job-queue",
        "/_authenticated/_collections/collections_/$id",
        "/_authenticated/_facets/facets_/$id",
        "/_authenticated/_product-variants/product-variants_/$id",
        "/_authenticated/_products/products_/$id"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_authenticated/dashboard": {
      "filePath": "_authenticated/dashboard.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_administrators/administrators": {
      "filePath": "_authenticated/_administrators/administrators.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_assets/assets": {
      "filePath": "_authenticated/_assets/assets.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_channels/channels": {
      "filePath": "_authenticated/_channels/channels.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_collections/collections": {
      "filePath": "_authenticated/_collections/collections.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_facets/facets": {
      "filePath": "_authenticated/_facets/facets.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_orders/orders": {
      "filePath": "_authenticated/_orders/orders.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_product-variants/product-variants": {
      "filePath": "_authenticated/_product-variants/product-variants.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_products/products": {
      "filePath": "_authenticated/_products/products.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_roles/roles": {
      "filePath": "_authenticated/_roles/roles.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_stock-locations/stock-locations": {
      "filePath": "_authenticated/_stock-locations/stock-locations.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_system/healthchecks": {
      "filePath": "_authenticated/_system/healthchecks.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_system/job-queue": {
      "filePath": "_authenticated/_system/job-queue.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_collections/collections_/$id": {
      "filePath": "_authenticated/_collections/collections_.$id.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_facets/facets_/$id": {
      "filePath": "_authenticated/_facets/facets_.$id.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_product-variants/product-variants_/$id": {
      "filePath": "_authenticated/_product-variants/product-variants_.$id.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_products/products_/$id": {
      "filePath": "_authenticated/_products/products_.$id.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
