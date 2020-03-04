import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Administrator,
    CanDeactivateDetailGuard,
    Channel,
    Country,
    createResolveData,
    detailBreadcrumb,
    Role,
    ShippingMethod,
    TaxCategory,
    TaxRate,
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
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { ShippingMethodDetailComponent } from './components/shipping-method-detail/shipping-method-detail.component';
import { ShippingMethodListComponent } from './components/shipping-method-list/shipping-method-list.component';
import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxRateDetailComponent } from './components/tax-rate-detail/tax-rate-detail.component';
import { TaxRateListComponent } from './components/tax-rate-list/tax-rate-list.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
import { ChannelResolver } from './providers/routing/channel-resolver';
import { CountryResolver } from './providers/routing/country-resolver';
import { GlobalSettingsResolver } from './providers/routing/global-settings-resolver';
import { PaymentMethodResolver } from './providers/routing/payment-method-resolver';
import { RoleResolver } from './providers/routing/role-resolver';
import { ShippingMethodResolver } from './providers/routing/shipping-method-resolver';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';
import { TaxRateResolver } from './providers/routing/tax-rate-resolver';

export const settingsRoutes: Route[] = [
    {
        path: 'administrators',
        component: AdministratorListComponent,
        data: {
            breadcrumb: _('breadcrumb.administrators'),
        },
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
        component: ChannelListComponent,
        data: {
            breadcrumb: _('breadcrumb.channels'),
        },
    },
    {
        path: 'channels/:id',
        component: ChannelDetailComponent,
        resolve: createResolveData(ChannelResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: { breadcrumb: channelBreadcrumb },
    },
    {
        path: 'roles',
        component: RoleListComponent,
        data: {
            breadcrumb: _('breadcrumb.roles'),
        },
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
        component: TaxCategoryListComponent,
        data: {
            breadcrumb: _('breadcrumb.tax-categories'),
        },
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
        component: TaxRateListComponent,
        data: {
            breadcrumb: _('breadcrumb.tax-rates'),
        },
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
        component: CountryListComponent,
        data: {
            breadcrumb: _('breadcrumb.countries'),
        },
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
        path: 'shipping-methods',
        component: ShippingMethodListComponent,
        data: {
            breadcrumb: _('breadcrumb.shipping-methods'),
        },
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
        component: PaymentMethodListComponent,
        data: {
            breadcrumb: _('breadcrumb.payment-methods'),
        },
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
    return detailBreadcrumb<TaxCategory.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.tax-categories',
        getName: category => category.name,
        route: 'tax-categories',
    });
}

export function taxRateBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<TaxRate.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.tax-rates',
        getName: category => category.name,
        route: 'tax-rates',
    });
}

export function countryBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Country.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.countries',
        getName: promotion => promotion.name,
        route: 'countries',
    });
}

export function shippingMethodBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<ShippingMethod.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.shipping-methods',
        getName: method => method.description,
        route: 'shipping-methods',
    });
}

export function paymentMethodBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<ShippingMethod.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.payment-methods',
        getName: method => method.code,
        route: 'payment-methods',
    });
}
