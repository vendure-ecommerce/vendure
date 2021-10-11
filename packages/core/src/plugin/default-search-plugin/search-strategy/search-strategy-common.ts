export const fieldsToSelect = [
    'sku',
    'enabled',
    'slug',
    'price',
    'priceWithTax',
    'productVariantId',
    'languageCode',
    'productId',
    'productName',
    'productVariantName',
    'description',
    'facetIds',
    'facetValueIds',
    'collectionIds',
    'channelIds',
    'productAssetId',
    'productPreview',
    'productPreviewFocalPoint',
    'productVariantAssetId',
    'productVariantPreview',
    'productVariantPreviewFocalPoint',
];

export function getFieldsToSelect(includeStockStatus: boolean = false) {
    return includeStockStatus ? [...fieldsToSelect, 'inStock', 'productInStock'] : fieldsToSelect;
}
