import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { generateAllCombinations } from '@vendure/common/lib/shared-utils';

import { CurrencyCode } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { OptionValueInputComponent } from '../option-value-input/option-value-input.component';

const DEFAULT_VARIANT_CODE = '__DEFAULT_VARIANT__';
export type CreateVariantValues = {
    optionValues: string[];
    enabled: boolean;
    sku: string;
    price: number;
    stock: number;
};
export type CreateProductVariantsConfig = {
    groups: Array<{ name: string; values: string[] }>;
    variants: CreateVariantValues[];
};

@Component({
    selector: 'vdr-generate-product-variants',
    templateUrl: './generate-product-variants.component.html',
    styleUrls: ['./generate-product-variants.component.scss'],
})
export class GenerateProductVariantsComponent implements OnInit {
    @Output() variantsChange = new EventEmitter<CreateProductVariantsConfig>();
    optionGroups: Array<{ name: string; values: Array<{ name: string; locked: boolean }> }> = [];
    currencyCode: CurrencyCode;
    variants: Array<{ id: string; values: string[] }>;
    variantFormValues: { [id: string]: CreateVariantValues } = {};
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.settings.getActiveChannel().single$.subscribe(data => {
            this.currencyCode = data.activeChannel.currencyCode;
        });

        this.generateVariants();
    }

    addOption() {
        this.optionGroups.push({ name: '', values: [] });
    }

    removeOption(name: string) {
        this.optionGroups = this.optionGroups.filter(g => g.name !== name);
        this.generateVariants();
    }

    generateVariants() {
        const totalValuesCount = this.optionGroups.reduce((sum, group) => sum + group.values.length, 0);
        const groups = totalValuesCount
            ? this.optionGroups.map(g => g.values.map(v => v.name))
            : [[DEFAULT_VARIANT_CODE]];
        this.variants = generateAllCombinations(groups).map(values => ({ id: values.join('|'), values }));

        this.variants.forEach(variant => {
            if (!this.variantFormValues[variant.id]) {
                this.variantFormValues[variant.id] = {
                    optionValues: variant.values,
                    enabled: true,
                    price: this.copyFromDefault(variant.id, 'price', 0),
                    sku: this.copyFromDefault(variant.id, 'sku', ''),
                    stock: this.copyFromDefault(variant.id, 'stock', 0),
                };
            }
        });
        this.onFormChange();
    }

    trackByFn(index: number, variant: { name: string; values: string[] }) {
        return variant.values.join('|');
    }

    handleEnter(event: KeyboardEvent, optionValueInputComponent: OptionValueInputComponent) {
        event.preventDefault();
        event.stopPropagation();
        optionValueInputComponent.focus();
    }

    onFormChange() {
        const variantsToCreate = this.variants.map(v => this.variantFormValues[v.id]).filter(v => v.enabled);
        this.variantsChange.emit({
            groups: this.optionGroups.map(og => ({ name: og.name, values: og.values.map(v => v.name) })),
            variants: variantsToCreate,
        });
    }

    private copyFromDefault<T extends keyof CreateVariantValues>(
        variantId: string,
        prop: T,
        value: CreateVariantValues[T],
    ): CreateVariantValues[T] {
        return variantId !== DEFAULT_VARIANT_CODE
            ? this.variantFormValues[DEFAULT_VARIANT_CODE][prop]
            : value;
    }
}
