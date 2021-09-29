import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../../data/providers/data.service';
import { NotificationService } from '../notification/notification.service';

export type NavMenuBadgeType = 'none' | 'info' | 'success' | 'warning' | 'error';

/**
 * A color-coded notification badge which will be displayed by the
 * NavMenuItem's icon.
 */
export interface NavMenuBadge {
    type: NavMenuBadgeType;
    /**
     * If true, the badge will propagate to the NavMenuItem's
     * parent section, displaying a notification badge next
     * to the section name.
     */
    propagateToSection?: boolean;
}

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
    /**
     * Control the display of this item based on the user permissions.
     */
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
    statusBadge?: Observable<NavMenuBadge>;
}

/**
 * A NavMenuSection is a grouping of links in the main
 * (left-hand side) nav bar.
 */
export interface NavMenuSection {
    id: string;
    label: string;
    items: NavMenuItem[];
    /**
     * Control the display of this item based on the user permissions.
     */
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
    collapsible?: boolean;
    collapsedByDefault?: boolean;
}

/**
 * Utilities available to the onClick handler of an ActionBarItem.
 */
export interface OnClickContext {
    route: ActivatedRoute;
    dataService: DataService;
    notificationService: NotificationService;
}

/**
 * A button in the ActionBar area at the top of one of the list or detail views.
 */
export interface ActionBarItem {
    id: string;
    label: string;
    locationId: string;
    disabled?: Observable<boolean>;
    onClick?: (event: MouseEvent, context: OnClickContext) => void;
    routerLink?: RouterLinkDefinition;
    buttonColor?: 'primary' | 'success' | 'warning';
    buttonStyle?: 'solid' | 'outline' | 'link';
    icon?: string;
    requiresPermission?: string;
}

export type RouterLinkDefinition = ((route: ActivatedRoute) => any[]) | any[];
