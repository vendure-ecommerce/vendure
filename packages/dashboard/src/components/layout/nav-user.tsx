'use client';

import { useAuth } from '@/providers/auth.js';
import { Route } from '@/routes/_authenticated.js';
import { useRouter } from '@tanstack/react-router';
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Monitor,
    Moon,
    Sparkles,
    Sun,
    SunMoon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu.js';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar.js';
import { useMemo } from 'react';
import { useUserSettings } from '@/providers/user-settings.js';

export function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const navigate = Route.useNavigate();
    const { user, ...auth } = useAuth();
    const { settings, setTheme } = useUserSettings();

    const handleLogout = () => {
        auth.logout(() => {
            router.invalidate().finally(() => {
                navigate({ to: '/login' });
            });
        });
    };

    if (!user) {
        return <></>;
    }

    const avatarFallback = useMemo(() => {
        return user.firstName.charAt(0) + user.lastName.charAt(0);
    }, [user]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.id} alt={user.firstName} />
                                <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.firstName} {user.lastName}
                                </span>
                                <span className="truncate text-xs">{user.emailAddress}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.id} alt={user.firstName} />
                                    <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <span className="truncate text-xs">{user.emailAddress}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Account</DropdownMenuItem>
                            <DropdownMenuItem>Language</DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                            value={settings.theme}
                                            onValueChange={setTheme}
                                        >
                                            <DropdownMenuRadioItem value="light">
                                                <Sun />
                                                Light
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="dark">
                                                <Moon />
                                                Dark
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="system">
                                                <Monitor />
                                                System
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
