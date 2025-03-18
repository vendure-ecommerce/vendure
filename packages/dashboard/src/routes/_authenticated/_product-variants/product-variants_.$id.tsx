import { MoneyInput } from '@/components/data-type-components/money.js';
import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { EntityAssets } from '@/components/shared/entity-assets.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TaxCategorySelect } from '@/components/shared/tax-category-select.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.js';
import { Switch } from '@/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { VariantPriceDetail } from './components/variant-price-detail.js';
import {
    createProductVariantDocument,
    productVariantDetailDocument,
    updateProductVariantDocument,
} from './product-variants.graphql.js';
import { Fragment } from 'react/jsx-runtime';
import { AssignedFacetValues } from '@/components/shared/assigned-facet-values.js';

export const Route = createFileRoute('/_authenticated/_product-variants/product-variants_/$id')({
    component: ProductVariantDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(productVariantDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.productVariant) {
            throw new Error(`Product with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/product-variants', label: 'Product variants' },
                isNew ? <Trans>New product variant</Trans> : result.productVariant.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function ProductVariantDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
        queryDocument: addCustomFields(productVariantDetailDocument),
        entityField: 'productVariant',
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
            toast(i18n.t('Successfully updated product'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                navigate({ to: `../${data?.[0]?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update product'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const [price, taxCategoryId] = form.watch(['price', 'taxCategoryId']);

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New product variant</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Enabled</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            <Trans>When enabled, a product is available in the shop</Trans>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main">
                            <div className="md:flex w-full gap-4">
                                <div className="w-1/2">
                                    <TranslatableFormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Product name</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>SKU</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="ProductVariant"
                            control={form.control}
                        />

                        <PageBlock column="main" title={<Trans>Price and tax</Trans>}>
                            <div className="grid grid-cols-2 gap-4 items-start">
                                <FormField
                                    control={form.control}
                                    name="taxCategoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Trans>Tax category</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <TaxCategorySelect {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Price</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <MoneyInput {...field} currency={entity?.currencyCode} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <VariantPriceDetail
                                        priceIncludesTax={entity.priceIncludesTax}
                                        price={price}
                                        currencyCode={entity.currencyCode}
                                        taxCategoryId={taxCategoryId}
                                    />
                                </div>
                            </div>
                        </PageBlock>
                        <PageBlock column="main" title={<Trans>Stock</Trans>}>
                            <div className="grid grid-cols-2 gap-4 items-start">
                                {entity.stockLevels.map((stockLevel, index) => (
                                    <Fragment key={stockLevel.id}>
                                        <FormField
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
                                                    Sets the stock level at which this variant is considered
                                                    to be out of stock. Using a negative value enables
                                                    backorder support.
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
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                <Trans>
                                                    Sets the stock level at which this variant is considered
                                                    to be out of stock. Using a negative value enables
                                                    backorder support.
                                                </Trans>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PageBlock>

                        <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="facetValueIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Facet values</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <AssignedFacetValues
                                                facetValues={entity?.facetValues ?? []}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="side">
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
                </form>
            </Form>
        </Page>
    );
}
