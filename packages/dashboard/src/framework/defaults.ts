import { navMenu } from '@/framework/nav-menu/nav-menu.js';
import { BookOpen, Bot, Settings2, ShoppingCart, SquareTerminal, Users, Mail, Terminal } from 'lucide-react';

navMenu({
    sections: [
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
                    id: 'logs',
                    title: 'Logs',
                    url: '/logs',
                },
                {
                    id: 'api-keys',
                    title: 'API Keys',
                    url: '/api-keys',
                },
                {
                    id: 'webhooks',
                    title: 'Webhooks',
                    url: '/webhooks',
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
                    id: 'admin-users',
                    title: 'Admin Users',
                    url: '/admin-users',
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
