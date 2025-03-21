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
import { Route as AuthenticatedZonesZonesImport } from './routes/_authenticated/_zones/zones';
import { Route as AuthenticatedTaxRatesTaxRatesImport } from './routes/_authenticated/_tax-rates/tax-rates';
import { Route as AuthenticatedTaxCategoriesTaxCategoriesImport } from './routes/_authenticated/_tax-categories/tax-categories';
import { Route as AuthenticatedSystemJobQueueImport } from './routes/_authenticated/_system/job-queue';
import { Route as AuthenticatedSystemHealthchecksImport } from './routes/_authenticated/_system/healthchecks';
import { Route as AuthenticatedStockLocationsStockLocationsImport } from './routes/_authenticated/_stock-locations/stock-locations';
import { Route as AuthenticatedShippingMethodsShippingMethodsImport } from './routes/_authenticated/_shipping-methods/shipping-methods';
import { Route as AuthenticatedSellersSellersImport } from './routes/_authenticated/_sellers/sellers';
import { Route as AuthenticatedRolesRolesImport } from './routes/_authenticated/_roles/roles';
import { Route as AuthenticatedProductsProductsImport } from './routes/_authenticated/_products/products';
import { Route as AuthenticatedProductVariantsProductVariantsImport } from './routes/_authenticated/_product-variants/product-variants';
import { Route as AuthenticatedPaymentMethodsPaymentMethodsImport } from './routes/_authenticated/_payment-methods/payment-methods';
import { Route as AuthenticatedOrdersOrdersImport } from './routes/_authenticated/_orders/orders';
import { Route as AuthenticatedFacetsFacetsImport } from './routes/_authenticated/_facets/facets';
import { Route as AuthenticatedCountriesCountriesImport } from './routes/_authenticated/_countries/countries';
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

