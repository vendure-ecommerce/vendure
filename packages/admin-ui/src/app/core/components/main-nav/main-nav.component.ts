import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavBuilderService } from '../../providers/nav-builder/nav-builder.service';

@Component({
    selector: 'vdr-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public menuBuilderService: NavBuilderService,
    ) {}

    ngOnInit(): void {
        this.menuBuilderService.defineNavMenuSections([
            {
                requiresPermission: 'ReadCatalog',
                name: 'catalog',
                label: 'nav.catalog',
                items: [
                    {
                        name: 'products',
                        label: 'nav.products',
                        icon: 'library',
                        routerLink: ['/catalog', 'products'],
                    },
                    {
                        name: 'facets',
                        label: 'nav.facets',
                        icon: 'tag',
                        routerLink: ['/catalog', 'facets'],
                    },
                    {
                        name: 'collections',
                        label: 'nav.collections',
                        icon: 'folder-open',
                        routerLink: ['/catalog', 'collections'],
                    },
                    {
                        name: 'assets',
                        label: 'nav.assets',
                        icon: 'image-gallery',
                        routerLink: ['/catalog', 'assets'],
                    },
                ],
            },
            {
                name: 'sales',
                label: 'nav.sales',
                requiresPermission: 'ReadOrder',
                items: [
                    {
                        name: 'orders',
                        label: 'nav.orders',
                        routerLink: ['/orders'],
                        icon: 'shopping-cart',
                    },
                ],
            },
            {
                name: 'customers',
                label: 'nav.customers',
                requiresPermission: 'ReadCustomer',
                items: [
                    {
                        name: 'customers',
                        label: 'nav.customers',
                        routerLink: ['/customer', 'customers'],
                        icon: 'user',
                    },
                ],
            },
            {
                name: 'marketing',
                label: 'nav.marketing',
                requiresPermission: 'ReadPromotion',
                items: [
                    {
                        name: 'promotions',
                        label: 'nav.promotions',
                        routerLink: ['/marketing', 'promotions'],
                        icon: 'asterisk',
                    },
                ],
            },
            {
                name: 'settings',
                label: 'nav.settings',
                requiresPermission: 'ReadSettings',
                collapsible: true,
                collapsedByDefault: true,
                items: [
                    {
                        name: 'channels',
                        label: 'nav.channels',
                        routerLink: ['/settings', 'channels'],
                        icon: 'layers',
                    },
                    {
                        name: 'administrators',
                        label: 'nav.administrators',
                        requiresPermission: 'ReadAdministrator',
                        routerLink: ['/settings', 'administrators'],
                        icon: 'administrator',
                    },
                    {
                        name: 'roles',
                        label: 'nav.roles',
                        requiresPermission: 'ReadAdministrator',
                        routerLink: ['/settings', 'roles'],
                        icon: 'users',
                    },
                    {
                        name: 'shipping-methods',
                        label: 'nav.shipping-methods',
                        routerLink: ['/settings', 'shipping-methods'],
                        icon: 'truck',
                    },
                    {
                        name: 'payment-methods',
                        label: 'nav.payment-methods',
                        routerLink: ['/settings', 'payment-methods'],
                        icon: 'credit-card',
                    },
                    {
                        name: 'tax-categories',
                        label: 'nav.tax-categories',
                        routerLink: ['/settings', 'tax-categories'],
                        icon: 'view-list',
                    },
                    {
                        name: 'tax-rates',
                        label: 'nav.tax-rates',
                        routerLink: ['/settings', 'tax-rates'],
                        icon: 'calculator',
                    },
                    {
                        name: 'countries',
                        label: 'nav.countries',
                        routerLink: ['/settings', 'countries'],
                        icon: 'world',
                    },
                    {
                        name: 'global-settings',
                        label: 'nav.global-settings',
                        routerLink: ['/settings', 'global-settings'],
                        icon: 'cog',
                    },
                ],
            },
        ]);
    }

    /**
     * Work-around for routerLinkActive on links which include queryParams.
     * See https://github.com/angular/angular/issues/13205
     */
    isLinkActive(route: string): boolean {
        return this.router.url.startsWith(route);
    }
}
