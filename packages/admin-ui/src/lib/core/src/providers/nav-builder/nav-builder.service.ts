import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Permission } from '../../common/generated-types';

import {
    ActionBarItem,
    NavMenuBadgeType,
    NavMenuItem,
    NavMenuSection,
    RouterLinkDefinition,
} from './nav-builder-types';

/**
 * @description
 * Add a section to the main nav menu. Providing the `before` argument will
 * move the section before any existing section with the specified id. If
 * omitted (or if the id is not found) the section will be appended to the
 * existing set of sections.
 * This should be used in the NgModule `providers` array of your ui extension module.
 *
 * @example
 * ```TypeScript
 * \@NgModule({
 *   imports: [SharedModule],
 *   providers: [
 *     addNavMenuSection({
 *       id: 'reports',
 *       label: 'Reports',
 *       items: [{
 *           // ...
 *       }],
 *     },
 *     'settings'),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ```
 * @docsCategory nav-menu
 */
export function addNavMenuSection(config: NavMenuSection, before?: string): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (navBuilderService: NavBuilderService) => () => {
            navBuilderService.addNavMenuSection(config, before);
        },
        deps: [NavBuilderService],
    };
}

/**
 * @description
 * Add a menu item to an existing section specified by `sectionId`. The id of the section
 * can be found by inspecting the DOM and finding the `data-section-id` attribute.
 * Providing the `before` argument will move the item before any existing item with the specified id.
 * If omitted (or if the name is not found) the item will be appended to the
 * end of the section.
 *
 * This should be used in the NgModule `providers` array of your ui extension module.
 *
 * @example
 * ```TypeScript
 * \@NgModule({
 *   imports: [SharedModule],
 *   providers: [
 *     addNavMenuItem({
 *       id: 'reviews',
 *       label: 'Product Reviews',
 *       routerLink: ['/extensions/reviews'],
 *       icon: 'star',
 *     },
 *     'marketing'),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ``
 *
 * @docsCategory nav-menu
 */
export function addNavMenuItem(config: NavMenuItem, sectionId: string, before?: string): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (navBuilderService: NavBuilderService) => () => {
            navBuilderService.addNavMenuItem(config, sectionId, before);
        },
        deps: [NavBuilderService],
    };
}

/**
 * @description
 * Adds a button to the ActionBar at the top right of each list or detail view. The locationId can
 * be determined by inspecting the DOM and finding the <vdr-action-bar> element and its
 * `data-location-id` attribute.
 *
 * This should be used in the NgModule `providers` array of your ui extension module.
 *
 * @example
 * ```TypeScript
 * \@NgModule({
 *   imports: [SharedModule],
 *   providers: [
 *     addActionBarItem({
 *      id: 'print-invoice'
 *      label: 'Print Invoice',
 *      locationId: 'order-detail',
 *      routerLink: ['/extensions/invoicing'],
 *     }),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ```
 * @docsCategory action-bar
 */
export function addActionBarItem(config: ActionBarItem): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (navBuilderService: NavBuilderService) => () => {
            navBuilderService.addActionBarItem(config);
        },
        deps: [NavBuilderService],
    };
}

/**
 * This service is used to define the contents of configurable menus in the application.
 */
@Injectable({
    providedIn: 'root',
})
export class NavBuilderService {
    menuConfig$: Observable<NavMenuSection[]>;
    actionBarConfig$: Observable<ActionBarItem[]>;
    sectionBadges: { [sectionId: string]: Observable<NavMenuBadgeType> } = {};

    private initialNavMenuConfig$ = new BehaviorSubject<NavMenuSection[]>([]);
    private addedNavMenuSections: Array<{ config: NavMenuSection; before?: string }> = [];
    private addedNavMenuItems: Array<{
        config: NavMenuItem;
        sectionId: string;
        before?: string;
    }> = [];
    private addedActionBarItems: ActionBarItem[] = [];

    constructor() {
        this.setupStreams();
    }

    /**
     * Used to define the initial sections and items of the main nav menu.
     */
    defineNavMenuSections(config: NavMenuSection[]) {
        this.initialNavMenuConfig$.next(config);
    }

    /**
     * Add a section to the main nav menu. Providing the `before` argument will
     * move the section before any existing section with the specified id. If
     * omitted (or if the id is not found) the section will be appended to the
     * existing set of sections.
     *
     * Providing the `id` of an existing section will replace that section.
     */
    addNavMenuSection(config: NavMenuSection, before?: string) {
        this.addedNavMenuSections.push({ config, before });
    }

