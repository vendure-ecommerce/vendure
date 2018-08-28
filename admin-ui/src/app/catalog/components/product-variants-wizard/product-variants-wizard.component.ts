import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';
import { ProductOptionGroup, ProductWithVariants } from 'shared/generated-types';
import { generateAllCombinations } from 'shared/shared-utils';

import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { CreateOptionGroupFormComponent } from '../create-option-group-form/create-option-group-form.component';
import { SelectOptionGroupComponent } from '../select-option-group/select-option-group.component';

@Component({
    selector: 'vdr-product-variants-wizard',
    templateUrl: './product-variants-wizard.component.html',
    styleUrls: ['./product-variants-wizard.component.scss'],
})
export class ProductVariantsWizardComponent implements OnChanges {
    @Input() product: ProductWithVariants;
    @ViewChild('wizard') wizard: ClrWizard;
    @ViewChild('createOptionGroupForm') createOptionGroupForm: CreateOptionGroupFormComponent;
    @ViewChild('selectOptionGroup') selectOptionGroup: SelectOptionGroupComponent;
    selectedOptionGroups: Array<Partial<ProductOptionGroup>> = [];
    productVariantPreviewList: string[] = [];
    defaultPrice = 0;
    defaultSku = '';

    constructor(private notificationService: NotificationService, private dataService: DataService) {}

    ngOnChanges() {
        if (this.product) {
            this.selectedOptionGroups = this.product.optionGroups;
        }
    }

    /**
     * Opens the wizard and begins the steps.
     */
    start(): Observable<{ defaultPrice: number; defaultSku: string }> {
        this.wizard.open();

        return this.wizard.wizardFinished.pipe(
            takeUntil(this.wizard.onCancel),
            take(1),
            mergeMap(() => {
                const addOptionsOperations = this.selectedOptionGroups.map(og => {
                    if (og.id) {
                        return this.dataService.product.addOptionGroupToProduct({
                            productId: this.product.id,
                            optionGroupId: og.id,
                        });
                    } else {
                        return [];
                    }
                });

                return forkJoin(addOptionsOperations);
            }),
            map(() => ({
                defaultPrice: this.defaultPrice,
                defaultSku: this.defaultSku,
            })),
        );
    }

    createOptionGroup() {
        this.createOptionGroupForm.createOptionGroup().subscribe(data => {
            this.toggleSelectedGroup(data.createProductOptionGroup);
            this.notificationService.success(_('catalog.notify-create-new-option-group'));
            this.createOptionGroupForm.resetForm();
        });
    }

    toggleSelectedGroup(optionGroup: ProductOptionGroup) {
        const selected = !!this.selectedOptionGroups.find(og => og.id === optionGroup.id);
        if (selected) {
            this.selectedOptionGroups = this.selectedOptionGroups.filter(og => og.id !== optionGroup.id);
        } else {
            this.selectedOptionGroups = this.selectedOptionGroups.concat(optionGroup);
        }
        this.generateVariantPreviews();
    }

    /**
     * The total number of variants to be generated is the product of all the options in the
     * selected option groups.
     */
    getVariantCount(): number {
        return this.selectedOptionGroups.reduce((total, og) => {
            const length = og.options ? og.options.length || 1 : 1;
            return total * length;
        }, 1);
    }

    private generateVariantPreviews() {
        const optionsArray = this.selectedOptionGroups.map(og => og.options || []);
        this.productVariantPreviewList = generateAllCombinations(optionsArray).map(options => {
            return `${this.product.name} ${options.map(o => o.name).join(' ')}`;
        });
    }
}
