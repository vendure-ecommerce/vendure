import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CreateProductOptionGroup,
    CreateProductOptionInput,
    CurrencyCode,
    DataService,
    DeactivateAware,
    getDefaultUiLanguage,
    GetProductVariantOptions,
    LanguageCode,
    ModalService,
    NotificationService,
    ProductOptionGroupWithOptionsFragment,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { pick } from '@vendure/common/lib/pick';
import { generateAllCombinations, notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductDetailService } from '../../providers/product-detail/product-detail.service';

export class GeneratedVariant {
    isDefault: boolean;
    options: Array<{ name: string; id?: string }>;
    productVariantId?: string;
    enabled: boolean;
    existing: boolean;
    sku: string;
    price: number;
    stock: number;

    constructor(config: Partial<GeneratedVariant>) {
        for (const key of Object.keys(config)) {
            this[key] = config[key];
        }
    }
}

@Component({
    selector: 'vdr-product-variants-editor',
    templateUrl: './product-variants-editor.component.html',
    styleUrls: ['./product-variants-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductVariantsEditorComponent implements OnInit, DeactivateAware {
    formValueChanged = false;
    generatedVariants: GeneratedVariant[] = [];
    optionGroups: Array<{
        id?: string;
        isNew: boolean;
        name: string;
        values: Array<{
            id?: string;
            name: string;
            locked: boolean;
        }>;
    }>;
    product: GetProductVariantOptions.Product;
    currencyCode: CurrencyCode;
    private languageCode: LanguageCode;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private productDetailService: ProductDetailService,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {}

    ngOnInit() {
        this.initOptionsAndVariants();
        this.languageCode =
            (this.route.snapshot.paramMap.get('lang') as LanguageCode) || getDefaultUiLanguage();
        this.dataService.settings.getActiveChannel().single$.subscribe(data => {
            this.currencyCode = data.activeChannel.currencyCode;
        });
    }

    onFormChanged(variantInfo: GeneratedVariant) {
        this.formValueChanged = true;
        variantInfo.enabled = true;
    }

    canDeactivate(): boolean {
        return !this.formValueChanged;
    }

    getVariantsToAdd() {
        return this.generatedVariants.filter(v => !v.existing && v.enabled);
    }

    getVariantName(variant: GeneratedVariant) {
        return variant.options.length === 0
            ? _('catalog.default-variant')
            : variant.options.map(o => o.name).join(' ');
    }

    addOption() {
        this.optionGroups.push({
            isNew: true,
            name: '',
            values: [],
        });
    }

    generateVariants() {
        const groups = this.optionGroups.map(g => g.values);
        const previousVariants = this.generatedVariants;
        const generatedVariantFactory = (
            isDefault: boolean,
            options: GeneratedVariant['options'],
            existingVariant?: GetProductVariantOptions.Variants,
        ): GeneratedVariant => {
            const prototype = this.getVariantPrototype(options, previousVariants);
            return new GeneratedVariant({
                enabled: false,
                existing: !!existingVariant,
                productVariantId: existingVariant?.id,
                isDefault,
                options,
                price: existingVariant?.price ?? prototype.price,
                sku: existingVariant?.sku ?? prototype.sku,
                stock: existingVariant?.stockOnHand ?? prototype.stock,
            });
        };
        this.generatedVariants = groups.length
            ? generateAllCombinations(groups).map(options => {
                  const existingVariant = this.product.variants.find(v =>
                      this.optionsAreEqual(v.options, options),
                  );
                  return generatedVariantFactory(false, options, existingVariant);
              })
            : [generatedVariantFactory(true, [], this.product.variants[0])];
    }

    /**
     * Returns one of the existing variants to base the newly-generated variant's
     * details off.
     */
    private getVariantPrototype(
        options: GeneratedVariant['options'],
        previousVariants: GeneratedVariant[],
    ): Pick<GeneratedVariant, 'sku' | 'price' | 'stock'> {
        const variantsWithSimilarOptions = previousVariants.filter(v =>
            options.map(o => o.name).filter(name => v.options.map(o => o.name).includes(name)),
        );
        if (variantsWithSimilarOptions.length) {
            return pick(previousVariants[0], ['sku', 'price', 'stock']);
        }
        return {
            sku: '',
            price: 0,
            stock: 0,
        };
    }

    deleteVariant(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-product-variant'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.productDetailService.deleteProductVariant(id, this.product.id) : EMPTY,
                ),
                switchMap(() => this.reFetchProduct(null)),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'ProductVariant',
                    });
                    this.initOptionsAndVariants();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'ProductVariant',
                    });
                },
            );
    }

    save() {
        const newOptionGroups = this.optionGroups
            .filter(og => og.isNew)
            .map(og => ({
                name: og.name,
                values: [],
            }));

        this.confirmDeletionOfDefault()
            .pipe(
                mergeMap(() =>
                    this.productDetailService.createProductOptionGroups(newOptionGroups, this.languageCode),
                ),
                mergeMap(createdOptionGroups => this.addOptionGroupsToProduct(createdOptionGroups)),
                mergeMap(createdOptionGroups => this.addNewOptionsToGroups(createdOptionGroups)),
                mergeMap(groupsIds => this.fetchOptionGroups(groupsIds)),
                mergeMap(groups => this.createNewProductVariants(groups)),
                mergeMap(res => this.deleteDefaultVariant(res.createProductVariants)),
                mergeMap(variants => this.reFetchProduct(variants)),
            )
            .subscribe({
                next: variants => {
                    this.formValueChanged = false;
                    this.notificationService.success(_('catalog.created-new-variants-success'), {
                        count: variants.length,
                    });
                    this.initOptionsAndVariants();
                },
            });
    }

    private confirmDeletionOfDefault(): Observable<boolean> {
        if (this.hasOnlyDefaultVariant(this.product)) {
            return this.modalService
                .dialog({
                    title: _('catalog.confirm-adding-options-delete-default-title'),
                    body: _('catalog.confirm-adding-options-delete-default-body'),
                    buttons: [
                        { type: 'secondary', label: _('common.cancel') },
                        { type: 'danger', label: _('catalog.delete-default-variant'), returnValue: true },
                    ],
                })
                .pipe(
                    mergeMap(res => {
                        return res === true ? of(true) : EMPTY;
                    }),
                );
        } else {
            return of(true);
        }
    }

    private hasOnlyDefaultVariant(product: GetProductVariantOptions.Product): boolean {
        return product.variants.length === 1 && product.optionGroups.length === 0;
    }

    private addOptionGroupsToProduct(
        createdOptionGroups: CreateProductOptionGroup.CreateProductOptionGroup[],
    ): Observable<CreateProductOptionGroup.CreateProductOptionGroup[]> {
        if (createdOptionGroups.length) {
            return forkJoin(
                createdOptionGroups.map(optionGroup => {
                    return this.dataService.product.addOptionGroupToProduct({
                        productId: this.product.id,
                        optionGroupId: optionGroup.id,
                    });
                }),
            ).pipe(map(() => createdOptionGroups));
        } else {
            return of([]);
        }
    }

    private addNewOptionsToGroups(
        createdOptionGroups: CreateProductOptionGroup.CreateProductOptionGroup[],
    ): Observable<string[]> {
        const newOptions: CreateProductOptionInput[] = this.optionGroups
            .map(og => {
                const createdGroup = createdOptionGroups.find(cog => cog.name === og.name);
                const productOptionGroupId = createdGroup ? createdGroup.id : og.id;
                if (!productOptionGroupId) {
                    throw new Error('Could not get a productOptionGroupId');
                }
                return og.values
                    .filter(v => !v.locked)
                    .map(v => ({
                        productOptionGroupId,
                        code: normalizeString(v.name, '-'),
                        translations: [{ name: v.name, languageCode: this.languageCode }],
                    }));
            })
            .reduce((flat, options) => [...flat, ...options], []);

        const allGroupIds = [
            ...createdOptionGroups.map(g => g.id),
            ...this.optionGroups.map(g => g.id).filter(notNullOrUndefined),
        ];

        if (newOptions.length) {
            return forkJoin(newOptions.map(input => this.dataService.product.addOptionToGroup(input))).pipe(
                map(() => allGroupIds),
            );
        } else {
            return of(allGroupIds);
        }
    }

    private fetchOptionGroups(groupsIds: string[]): Observable<ProductOptionGroupWithOptionsFragment[]> {
        return forkJoin(
            groupsIds.map(id =>
                this.dataService.product
                    .getProductOptionGroup(id)
                    .mapSingle(data => data.productOptionGroup)
                    .pipe(filter(notNullOrUndefined)),
            ),
        );
    }

    private createNewProductVariants(groups: ProductOptionGroupWithOptionsFragment[]) {
        const options = groups
            .filter(notNullOrUndefined)
            .map(og => og.options)
            .reduce((flat, o) => [...flat, ...o], []);
        const variants = this.generatedVariants
            .filter(v => v.enabled && !v.existing)
            .map(v => ({
                price: v.price,
                sku: v.sku,
                stock: v.stock,
                optionIds: v.options
                    .map(name => options.find(o => o.name === name.name))
                    .filter(notNullOrUndefined)
                    .map(o => o.id),
            }));
        return this.productDetailService.createProductVariants(
            this.product,
            variants,
            options,
            this.languageCode,
        );
    }

    private deleteDefaultVariant<T>(input: T): Observable<T> {
        if (this.hasOnlyDefaultVariant(this.product)) {
            // If the default single product variant has been replaced by multiple variants,
            // delete the original default variant.
            return this.dataService.product
                .deleteProductVariant(this.product.variants[0].id)
                .pipe(map(() => input));
        } else {
            return of(input);
        }
    }

    private reFetchProduct<T>(input: T): Observable<T> {
        // Re-fetch the Product to force an update to the view.
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            return this.dataService.product.getProduct(id).single$.pipe(map(() => input));
        } else {
            return of(input);
        }
    }

    initOptionsAndVariants() {
        this.dataService.product
            // tslint:disable-next-line:no-non-null-assertion
            .getProductVariantsOptions(this.route.snapshot.paramMap.get('id')!)
            // tslint:disable-next-line:no-non-null-assertion
            .mapSingle(({ product }) => product!)
            .subscribe(p => {
                this.product = p;
                this.optionGroups = p.optionGroups.map(og => {
                    return {
                        id: og.id,
                        isNew: false,
                        name: og.name,
                        values: og.options.map(o => ({
                            id: o.id,
                            name: o.name,
                            locked: true,
                        })),
                    };
                });
                this.generateVariants();
            });
    }

    private optionsAreEqual(a: Array<{ name: string }>, b: Array<{ name: string }>): boolean {
        function toOptionString(o: Array<{ name: string }>) {
            return o
                .map(x => x.name)
                .sort()
                .join('|');
        }

        return toOptionString(a) === toOptionString(b);
    }
}
