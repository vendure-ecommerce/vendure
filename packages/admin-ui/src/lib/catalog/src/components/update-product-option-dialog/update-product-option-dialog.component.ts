import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    CustomFieldConfig,
    LanguageCode,
    ProductVariant,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { createUpdatedTranslatable } from '@vendure/admin-ui/core';
import { Dialog } from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';

@Component({
    selector: 'vdr-update-product-option-dialog',
    templateUrl: './update-product-option-dialog.component.html',
    styleUrls: ['./update-product-option-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProductOptionDialogComponent
    implements Dialog<UpdateProductOptionInput & { autoUpdate: boolean }>, OnInit {
    resolveWith: (result?: UpdateProductOptionInput & { autoUpdate: boolean }) => void;
    updateVariantName = true;
    // Provided by caller
    productOption: ProductVariant.Options;
    activeLanguage: LanguageCode;
    name: string;
    code: string;
    customFields: CustomFieldConfig[];
    codeInputTouched = false;
    customFieldsForm: FormGroup;

    ngOnInit(): void {
        const currentTranslation = this.productOption.translations.find(
            t => t.languageCode === this.activeLanguage,
        );
        this.name = currentTranslation?.name ?? '';
        this.code = this.productOption.code;
        this.customFieldsForm = new FormGroup({});
        if (this.customFields) {
            const cfCurrentTranslation =
                (currentTranslation && (currentTranslation as any).customFields) || {};

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value =
                    fieldDef.type === 'localeString'
                        ? cfCurrentTranslation[key]
                        : (this.productOption as any).customFields[key];
                this.customFieldsForm.addControl(fieldDef.name, new FormControl(value));
            }
        }
    }

    update() {
        const result = createUpdatedTranslatable({
            translatable: this.productOption,
            languageCode: this.activeLanguage,
            updatedFields: {
                code: this.code,
                name: this.name,
                customFields: this.customFieldsForm.value,
            },
            customFieldConfig: this.customFields,
            defaultTranslation: {
                languageCode: this.activeLanguage,
                name: '',
            },
        });
        this.resolveWith({ ...result, autoUpdate: this.updateVariantName });
    }

    cancel() {
        this.resolveWith();
    }

    updateCode(nameValue: string) {
        if (!this.codeInputTouched && !this.productOption.code) {
            this.code = normalizeString(nameValue, '-');
        }
    }
}
