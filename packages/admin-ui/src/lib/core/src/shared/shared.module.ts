import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import '@webcomponents/custom-elements/custom-elements.min.js';
import { NgxPaginationModule } from 'ngx-pagination';

import { ModalService } from '../providers/modal/modal.service';

import { ActionBarItemsComponent } from './components/action-bar-items/action-bar-items.component';
import {
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
} from './components/action-bar/action-bar.component';
import { AffixedInputComponent } from './components/affixed-input/affixed-input.component';
import { PercentageSuffixInputComponent } from './components/affixed-input/percentage-suffix-input.component';
import { AssetFileInputComponent } from './components/asset-file-input/asset-file-input.component';
import { AssetGalleryComponent } from './components/asset-gallery/asset-gallery.component';
import { AssetPickerDialogComponent } from './components/asset-picker-dialog/asset-picker-dialog.component';
import { AssetPreviewDialogComponent } from './components/asset-preview-dialog/asset-preview-dialog.component';
import { AssetPreviewComponent } from './components/asset-preview/asset-preview.component';
import { ChannelAssignmentControlComponent } from './components/channel-assignment-control/channel-assignment-control.component';
import { ChannelBadgeComponent } from './components/channel-badge/channel-badge.component';
import { ChipComponent } from './components/chip/chip.component';
import { ConfigurableInputComponent } from './components/configurable-input/configurable-input.component';
import { CurrencyInputComponent } from './components/currency-input/currency-input.component';
import { CustomFieldControlComponent } from './components/custom-field-control/custom-field-control.component';
import { CustomerLabelComponent } from './components/customer-label/customer-label.component';
import { DataTableColumnComponent } from './components/data-table/data-table-column.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DatetimePickerComponent } from './components/datetime-picker/datetime-picker.component';
import { DropdownItemDirective } from './components/dropdown/dropdown-item.directive';
import { DropdownMenuComponent } from './components/dropdown/dropdown-menu.component';
import { DropdownTriggerDirective } from './components/dropdown/dropdown-trigger.directive';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { EntityInfoComponent } from './components/entity-info/entity-info.component';
import { ExtensionHostComponent } from './components/extension-host/extension-host.component';
import { FacetValueChipComponent } from './components/facet-value-chip/facet-value-chip.component';
import { FacetValueSelectorComponent } from './components/facet-value-selector/facet-value-selector.component';
import { FocalPointControlComponent } from './components/focal-point-control/focal-point-control.component';
import { FormFieldControlDirective } from './components/form-field/form-field-control.directive';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormItemComponent } from './components/form-item/form-item.component';
import { FormattedAddressComponent } from './components/formatted-address/formatted-address.component';
import { ItemsPerPageControlsComponent } from './components/items-per-page-controls/items-per-page-controls.component';
import { LabeledDataComponent } from './components/labeled-data/labeled-data.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DialogButtonsDirective } from './components/modal-dialog/dialog-buttons.directive';
import { DialogComponentOutletComponent } from './components/modal-dialog/dialog-component-outlet.component';
import { DialogTitleDirective } from './components/modal-dialog/dialog-title.directive';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { ObjectTreeComponent } from './components/object-tree/object-tree.component';
import { OrderStateLabelComponent } from './components/order-state-label/order-state-label.component';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { ExternalImageDialogComponent } from './components/rich-text-editor/external-image-dialog/external-image-dialog.component';
import { LinkDialogComponent } from './components/rich-text-editor/link-dialog/link-dialog.component';
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';
import { SelectToggleComponent } from './components/select-toggle/select-toggle.component';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { TableRowActionComponent } from './components/table-row-action/table-row-action.component';
import { TitleInputComponent } from './components/title-input/title-input.component';
import { DisabledDirective } from './directives/disabled.directive';
import { IfDefaultChannelActiveDirective } from './directives/if-default-channel-active.directive';
import { IfMultichannelDirective } from './directives/if-multichannel.directive';
import { IfPermissionsDirective } from './directives/if-permissions.directive';
import { AssetPreviewPipe } from './pipes/asset-preview.pipe';
import { ChannelLabelPipe } from './pipes/channel-label.pipe';
import { CurrencyNamePipe } from './pipes/currency-name.pipe';
import { CustomFieldLabelPipe } from './pipes/custom-field-label.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { HasPermissionPipe } from './pipes/has-permission.pipe';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { StringToColorPipe } from './pipes/string-to-color.pipe';
import { CanDeactivateDetailGuard } from './providers/routing/can-deactivate-detail-guard';

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
    DragDropModule,
];

const DECLARATIONS = [
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
    AssetPreviewComponent,
    AssetPreviewDialogComponent,
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
    IfMultichannelDirective,
    HasPermissionPipe,
    ActionBarItemsComponent,
    DisabledDirective,
    AssetFileInputComponent,
    AssetGalleryComponent,
    AssetPickerDialogComponent,
    EntityInfoComponent,
    DatetimePickerComponent,
    ChannelBadgeComponent,
    ChannelAssignmentControlComponent,
    ChannelLabelPipe,
    IfDefaultChannelActiveDirective,
    ExtensionHostComponent,
    CustomFieldLabelPipe,
    FocalPointControlComponent,
    AssetPreviewPipe,
    LinkDialogComponent,
    ExternalImageDialogComponent,
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
