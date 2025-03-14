import { NavMain } from '@/components/layout/nav-main.js';
import { NavProjects } from '@/components/layout/nav-projects.js';
import { NavUser } from '@/components/layout/nav-user.js';
import { TeamSwitcher } from '@/components/layout/team-switcher.js';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar.js';
import { getNavMenuConfig } from '@/framework/nav-menu/nav-menu.js';
import { useDashboardExtensions } from '@/framework/extension-api/use-dashboard-extensions.js';
import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from 'lucide-react';
import * as React from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { extensionsLoaded } = useDashboardExtensions();
    const data = {
        user: {
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg',
        },
        teams: [
            {
                name: 'Acme Inc',
                logo: GalleryVerticalEnd,
                plan: 'Enterprise',
            },
            {
                name: 'Acme Corp.',
                logo: AudioWaveform,
                plan: 'Startup',
            },
            {
                name: 'Evil Corp.',
                logo: Command,
                plan: 'Free',
            },
        ],
        navMain: getNavMenuConfig().sections,
        projects: [
            {
                name: 'Design Engineering',
                url: '#',
                icon: Frame,
            },
            {
                name: 'Sales & Marketing',
                url: '#',
                icon: PieChart,
            },
            {
                name: 'Travel',
                url: '#',
                icon: Map,
            },
        ],
    };
    return (
        extensionsLoaded && (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <TeamSwitcher teams={data.teams} />
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={data.navMain} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    );
}
