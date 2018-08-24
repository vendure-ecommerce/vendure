import { Component, Input, ViewChild } from '@angular/core';

import { DataService } from '../../../data/providers/data.service';
import { ProductWithVariants } from '../../../data/types/gql-generated-types';
import { ProductVariantsWizardComponent } from '../product-variants-wizard/product-variants-wizard.component';

@Component({
    selector: 'vdr-generate-product-variants',
    templateUrl: './generate-product-variants.component.html',
    styleUrls: ['./generate-product-variants.component.scss'],
})
export class GenerateProductVariantsComponent {
    @Input() product: ProductWithVariants;
    @ViewChild('productVariantsWizard') productVariantsWizard: ProductVariantsWizardComponent;
    constructor(private dataService: DataService) {}

    startProductVariantsWizard() {
        this.productVariantsWizard.start().subscribe(({ defaultPrice, defaultSku }) => {
            this.generateProductVariants(defaultPrice, defaultSku);
        });
    }

    generateProductVariants(defaultPrice?: number, defaultSku?: string) {
        this.dataService.product
            .generateProductVariants(this.product.id, defaultPrice, defaultSku)
            .subscribe();
    }
}