    /**
     * Add a menu item to an existing section specified by `sectionId`. The id of the section
     * can be found by inspecting the DOM and finding the `data-section-id` attribute.
     * Providing the `before` argument will move the item before any existing item with the specified id.
     * If omitted (or if the name is not found) the item will be appended to the
     * end of the section.
     *
     * Providing the `id` of an existing item in that section will replace
     * that item.
     */
    addNavMenuItem(config: NavMenuItem, sectionId: string, before?: string) {
        this.addedNavMenuItems.push({ config, sectionId, before });
    }

    /**
     * Adds a button to the ActionBar at the top right of each list or detail view. The locationId can
     * be determined by inspecting the DOM and finding the <vdr-action-bar> element and its
     * `data-location-id` attribute.
     */
    addActionBarItem(config: ActionBarItem) {
        this.addedActionBarItems.push({
            requiresPermission: Permission.Authenticated,
            ...config,
        });
    }

    getRouterLink(config: { routerLink?: RouterLinkDefinition }, route: ActivatedRoute): string[] | null {
        if (typeof config.routerLink === 'function') {
            return config.routerLink(route);
        }
        if (Array.isArray(config.routerLink)) {
            return config.routerLink;
        }
        return null;
    }

    private setupStreams() {
        const sectionAdditions$ = of(this.addedNavMenuSections);
        const itemAdditions$ = of(this.addedNavMenuItems);

        const combinedConfig$ = combineLatest(this.initialNavMenuConfig$, sectionAdditions$).pipe(
            map(([initialConfig, additions]) => {
                for (const { config, before } of additions) {
                    if (!config.requiresPermission) {
                        config.requiresPermission = Permission.Authenticated;
                    }
                    const existingIndex = initialConfig.findIndex(c => c.id === config.id);
                    if (-1 < existingIndex) {
                        initialConfig[existingIndex] = config;
                    }
                    const beforeIndex = initialConfig.findIndex(c => c.id === before);
                    if (-1 < beforeIndex) {
                        if (-1 < existingIndex) {
                            initialConfig.splice(existingIndex, 1);
                        }
                        initialConfig.splice(beforeIndex, 0, config);
                    } else if (existingIndex === -1) {
                        initialConfig.push(config);
                    }
                }
                return initialConfig;
            }),
            shareReplay(1),
        );

        this.menuConfig$ = combineLatest(combinedConfig$, itemAdditions$).pipe(
            map(([sections, additionalItems]) => {
                for (const item of additionalItems) {
                    const section = sections.find(s => s.id === item.sectionId);
                    if (!section) {
                        // eslint-disable-next-line no-console
                        console.error(
                            `Could not add menu item "${item.config.id}", section "${item.sectionId}" does not exist`,
                        );
                    } else {
                        const { config, sectionId, before } = item;
                        const existingIndex = section.items.findIndex(i => i.id === config.id);
                        if (-1 < existingIndex) {
                            section.items[existingIndex] = config;
                        }
                        const beforeIndex = section.items.findIndex(i => i.id === before);
                        if (-1 < beforeIndex) {
                            if (-1 < existingIndex) {
                                section.items.splice(existingIndex, 1);
                            }
                            section.items.splice(beforeIndex, 0, config);
                        } else if (existingIndex === -1) {
                            section.items.push(config);
                        }
                    }
                }

                // Aggregate any badges defined for the nav items in each section
                for (const section of sections) {
                    const itemBadgeStatuses = section.items
                        .map(i => i.statusBadge)
                        .filter(notNullOrUndefined);
                    this.sectionBadges[section.id] = combineLatest(itemBadgeStatuses).pipe(
                        map(badges => {
                            const propagatingBadges = badges.filter(b => b.propagateToSection);
                            if (propagatingBadges.length === 0) {
                                return 'none';
                            }
                            const statuses = propagatingBadges.map(b => b.type);
                            if (statuses.includes('error')) {
                                return 'error';
                            } else if (statuses.includes('warning')) {
                                return 'warning';
                            } else if (statuses.includes('info')) {
                                return 'info';
                            } else {
                                return 'none';
                            }
                        }),
                    );
                }

                return sections;
            }),
        );

        this.actionBarConfig$ = of(this.addedActionBarItems);
    }
}
