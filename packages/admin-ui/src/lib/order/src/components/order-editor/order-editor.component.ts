import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AddItemInput,
    BaseDetailComponent,
    CustomFieldConfig,
    DataService,
    ErrorResult,
    GetAvailableCountriesQuery,
    HistoryEntryType,
    LanguageCode,
    ModalService,
    ModifyOrderInput,
    NotificationService,
    OrderAddressFragment,
    OrderDetailFragment,
    OrderLineInput,
    ProductSelectorSearchQuery,
    ServerConfigService,
    SortOrder,
    SurchargeInput,
    transformRelationCustomFieldInputs,
} from '@vendure/admin-ui/core';
import { assertNever, notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { EMPTY, Observable, of } from 'rxjs';
import { mapTo, shareReplay, switchMap, takeUntil } from 'rxjs/operators';

import { OrderTransitionService } from '../../providers/order-transition.service';
import {
    OrderEditResultType,
    OrderEditsPreviewDialogComponent,
} from '../order-edits-preview-dialog/order-edits-preview-dialog.component';

type ProductSelectorItem = ProductSelectorSearchQuery['search']['items'][number];

interface AddedLine {
    productVariantId: string;
    productAsset?: ProductSelectorItem['productAsset'] | null;
    productVariantName: string;
    sku: string;
    priceWithTax: number;
    price: number;
    quantity: number;
}

type ModifyOrderData = Omit<ModifyOrderInput, 'addItems' | 'adjustOrderLines'> & {
    addItems: Array<AddItemInput & { customFields?: any }>;
    adjustOrderLines: Array<OrderLineInput & { customFields?: any }>;
};

@Component({
    selector: 'vdr-order-editor',
    templateUrl: './order-editor.component.html',
    styleUrls: ['./order-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEditorComponent
    extends BaseDetailComponent<OrderDetailFragment>
    implements OnInit, OnDestroy
{
    availableCountries$: Observable<GetAvailableCountriesQuery['countries']['items']>;
    addressCustomFields: CustomFieldConfig[];
    detailForm = new UntypedFormGroup({});
    couponCodesControl = new UntypedFormControl();
    orderLineCustomFieldsFormArray: UntypedFormArray;
    addItemCustomFieldsFormArray: UntypedFormArray;
    addItemCustomFieldsForm: UntypedFormGroup;
    addItemSelectedVariant: ProductSelectorItem | undefined;
    orderLineCustomFields: CustomFieldConfig[];
    modifyOrderInput: ModifyOrderData = {
        dryRun: true,
        orderId: '',
        addItems: [],
        adjustOrderLines: [],
        surcharges: [],
        note: '',
        updateShippingAddress: {},
        updateBillingAddress: {},
    };
    surchargeForm: UntypedFormGroup;
    shippingAddressForm: UntypedFormGroup;
    billingAddressForm: UntypedFormGroup;
    note = '';
    recalculateShipping = true;
    previousState: string;
    private addedVariants = new Map<string, ProductSelectorItem>();

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private orderTransitionService: OrderTransitionService,
    ) {
        super(route, router, serverConfigService, dataService);
    }

    get addedLines(): AddedLine[] {
        const getSinglePriceValue = (price: ProductSelectorItem['price']) =>
            price.__typename === 'SinglePrice' ? price.value : 0;
        return (this.modifyOrderInput.addItems || [])
            .map(row => {
                const variantInfo = this.addedVariants.get(row.productVariantId);
                if (variantInfo) {
                    return {
                        ...variantInfo,
                        price: getSinglePriceValue(variantInfo.price),
                        priceWithTax: getSinglePriceValue(variantInfo.priceWithTax),
                        quantity: row.quantity,
                    };
                }
            })
            .filter(notNullOrUndefined);
    }

    ngOnInit(): void {
        this.init();
        this.addressCustomFields = this.getCustomFieldConfig('Address');
        this.modifyOrderInput.orderId = this.route.snapshot.paramMap.get('id') as string;
        this.orderLineCustomFields = this.getCustomFieldConfig('OrderLine');
        this.entity$.pipe(takeUntil(this.destroy$)).subscribe(order => {
            if (order.couponCodes.length) {
                this.couponCodesControl.setValue(order.couponCodes);
            }
            this.surchargeForm = new UntypedFormGroup({
                description: new UntypedFormControl('', Validators.required),
                sku: new UntypedFormControl(''),
                price: new UntypedFormControl(0, Validators.required),
                priceIncludesTax: new UntypedFormControl(true),
                taxRate: new UntypedFormControl(0),
                taxDescription: new UntypedFormControl(''),
            });
            if (!this.shippingAddressForm) {
                this.shippingAddressForm = new UntypedFormGroup({
                    fullName: new UntypedFormControl(order.shippingAddress?.fullName),
                    company: new UntypedFormControl(order.shippingAddress?.company),
                    streetLine1: new UntypedFormControl(order.shippingAddress?.streetLine1),
                    streetLine2: new UntypedFormControl(order.shippingAddress?.streetLine2),
                    city: new UntypedFormControl(order.shippingAddress?.city),
                    province: new UntypedFormControl(order.shippingAddress?.province),
                    postalCode: new UntypedFormControl(order.shippingAddress?.postalCode),
                    countryCode: new UntypedFormControl(order.shippingAddress?.countryCode),
                    phoneNumber: new UntypedFormControl(order.shippingAddress?.phoneNumber),
                });
                this.addAddressCustomFieldsFormGroup(this.shippingAddressForm, order.shippingAddress);
            }
            if (!this.billingAddressForm) {
                this.billingAddressForm = new UntypedFormGroup({
                    fullName: new UntypedFormControl(order.billingAddress?.fullName),
                    company: new UntypedFormControl(order.billingAddress?.company),
                    streetLine1: new UntypedFormControl(order.billingAddress?.streetLine1),
                    streetLine2: new UntypedFormControl(order.billingAddress?.streetLine2),
                    city: new UntypedFormControl(order.billingAddress?.city),
                    province: new UntypedFormControl(order.billingAddress?.province),
                    postalCode: new UntypedFormControl(order.billingAddress?.postalCode),
                    countryCode: new UntypedFormControl(order.billingAddress?.countryCode),
                    phoneNumber: new UntypedFormControl(order.billingAddress?.phoneNumber),
                });
                this.addAddressCustomFieldsFormGroup(this.billingAddressForm, order.billingAddress);
            }
            this.orderLineCustomFieldsFormArray = new UntypedFormArray([]);
            for (const line of order.lines) {
                const formGroup = new UntypedFormGroup({});
                for (const { name } of this.orderLineCustomFields) {
                    formGroup.addControl(name, new UntypedFormControl((line as any).customFields[name]));
                }
                formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                    let modifyRow = this.modifyOrderInput.adjustOrderLines.find(
                        l => l.orderLineId === line.id,
                    );
                    if (!modifyRow) {
                        modifyRow = {
                            orderLineId: line.id,
                            quantity: line.quantity,
                        };
                        this.modifyOrderInput.adjustOrderLines.push(modifyRow);
                    }
                    if (this.orderLineCustomFields.length) {
                        modifyRow.customFields = value;
                    }
                });
                this.orderLineCustomFieldsFormArray.push(formGroup);
            }
        });

        this.addItemCustomFieldsFormArray = new UntypedFormArray([]);
        this.addItemCustomFieldsForm = new UntypedFormGroup({});
        for (const customField of this.orderLineCustomFields) {
            this.addItemCustomFieldsForm.addControl(customField.name, new UntypedFormControl());
        }
        this.availableCountries$ = this.dataService.settings
            .getAvailableCountries()
            .mapSingle(result => result.countries.items)
            .pipe(shareReplay(1));
        this.dataService.order
            .getOrderHistory(this.id, {
                take: 1,
                sort: {
                    createdAt: SortOrder.DESC,
                },
                filter: { type: { eq: HistoryEntryType.ORDER_STATE_TRANSITION } },
            })
            .single$.subscribe(({ order }) => {
                this.previousState = order?.history.items[0].data.from;
            });
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    transitionToPriorState(order: OrderDetailFragment) {
        this.orderTransitionService
            .transitionToPreModifyingState(order.id, order.nextStates)
            .subscribe(result => {
                this.router.navigate(['..'], { relativeTo: this.route });
            });
    }

    canPreviewChanges(): boolean {
        const { addItems, adjustOrderLines, surcharges } = this.modifyOrderInput;
        return (
            !!addItems?.length ||
            !!surcharges?.length ||
            !!adjustOrderLines?.length ||
            (this.shippingAddressForm.dirty && this.shippingAddressForm.valid) ||
            (this.billingAddressForm.dirty && this.billingAddressForm.valid) ||
            this.couponCodesControl.dirty
        );
    }

    isLineModified(line: OrderDetailFragment['lines'][number]): boolean {
        return !!this.modifyOrderInput.adjustOrderLines?.find(
            l => l.orderLineId === line.id && l.quantity !== line.quantity,
        );
    }

    updateLineQuantity(line: OrderDetailFragment['lines'][number], quantity: string) {
        const { adjustOrderLines } = this.modifyOrderInput;
        let row = adjustOrderLines?.find(l => l.orderLineId === line.id);
        if (row && +quantity === line.quantity) {
            // Remove the modification if the quantity is the same as
            // the original order
            adjustOrderLines?.splice(adjustOrderLines?.indexOf(row), 1);
        }
        if (!row) {
            row = { orderLineId: line.id, quantity: +quantity };
            adjustOrderLines?.push(row);
        }
        row.quantity = +quantity;
    }

    updateAddedItemQuantity(item: AddedLine, quantity: string) {
        const row = this.modifyOrderInput.addItems?.find(l => l.productVariantId === item.productVariantId);
        if (row) {
            row.quantity = +quantity;
        }
    }

    trackByProductVariantId(index: number, item: AddedLine) {
        return item.productVariantId;
    }

    getSelectedItemPrice(result: ProductSelectorItem | undefined): number {
        switch (result?.priceWithTax.__typename) {
            case 'SinglePrice':
                return result.priceWithTax.value;
            default:
                return 0;
        }
    }

    addItemToOrder(result: ProductSelectorItem | undefined) {
        if (!result) {
            return;
        }
        const customFields = this.orderLineCustomFields.length
            ? this.addItemCustomFieldsForm.value
            : undefined;
        let row = this.modifyOrderInput.addItems?.find(l =>
            this.isMatchingAddItemRow(l, result, customFields),
        );
        if (!row) {
            row = { productVariantId: result.productVariantId, quantity: 1 };
            if (customFields) {
                row.customFields = customFields;
            }
            this.modifyOrderInput.addItems?.push(row);
        } else {
            row.quantity++;
        }
        if (customFields) {
            const formGroup = new UntypedFormGroup({});
            for (const [key, value] of Object.entries(customFields)) {
                formGroup.addControl(key, new UntypedFormControl(value));
            }
            this.addItemCustomFieldsFormArray.push(formGroup);
            formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                if (row) {
                    row.customFields = value;
                }
            });
        }
        this.addItemCustomFieldsForm.reset({});
        this.addItemSelectedVariant = undefined;
        this.addedVariants.set(result.productVariantId, result);
    }

    private isMatchingAddItemRow(
        row: ModifyOrderData['addItems'][number],
        result: ProductSelectorItem,
        customFields: any,
    ): boolean {
        return (
            row.productVariantId === result.productVariantId &&
            JSON.stringify(row.customFields) === JSON.stringify(customFields)
        );
    }

    removeAddedItem(index: number) {
        this.modifyOrderInput.addItems.splice(index, 1);
        if (-1 < index) {
            this.addItemCustomFieldsFormArray.removeAt(index);
        }
    }

    getSurchargePrices(surcharge: SurchargeInput) {
        const priceWithTax = surcharge.priceIncludesTax
            ? surcharge.price
            : Math.round(surcharge.price * ((100 + (surcharge.taxRate || 0)) / 100));
        const price = surcharge.priceIncludesTax
            ? Math.round(surcharge.price / ((100 + (surcharge.taxRate || 0)) / 100))
            : surcharge.price;
        return {
            price,
            priceWithTax,
        };
    }

    addSurcharge(value: any) {
        this.modifyOrderInput.surcharges?.push(value);
        this.surchargeForm.reset({
            price: 0,
            priceIncludesTax: true,
            taxRate: 0,
        });
    }

    removeSurcharge(index: number) {
        this.modifyOrderInput.surcharges?.splice(index, 1);
    }

    previewAndModify(order: OrderDetailFragment) {
        const modifyOrderInput: ModifyOrderData = {
            ...this.modifyOrderInput,
            adjustOrderLines: this.modifyOrderInput.adjustOrderLines.map(line =>
                transformRelationCustomFieldInputs(simpleDeepClone(line), this.orderLineCustomFields),
            ),
        };
        const input: ModifyOrderInput = {
            ...modifyOrderInput,
            ...(this.billingAddressForm.dirty ? { updateBillingAddress: this.billingAddressForm.value } : {}),
            ...(this.shippingAddressForm.dirty
                ? { updateShippingAddress: this.shippingAddressForm.value }
                : {}),
            dryRun: true,
            couponCodes: this.couponCodesControl.dirty ? this.couponCodesControl.value : undefined,
            note: this.note ?? '',
            options: {
                recalculateShipping: this.recalculateShipping,
            },
        };
        const originalTotalWithTax = order.totalWithTax;
        this.dataService.order
            .modifyOrder(input)
            .pipe(
                switchMap(({ modifyOrder }) => {
                    switch (modifyOrder.__typename) {
                        case 'Order':
                            return this.modalService.fromComponent(OrderEditsPreviewDialogComponent, {
                                size: 'xl',
                                closable: false,
                                locals: {
                                    originalTotalWithTax,
                                    order: modifyOrder,
                                    orderLineCustomFields: this.orderLineCustomFields,
                                    modifyOrderInput: input,
                                },
                            });
                        case 'InsufficientStockError':
                        case 'NegativeQuantityError':
                        case 'NoChangesSpecifiedError':
                        case 'OrderLimitError':
                        case 'OrderModificationStateError':
                        case 'PaymentMethodMissingError':
                        case 'RefundPaymentIdMissingError':
                        case 'CouponCodeLimitError':
                        case 'CouponCodeExpiredError':
                        case 'CouponCodeInvalidError': {
                            this.notificationService.error(modifyOrder.message);
                            return of(false as const);
                        }
                        case null:
                        case undefined:
                            return of(false as const);
                        default:
                            assertNever(modifyOrder);
                    }
                }),
                switchMap(result => {
                    if (!result || result.result === OrderEditResultType.Cancel) {
                        // re-fetch so that the preview values get overwritten in the cache.
                        return this.dataService.order.getOrder(this.id).mapSingle(() => false);
                    } else {
                        // Do the modification
                        const wetRunInput = {
                            ...input,
                            dryRun: false,
                        };
                        if (result.result === OrderEditResultType.Refund) {
                            wetRunInput.refund = {
                                paymentId: result.refundPaymentId,
                                reason: result.refundNote,
                            };
                        }
                        return this.dataService.order.modifyOrder(wetRunInput).pipe(
                            switchMap(({ modifyOrder }) => {
                                if (modifyOrder.__typename === 'Order') {
                                    const priceDelta = modifyOrder.totalWithTax - originalTotalWithTax;
                                    const nextState =
                                        0 < priceDelta ? 'ArrangingAdditionalPayment' : this.previousState;

                                    return this.dataService.order
                                        .transitionToState(order.id, nextState)
                                        .pipe(mapTo(true));
                                } else {
                                    this.notificationService.error((modifyOrder as ErrorResult).message);
                                    return EMPTY;
                                }
                            }),
                        );
                    }
                }),
            )
            .subscribe(result => {
                if (result) {
                    this.router.navigate(['../'], { relativeTo: this.route });
                }
            });
    }

    private addAddressCustomFieldsFormGroup(
        parentFormGroup: UntypedFormGroup,
        address?: OrderAddressFragment | null,
    ) {
        if (address && this.addressCustomFields.length) {
            const addressCustomFieldsFormGroup = new UntypedFormGroup({});
            for (const customFieldDef of this.addressCustomFields) {
                const name = customFieldDef.name;
                const value = (address as any).customFields?.[name];
                addressCustomFieldsFormGroup.addControl(name, new UntypedFormControl(value));
            }
            parentFormGroup.addControl('customFields', addressCustomFieldsFormGroup);
        }
    }

    protected setFormValues(entity: OrderDetailFragment, languageCode: LanguageCode): void {
        /* not used */
    }
}
