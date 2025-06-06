import { setNavMenuConfig } from '@/framework/nav-menu/nav-menu-extensions.js';
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
                id: 'dashboard',
                title: 'Dashboard',
                placement: 'top',
                icon: LayoutDashboardIcon,
                url: '/',
            },
            {
                id: 'catalog',
                title: 'Catalog',
                icon: SquareTerminal,
                defaultOpen: true,
                placement: 'top',
                items: [
                    {
                        id: 'products',
                        title: 'Products',
                        url: '/products',
                    },
                    {
                        id: 'product-variants',
                        title: 'Product Variants',
                        url: '/product-variants',
                    },
                    {
                        id: 'facets',
                        title: 'Facets',
                        url: '/facets',
                    },
                    {
                        id: 'collections',
                        title: 'Collections',
                        url: '/collections',
                    },
                    {
                        id: 'assets',
                        title: 'Assets',
                        url: '/assets',
                    },
                ],
            },
            {
                id: 'sales',
                title: 'Sales',
                icon: ShoppingCart,
                defaultOpen: true,
                placement: 'top',
                items: [
                    {
                        id: 'orders',
                        title: 'Orders',
                        url: '/orders',
                    },
                ],
            },
            {
                id: 'customers',
                title: 'Customers',
                icon: Users,
                defaultOpen: false,
                placement: 'top',
                items: [
                    {
                        id: 'customers',
                        title: 'Customers',
                        url: '/customers',
                    },
                    {
                        id: 'customer-groups',
                        title: 'Customer Groups',
                        url: '/customer-groups',
                    },
                ],
            },
            {
                id: 'marketing',
                title: 'Marketing',
                icon: Mail,
                defaultOpen: false,
                placement: 'top',
                items: [
                    {
                        id: 'promotions',
                        title: 'Promotions',
                        url: '/promotions',
                    },
                ],
            },
            {
                id: 'system',
                title: 'System',
                icon: Terminal,
                defaultOpen: false,
                placement: 'bottom',
                items: [
                    {
                        id: 'job-queue',
                        title: 'Job Queue',
                        url: '/job-queue',
                    },
                    {
                        id: 'healthchecks',
                        title: 'Healthchecks',
                        url: '/healthchecks',
                    },
                    {
                        id: 'scheduled-tasks',
                        title: 'Scheduled Tasks',
                        url: '/scheduled-tasks',
                    },
                ],
            },
            {
                id: 'settings',
                title: 'Settings',
                icon: Settings2,
                defaultOpen: false,
                placement: 'bottom',
                items: [
                    {
                        id: 'sellers',
                        title: 'Sellers',
                        url: '/sellers',
                    },
                    {
                        id: 'channels',
                        title: 'Channels',
                        url: '/channels',
                    },
                    {
                        id: 'stock-locations',
                        title: 'Stock Locations',
                        url: '/stock-locations',
                    },
                    {
                        id: 'administrators',
                        title: 'Administrators',
                        url: '/administrators',
                    },
                    {
                        id: 'roles',
                        title: 'Roles',
                        url: '/roles',
                    },
                    {
                        id: 'shipping-methods',
                        title: 'Shipping Methods',
                        url: '/shipping-methods',
                    },
                    {
                        id: 'payment-methods',
                        title: 'Payment Methods',
                        url: '/payment-methods',
                    },
                    {
                        id: 'tax-categories',
                        title: 'Tax Categories',
                        url: '/tax-categories',
                    },
                    {
                        id: 'tax-rates',
                        title: 'Tax Rates',
                        url: '/tax-rates',
                    },
                    {
                        id: 'countries',
                        title: 'Countries',
                        url: '/countries',
                    },
                    {
                        id: 'zones',
                        title: 'Zones',
                        url: '/zones',
                    },
                    {
                        id: 'global-settings',
                        title: 'Global Settings',
                        url: '/global-settings',
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
