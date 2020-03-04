import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProductVariant, UpdateProductOptionInput } from '@vendure/admin-ui/core';
import { createUpdatedTranslatable } from '@vendure/admin-ui/core';
import { Dialog } from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';

@Component({
    selector: 'vdr-update-product-option-dialog',
    templateUrl: './update-product-option-dialog.component.html',
    styleUrls: ['./update-product-option-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProductOptionDialogComponent implements Dialog<UpdateProductOptionInput>, OnInit {
    resolveWith: (result?: UpdateProductOptionInput) => void;
    // Provided by caller
    productOption: ProductVariant.Options;
    name: string;
    code: string;
    codeInputTouched = false;

    ngOnInit(): void {
        this.name = this.productOption.name;
        this.code = this.productOption.code;
    }

    update() {
        const result = createUpdatedTranslatable({
            translatable: this.productOption,
            languageCode: this.productOption.languageCode,
            updatedFields: {
                code: this.code,
                name: this.name,
            },
        });
        this.resolveWith(result);
    }

    cancel() {
        this.resolveWith();
    }

    updateCode(nameValue: string) {
        if (!this.codeInputTouched) {
            this.code = normalizeString(nameValue, '-');
        }
    }
}
