import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

import { ActionBarItem, NavMenuItem, NavMenuSection, RouterLinkDefinition } from './nav-builder-types';

/**
 * This service is used to define the contents of configurable menus in the application.
 */
@Injectable()
export class NavBuilderService {
    navMenuConfig$: Observable<NavMenuSection[]>;
    actionBarConfig$: Observable<ActionBarItem[]>;

    private initialNavMenuConfig$ = new BehaviorSubject<NavMenuSection[]>([]);
    private addNavMenuSection$ = new BehaviorSubject<{ config: NavMenuSection; before?: string } | null>(
        null,
    );
    private addNavMenuItem$ = new BehaviorSubject<{
        config: NavMenuItem;
        sectionId: string;
        before?: string;
    } | null>(null);
    private addActionBarItem$ = new BehaviorSubject<ActionBarItem | null>(null);

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
     */
    addNavMenuSection(config: NavMenuSection, before?: string) {
        this.addNavMenuSection$.next({ config, before });
    }

    /**
     * Add a menu item to an existing section specified by `sectionId`. The id of the section
     * can be found by inspecting the DOM and finding the `data-section-id` attribute.
     * Providing the `before` argument will move the item before any existing item with the specified id.
     * If omitted (or if the name is not found) the item will be appended to the
     * end of the section.
     */
    addNavMenuItem(config: NavMenuItem, sectionId: string, before?: string) {
        this.addNavMenuItem$.next({ config, sectionId, before });
    }

    /**
     * Adds a button to the ActionBar at the top right of each list or detail view. The locationId can
     * be determined by inspecting the DOM and finding the <vdr-action-bar> element and its
     * `data-location-id` attribute.
     */
    addActionBarItem(config: ActionBarItem) {
        this.addActionBarItem$.next(config);
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
        const sectionAdditions$ = this.addNavMenuSection$.pipe(
            scan((acc, value) => (value ? [...acc, value] : acc), [] as Array<{
                config: NavMenuSection;
                before?: string;
            }>),
        );

        const itemAdditions$ = this.addNavMenuItem$.pipe(
            scan((acc, value) => (value ? [...acc, value] : acc), [] as Array<{
                config: NavMenuItem;
                sectionId: string;
                before?: string;
            }>),
        );

        const combinedConfig$ = combineLatest(this.initialNavMenuConfig$, sectionAdditions$).pipe(
            map(([initalConfig, additions]) => {
                for (const { config, before } of additions) {
                    const index = initalConfig.findIndex(c => c.id === before);
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
                    const section = sections.find(s => s.id === item.sectionId);
                    if (!section) {
                        // tslint:disable-next-line:no-console
                        console.error(
                            `Could not add menu item "${item.config.id}", section "${item.sectionId}" does not exist`,
                        );
                    } else {
                        const index = section.items.findIndex(i => i.id === item.before);
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

        this.actionBarConfig$ = this.addActionBarItem$.pipe(
            scan((acc, value) => (value ? [...acc, value] : acc), [] as ActionBarItem[]),
        );
    }
}
