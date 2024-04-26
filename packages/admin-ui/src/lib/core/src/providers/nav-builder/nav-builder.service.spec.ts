/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console */
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavMenuSection } from './nav-builder-types';
import { NavBuilderService } from './nav-builder.service';

describe('NavBuilderService', () => {
    let service: NavBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NavBuilderService);
    });

    it('defineNavMenuSections', async () => {
        service.defineNavMenuSections(getBaseNav());

        const result = await firstValueFrom(service.menuConfig$);
        expect(result).toEqual(getBaseNav());
    });

    describe('addNavMenuSection', () => {
        it('adding new section to end', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuSection({
                id: 'reports',
                label: 'Reports',
                items: [],
            });

            const result = await firstValueFrom(service.menuConfig$);
            expect(result.map(section => section.id)).toEqual(['catalog', 'sales', 'reports']);
        });

        it('adding new section before', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuSection(
                {
                    id: 'reports',
                    label: 'Reports',
                    items: [],
                },
                'sales',
            );

            const result = await firstValueFrom(service.menuConfig$);
            expect(result.map(section => section.id)).toEqual(['catalog', 'reports', 'sales']);
        });

        it('replacing an existing section', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuSection({
                id: 'sales',
                label: 'Custom Sales',
                items: [],
            });

            const result = await firstValueFrom(service.menuConfig$);
            expect(result.map(section => section.id)).toEqual(['catalog', 'sales']);
            expect(result[1].label).toBe('Custom Sales');
        });

        it('replacing and moving', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuSection(
                {
                    id: 'sales',
                    label: 'Custom Sales',
                    items: [],
                },
                'catalog',
            );

            const result = await firstValueFrom(service.menuConfig$);
            expect(result.map(section => section.id)).toEqual(['sales', 'catalog']);
            expect(result[0].label).toBe('Custom Sales');
        });
    });

    describe('addNavMenuItem()', () => {
        it('adding to non-existent section', async () => {
            vi.spyOn(console, 'error');
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuItem(
                {
                    id: 'fulfillments',
                    label: 'Fulfillments',
                    routerLink: ['/extensions', 'fulfillments'],
                },
                'farm-tools',
            );

            await firstValueFrom(service.menuConfig$);
            expect(console.error).toHaveBeenCalledWith(
                'Could not add menu item "fulfillments", section "farm-tools" does not exist',
            );
        });

        it('adding to end of section', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuItem(
                {
                    id: 'fulfillments',
                    label: 'Fulfillments',
                    routerLink: ['/extensions', 'fulfillments'],
                },
                'sales',
            );

            const result = await firstValueFrom(service.menuConfig$);
            const salesSection = result.find(r => r.id === 'sales')!;

            expect(salesSection.items.map(item => item.id)).toEqual(['orders', 'fulfillments']);
        });

        it('adding before existing item', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuItem(
                {
                    id: 'fulfillments',
                    label: 'Fulfillments',
                    routerLink: ['/extensions', 'fulfillments'],
                },
                'sales',
                'orders',
            );

            const result = await firstValueFrom(service.menuConfig$);
            const salesSection = result.find(r => r.id === 'sales')!;

            expect(salesSection.items.map(item => item.id)).toEqual(['fulfillments', 'orders']);
        });

        it('replacing existing item', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuItem(
                {
                    id: 'facets',
                    label: 'Custom Facets',
                    routerLink: ['/custom-facets'],
                },
                'catalog',
            );

            const result = await firstValueFrom(service.menuConfig$);
            const catalogSection = result.find(r => r.id === 'catalog')!;

            expect(catalogSection.items.map(item => item.id)).toEqual(['products', 'facets']);
            expect(catalogSection.items[1].label).toBe('Custom Facets');
        });

        it('replacing existing item and moving', async () => {
            service.defineNavMenuSections(getBaseNav());
            service.addNavMenuItem(
                {
                    id: 'facets',
                    label: 'Custom Facets',
                    routerLink: ['/custom-facets'],
                },
                'catalog',
                'products',
            );

            const result = await firstValueFrom(service.menuConfig$);
            const catalogSection = result.find(r => r.id === 'catalog')!;

            expect(catalogSection.items.map(item => item.id)).toEqual(['facets', 'products']);
            expect(catalogSection.items[0].label).toBe('Custom Facets');
        });
    });

    function getBaseNav(): NavMenuSection[] {
        return [
            {
                id: 'catalog',
                label: 'Catalog',
                items: [
                    {
                        id: 'products',
                        label: 'Products',
                        icon: 'library',
                        routerLink: ['/catalog', 'products'],
                    },
                    {
                        id: 'facets',
                        label: 'Facets',
                        icon: 'tag',
                        routerLink: ['/catalog', 'facets'],
                    },
                ],
            },
            {
                id: 'sales',
                label: 'Sales',
                requiresPermission: 'ReadOrder',
                items: [
                    {
                        id: 'orders',
                        label: 'Orders',
                        routerLink: ['/orders'],
                        icon: 'shopping-cart',
                    },
                ],
            },
        ];
    }
});
