import { setNavMenuConfig } from '@/vdb/framework/nav-menu/nav-menu-extensions.js';
import {
    LayoutDashboardIcon,
    Mail,
    Settings2,
    ShoppingCart,
    SquareTerminal,
    Terminal,
    Users,
} from 'lucide-react';

import { LatestOrdersWidget } from './dashboard-widget/latest-orders-widget/index.js';
import { MetricsWidget } from './dashboard-widget/metrics-widget/index.js';
import { OrdersSummaryWidget } from './dashboard-widget/orders-summary/index.js';
import { registerDashboardWidget } from './dashboard-widget/widget-extensions.js';

export function registerDefaults() {
    setNavMenuConfig({
        sections: [
            {
                id: 'insights',
                title: 'Insights',
                placement: 'top',
                icon: LayoutDashboardIcon,
                url: '/',
                order: 100,
            },
            {
                id: 'catalog',
                title: 'Catalog',
                icon: SquareTerminal,
                placement: 'top',
                order: 200,
                items: [
                    {
                        id: 'products',
                        title: 'Products',
                        url: '/products',
                        order: 100,
                        requiresPermission: ['ReadProduct', 'ReadCatalog'],
                    },
                    {
                        id: 'product-variants',
                        title: 'Product Variants',
                        url: '/product-variants',
                        order: 200,
                        requiresPermission: ['ReadProduct', 'ReadCatalog'],
                    },
                    {
                        id: 'facets',
                        title: 'Facets',
                        url: '/facets',
                        order: 300,
                        requiresPermission: ['ReadProduct', 'ReadCatalog'],
                    },
                    {
                        id: 'collections',
                        title: 'Collections',
                        url: '/collections',
                        order: 400,
                        requiresPermission: ['ReadCollection', 'ReadCatalog'],
                    },
                    {
                        id: 'assets',
                        title: 'Assets',
                        url: '/assets',
                        order: 500,
                        requiresPermission: ['ReadAsset', 'ReadCatalog'],
                    },
                ],
            },
            {
                id: 'sales',
                title: 'Sales',
                icon: ShoppingCart,
                placement: 'top',
                order: 300,
                items: [
                    {
                        id: 'orders',
                        title: 'Orders',
                        url: '/orders',
                        order: 100,
                        requiresPermission: ['ReadOrder'],
                    },
                ],
            },
            {
                id: 'customers',
                title: 'Customers',
                icon: Users,
                placement: 'top',
                order: 400,
                items: [
                    {
                        id: 'customers',
                        title: 'Customers',
                        url: '/customers',
                        order: 100,
                        requiresPermission: ['ReadCustomer'],
                    },
                    {
                        id: 'customer-groups',
                        title: 'Customer Groups',
                        url: '/customer-groups',
                        order: 200,
                        requiresPermission: ['ReadCustomerGroup'],
                    },
                ],
            },
            {
                id: 'marketing',
                title: 'Marketing',
                icon: Mail,
                placement: 'top',
                order: 500,
                items: [
                    {
                        id: 'promotions',
                        title: 'Promotions',
                        url: '/promotions',
                        order: 100,
                        requiresPermission: ['ReadPromotion'],
                    },
                ],
            },
            {
                id: 'system',
                title: 'System',
                icon: Terminal,
                placement: 'bottom',
                order: 200,
                items: [
                    {
                        id: 'job-queue',
                        title: 'Job Queue',
                        url: '/job-queue',
                        order: 100,
                        requiresPermission: ['ReadSystem'],
                    },
                    {
                        id: 'healthchecks',
                        title: 'Healthchecks',
                        url: '/healthchecks',
                        order: 200,
                        requiresPermission: ['ReadSystem'],
                    },
                    {
                        id: 'scheduled-tasks',
                        title: 'Scheduled Tasks',
                        url: '/scheduled-tasks',
                        order: 300,
                        requiresPermission: ['ReadSystem'],
                    },
                ],
            },
            {
                id: 'settings',
                title: 'Settings',
                icon: Settings2,
                placement: 'bottom',
                order: 100,
                items: [
                    {
                        id: 'sellers',
                        title: 'Sellers',
                        url: '/sellers',
                        order: 100,
                        requiresPermission: ['ReadSeller'],
                    },
                    {
                        id: 'channels',
                        title: 'Channels',
                        url: '/channels',
                        order: 200,
                        requiresPermission: ['ReadChannel'],
                    },
                    {
                        id: 'stock-locations',
                        title: 'Stock Locations',
                        url: '/stock-locations',
                        order: 300,
                        requiresPermission: ['ReadStockLocation'],
                    },
                    {
                        id: 'administrators',
                        title: 'Administrators',
                        url: '/administrators',
                        order: 400,
                        requiresPermission: ['ReadAdministrator'],
                    },
                    {
                        id: 'roles',
                        title: 'Roles',
                        url: '/roles',
                        order: 500,
                        requiresPermission: ['ReadAdministrator'],
                    },
                    {
                        id: 'shipping-methods',
                        title: 'Shipping Methods',
                        url: '/shipping-methods',
                        order: 600,
                        requiresPermission: ['ReadShippingMethod'],
                    },
                    {
                        id: 'payment-methods',
                        title: 'Payment Methods',
                        url: '/payment-methods',
                        order: 700,
                        requiresPermission: ['ReadPaymentMethod'],
                    },
                    {
                        id: 'tax-categories',
                        title: 'Tax Categories',
                        url: '/tax-categories',
                        order: 800,
                        requiresPermission: ['ReadTaxCategory'],
                    },
                    {
                        id: 'tax-rates',
                        title: 'Tax Rates',
                        url: '/tax-rates',
                        order: 900,
                        requiresPermission: ['ReadTaxRate'],
                    },
                    {
                        id: 'countries',
                        title: 'Countries',
                        url: '/countries',
                        order: 1000,
                        requiresPermission: ['ReadCountry'],
                    },
                    {
                        id: 'zones',
                        title: 'Zones',
                        url: '/zones',
                        order: 1100,
                        requiresPermission: ['ReadZone'],
                    },
                    {
                        id: 'global-settings',
                        title: 'Global Settings',
                        url: '/global-settings',
                        order: 1200,
                        requiresPermission: ['UpdateGlobalSettings'],
                    },
                ],
            },
        ],
    });

    registerDashboardWidget({
        id: 'metrics-widget',
        name: 'Metrics Widget',
        component: MetricsWidget,
        defaultSize: { w: 12, h: 6, x: 0, y: 0 },
        minSize: { w: 6, h: 4 },
    });

    registerDashboardWidget({
        id: 'latest-orders-widget',
        name: 'Latest Orders Widget',
        component: LatestOrdersWidget,
        defaultSize: { w: 6, h: 7, x: 0, y: 0 },
    });

    registerDashboardWidget({
        id: 'orders-summary-widget',
        name: 'Orders Summary Widget',
        component: OrdersSummaryWidget,
        defaultSize: { w: 6, h: 3, x: 6, y: 0 },
    });

    // registerAlert<boolean>({
    //     id: 'test-alert',
    //     title: data => `Test Alert ${String(data)}`,
    //     description: 'This is a test alert',
    //     severity: 'info',
    //     check: () => Promise.resolve(true),
    //     actions: [
    //         {
    //             label: 'Test Action',
    //             onClick: () => console.log('Test Action'),
    //         },
    //     ],
    // });

    // registerAlert<boolean>({
    //     id: 'test-alert-2',
    //     title: 'Test Alert 2',
    //     description: 'This is a test alert 2',
    //     severity: 'info',
    //     check: () => Promise.resolve(true),
    //     shouldShow: data => data === true,
    //     actions: [
    //         {
    //             label: 'Test Action',
    //             onClick: () => console.log('Test Action'),
    //         },
    //     ],
    // });
}
