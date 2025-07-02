import { useAuth } from '@/vdb/hooks/use-auth.js';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ChevronsUpDown, LogOut, Monitor, Moon, Sparkles, Sun } from 'lucide-react';

// import { Avatar, AvatarFallback, AvatarImage } from '@/vdb/components/ui/avatar.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/vdb/components/ui/sidebar.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Theme } from '@/vdb/providers/theme-provider.js';
import { useMemo } from 'react';
import { Dialog, DialogTrigger } from '../ui/dialog.js';
import { LanguageDialog } from './language-dialog.js';

export function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const navigate = useNavigate();
    const { user, ...auth } = useAuth();
    const { settings, setTheme, setDevMode } = useUserSettings();

    const handleLogout = () => {
        auth.logout().then(() => {
            router.invalidate().finally(() => {
                navigate({ to: '/login' });
            });
        });
    };

    const avatarFallback = useMemo(() => {
        return user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';
    }, [user]);

    if (!user) {
        return <></>;
    }

    const isDevMode = (import.meta as any).env?.MODE === 'development';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                {/* Avatar component temporarily disabled due to https://github.com/radix-ui/primitives/issues/3489
                                    error in published package version */}
                                {/*<Avatar className="h-8 w-8 rounded-lg">*/}
                                {/*    <AvatarImage src={user.id} alt={user.firstName} />*/}
                                {/*    <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>*/}
                                {/*</Avatar>*/}
                                <div className="relative flex rounded-lg border justify-center items-center w-8 h-8">
                                    {avatarFallback}
                                </div>
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
                                    {/*<Avatar className="h-8 w-8 rounded-lg">*/}
                                    {/*    <AvatarImage src={user.id} alt={user.firstName} />*/}
                                    {/*    <AvatarFallback className="rounded-lg">*/}
                                    {/*        {avatarFallback}*/}
                                    {/*    </AvatarFallback>*/}
                                    {/*</Avatar>*/}
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
                                <DropdownMenuItem asChild>
                                    <a href="https://vendure.io/pricing" target="_blank">
                                        <Sparkles />
                                        Explore Enterprise Edition
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link to="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Language</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={settings.theme}
                                                onValueChange={value => setTheme(value as Theme)}
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
                            {isDevMode && (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Dev Mode</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup
                                                value={settings.devMode.toString()}
                                                onValueChange={value => setDevMode(value === 'true')}
                                            >
                                                <DropdownMenuRadioItem value="true">
                                                    <Trans>Enabled</Trans>
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="false">
                                                    <Trans>Disabled</Trans>
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <LanguageDialog />
                </Dialog>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
