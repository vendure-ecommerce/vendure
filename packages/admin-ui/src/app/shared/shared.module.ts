import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

import {
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
} from './components/action-bar/action-bar.component';
import { IfPermissionsDirective } from './directives/if-permissions.directive';
import { ModalService } from './providers/modal/modal.service';
import { CanDeactivateDetailGuard } from './providers/routing/can-deactivate-detail-guard';
import { AffixedInputComponent } from './shared-declarations';
import { PercentageSuffixInputComponent } from './shared-declarations';
import { ChipComponent } from './shared-declarations';
import { ConfigurableInputComponent } from './shared-declarations';
import { CurrencyInputComponent } from './shared-declarations';
import { CustomFieldControlComponent } from './shared-declarations';
import { CustomerLabelComponent } from './shared-declarations';
import { DataTableColumnComponent } from './shared-declarations';
import { DataTableComponent } from './shared-declarations';
import { DropdownItemDirective } from './shared-declarations';
import { DropdownMenuComponent } from './shared-declarations';
import { DropdownTriggerDirective } from './shared-declarations';
import { DropdownComponent } from './shared-declarations';
import { FacetValueChipComponent } from './shared-declarations';
import { FacetValueSelectorComponent } from './shared-declarations';
import { FormFieldControlDirective } from './shared-declarations';
import { FormFieldComponent } from './shared-declarations';
import { FormItemComponent } from './shared-declarations';
import { FormattedAddressComponent } from './shared-declarations';
import { ItemsPerPageControlsComponent } from './shared-declarations';
import { LabeledDataComponent } from './shared-declarations';
import { LanguageSelectorComponent } from './shared-declarations';
import { DialogButtonsDirective } from './shared-declarations';
import { DialogComponentOutletComponent } from './shared-declarations';
import { DialogTitleDirective } from './shared-declarations';
import { ModalDialogComponent } from './shared-declarations';
import { ObjectTreeComponent } from './shared-declarations';
import { OrderStateLabelComponent } from './shared-declarations';
import { PaginationControlsComponent } from './shared-declarations';
import { RichTextEditorComponent } from './shared-declarations';
import { SelectToggleComponent } from './shared-declarations';
import { SimpleDialogComponent } from './shared-declarations';
import { TableRowActionComponent } from './shared-declarations';
import { TitleInputComponent } from './shared-declarations';
import { CurrencyNamePipe } from './shared-declarations';
import { FileSizePipe } from './shared-declarations';
import { SentenceCasePipe } from './shared-declarations';
import { SortPipe } from './shared-declarations';
import { StringToColorPipe } from './shared-declarations';

const IMPORTS = [
    ClarityModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    NgxPaginationModule,
    TranslateModule,
    OverlayModule,
];

const DECLARATIONS = [
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
    ConfigurableInputComponent,
    AffixedInputComponent,
    ChipComponent,
    CurrencyInputComponent,
    CurrencyNamePipe,
    CustomerLabelComponent,
    CustomFieldControlComponent,
    DataTableComponent,
    DataTableColumnComponent,
    FacetValueSelectorComponent,
    ItemsPerPageControlsComponent,
    PaginationControlsComponent,
    TableRowActionComponent,
    FacetValueChipComponent,
    FileSizePipe,
    FormFieldComponent,
    FormFieldControlDirective,
    FormItemComponent,
    ModalDialogComponent,
    PercentageSuffixInputComponent,
    DialogComponentOutletComponent,
    DialogButtonsDirective,
    DialogTitleDirective,
    SelectToggleComponent,
    LanguageSelectorComponent,
    RichTextEditorComponent,
    SimpleDialogComponent,
    TitleInputComponent,
    SentenceCasePipe,
    DropdownComponent,
    DropdownMenuComponent,
    SortPipe,
    DropdownTriggerDirective,
    DropdownItemDirective,
    OrderStateLabelComponent,
    FormattedAddressComponent,
    LabeledDataComponent,
    StringToColorPipe,
    ObjectTreeComponent,
    IfPermissionsDirective,
];

@NgModule({
    imports: IMPORTS,
    exports: [...IMPORTS, ...DECLARATIONS],
    declarations: DECLARATIONS,
    providers: [
        // This needs to be shared, since lazy-loaded
        // modules have their own entryComponents which
        // are unknown to the CoreModule instance of ModalService.
        // See https://github.com/angular/angular/issues/14324#issuecomment-305650763
        ModalService,
        CanDeactivateDetailGuard,
    ],
    entryComponents: [ModalDialogComponent, SimpleDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
