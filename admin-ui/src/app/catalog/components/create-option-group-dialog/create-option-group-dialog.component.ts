import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';

import { ID } from '../../../../../../shared/shared-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { normalizeString } from '../../../common/utilities/normalize-string';
import { DataService } from '../../../data/providers/data.service';
import {
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionInput,
    LanguageCode,
} from '../../../data/types/gql-generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-create-option-group-dialog',
    templateUrl: './create-option-group-dialog.component.html',
    styleUrls: ['./create-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOptionGroupDialogComponent implements Dialog<CreateProductOptionGroup>, OnInit {
    resolveWith: (result?: CreateProductOptionGroup) => void;
    optionGroupForm: FormGroup;
    productName = '';
    productId: string;
    editCode = false;
    readonly defaultLanguage = getDefaultLanguage();

    constructor(private formBuilder: FormBuilder, private dataService: DataService) {}

    ngOnInit() {
        this.optionGroupForm = this.formBuilder.group({
            name: '',
            code: '',
            options: '',
        });
    }

    updateCode(nameValue: string) {
        const codeControl = this.optionGroupForm.get('code');
        if (codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(`${this.productName} ${nameValue}`, '-'));
        }
    }

    createOptionGroup() {
        this.dataService.product
            .createProductOptionGroups(this.createGroupFromForm())
            .subscribe(data => this.resolveWith(data));
    }

    cancel() {
        this.resolveWith();
    }

    private createGroupFromForm(): CreateProductOptionGroupInput {
        const name = this.optionGroupForm.value.name;
        const code = this.optionGroupForm.value.code;
        const rawOptions = this.optionGroupForm.value.options;
        return {
            code,
            translations: [
                {
                    languageCode: getDefaultLanguage(),
                    name,
                },
            ],
            options: this.createGroupOptions(rawOptions),
        };
    }

    private createGroupOptions(rawOptions: string): CreateProductOptionInput[] {
        return rawOptions
            .split('\n')
            .map(line => line.trim())
            .map(name => {
                return {
                    code: normalizeString(name, '-'),
                    translations: [
                        {
                            languageCode: getDefaultLanguage(),
                            name,
                        },
                    ],
                };
            });
    }
}
