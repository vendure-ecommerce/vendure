import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';
import { GetProductWithVariants_product, LanguageCode } from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {

    product$: Observable<GetProductWithVariants_product>;
    availableLanguages$: Observable<LanguageCode[]>;
    languageCode$: Observable<LanguageCode>;
    productForm: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService,
                private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
        this.product$ = this.route.snapshot.data.product;
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            slug: '',
            description: '',
        });

        this.languageCode$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('lang')),
            map(lang => !lang ? getDefaultLanguage() : lang as LanguageCode),
        );

        this.availableLanguages$ = this.product$.pipe(
            map(p => p.translations.map(t => t.languageCode)),
        );

        combineLatest(this.product$, this.languageCode$).pipe(
            takeUntil(this.destroy$),
        )
            .subscribe(([product, languageCode]) => {
                const currentTranslation = product.translations.find(t => t.languageCode === languageCode);
                if (currentTranslation) {
                    this.productForm.setValue({
                        name: currentTranslation.name,
                        slug: currentTranslation.slug,
                        description: currentTranslation.description,
                    });
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
    }

    save() {
        combineLatest(this.product$, this.languageCode$).pipe(take(1))
            .subscribe(([product, languageCode]) => {
                const currentTranslation = product.translations.find(t => t.languageCode === languageCode);
                if (!currentTranslation) {
                    return;
                }
                const index = product.translations.indexOf(currentTranslation);
                const newTranslation = Object.assign({}, currentTranslation, this.productForm.value);
                const newProduct = { ...product, ...{ translations: product.translations.slice() } };
                newProduct.translations.splice(index, 1, newTranslation);
                this.dataService.product.updateProduct(newProduct).subscribe();
                this.productForm.markAsPristine();
            });
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], { queryParams: { [key]: value }, relativeTo: this.route, queryParamsHandling: 'merge' });
    }
}
