import { MoneyInput } from '@/vdb/components/data-input/money-input.js';
import { AssignedFacetValues } from '@/vdb/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/vdb/components/shared/entity-assets.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TaxCategorySelector } from '@/vdb/components/shared/tax-category-selector.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Switch } from '@/vdb/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/vdb/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import { toast } from 'sonner';
import { VariantPriceDetail } from './components/variant-price-detail.js';
import {
    createProductVariantDocument,
    productVariantDetailDocument,
    updateProductVariantDocument,
} from './product-variants.graphql.js';

const pageId = 'product-variant-detail';

export const Route = createFileRoute('/_authenticated/_product-variants/product-variants_/$id')({
    component: ProductVariantDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: productVariantDetailDocument,
        breadcrumb(_isNew, entity, location) {
            if ((location.search as any).from === 'product') {
                return [
                    { path: '/product', label: <Trans>Products</Trans> },
                    { path: `/products/${entity?.product.id}`, label: entity?.product.name ?? '' },
                    entity?.name,
                ];
            }
            return [{ path: '/product-variants', label: <Trans>Product Variants</Trans> }, entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ProductVariantDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();
    const { activeChannel } = useChannel();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: productVariantDetailDocument,
        createDocument: createProductVariantDocument,
        updateDocument: updateProductVariantDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                enabled: entity.enabled,
                sku: entity.sku,
                featuredAssetId: entity.featuredAsset?.id,
                assetIds: entity.assets.map(asset => asset.id),
                facetValueIds: entity.facetValues.map(facetValue => facetValue.id),
                taxCategoryId: entity.taxCategory.id,
                price: entity.price,
                prices: [],
                trackInventory: entity.trackInventory,
                outOfStockThreshold: entity.outOfStockThreshold,
                stockLevels: entity.stockLevels.map(stockLevel => ({
                    stockOnHand: stockLevel.stockOnHand,
                    stockLocationId: stockLevel.stockLocation.id,
                })),
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    customFields: (translation as any).customFields,
                })),
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: data => {
            toast.success(i18n.t(creatingNewEntity ? 'Successfully created product variant' : 'Successfully updated product variant'));
            resetForm();
            if (creatingNewEntity) {
                navigate({ to: `../${(data as any)?.[0]?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast.error(i18n.t(creatingNewEntity ? 'Failed to create product variant' : 'Failed to update product variant'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const [price, taxCategoryId] = form.watch(['price', 'taxCategoryId']);

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                {creatingNewEntity ? <Trans>New product variant</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            {creatingNewEntity ? <Trans>Create</Trans> : <Trans>Update</Trans>}
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="side" blockId="enabled">
                    <FormFieldWrapper
                        control={form.control}
                        name="enabled"
                        label={<Trans>Enabled</Trans>}
                        description={<Trans>When enabled, a product is available in the shop</Trans>}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Product name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="sku"
                            label={<Trans>SKU</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="ProductVariant" control={form.control} />

                <PageBlock column="main" blockId="price-and-tax" title={<Trans>Price and tax</Trans>}>
                    <div className="grid grid-cols-2 gap-4 items-start">
                        <FormFieldWrapper
                            control={form.control}
                            name="taxCategoryId"
                            label={<Trans>Tax category</Trans>}
                            render={({ field }) => (
                                <TaxCategorySelector value={field.value} onChange={field.onChange} />
                            )}
                        />

                        <div>
                            <FormFieldWrapper
                                control={form.control}
                                name="price"
                                label={<Trans>Price</Trans>}
                                render={({ field }) => (
                                    <MoneyInput {...field} currency={entity?.currencyCode} />
                                )}
                            />
                            <VariantPriceDetail
                                priceIncludesTax={activeChannel?.pricesIncludeTax ?? false}
                                price={price}
                                currencyCode={
                                    entity?.currencyCode ?? activeChannel?.defaultCurrencyCode ?? ''
                                }
                                taxCategoryId={taxCategoryId}
                            />
                        </div>
                    </div>
                </PageBlock>
                <PageBlock column="main" blockId="stock" title={<Trans>Stock</Trans>}>
                    <DetailFormGrid>
                        {entity?.stockLevels.map((stockLevel, index) => (
                            <Fragment key={stockLevel.id}>
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`stockLevels.${index}.stockOnHand`}
                                    label={<Trans>Stock level</Trans>}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            value={field.value}
                                            onChange={e => {
                                                field.onChange(e.target.valueAsNumber);
                                            }}
                                        />
                                    )}
                                />
                                <div>
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Allocated</Trans>
                                        </FormLabel>
                                        <div className="text-sm pt-1.5">{stockLevel.stockAllocated}</div>
                                    </FormItem>
                                </div>
                            </Fragment>
                        ))}

                        <FormFieldWrapper
                            control={form.control}
                            name="trackInventory"
                            label={<Trans>Stock levels</Trans>}
                            render={({ field }) => (
                                <Select
                                    onValueChange={val => {
                                        if (val) {
                                            field.onChange(val);
                                        }
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Track inventory" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="INHERIT">
                                            <Trans>Inherit from global settings</Trans>
                                        </SelectItem>
                                        <SelectItem value="TRUE">
                                            <Trans>Track</Trans>
                                        </SelectItem>
                                        <SelectItem value="FALSE">
                                            <Trans>Do not track</Trans>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="outOfStockThreshold"
                            label={<Trans>Out-of-stock threshold</Trans>}
                            description={
                                <Trans>
                                    Sets the stock level at which this variant is considered to be out of
                                    stock. Using a negative value enables backorder support.
                                </Trans>
                            }
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="useGlobalOutOfStockThreshold"
                            label={<Trans>Use global out-of-stock threshold</Trans>}
                            description={
                                <Trans>
                                    Sets the stock level at which this variant is considered to be out of
                                    stock. Using a negative value enables backorder support.
                                </Trans>
                            }
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </DetailFormGrid>
                </PageBlock>

                <PageBlock column="side" blockId="facet-values">
                    <FormFieldWrapper
                        control={form.control}
                        name="facetValueIds"
                        label={<Trans>Facet values</Trans>}
                        render={({ field }) => (
                            <AssignedFacetValues facetValues={entity?.facetValues ?? []} {...field} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="side" blockId="assets">
                    <FormItem>
                        <FormLabel>
                            <Trans>Assets</Trans>
                        </FormLabel>
                        <FormControl>
                            <EntityAssets
                                assets={entity?.assets}
                                featuredAsset={entity?.featuredAsset}
                                compact={true}
                                value={form.getValues()}
                                onChange={value => {
                                    form.setValue('featuredAssetId', value.featuredAssetId ?? undefined, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                    form.setValue('assetIds', value.assetIds ?? undefined, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                            />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
