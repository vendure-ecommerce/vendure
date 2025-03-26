import type { LucideIcon } from 'lucide-react';

// Define the placement options for navigation sections
export type NavMenuSectionPlacement = 'top' | 'bottom';

export interface NavMenuItem {
    id: string;
    title: React.ReactNode;
    url: string;
}

export interface NavMenuSection {
    title: string;
    id: string;
    icon?: LucideIcon;
    defaultOpen?: boolean;
    items?: NavMenuItem[];
    placement?: NavMenuSectionPlacement;
}

export interface NavMenuConfig {
    sections: NavMenuSection[];
}

let navMenuConfig: NavMenuConfig = { sections: [] };

export function navMenu(config: NavMenuConfig) {
    navMenuConfig = config;
}

export function addNavMenuItem(item: NavMenuItem, sectionId: string) {
    navMenuConfig.sections = [...navMenuConfig.sections];
    const sectionIndex = navMenuConfig.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1) {
        const section = {
            ...navMenuConfig.sections[sectionIndex],
            items: [...(navMenuConfig.sections[sectionIndex]?.items ?? [])],
        };
        const itemIndex = section.items.findIndex(i => i.id === item.id);
        if (itemIndex === -1) {
            section.items.push(item);
            navMenuConfig.sections.splice(sectionIndex, 1, section);
        } else {
            section.items.splice(itemIndex, 1, item);
        }

        navMenuConfig.sections.splice(sectionIndex, 1, section);
    }
}

export function getNavMenuConfig() {
    return navMenuConfig;
}
