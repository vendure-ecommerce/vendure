import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { getNavMenuConfig } from '@/framework/internal/nav-menu/nav-menu.js';
import { useDashboardExtensions } from '@/framework/internal/extension-api/use-dashboard-extensions.js';
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
                    <NavProjects projects={data.projects} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={data.user} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    );
}
