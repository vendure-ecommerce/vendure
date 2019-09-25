import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * A NavMenuItem is a menu item in the main (left-hand side) nav
 * bar.
 */
export interface NavMenuItem {
    id: string;
    label: string;
    routerLink: RouterLinkDefinition;
    onClick?: (event: MouseEvent) => void;
    icon?: string;
    requiresPermission?: string;
}

/**
 * A NavMenuSection is a grouping of links in the main
 * (left-hand side) nav bar.
 */
export interface NavMenuSection {
    id: string;
    label: string;
    items: NavMenuItem[];
    requiresPermission?: string;
    collapsible?: boolean;
    collapsedByDefault?: boolean;
}

/**
 * A button in the ActionBar area at the top of one of the list or detail views.
 */
export interface ActionBarItem {
    id: string;
    label: string;
    locationId: string;
    disabled?: Observable<boolean>;
    onClick?: (event: MouseEvent, route: ActivatedRoute) => void;
    routerLink?: RouterLinkDefinition;
    buttonColor?: 'primary' | 'success' | 'warning';
    buttonStyle?: 'solid' | 'outline' | 'link';
    icon?: string;
    requiresPermission?: string;
}

export type RouterLinkDefinition = ((route: ActivatedRoute) => any[]) | any[];
