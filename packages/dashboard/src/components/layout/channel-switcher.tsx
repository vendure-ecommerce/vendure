import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar.js';
import { Trans } from '@lingui/react/macro';
import { useChannel } from '@/providers/channel-provider.js';
import { Link } from '@tanstack/react-router';

export function ChannelSwitcher() {
    const { isMobile } = useSidebar();
    const { channels, activeChannel, selectedChannel, setSelectedChannel } = useChannel();

    // Use the selected channel if available, otherwise fall back to the active channel
    const displayChannel = selectedChannel || activeChannel;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <span className="truncate font-semibold text-xs">
                                    {displayChannel?.defaultCurrencyCode}
                                </span>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{displayChannel?.code}</span>
                                <span className="truncate text-xs">
                                    Default Language: {displayChannel?.defaultLanguageCode}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            <Trans>Channels</Trans>
                        </DropdownMenuLabel>
                        {channels.map((channel, index) => (
                            <DropdownMenuItem
                                key={channel.code}
                                onClick={() => setSelectedChannel(channel.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-xs border">
                                    <span className="truncate font-semibold text-xs">
                                        {channel.defaultCurrencyCode}
                                    </span>
                                </div>
                                {channel.code}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2 cursor-pointer" asChild>
                            <Link to={'/channels/new'}>
                                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                    <Plus className="size-4" />
                                </div>
                                <div className="text-muted-foreground font-medium">Add channel</div>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