const AuthenticatedZonesZonesRoute = AuthenticatedZonesZonesImport.update({
    id: '/_zones/zones',
    path: '/zones',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedTaxRatesTaxRatesRoute = AuthenticatedTaxRatesTaxRatesImport.update({
    id: '/_tax-rates/tax-rates',
    path: '/tax-rates',
    getParentRoute: () => AuthenticatedRoute,
} as any);

const AuthenticatedTaxCategoriesTaxCategoriesRoute = AuthenticatedTaxCategoriesTaxCategoriesImport.update({
    id: '/_tax-categories/tax-categories',
    path: '/tax-categories',
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

const AuthenticatedShippingMethodsShippingMethodsRoute =
    AuthenticatedShippingMethodsShippingMethodsImport.update({
        id: '/_shipping-methods/shipping-methods',
        path: '/shipping-methods',
        getParentRoute: () => AuthenticatedRoute,
    } as any);

const AuthenticatedSellersSellersRoute = AuthenticatedSellersSellersImport.update({
    id: '/_sellers/sellers',
    path: '/sellers',
    getParentRoute: () => AuthenticatedRoute,
} as any);

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

const AuthenticatedPaymentMethodsPaymentMethodsRoute = AuthenticatedPaymentMethodsPaymentMethodsImport.update(
    {
        id: '/_payment-methods/payment-methods',
        path: '/payment-methods',
        getParentRoute: () => AuthenticatedRoute,
    } as any,
);

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

const AuthenticatedCountriesCountriesRoute = AuthenticatedCountriesCountriesImport.update({
    id: '/_countries/countries',
    path: '/countries',
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
        '/_authenticated/_countries/countries': {
            id: '/_authenticated/_countries/countries';
            path: '/countries';
            fullPath: '/countries';
            preLoaderRoute: typeof AuthenticatedCountriesCountriesImport;
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
        '/_authenticated/_payment-methods/payment-methods': {
            id: '/_authenticated/_payment-methods/payment-methods';
            path: '/payment-methods';
            fullPath: '/payment-methods';
            preLoaderRoute: typeof AuthenticatedPaymentMethodsPaymentMethodsImport;
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
        '/_authenticated/_sellers/sellers': {
            id: '/_authenticated/_sellers/sellers';
            path: '/sellers';
            fullPath: '/sellers';
            preLoaderRoute: typeof AuthenticatedSellersSellersImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_shipping-methods/shipping-methods': {
            id: '/_authenticated/_shipping-methods/shipping-methods';
            path: '/shipping-methods';
            fullPath: '/shipping-methods';
            preLoaderRoute: typeof AuthenticatedShippingMethodsShippingMethodsImport;
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
        '/_authenticated/_tax-categories/tax-categories': {
            id: '/_authenticated/_tax-categories/tax-categories';
            path: '/tax-categories';
            fullPath: '/tax-categories';
            preLoaderRoute: typeof AuthenticatedTaxCategoriesTaxCategoriesImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_tax-rates/tax-rates': {
            id: '/_authenticated/_tax-rates/tax-rates';
            path: '/tax-rates';
            fullPath: '/tax-rates';
            preLoaderRoute: typeof AuthenticatedTaxRatesTaxRatesImport;
            parentRoute: typeof AuthenticatedImport;
        };
        '/_authenticated/_zones/zones': {
            id: '/_authenticated/_zones/zones';
            path: '/zones';
            fullPath: '/zones';
            preLoaderRoute: typeof AuthenticatedZonesZonesImport;
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
    AuthenticatedCountriesCountriesRoute: typeof AuthenticatedCountriesCountriesRoute;
    AuthenticatedFacetsFacetsRoute: typeof AuthenticatedFacetsFacetsRoute;
    AuthenticatedOrdersOrdersRoute: typeof AuthenticatedOrdersOrdersRoute;
    AuthenticatedPaymentMethodsPaymentMethodsRoute: typeof AuthenticatedPaymentMethodsPaymentMethodsRoute;
    AuthenticatedProductVariantsProductVariantsRoute: typeof AuthenticatedProductVariantsProductVariantsRoute;
    AuthenticatedProductsProductsRoute: typeof AuthenticatedProductsProductsRoute;
    AuthenticatedRolesRolesRoute: typeof AuthenticatedRolesRolesRoute;
    AuthenticatedSellersSellersRoute: typeof AuthenticatedSellersSellersRoute;
    AuthenticatedShippingMethodsShippingMethodsRoute: typeof AuthenticatedShippingMethodsShippingMethodsRoute;
    AuthenticatedStockLocationsStockLocationsRoute: typeof AuthenticatedStockLocationsStockLocationsRoute;
    AuthenticatedSystemHealthchecksRoute: typeof AuthenticatedSystemHealthchecksRoute;
    AuthenticatedSystemJobQueueRoute: typeof AuthenticatedSystemJobQueueRoute;
    AuthenticatedTaxCategoriesTaxCategoriesRoute: typeof AuthenticatedTaxCategoriesTaxCategoriesRoute;
    AuthenticatedTaxRatesTaxRatesRoute: typeof AuthenticatedTaxRatesTaxRatesRoute;
    AuthenticatedZonesZonesRoute: typeof AuthenticatedZonesZonesRoute;
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
    AuthenticatedCountriesCountriesRoute: AuthenticatedCountriesCountriesRoute,
    AuthenticatedFacetsFacetsRoute: AuthenticatedFacetsFacetsRoute,
    AuthenticatedOrdersOrdersRoute: AuthenticatedOrdersOrdersRoute,
    AuthenticatedPaymentMethodsPaymentMethodsRoute: AuthenticatedPaymentMethodsPaymentMethodsRoute,
    AuthenticatedProductVariantsProductVariantsRoute: AuthenticatedProductVariantsProductVariantsRoute,
    AuthenticatedProductsProductsRoute: AuthenticatedProductsProductsRoute,
    AuthenticatedRolesRolesRoute: AuthenticatedRolesRolesRoute,
    AuthenticatedSellersSellersRoute: AuthenticatedSellersSellersRoute,
    AuthenticatedShippingMethodsShippingMethodsRoute: AuthenticatedShippingMethodsShippingMethodsRoute,
    AuthenticatedStockLocationsStockLocationsRoute: AuthenticatedStockLocationsStockLocationsRoute,
    AuthenticatedSystemHealthchecksRoute: AuthenticatedSystemHealthchecksRoute,
    AuthenticatedSystemJobQueueRoute: AuthenticatedSystemJobQueueRoute,
    AuthenticatedTaxCategoriesTaxCategoriesRoute: AuthenticatedTaxCategoriesTaxCategoriesRoute,
    AuthenticatedTaxRatesTaxRatesRoute: AuthenticatedTaxRatesTaxRatesRoute,
    AuthenticatedZonesZonesRoute: AuthenticatedZonesZonesRoute,
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
    '/countries': typeof AuthenticatedCountriesCountriesRoute;
    '/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/payment-methods': typeof AuthenticatedPaymentMethodsPaymentMethodsRoute;
    '/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/products': typeof AuthenticatedProductsProductsRoute;
    '/roles': typeof AuthenticatedRolesRolesRoute;
    '/sellers': typeof AuthenticatedSellersSellersRoute;
    '/shipping-methods': typeof AuthenticatedShippingMethodsShippingMethodsRoute;
    '/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/tax-categories': typeof AuthenticatedTaxCategoriesTaxCategoriesRoute;
    '/tax-rates': typeof AuthenticatedTaxRatesTaxRatesRoute;
    '/zones': typeof AuthenticatedZonesZonesRoute;
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
    '/countries': typeof AuthenticatedCountriesCountriesRoute;
    '/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/payment-methods': typeof AuthenticatedPaymentMethodsPaymentMethodsRoute;
    '/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/products': typeof AuthenticatedProductsProductsRoute;
    '/roles': typeof AuthenticatedRolesRolesRoute;
    '/sellers': typeof AuthenticatedSellersSellersRoute;
    '/shipping-methods': typeof AuthenticatedShippingMethodsShippingMethodsRoute;
    '/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/tax-categories': typeof AuthenticatedTaxCategoriesTaxCategoriesRoute;
    '/tax-rates': typeof AuthenticatedTaxRatesTaxRatesRoute;
    '/zones': typeof AuthenticatedZonesZonesRoute;
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
    '/_authenticated/_countries/countries': typeof AuthenticatedCountriesCountriesRoute;
    '/_authenticated/_facets/facets': typeof AuthenticatedFacetsFacetsRoute;
    '/_authenticated/_orders/orders': typeof AuthenticatedOrdersOrdersRoute;
    '/_authenticated/_payment-methods/payment-methods': typeof AuthenticatedPaymentMethodsPaymentMethodsRoute;
    '/_authenticated/_product-variants/product-variants': typeof AuthenticatedProductVariantsProductVariantsRoute;
    '/_authenticated/_products/products': typeof AuthenticatedProductsProductsRoute;
    '/_authenticated/_roles/roles': typeof AuthenticatedRolesRolesRoute;
    '/_authenticated/_sellers/sellers': typeof AuthenticatedSellersSellersRoute;
    '/_authenticated/_shipping-methods/shipping-methods': typeof AuthenticatedShippingMethodsShippingMethodsRoute;
    '/_authenticated/_stock-locations/stock-locations': typeof AuthenticatedStockLocationsStockLocationsRoute;
    '/_authenticated/_system/healthchecks': typeof AuthenticatedSystemHealthchecksRoute;
    '/_authenticated/_system/job-queue': typeof AuthenticatedSystemJobQueueRoute;
    '/_authenticated/_tax-categories/tax-categories': typeof AuthenticatedTaxCategoriesTaxCategoriesRoute;
    '/_authenticated/_tax-rates/tax-rates': typeof AuthenticatedTaxRatesTaxRatesRoute;
    '/_authenticated/_zones/zones': typeof AuthenticatedZonesZonesRoute;
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
        | '/countries'
        | '/facets'
        | '/orders'
        | '/payment-methods'
        | '/product-variants'
        | '/products'
        | '/roles'
        | '/sellers'
        | '/shipping-methods'
        | '/stock-locations'
        | '/healthchecks'
        | '/job-queue'
        | '/tax-categories'
        | '/tax-rates'
        | '/zones'
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
        | '/countries'
        | '/facets'
        | '/orders'
        | '/payment-methods'
        | '/product-variants'
        | '/products'
        | '/roles'
        | '/sellers'
        | '/shipping-methods'
        | '/stock-locations'
        | '/healthchecks'
        | '/job-queue'
        | '/tax-categories'
        | '/tax-rates'
        | '/zones'
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
        | '/_authenticated/_countries/countries'
        | '/_authenticated/_facets/facets'
        | '/_authenticated/_orders/orders'
        | '/_authenticated/_payment-methods/payment-methods'
        | '/_authenticated/_product-variants/product-variants'
        | '/_authenticated/_products/products'
        | '/_authenticated/_roles/roles'
        | '/_authenticated/_sellers/sellers'
        | '/_authenticated/_shipping-methods/shipping-methods'
        | '/_authenticated/_stock-locations/stock-locations'
        | '/_authenticated/_system/healthchecks'
        | '/_authenticated/_system/job-queue'
        | '/_authenticated/_tax-categories/tax-categories'
        | '/_authenticated/_tax-rates/tax-rates'
        | '/_authenticated/_zones/zones'
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
        "/_authenticated/_countries/countries",
        "/_authenticated/_facets/facets",
        "/_authenticated/_orders/orders",
        "/_authenticated/_payment-methods/payment-methods",
        "/_authenticated/_product-variants/product-variants",
        "/_authenticated/_products/products",
        "/_authenticated/_roles/roles",
        "/_authenticated/_sellers/sellers",
        "/_authenticated/_shipping-methods/shipping-methods",
        "/_authenticated/_stock-locations/stock-locations",
        "/_authenticated/_system/healthchecks",
        "/_authenticated/_system/job-queue",
        "/_authenticated/_tax-categories/tax-categories",
        "/_authenticated/_tax-rates/tax-rates",
        "/_authenticated/_zones/zones",
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
    "/_authenticated/_countries/countries": {
      "filePath": "_authenticated/_countries/countries.tsx",
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
    "/_authenticated/_payment-methods/payment-methods": {
      "filePath": "_authenticated/_payment-methods/payment-methods.tsx",
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
    "/_authenticated/_sellers/sellers": {
      "filePath": "_authenticated/_sellers/sellers.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_shipping-methods/shipping-methods": {
      "filePath": "_authenticated/_shipping-methods/shipping-methods.tsx",
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
    "/_authenticated/_tax-categories/tax-categories": {
      "filePath": "_authenticated/_tax-categories/tax-categories.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_tax-rates/tax-rates": {
      "filePath": "_authenticated/_tax-rates/tax-rates.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/_zones/zones": {
      "filePath": "_authenticated/_zones/zones.tsx",
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
