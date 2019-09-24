import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavMenuItem } from '../../providers/nav-builder/nav-builder-types';
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
        public navBuilderService: NavBuilderService,
    ) {}

    ngOnInit(): void {
        this.navBuilderService.defineNavMenuSections([
            {
                requiresPermission: 'ReadCatalog',
                id: 'catalog',
                label: 'nav.catalog',
                items: [
                    {
                        id: 'products',
                        label: 'nav.products',
                        icon: 'library',
                        routerLink: ['/catalog', 'products'],
                    },
                    {
                        id: 'facets',
                        label: 'nav.facets',
                        icon: 'tag',
                        routerLink: ['/catalog', 'facets'],
                    },
                    {
                        id: 'collections',
                        label: 'nav.collections',
                        icon: 'folder-open',
                        routerLink: ['/catalog', 'collections'],
                    },
                    {
                        id: 'assets',
                        label: 'nav.assets',
                        icon: 'image-gallery',
                        routerLink: ['/catalog', 'assets'],
                    },
                ],
            },
            {
                id: 'sales',
                label: 'nav.sales',
                requiresPermission: 'ReadOrder',
                items: [
                    {
                        id: 'orders',
                        label: 'nav.orders',
                        routerLink: ['/orders'],
                        icon: 'shopping-cart',
                    },
                ],
            },
            {
                id: 'customers',
                label: 'nav.customers',
                requiresPermission: 'ReadCustomer',
                items: [
                    {
                        id: 'customers',
                        label: 'nav.customers',
                        routerLink: ['/customer', 'customers'],
                        icon: 'user',
                    },
                ],
            },
            {
                id: 'marketing',
                label: 'nav.marketing',
                requiresPermission: 'ReadPromotion',
                items: [
                    {
                        id: 'promotions',
                        label: 'nav.promotions',
                        routerLink: ['/marketing', 'promotions'],
                        icon: 'asterisk',
                    },
                ],
            },
            {
                id: 'settings',
                label: 'nav.settings',
                requiresPermission: 'ReadSettings',
                collapsible: true,
                collapsedByDefault: true,
                items: [
                    {
                        id: 'channels',
                        label: 'nav.channels',
                        routerLink: ['/settings', 'channels'],
                        icon: 'layers',
                    },
                    {
                        id: 'administrators',
                        label: 'nav.administrators',
                        requiresPermission: 'ReadAdministrator',
                        routerLink: ['/settings', 'administrators'],
                        icon: 'administrator',
                    },
                    {
                        id: 'roles',
                        label: 'nav.roles',
                        requiresPermission: 'ReadAdministrator',
                        routerLink: ['/settings', 'roles'],
                        icon: 'users',
                    },
                    {
                        id: 'shipping-methods',
                        label: 'nav.shipping-methods',
                        routerLink: ['/settings', 'shipping-methods'],
                        icon: 'truck',
                    },
                    {
                        id: 'payment-methods',
                        label: 'nav.payment-methods',
                        routerLink: ['/settings', 'payment-methods'],
                        icon: 'credit-card',
                    },
                    {
                        id: 'tax-categories',
                        label: 'nav.tax-categories',
                        routerLink: ['/settings', 'tax-categories'],
                        icon: 'view-list',
                    },
                    {
                        id: 'tax-rates',
                        label: 'nav.tax-rates',
                        routerLink: ['/settings', 'tax-rates'],
                        icon: 'calculator',
                    },
                    {
                        id: 'countries',
                        label: 'nav.countries',
                        routerLink: ['/settings', 'countries'],
                        icon: 'world',
                    },
                    {
                        id: 'global-settings',
                        label: 'nav.global-settings',
                        routerLink: ['/settings', 'global-settings'],
                        icon: 'cog',
                    },
                ],
            },
        ]);
    }

    getRouterLink(item: NavMenuItem) {
        return this.navBuilderService.getRouterLink(item, this.route);
    }
}
