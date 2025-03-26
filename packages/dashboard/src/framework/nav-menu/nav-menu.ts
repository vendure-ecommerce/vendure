import type { LucideIcon } from 'lucide-react';

// Define the placement options for navigation sections
export type NavMenuSectionPlacement = 'top' | 'bottom';

interface NavMenuBaseItem {
    id: string;
    title: string | React.ReactNode;
    icon?: LucideIcon;
    placement?: NavMenuSectionPlacement;
}

export interface NavMenuItem extends NavMenuBaseItem {
    url: string;
}

export interface NavMenuSection extends NavMenuBaseItem {
    defaultOpen?: boolean;
    items?: NavMenuItem[];
}

export interface NavMenuConfig {
    sections: Array<NavMenuSection | NavMenuItem>;
}

let navMenuConfig: NavMenuConfig = { sections: [] };

export function navMenu(config: NavMenuConfig) {
    navMenuConfig = config;
}

export function addNavMenuItem(item: NavMenuItem, sectionId: string) {
    navMenuConfig.sections = [...navMenuConfig.sections];
    const sectionIndex = navMenuConfig.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1) {
        const sectionFromConfig = navMenuConfig.sections[sectionIndex];

        if ('items' in sectionFromConfig) {
            const section = {
                ...sectionFromConfig,
                items: [...(sectionFromConfig.items ?? [])],
            };
            const itemIndex = section.items.findIndex(i => i.id === item.id);
            if (itemIndex === -1) {
                section.items.push(item);
                navMenuConfig.sections.splice(sectionIndex, 1, section);
            } else {
                section.items.splice(itemIndex, 1, item);
                navMenuConfig.sections.splice(sectionIndex, 1, section);
            }
        } else {
            navMenuConfig.sections.splice(sectionIndex, 1, item);
        }
    }
}

export function getNavMenuConfig() {
    return navMenuConfig;
}
