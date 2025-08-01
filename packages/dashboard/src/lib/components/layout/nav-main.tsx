import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/vdb/components/ui/collapsible.js';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/vdb/components/ui/sidebar.js';
import {
    NavMenuItem,
    NavMenuSection,
    NavMenuSectionPlacement,
} from '@/vdb/framework/nav-menu/nav-menu-extensions.js';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import { NavItemWrapper } from './nav-item-wrapper.js';

// Utility to sort items & sections by the optional `order` prop (ascending) and then alphabetically by title
function sortByOrder<T extends { order?: number; title: string }>(a: T, b: T) {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA === orderB) {
        return a.title.localeCompare(b.title);
    }
    return orderA - orderB;
}

export function NavMain({ items }: Readonly<{ items: Array<NavMenuSection | NavMenuItem> }>) {
    const location = useLocation();
    // State to track which bottom section is currently open
    const [openBottomSectionId, setOpenBottomSectionId] = React.useState<string | null>(null);

    // Helper to build a sorted list of sections for a given placement, memoized for stability
    const getSortedSections = React.useCallback(
        (placement: NavMenuSectionPlacement) => {
            return items
                .filter(item => item.placement === placement)
                .slice()
                .sort(sortByOrder)
                .map(section =>
                    'items' in section
                        ? { ...section, items: section.items?.slice().sort(sortByOrder) }
                        : section,
                );
        },
        [items],
    );

    const topSections = React.useMemo(() => getSortedSections('top'), [getSortedSections]);
    const bottomSections = React.useMemo(() => getSortedSections('bottom'), [getSortedSections]);

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
            const matchingItem =
                'items' in section
                    ? section.items?.find(
                          item => currentPath === item.url || currentPath.startsWith(`${item.url}/`),
                      )
                    : null;

            if (matchingItem) {
                setOpenBottomSectionId(section.id);
                return;
            }
        }
    }, [location.pathname, bottomSections]);

    // Render a top navigation section
    const renderTopSection = (item: NavMenuSection | NavMenuItem) => {
        if ('url' in item) {
            return (
                <NavItemWrapper key={item.title} locationId={item.id} order={item.order} offset={true}>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={item.title}
                            asChild
                            isActive={location.pathname === item.url}
                        >
                            <Link to={item.url}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </NavItemWrapper>
            );
        }

        return (
            <NavItemWrapper key={item.title} locationId={item.id} order={item.order} offset={true}>
                <Collapsible asChild defaultOpen={item.defaultOpen} className="group/collapsible">
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
                                    <NavItemWrapper
                                        key={subItem.title}
                                        locationId={subItem.id}
                                        order={subItem.order}
                                        parentLocationId={item.id}
                                    >
                                        <SidebarMenuSubItem>
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
                                    </NavItemWrapper>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </NavItemWrapper>
        );
    };

    // Render a bottom navigation section with controlled open state
    const renderBottomSection = (item: NavMenuSection | NavMenuItem) => {
        if ('url' in item) {
            return (
                <NavItemWrapper key={item.title} locationId={item.id} order={item.order} offset={true}>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={item.title}
                            asChild
                            isActive={location.pathname === item.url}
                        >
                            <Link to={item.url}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </NavItemWrapper>
            );
        }
        return (
            <NavItemWrapper key={item.title} locationId={item.id} order={item.order} offset={true}>
                <Collapsible
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
                                    <NavItemWrapper
                                        key={subItem.title}
                                        locationId={subItem.id}
                                        order={subItem.order}
                                        parentLocationId={item.id}
                                    >
                                        <SidebarMenuSubItem>
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
                                    </NavItemWrapper>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </NavItemWrapper>
        );
    };

    return (
        <>
            {/* Top sections */}
            <SidebarGroup>
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
