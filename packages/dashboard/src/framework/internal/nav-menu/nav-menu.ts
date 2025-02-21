import type { LucideIcon } from 'lucide-react';

export interface NavMenuItem {
    title: string;
    id: string;
    icon?: LucideIcon;
    defaultOpen?: boolean;
    items?: Array<{
        id: string;
        title: string;
        url: string;
    }>;
}

export interface NavMenuConfig {
    items: NavMenuItem[];
}

let navMenuConfig: NavMenuConfig = { items: [] };

export function navMenu(config: NavMenuConfig) {
    navMenuConfig = config;
}

export function getNavMenuConfig() {
    return navMenuConfig;
}
