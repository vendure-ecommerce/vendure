import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Administrator,
    CanDeactivateDetailGuard,
    Channel,
    CountryFragment,
    createResolveData,
    detailBreadcrumb,
    PageComponent,
    PageService,
    PaymentMethodFragment,
    Role,
    Seller,
    ShippingMethodFragment,
    TaxCategoryFragment,
    TaxRateFragment,
} from '@vendure/admin-ui/core';

import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { ChannelDetailComponent } from './components/channel-detail/channel-detail.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { PaymentMethodDetailComponent } from './components/payment-method-detail/payment-method-detail.component';
import { PaymentMethodListComponent } from './components/payment-method-list/payment-method-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { SellerDetailComponent } from './components/seller-detail/seller-detail.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { ShippingMethodDetailComponent } from './components/shipping-method-detail/shipping-method-detail.component';
import { ShippingMethodListComponent } from './components/shipping-method-list/shipping-method-list.component';
import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxRateDetailComponent } from './components/tax-rate-detail/tax-rate-detail.component';
import { TaxRateListComponent } from './components/tax-rate-list/tax-rate-list.component';
import { ZoneListComponent } from './components/zone-list/zone-list.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
import { ChannelResolver } from './providers/routing/channel-resolver';
import { CountryResolver } from './providers/routing/country-resolver';
import { GlobalSettingsResolver } from './providers/routing/global-settings-resolver';
import { PaymentMethodResolver } from './providers/routing/payment-method-resolver';
import { ProfileResolver } from './providers/routing/profile-resolver';
import { RoleResolver } from './providers/routing/role-resolver';
import { SellerResolver } from './providers/routing/seller-resolver';
import { ShippingMethodResolver } from './providers/routing/shipping-method-resolver';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';
import { TaxRateResolver } from './providers/routing/tax-rate-resolver';

export const createRoutes = (pageService: PageService): Route[] => [
    {
        path: 'profile',
        component: ProfileComponent,
        resolve: createResolveData(ProfileResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: _('breadcrumb.profile'),
        },
    },
    {
        path: 'administrators',
        component: PageComponent,
        data: {
            locationId: 'administrator-list',
            breadcrumb: _('breadcrumb.administrators'),
        },
        children: pageService.getPageTabRoutes('administrator-list'),
    },
    {
        path: 'administrators/:id',
        component: AdminDetailComponent,
        resolve: createResolveData(AdministratorResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: { breadcrumb: administratorBreadcrumb },
    },
    {
        path: 'channels',
        component: PageComponent,
        data: {
            locationId: 'channel-list',
            breadcrumb: _('breadcrumb.channels'),
        },
        children: pageService.getPageTabRoutes('channel-list'),
    },
    {
        path: 'channels/:id',
        component: ChannelDetailComponent,
        resolve: createResolveData(ChannelResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: { breadcrumb: channelBreadcrumb },
    },
    {
        path: 'sellers',
        component: PageComponent,
        data: {
            locationId: 'seller-list',
            breadcrumb: _('breadcrumb.sellers'),
        },
        children: pageService.getPageTabRoutes('seller-list'),
    },
    {
        path: 'sellers/:id',
        component: SellerDetailComponent,
        resolve: createResolveData(SellerResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: { breadcrumb: sellerBreadcrumb },
    },
    {
        path: 'roles',
        component: PageComponent,
        data: {
            locationId: 'role-list',
            breadcrumb: _('breadcrumb.roles'),
        },
        children: pageService.getPageTabRoutes('role-list'),
    },
    {
        path: 'roles/:id',
        component: RoleDetailComponent,
        resolve: createResolveData(RoleResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: { breadcrumb: roleBreadcrumb },
    },
    {
        path: 'tax-categories',
        component: PageComponent,
        data: {
            locationId: 'tax-category-list',
            breadcrumb: _('breadcrumb.tax-categories'),
        },
        children: pageService.getPageTabRoutes('tax-category-list'),
    },
    {
        path: 'tax-categories/:id',
        component: TaxCategoryDetailComponent,
        resolve: createResolveData(TaxCategoryResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: taxCategoryBreadcrumb,
        },
    },
    {
        path: 'tax-rates',
        component: PageComponent,
        data: {
            locationId: 'tax-rate-list',
            breadcrumb: _('breadcrumb.tax-rates'),
        },
        children: pageService.getPageTabRoutes('tax-rate-list'),
    },
    {
        path: 'tax-rates/:id',
        component: TaxRateDetailComponent,
        resolve: createResolveData(TaxRateResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: taxRateBreadcrumb,
        },
    },
    {
        path: 'countries',
        component: PageComponent,
        data: {
            locationId: 'country-list',
            breadcrumb: _('breadcrumb.countries'),
        },
        children: pageService.getPageTabRoutes('country-list'),
    },
    {
        path: 'countries/:id',
        component: CountryDetailComponent,
        resolve: createResolveData(CountryResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: countryBreadcrumb,
        },
    },
    {
        path: 'zones',
        component: PageComponent,
        data: {
            locationId: 'zone-list',
            breadcrumb: _('breadcrumb.zones'),
        },
        children: pageService.getPageTabRoutes('zone-list'),
    },
    {
        path: 'shipping-methods',
        component: PageComponent,
        data: {
            locationId: 'shipping-method-list',
            breadcrumb: _('breadcrumb.shipping-methods'),
        },
        children: pageService.getPageTabRoutes('shipping-method-list'),
    },
    {
        path: 'shipping-methods/:id',
        component: ShippingMethodDetailComponent,
        resolve: createResolveData(ShippingMethodResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: shippingMethodBreadcrumb,
        },
    },
    {
        path: 'payment-methods',
        component: PageComponent,
        data: {
            locationId: 'payment-method-list',
            breadcrumb: _('breadcrumb.payment-methods'),
        },
        children: pageService.getPageTabRoutes('payment-method-list'),
    },
    {
        path: 'payment-methods/:id',
        component: PaymentMethodDetailComponent,
        resolve: createResolveData(PaymentMethodResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: paymentMethodBreadcrumb,
        },
    },
    {
        path: 'global-settings',
        component: GlobalSettingsComponent,
        resolve: createResolveData(GlobalSettingsResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: _('breadcrumb.global-settings'),
        },
    },
];

export function administratorBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Administrator>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.administrators',
        getName: admin => `${admin.firstName} ${admin.lastName}`,
        route: 'administrators',
    });
}

export function channelBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Channel>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.channels',
        getName: channel => channel.code,
        route: 'channels',
    });
}

export function sellerBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Seller>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.sellers',
        getName: seller => seller.name,
        route: 'sellers',
    });
}

export function roleBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Role>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.roles',
        getName: role => role.description,
        route: 'roles',
    });
}

export function taxCategoryBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<TaxCategoryFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.tax-categories',
        getName: category => category.name,
        route: 'tax-categories',
    });
}

export function taxRateBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<TaxRateFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.tax-rates',
        getName: category => category.name,
        route: 'tax-rates',
    });
}

export function countryBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<CountryFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.countries',
        getName: promotion => promotion.name,
        route: 'countries',
    });
}

export function shippingMethodBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<ShippingMethodFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.shipping-methods',
        getName: method => method.name,
        route: 'shipping-methods',
    });
}

export function paymentMethodBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<PaymentMethodFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.payment-methods',
        getName: method => method.code,
        route: 'payment-methods',
    });
}
