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
import { usePermissions } from '@/vdb/hooks/use-permissions.js';
import { Link, useRouter, useRouterState } from '@tanstack/react-router';
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

/**
 * Escapes special regex characters in a string to be used as a literal pattern
 */
function escapeRegexChars(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function NavMain({ items }: Readonly<{ items: Array<NavMenuSection | NavMenuItem> }>) {
    const router = useRouter();
    const routerState = useRouterState();
    const { hasPermissions } = usePermissions();
    const currentPath = routerState.location.pathname;
    const basePath = router.basepath || '';

    // Helper to check if a path is active
    const isPathActive = React.useCallback(
        (itemUrl: string) => {
            // Remove basepath prefix from current path for comparison
            const normalizedCurrentPath = basePath
                ? currentPath.replace(new RegExp(`^${escapeRegexChars(basePath)}`), '')
                : currentPath;

            // Ensure normalized path starts with /
            const cleanPath = normalizedCurrentPath.startsWith('/')
                ? normalizedCurrentPath
                : `/${normalizedCurrentPath}`;

            // Special handling for root path
            if (itemUrl === '/') {
                return cleanPath === '/' || cleanPath === '';
            }

            // For other paths, check exact match or prefix match
            return cleanPath === itemUrl || cleanPath.startsWith(`${itemUrl}/`);
        },
        [currentPath, basePath],
    );

    // Helper to find sections containing active routes
    const findActiveSections = React.useCallback(
        (sections: Array<NavMenuSection | NavMenuItem>) => {
            const activeTopSections = new Set<string>();
            let activeBottomSection: string | null = null;

            for (const section of sections) {
                if ('items' in section && section.items) {
                    const hasActiveItem = section.items.some(item => isPathActive(item.url));
                    if (hasActiveItem) {
                        if (section.placement === 'top') {
                            activeTopSections.add(section.id);
                        } else if (section.placement === 'bottom' && !activeBottomSection) {
                            activeBottomSection = section.id;
                        }
                    }
                }
            }

            return { activeTopSections, activeBottomSection };
        },
        [isPathActive],
    );

    // Initialize state with active sections on mount
    const [openBottomSectionId, setOpenBottomSectionId] = React.useState<string | null>(() => {
        const { activeBottomSection } = findActiveSections(items);
        return activeBottomSection;
    });

    const [openTopSectionIds, setOpenTopSectionIds] = React.useState<Set<string>>(() => {
        const { activeTopSections } = findActiveSections(items);
        return activeTopSections;
    });

    // Helper to check if an item is allowed based on permissions
    const isItemAllowed = React.useCallback(
        (item: NavMenuItem) => {
            if (!item.requiresPermission) {
                return true;
            }
            const permissions = Array.isArray(item.requiresPermission)
                ? item.requiresPermission
                : [item.requiresPermission];
            return hasPermissions(permissions);
        },
        [hasPermissions],
    );

    // Helper to build a sorted list of sections for a given placement, memoized for stability
    const getSortedSections = React.useCallback(
        (placement: NavMenuSectionPlacement) => {
            return items
                .filter(item => item.placement === placement)
                .slice()
                .sort(sortByOrder)
                .map(section => {
                    if ('items' in section) {
                        // Filter items based on permissions
                        const allowedItems = (section.items ?? []).filter(isItemAllowed).sort(sortByOrder);
                        return { ...section, items: allowedItems };
                    }
                    return section;
                })
                .filter(section => {
                    // Drop sections that have no items after permission filtering
                    if ('items' in section) {
                        return section.items && section.items.length > 0;
                    }
                    // For single items, check if they're allowed
                    return isItemAllowed(section as NavMenuItem);
                });
        },
        [items, isItemAllowed],
    );

    const topSections = React.useMemo(() => getSortedSections('top'), [getSortedSections]);
    const bottomSections = React.useMemo(() => getSortedSections('bottom'), [getSortedSections]);

    // Handle top section open/close (only one section open at a time)
    const handleTopSectionToggle = (sectionId: string, isOpen: boolean) => {
        if (isOpen) {
            // When opening a section, close all others
            setOpenTopSectionIds(new Set([sectionId]));
        } else {
            // When closing a section, remove it from the set
            setOpenTopSectionIds(new Set());
        }
    };

    // Handle bottom section open/close
    const handleBottomSectionToggle = (sectionId: string, isOpen: boolean) => {
        if (isOpen) {
            setOpenBottomSectionId(sectionId);
        } else if (openBottomSectionId === sectionId) {
            setOpenBottomSectionId(null);
        }
    };

    // Update open sections when route changes (for client-side navigation)
    React.useEffect(() => {
        const { activeTopSections, activeBottomSection } = findActiveSections(items);

        // Replace open sections with only the active one
        setOpenTopSectionIds(activeTopSections);

        if (activeBottomSection) {
            setOpenBottomSectionId(activeBottomSection);
        }
    }, [currentPath, items, findActiveSections]);

    // Render a top navigation section
    const renderTopSection = (item: NavMenuSection | NavMenuItem) => {
        if ('url' in item) {
            return (
                <NavItemWrapper key={item.title} locationId={item.id} order={item.order} offset={true}>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={item.title} asChild isActive={isPathActive(item.url)}>
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
                    open={openTopSectionIds.has(item.id)}
                    onOpenChange={isOpen => handleTopSectionToggle(item.id, isOpen)}
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
                                                isActive={isPathActive(subItem.url)}
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
                        <SidebarMenuButton tooltip={item.title} asChild isActive={isPathActive(item.url)}>
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
                                                isActive={isPathActive(subItem.url)}
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
            {bottomSections.length ? (
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarMenu>{bottomSections.map(renderBottomSection)}</SidebarMenu>
                </SidebarGroup>
            ) : null}
        </>
    );
}
