import {
    alwaysVisible,
    registerQuickAction,
    visibleOnDetailPages,
    visibleOnListPages,
} from '@/vdb/components/global-search/quick-actions-registry.js';
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
                    },
                    {
                        id: 'product-variants',
                        title: 'Product Variants',
                        url: '/product-variants',
                        order: 200,
                    },
                    {
                        id: 'facets',
                        title: 'Facets',
                        url: '/facets',
                        order: 300,
                    },
                    {
                        id: 'collections',
                        title: 'Collections',
                        url: '/collections',
                        order: 400,
                    },
                    {
                        id: 'assets',
                        title: 'Assets',
                        url: '/assets',
                        order: 500,
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
                    },
                    {
                        id: 'customer-groups',
                        title: 'Customer Groups',
                        url: '/customer-groups',
                        order: 200,
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
                    },
                    {
                        id: 'healthchecks',
                        title: 'Healthchecks',
                        url: '/healthchecks',
                        order: 200,
                    },
                    {
                        id: 'scheduled-tasks',
                        title: 'Scheduled Tasks',
                        url: '/scheduled-tasks',
                        order: 300,
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
                    },
                    {
                        id: 'channels',
                        title: 'Channels',
                        url: '/channels',
                        order: 200,
                    },
                    {
                        id: 'stock-locations',
                        title: 'Stock Locations',
                        url: '/stock-locations',
                        order: 300,
                    },
                    {
                        id: 'administrators',
                        title: 'Administrators',
                        url: '/administrators',
                        order: 400,
                    },
                    {
                        id: 'roles',
                        title: 'Roles',
                        url: '/roles',
                        order: 500,
                    },
                    {
                        id: 'shipping-methods',
                        title: 'Shipping Methods',
                        url: '/shipping-methods',
                        order: 600,
                    },
                    {
                        id: 'payment-methods',
                        title: 'Payment Methods',
                        url: '/payment-methods',
                        order: 700,
                    },
                    {
                        id: 'tax-categories',
                        title: 'Tax Categories',
                        url: '/tax-categories',
                        order: 800,
                    },
                    {
                        id: 'tax-rates',
                        title: 'Tax Rates',
                        url: '/tax-rates',
                        order: 900,
                    },
                    {
                        id: 'countries',
                        title: 'Countries',
                        url: '/countries',
                        order: 1000,
                    },
                    {
                        id: 'zones',
                        title: 'Zones',
                        url: '/zones',
                        order: 1100,
                    },
                    {
                        id: 'global-settings',
                        title: 'Global Settings',
                        url: '/global-settings',
                        order: 1200,
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

    // Register default quick actions
    registerDefaultQuickActions();
}

