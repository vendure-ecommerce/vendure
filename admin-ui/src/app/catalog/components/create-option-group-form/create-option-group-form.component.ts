import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { normalizeString } from '../../../common/utilities/normalize-string';
import { DataService } from '../../../data/providers/data.service';
import {
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionInput,
} from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-create-option-group-form',
    templateUrl: './create-option-group-form.component.html',
    styleUrls: ['./create-option-group-form.component.scss'],
})
export class CreateOptionGroupFormComponent implements OnInit {
    @Input() productName = '';
    @Input() productId: string;
    optionGroupForm: FormGroup;
    readonly defaultLanguage = getDefaultLanguage();

    constructor(private formBuilder: FormBuilder, private dataService: DataService) {}

    ngOnInit() {
        this.optionGroupForm = this.formBuilder.group({
            name: '',
            code: '',
            options: '',
        });
    }

    resetForm() {
        this.optionGroupForm.reset();
    }

    updateCode(nameValue: string) {
        const codeControl = this.optionGroupForm.get('code');
        if (codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(`${this.productName} ${nameValue}`, '-'));
        }
    }

    createOptionGroup(): Observable<CreateProductOptionGroup> {
        return this.dataService.product.createProductOptionGroups(this.createGroupFromForm());
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
