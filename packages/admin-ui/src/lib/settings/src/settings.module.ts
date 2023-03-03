import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { AddCountryToZoneDialogComponent } from './components/add-country-to-zone-dialog/add-country-to-zone-dialog.component';
import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { ChannelDetailComponent } from './components/channel-detail/channel-detail.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { GlobalSettingsComponent } from './components/global-settings/global-settings.component';
import { PaymentMethodDetailComponent } from './components/payment-method-detail/payment-method-detail.component';
import { PaymentMethodListComponent } from './components/payment-method-list/payment-method-list.component';
import { PermissionGridComponent } from './components/permission-grid/permission-grid.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { SellerDetailComponent } from './components/seller-detail/seller-detail.component';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { ShippingEligibilityTestResultComponent } from './components/shipping-eligibility-test-result/shipping-eligibility-test-result.component';
import { ShippingMethodDetailComponent } from './components/shipping-method-detail/shipping-method-detail.component';
import { ShippingMethodListComponent } from './components/shipping-method-list/shipping-method-list.component';
import { ShippingMethodTestResultComponent } from './components/shipping-method-test-result/shipping-method-test-result.component';
import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxRateDetailComponent } from './components/tax-rate-detail/tax-rate-detail.component';
import { TaxRateListComponent } from './components/tax-rate-list/tax-rate-list.component';
import { TestAddressFormComponent } from './components/test-address-form/test-address-form.component';
import { TestOrderBuilderComponent } from './components/test-order-builder/test-order-builder.component';
import { ZoneDetailDialogComponent } from './components/zone-detail-dialog/zone-detail-dialog.component';
import { ZoneListComponent } from './components/zone-list/zone-list.component';
import { ZoneMemberControlsDirective } from './components/zone-member-list/zone-member-controls.directive';
import { ZoneMemberListHeaderDirective } from './components/zone-member-list/zone-member-list-header.directive';
import { ZoneMemberListComponent } from './components/zone-member-list/zone-member-list.component';
import { settingsRoutes } from './settings.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(settingsRoutes)],
    declarations: [
        TaxCategoryListComponent,
        TaxCategoryDetailComponent,
        AdministratorListComponent,
        RoleListComponent,
        RoleDetailComponent,
        AdminDetailComponent,
        PermissionGridComponent,
        CountryListComponent,
        CountryDetailComponent,
        TaxRateListComponent,
        TaxRateDetailComponent,
        ChannelListComponent,
        ChannelDetailComponent,
        ShippingMethodListComponent,
        ShippingMethodDetailComponent,
        PaymentMethodListComponent,
        PaymentMethodDetailComponent,
        GlobalSettingsComponent,
        TestOrderBuilderComponent,
        TestAddressFormComponent,
        SellerDetailComponent,
        SellerListComponent,
        ShippingMethodTestResultComponent,
        ShippingEligibilityTestResultComponent,
        ZoneListComponent,
        AddCountryToZoneDialogComponent,
        ZoneMemberListComponent,
        ZoneMemberListHeaderDirective,
        ZoneMemberControlsDirective,
        ZoneDetailDialogComponent,
        ProfileComponent,
    ],
})
export class SettingsModule {}
