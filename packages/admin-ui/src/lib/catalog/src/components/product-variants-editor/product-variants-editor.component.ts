import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CreateProductOptionGroup,
    CreateProductOptionInput,
    CurrencyCode,
    DataService,
    DeactivateAware,
    DeletionResult,
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
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductDetailService } from '../../providers/product-detail/product-detail.service';
import { ConfirmVariantDeletionDialogComponent } from '../confirm-variant-deletion-dialog/confirm-variant-deletion-dialog.component';

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

interface OptionGroupUiModel {
    id?: string;
    isNew: boolean;
    name: string;
    locked: boolean;
    values: Array<{
        id?: string;
        name: string;
        locked: boolean;
    }>;
}

@Component({
    selector: 'vdr-product-variants-editor',
    templateUrl: './product-variants-editor.component.html',
    styleUrls: ['./product-variants-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductVariantsEditorComponent implements OnInit, DeactivateAware {
    formValueChanged = false;
    optionsChanged = false;
    generatedVariants: GeneratedVariant[] = [];
    optionGroups: OptionGroupUiModel[];
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

    addOptionGroup() {
        this.optionGroups.push({
            isNew: true,
            locked: false,
            name: '',
            values: [],
        });
        this.optionsChanged = true;
    }

    removeOptionGroup(optionGroup: OptionGroupUiModel) {
        const id = optionGroup.id;
        if (optionGroup.isNew) {
            this.optionGroups = this.optionGroups.filter(og => og !== optionGroup);
            this.generateVariants();
            this.optionsChanged = true;
        } else if (id) {
            this.modalService
                .dialog({
                    title: _('catalog.confirm-delete-product-option-group'),
                    translationVars: { name: optionGroup.name },
                    buttons: [
                        { type: 'secondary', label: _('common.cancel') },
                        { type: 'danger', label: _('common.delete'), returnValue: true },
                    ],
                })
                .pipe(
                    switchMap(val => {
                        if (val) {
                            return this.dataService.product.removeOptionGroupFromProduct({
                                optionGroupId: id,
                                productId: this.product.id,
                            });
                        } else {
                            return EMPTY;
                        }
                    }),
                )
                .subscribe(({ removeOptionGroupFromProduct }) => {
                    if (removeOptionGroupFromProduct.__typename === 'Product') {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'ProductOptionGroup',
                        });
                        this.initOptionsAndVariants();
                        this.optionsChanged = true;
                    } else if (removeOptionGroupFromProduct.__typename === 'ProductOptionInUseError') {
                        this.notificationService.error(removeOptionGroupFromProduct.message ?? '');
                    }
                });
        }
    }

    addOption(index: number, optionName: string) {
        const group = this.optionGroups[index];
        if (group) {
            group.values.push({ name: optionName, locked: false });
            this.generateVariants();
            this.optionsChanged = true;
        }
    }

    removeOption(index: number, { id, name }: { id?: string; name: string }) {
        const optionGroup = this.optionGroups[index];
        if (optionGroup) {
            if (!id) {
                optionGroup.values = optionGroup.values.filter(v => v.name !== name);
                this.generateVariants();
            } else {
                this.modalService
                    .dialog({
                        title: _('catalog.confirm-delete-product-option'),
                        translationVars: { name },
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            { type: 'danger', label: _('common.delete'), returnValue: true },
                        ],
                    })
                    .pipe(
                        switchMap(val => {
                            if (val) {
                                return this.dataService.product.deleteProductOption(id);
                            } else {
                                return EMPTY;
                            }
                        }),
                    )
                    .subscribe(({ deleteProductOption }) => {
                        if (deleteProductOption.result === DeletionResult.DELETED) {
                            this.notificationService.success(_('common.notify-delete-success'), {
                                entity: 'ProductOption',
                            });
                            optionGroup.values = optionGroup.values.filter(v => v.id !== id);
                            this.generateVariants();
                            this.optionsChanged = true;
                        } else {
                            this.notificationService.error(deleteProductOption.message ?? '');
                        }
                    });
            }
        }
    }

    generateVariants() {
        const groups = this.optionGroups.map(g => g.values);
        const previousVariants = this.generatedVariants;
        const generatedVariantFactory = (
            isDefault: boolean,
            options: GeneratedVariant['options'],
            existingVariant?: GetProductVariantOptions.Variants,
            prototypeVariant?: GetProductVariantOptions.Variants,
        ): GeneratedVariant => {
            const prototype = this.getVariantPrototype(options, previousVariants);
            return new GeneratedVariant({
                enabled: true,
                existing: !!existingVariant,
                productVariantId: existingVariant?.id,
                isDefault,
                options,
                price: existingVariant?.price ?? prototypeVariant?.price ?? prototype.price,
                sku: existingVariant?.sku ?? prototypeVariant?.sku ?? prototype.sku,
                stock: existingVariant?.stockOnHand ?? prototypeVariant?.stockOnHand ?? prototype.stock,
            });
        };
        this.generatedVariants = groups.length
            ? generateAllCombinations(groups).map(options => {
                  const existingVariant = this.product.variants.find(v =>
                      this.optionsAreEqual(v.options, options),
                  );
                  const prototypeVariant = this.product.variants.find(v =>
                      this.optionsAreSubset(v.options, options),
                  );
                  return generatedVariantFactory(false, options, existingVariant, prototypeVariant);
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

    deleteVariant(id: string, options: GeneratedVariant['options']) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-product-variant'),
                translationVars: { name: options.map(o => o.name).join(' ') },
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
        this.optionGroups = this.optionGroups.filter(g => g.values.length);
        const newOptionGroups = this.optionGroups
            .filter(og => og.isNew)
            .map(og => ({
                name: og.name,
                values: [],
            }));

        this.checkUniqueSkus()
            .pipe(
                mergeMap(() => this.confirmDeletionOfObsoleteVariants()),
                mergeMap(() =>
                    this.productDetailService.createProductOptionGroups(newOptionGroups, this.languageCode),
                ),
                mergeMap(createdOptionGroups => this.addOptionGroupsToProduct(createdOptionGroups)),
                mergeMap(createdOptionGroups => this.addNewOptionsToGroups(createdOptionGroups)),
                mergeMap(groupsIds => this.fetchOptionGroups(groupsIds)),
                mergeMap(groups => this.createNewProductVariants(groups)),
                mergeMap(res => this.deleteObsoleteVariants(res.createProductVariants)),
                mergeMap(variants => this.reFetchProduct(variants)),
            )
            .subscribe({
                next: variants => {
                    this.formValueChanged = false;
                    this.notificationService.success(_('catalog.created-new-variants-success'), {
                        count: variants.length,
                    });
                    this.initOptionsAndVariants();
                    this.optionsChanged = false;
                },
            });
    }

    private checkUniqueSkus() {
        const withDuplicateSkus = this.generatedVariants.filter((variant, index) => {
            return (
                variant.enabled &&
                this.generatedVariants.find(gv => gv.sku.trim() === variant.sku.trim() && gv !== variant)
            );
        });
        if (withDuplicateSkus.length) {
            return this.modalService
                .dialog({
                    title: _('catalog.duplicate-sku-warning'),
                    body: unique(withDuplicateSkus.map(v => `${v.sku}`)).join(', '),
                    buttons: [{ label: _('common.close'), returnValue: false, type: 'primary' }],
                })
                .pipe(mergeMap(res => EMPTY));
        } else {
            return of(true);
        }
    }

    private confirmDeletionOfObsoleteVariants(): Observable<boolean> {
        const obsoleteVariants = this.getObsoleteVariants();
        if (obsoleteVariants.length) {
            return this.modalService
                .fromComponent(ConfirmVariantDeletionDialogComponent, {
                    locals: {
                        variants: obsoleteVariants,
                    },
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

    private getObsoleteVariants() {
        return this.product.variants.filter(
            variant => !this.generatedVariants.find(gv => gv.productVariantId === variant.id),
        );
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
        ).pipe(defaultIfEmpty([] as ProductOptionGroupWithOptionsFragment[]));
    }

    private createNewProductVariants(groups: ProductOptionGroupWithOptionsFragment[]) {
        const options = groups
            .filter(notNullOrUndefined)
            .map(og => og.options)
            .reduce((flat, o) => [...flat, ...o], []);
        const variants = this.generatedVariants
            .filter(v => v.enabled && !v.existing)
            .map(v => {
                const optionIds = groups.map((group, index) => {
                    const option = group.options.find(o => o.name === v.options[index].name);
                    if (option) {
                        return option.id;
                    } else {
                        throw new Error(`Could not find a matching option for group ${group.name}`);
                    }
                });
                return {
                    price: v.price,
                    sku: v.sku,
                    stock: v.stock,
                    optionIds,
                };
            });
        return this.productDetailService.createProductVariants(
            this.product,
            variants,
            options,
            this.languageCode,
        );
    }

    private deleteObsoleteVariants<T>(input: T): Observable<T> {
        const obsoleteVariants = this.getObsoleteVariants();
        if (obsoleteVariants.length) {
            const deleteOperations = obsoleteVariants.map(v =>
                this.dataService.product.deleteProductVariant(v.id).pipe(map(() => input)),
            );
            return forkJoin(...deleteOperations);
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
                const allUsedOptionIds = p.variants.map(v => v.options.map(option => option.id)).flat();
                const allUsedOptionGroupIds = p.variants
                    .map(v => v.options.map(option => option.groupId))
                    .flat();
                this.optionGroups = p.optionGroups.map(og => {
                    return {
                        id: og.id,
                        isNew: false,
                        name: og.name,
                        locked: allUsedOptionGroupIds.includes(og.id),
                        values: og.options.map(o => ({
                            id: o.id,
                            name: o.name,
                            locked: allUsedOptionIds.includes(o.id),
                        })),
                    };
                });
                this.generateVariants();
            });
    }

    private optionsAreEqual(a: Array<{ name: string }>, b: Array<{ name: string }>): boolean {
        return this.toOptionString(a) === this.toOptionString(b);
    }

    private optionsAreSubset(a: Array<{ name: string }>, b: Array<{ name: string }>): boolean {
        return this.toOptionString(b).includes(this.toOptionString(a));
    }

    private toOptionString(o: Array<{ name: string }>): string {
        return o
            .map(x => x.name)
            .sort()
            .join('|');
    }
}
