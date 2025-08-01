import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateProductOptionInput, Dialog, LanguageCode } from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';

@Component({
    selector: 'vdr-create-product-option-dialog',
    templateUrl: './create-product-option-dialog.component.html',
    styleUrls: ['./create-product-option-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class CreateProductOptionDialogComponent implements Dialog<CreateProductOptionInput> {
    resolveWith: (result?: CreateProductOptionInput) => void;
    languageCode: LanguageCode;
    productOptionGroupId: string;
    form = this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
    });

    constructor(private formBuilder: FormBuilder) {}

    updateCode() {
        const nameControl = this.form.get('name');
        const codeControl = this.form.get('code');
        if (nameControl && codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(`${nameControl.value}`, '-'));
        }
    }

    confirm() {
        const { name, code } = this.form.value;
        if (!name || !code) {
            return;
        }
        this.resolveWith({
            productOptionGroupId: this.productOptionGroupId,
            code,
            translations: [{ languageCode: this.languageCode, name }],
        });
    }

    cancel() {
        this.resolveWith();
    }
}