function registerDefaultQuickActions() {
    // Global actions - always visible
    registerQuickAction({
        id: 'create-product',
        label: 'Create New Product',
        description: 'Create a new product',
        icon: 'plus',
        shortcut: 'ctrl+shift+p',
        visible: alwaysVisible,
        requiredPermissions: ['CreateProduct', 'CreateCatalog'],
        handler: context => context.navigate('/products/new'),
    });

    registerQuickAction({
        id: 'create-customer',
        label: 'Create New Customer',
        description: 'Create a new customer',
        icon: 'user-plus',
        shortcut: 'ctrl+shift+c',
        visible: alwaysVisible,
        requiredPermissions: ['CreateCustomer'],
        handler: context => context.navigate('/customers/new'),
    });

    registerQuickAction({
        id: 'create-order',
        label: 'Create New Order',
        description: 'Create a new order',
        icon: 'shopping-cart',
        shortcut: 'ctrl+shift+o',
        visible: alwaysVisible,
        requiredPermissions: ['CreateOrder'],
        handler: context => context.navigate('/orders/new'),
    });

    registerQuickAction({
        id: 'go-to-products',
        label: 'Go to Products',
        description: 'Navigate to products list',
        icon: 'package',
        visible: alwaysVisible,
        handler: context => context.navigate('/products'),
    });

    registerQuickAction({
        id: 'go-to-orders',
        label: 'Go to Orders',
        description: 'Navigate to orders list',
        icon: 'shopping-cart',
        visible: alwaysVisible,
        handler: context => context.navigate('/orders'),
    });

    registerQuickAction({
        id: 'go-to-customers',
        label: 'Go to Customers',
        description: 'Navigate to customers list',
        icon: 'users',
        visible: alwaysVisible,
        handler: context => context.navigate('/customers'),
    });

    // Product list actions
    registerQuickAction({
        id: 'export-products',
        label: 'Export Products',
        description: 'Export products to CSV',
        icon: 'download',
        shortcut: 'ctrl+e',
        visible: visibleOnListPages('products'),
        handler: async context => {
            context.showNotification('Product export started', 'success');
        },
    });

    registerQuickAction({
        id: 'import-products',
        label: 'Import Products',
        description: 'Import products from CSV',
        icon: 'upload',
        shortcut: 'ctrl+i',
        visible: visibleOnListPages('products'),
        requiredPermissions: ['CreateProduct', 'UpdateProduct'],
        handler: context => {
            context.navigate('/products/import');
        },
    });

    registerQuickAction({
        id: 'refresh-products',
        label: 'Refresh Products',
        description: 'Reload the products list',
        icon: 'refresh-cw',
        shortcut: 'ctrl+r',
        visible: visibleOnListPages('products'),
        handler: async context => {
            context.showNotification('Products list refreshed', 'success');
            // In real implementation, this would trigger a refetch
        },
    });

    // Product detail actions
    registerQuickAction({
        id: 'duplicate-product',
        label: 'Duplicate Product',
        description: 'Create a copy of this product',
        icon: 'copy',
        shortcut: 'ctrl+d',
        visible: visibleOnDetailPages('products'),
        requiredPermissions: ['CreateProduct'],
        handler: async context => {
            const confirmed = await context.confirm('Duplicate this product?');
            if (confirmed) {
                context.showNotification('Product duplicated successfully');
                // In real implementation, this would duplicate the product
            }
        },
    });

    registerQuickAction({
        id: 'add-product-variant',
        label: 'Add Variant',
        description: 'Add a new variant to this product',
        icon: 'plus-square',
        shortcut: 'ctrl+shift+v',
        visible: visibleOnDetailPages('products'),
        requiredPermissions: ['CreateProduct', 'UpdateProduct'],
        handler: context => {
            const entityId = context.currentEntityId;
            if (entityId) {
                context.navigate(`/products/${entityId}/variants/create`);
            }
        },
    });

    registerQuickAction({
        id: 'delete-product',
        label: 'Delete Product',
        description: 'Delete this product permanently',
        icon: 'trash',
        shortcut: 'ctrl+shift+delete',
        visible: visibleOnDetailPages('products'),
        requiredPermissions: ['DeleteProduct'],
        handler: async context => {
            const confirmed = await context.confirm(
                'Are you sure you want to delete this product? This action cannot be undone.',
            );
            if (confirmed) {
                context.showNotification('Product deleted', 'success');
                context.navigate('/products');
            }
        },
    });

    // Customer list actions
    registerQuickAction({
        id: 'export-customers',
        label: 'Export Customers',
        description: 'Export customers to CSV',
        icon: 'download',
        shortcut: 'ctrl+e',
        visible: visibleOnListPages('customers'),
        handler: async context => {
            context.showNotification('Customer export started', 'success');
        },
    });

    // Customer detail actions
    registerQuickAction({
        id: 'view-customer-orders',
        label: 'View Customer Orders',
        description: 'View orders for this customer',
        icon: 'shopping-cart',
        visible: visibleOnDetailPages('customers'),
        handler: context => {
            const entityId = context.currentEntityId;
            if (entityId) {
                context.navigate(`/customers/${entityId}/orders`);
            }
        },
    });

    // Order list actions
    registerQuickAction({
        id: 'export-orders',
        label: 'Export Orders',
        description: 'Export orders to CSV',
        icon: 'download',
        shortcut: 'ctrl+e',
        visible: visibleOnListPages('orders'),
        handler: async context => {
            context.showNotification('Order export started', 'success');
        },
    });

    // Order detail actions
    registerQuickAction({
        id: 'fulfill-order',
        label: 'Fulfill Order',
        description: 'Fulfill this order',
        icon: 'truck',
        shortcut: 'ctrl+f',
        visible: visibleOnDetailPages('orders'),
        requiredPermissions: ['UpdateOrder'],
        handler: context => {
            const entityId = context.currentEntityId;
            if (entityId) {
                context.navigate(`/orders/${entityId}/fulfill`);
            }
        },
    });

    registerQuickAction({
        id: 'cancel-order',
        label: 'Cancel Order',
        description: 'Cancel this order',
        icon: 'x-circle',
        shortcut: 'ctrl+shift+x',
        visible: visibleOnDetailPages('orders'),
        requiredPermissions: ['UpdateOrder'],
        handler: async context => {
            const confirmed = await context.confirm('Are you sure you want to cancel this order?');
            if (confirmed) {
                context.showNotification('Order cancelled', 'success');
            }
        },
    });

    // Navigation actions
    registerQuickAction({
        id: 'go-to-profile',
        label: 'Go to Profile',
        description: 'Navigate to user profile',
        icon: 'user',
        visible: alwaysVisible,
        handler: context => context.navigate('/profile'),
    });

    registerQuickAction({
        id: 'manage-facets',
        label: 'Manage Facets',
        description: 'Navigate to facet management',
        icon: 'tags',
        visible: visibleOnListPages('products'),
        handler: context => context.navigate('/facets'),
    });

    registerQuickAction({
        id: 'manage-collections',
        label: 'Manage Collections',
        description: 'Navigate to collection management',
        icon: 'folder',
        visible: visibleOnListPages('products'),
        handler: context => context.navigate('/collections'),
    });
}
