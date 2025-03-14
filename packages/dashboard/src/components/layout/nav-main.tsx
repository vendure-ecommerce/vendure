import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.js';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar.js';
import { NavMenuSection } from '@/framework/nav-menu/nav-menu.js';
import { Link, rootRouteId, useLocation, useMatch } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

export function NavMain({ items }: { items: NavMenuSection[] }) {
    const location = useLocation();
    // State to track which bottom section is currently open
    const [openBottomSectionId, setOpenBottomSectionId] = React.useState<string | null>(null);

    // Split sections into top and bottom groups based on placement property
    const topSections = items.filter(item => item.placement !== 'bottom');
    const bottomSections = items.filter(item => item.placement === 'bottom');

    // Handle bottom section open/close
    const handleBottomSectionToggle = (sectionId: string, isOpen: boolean) => {
        if (isOpen) {
            setOpenBottomSectionId(sectionId);
        } else if (openBottomSectionId === sectionId) {
            setOpenBottomSectionId(null);
        }
    };

    // Auto-open the bottom section that contains the current route
    React.useEffect(() => {
        const currentPath = location.pathname;

        // Check if the current path is in any bottom section
        for (const section of bottomSections) {
            const matchingItem = section.items?.find(
                item => currentPath === item.url || currentPath.startsWith(`${item.url}/`),
            );

            if (matchingItem) {
                setOpenBottomSectionId(section.id);
                return;
            }
        }
    }, [location.pathname, bottomSections]);

    // Render a top navigation section
    const renderTopSection = (item: NavMenuSection) => (
        <Collapsible key={item.title} asChild defaultOpen={item.defaultOpen} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={
                                        location.pathname === subItem.url ||
                                        location.pathname.startsWith(`${subItem.url}/`)
                                    }
                                >
                                    <Link to={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );

    // Render a bottom navigation section with controlled open state
    const renderBottomSection = (item: NavMenuSection) => (
        <Collapsible
            key={item.title}
            asChild
            open={openBottomSectionId === item.id}
            onOpenChange={isOpen => handleBottomSectionToggle(item.id, isOpen)}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={
                                        location.pathname === subItem.url ||
                                        location.pathname.startsWith(`${subItem.url}/`)
                                    }
                                >
                                    <Link to={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );

    return (
        <>
            {/* Top sections */}
            <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>{topSections.map(renderTopSection)}</SidebarMenu>
            </SidebarGroup>

            {/* Bottom sections - will be pushed to the bottom by CSS */}
            <SidebarGroup className="mt-auto">
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarMenu>{bottomSections.map(renderBottomSection)}</SidebarMenu>
            </SidebarGroup>
        </>
    );
}
