import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

/**
 * A NavMenuItem is a menu item in the main (left-hand side) nav
 * bar.
 */
export interface NavMenuItem {
    name: string;
    label: string;
    routerLink: any[];
    icon?: string;
    requiresPermission?: string;
}

/**
 * A NavMenuSection is a grouping of links in the main
 * (left-hand side) nav bar.
 */
export interface NavMenuSection {
    name: string;
    label: string;
    items: NavMenuItem[];
    requiresPermission?: string;
    collapsible?: boolean;
    collapsedByDefault?: boolean;
}

/**
 * This service is used to define the contents of configurable menus in the application.
 */
@Injectable()
export class NavBuilderService {
    navMenuConfig$: Observable<NavMenuSection[]>;

    private initialNavMenuConfig$ = new BehaviorSubject<NavMenuSection[]>([]);
    private addNavMenuSection$ = new BehaviorSubject<{ config: NavMenuSection; before?: string } | null>(
        null,
    );
    private addNavMenuItem$ = new BehaviorSubject<{
        config: NavMenuItem;
        section: string;
        before?: string;
    } | null>(null);

    constructor() {
        const sectionAdditions$ = this.addNavMenuSection$.pipe(
            scan(
                (acc, value) => {
                    return value ? [...acc, value] : acc;
                },
                [] as Array<{ config: NavMenuSection; before?: string }>,
            ),
        );

        const itemAdditions$ = this.addNavMenuItem$.pipe(
            scan(
                (acc, value) => {
                    return value ? [...acc, value] : acc;
                },
                [] as Array<{ config: NavMenuItem; section: string; before?: string }>,
            ),
        );

        const combinedConfig$ = combineLatest(this.initialNavMenuConfig$, sectionAdditions$).pipe(
            map(([initalConfig, additions]) => {
                for (const { config, before } of additions) {
                    const index = initalConfig.findIndex(c => c.name === before);
                    if (-1 < index) {
                        initalConfig.splice(index, 0, config);
                    } else {
                        initalConfig.push(config);
                    }
                }
                return initalConfig;
            }),
            shareReplay(1),
        );

        this.navMenuConfig$ = combineLatest(combinedConfig$, itemAdditions$).pipe(
            map(([sections, additionalItems]) => {
                for (const item of additionalItems) {
                    const section = sections.find(s => s.name === item.section);
                    if (!section) {
                        // tslint:disable-next-line:no-console
                        console.error(
                            `Could not add menu item "${item.config.name}", section "${item.section}" does not exist`,
                        );
                    } else {
                        const index = section.items.findIndex(i => i.name === item.before);
                        if (-1 < index) {
                            section.items.splice(index, 0, item.config);
                        } else {
                            section.items.push(item.config);
                        }
                    }
                }
                return sections;
            }),
        );
    }

    /**
     * Used to define the initial sections and items of the main nav menu.
     */
    defineNavMenuSections(config: NavMenuSection[]) {
        this.initialNavMenuConfig$.next(config);
    }

    /**
     * Add a section to the main nav menu. Providing the `before` argument will
     * move the section before any existing section with the specified name. If
     * omitted (or if the name is not found) the section will be appended to the
     * existing set of sections.
     */
    addNavMenuSection(config: NavMenuSection, before?: string) {
        this.addNavMenuSection$.next({ config, before });
    }

    /**
     * Add a menu item to an existing section specified by `section`. The name of the section
     * can be found by inspecting the DOM and finding the `data-section-name` attribute.
     * Providing the `before` argument will move the item before any existing item with the specified name.
     * If omitted (or if the name is not found) the item will be appended to the
     * end of the section.
     */
    addNavMenuItem(config: NavMenuItem, section: string, before?: string) {
        this.addNavMenuItem$.next({ config, section, before });
    }
}
