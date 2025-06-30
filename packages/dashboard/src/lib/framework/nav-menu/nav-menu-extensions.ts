import type { LucideIcon } from 'lucide-react';

import { globalRegistry } from '../registry/global-registry.js';

// Define the placement options for navigation sections
export type NavMenuSectionPlacement = 'top' | 'bottom';

interface NavMenuBaseItem {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
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

globalRegistry.register('navMenuConfig', { sections: [] });

export function getNavMenuConfig() {
    return globalRegistry.get('navMenuConfig');
}

export function setNavMenuConfig(config: NavMenuConfig) {
    globalRegistry.set('navMenuConfig', oldValue => {
        return Object.assign({}, oldValue, config);
    });
}

export function addNavMenuItem(item: NavMenuItem, sectionId: string) {
    const navMenuConfig = getNavMenuConfig();
    navMenuConfig.sections = [...navMenuConfig.sections];
    const sectionIndex = navMenuConfig.sections.findIndex(
        (s: NavMenuSection | NavMenuItem) => s.id === sectionId,
    );
    if (sectionIndex !== -1) {
        const sectionFromConfig = navMenuConfig.sections[sectionIndex];

        if ('items' in sectionFromConfig) {
            const section = {
                ...sectionFromConfig,
                items: [...(sectionFromConfig.items ?? [])],
            };
            const itemIndex = section.items.findIndex((i: NavMenuItem) => i.id === item.id);
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

export function addNavMenuSection(section: NavMenuSection) {
    const navMenuConfig = getNavMenuConfig();
    navMenuConfig.sections = [...navMenuConfig.sections];
    navMenuConfig.sections.push(section);
}
