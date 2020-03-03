import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';

import { ProductVariant, UpdateProductOptionInput } from '../../../common/generated-types';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { Dialog } from '../../../shared/providers/modal/modal.service';

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
