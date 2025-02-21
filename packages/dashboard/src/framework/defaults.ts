import { navMenu } from '@/framework/internal/nav-menu/nav-menu.js';
import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react';

navMenu({
    items: [
        {
            id: 'catalog',
            title: 'Catalog',
            icon: SquareTerminal,
            defaultOpen: true,
            items: [
                {
                    id: 'products',
                    title: 'Products',
                    url: '/products',
                },
            ],
        },
        // {
        //     title: 'Models',
        //     url: '#',
        //     icon: Bot,
        //     items: [
        //         {
        //             title: 'Genesis',
        //             url: '#',
        //         },
        //         {
        //             title: 'Explorer',
        //             url: '#',
        //         },
        //         {
        //             title: 'Quantum',
        //             url: '#',
        //         },
        //     ],
        // },
        // {
        //     title: 'Documentation',
        //     url: '#',
        //     icon: BookOpen,
        //     items: [
        //         {
        //             title: 'Introduction',
        //             url: '#',
        //         },
        //         {
        //             title: 'Get Started',
        //             url: '#',
        //         },
        //         {
        //             title: 'Tutorials',
        //             url: '#',
        //         },
        //         {
        //             title: 'Changelog',
        //             url: '#',
        //         },
        //     ],
        // },
        // {
        //     title: 'Settings',
        //     url: '#',
        //     icon: Settings2,
        //     items: [
        //         {
        //             title: 'General',
        //             url: '#',
        //         },
        //         {
        //             title: 'Team',
        //             url: '#',
        //         },
        //         {
        //             title: 'Billing',
        //             url: '#',
        //         },
        //         {
        //             title: 'Limits',
        //             url: '#',
        //         },
        //     ],
        // },
    ],
});
