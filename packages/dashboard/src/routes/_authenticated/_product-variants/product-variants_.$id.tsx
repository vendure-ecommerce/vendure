import { MoneyInput } from '@/components/data-input/money-input.js';
import { AssignedFacetValues } from '@/components/shared/assigned-facet-values.js';
import { EntityAssets } from '@/components/shared/entity-assets.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TaxCategorySelector } from '@/components/shared/tax-category-selector.js';
import {
    TranslatableFormFieldWrapper
} from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { Switch } from '@/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageDetailForm,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { useChannel } from '@/hooks/use-channel.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import { toast } from 'sonner';
import { VariantPriceDetail } from './components/variant-price-detail.js';
import {
    createProductVariantDocument,
    productVariantDetailDocument,
    updateProductVariantDocument,
} from './product-variants.graphql.js';

export const Route = createFileRoute('/_authenticated/_product-variants/product-variants_/$id')({
    component: ProductVariantDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: productVariantDetailDocument,
        breadcrumb(_isNew, entity) {
            return [{ path: '/product-variants', label: 'Product variants' }, entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ProductVariantDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();
    const { activeChannel } = useChannel();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
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
                    customFields: translation.customFields,
                })),
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: data => {
            toast.success(i18n.t('Successfully updated product'));
            resetForm();
            if (creatingNewEntity) {
                navigate({ to: `../${data?.[0]?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update product'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const [price, taxCategoryId] = form.watch(['price', 'taxCategoryId']);

    return (
        <Page pageId="product-variant-detail">
            <PageTitle>
                {creatingNewEntity ? <Trans>New product variant</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
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
                                    currencyCode={entity?.currencyCode}
                                    taxCategoryId={taxCategoryId}
                                />
                            </div>
                        </div>
                    </PageBlock>
                    <PageBlock column="main" blockId="stock" title={<Trans>Stock</Trans>}>
                        <DetailFormGrid>
                            {entity.stockLevels.map((stockLevel, index) => (
                                <Fragment key={stockLevel.id}>
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`stockLevels.${index}.stockOnHand`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Stock level</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                            </FormItem>
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

                            <FormField
                                control={form.control}
                                name="trackInventory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Track inventory</Trans>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="outOfStockThreshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Out-of-stock threshold</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            <Trans>
                                                Sets the stock level at which this variant is considered to be
                                                out of stock. Using a negative value enables backorder
                                                support.
                                            </Trans>
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="useGlobalOutOfStockThreshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Use global out-of-stock threshold</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            <Trans>
                                                Sets the stock level at which this variant is considered to be
                                                out of stock. Using a negative value enables backorder
                                                support.
                                            </Trans>
                                        </FormDescription>
                                    </FormItem>
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
                                        form.setValue('featuredAssetId', value.featuredAssetId, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                        form.setValue('assetIds', value.assetIds, {
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
            </PageDetailForm>
        </Page>
    );
}
