import { NavMain } from '@/components/layout/nav-main.js';
import { NavUser } from '@/components/layout/nav-user.js';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar.js';
import { getNavMenuConfig } from '@/framework/nav-menu/nav-menu-extensions.js';
import { useDashboardExtensions } from '@/framework/extension-api/use-dashboard-extensions.js';
import * as React from 'react';
import { ChannelSwitcher } from './channel-switcher.js';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { extensionsLoaded } = useDashboardExtensions();
    const { sections } = getNavMenuConfig();
    return (
        extensionsLoaded && (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <ChannelSwitcher />
                </SidebarHeader>
                <SidebarContent className="flex flex-col h-full overflow-y-auto">
                    <NavMain items={sections} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    );
}
