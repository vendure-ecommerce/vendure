// tslint:disable
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AddFulfillmentToOrderResult = CreateFulfillmentError | EmptyOrderLineSelectionError | Fulfillment | FulfillmentStateTransitionError | InsufficientStockOnHandError | InvalidFulfillmentHandlerError | ItemsAlreadyFulfilledError;

export type AddItemInput = {
  productVariantId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type AddManualPaymentToOrderResult = ManualPaymentStateError | Order;

export type AddNoteToCustomerInput = {
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  note: Scalars['String'];
};

export type AddNoteToOrderInput = {
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  note: Scalars['String'];
};

export type Address = Node & {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country: Country;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  defaultBillingAddress?: Maybe<Scalars['Boolean']>;
  defaultShippingAddress?: Maybe<Scalars['Boolean']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  phoneNumber?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  streetLine1: Scalars['String'];
  streetLine2?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type AdjustOrderLineInput = {
  orderLineId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type Adjustment = {
  __typename?: 'Adjustment';
  adjustmentSource: Scalars['String'];
  amount: Scalars['Int'];
  description: Scalars['String'];
  type: AdjustmentType;
};

export enum AdjustmentType {
  DISTRIBUTED_ORDER_PROMOTION = 'DISTRIBUTED_ORDER_PROMOTION',
  OTHER = 'OTHER',
  PROMOTION = 'PROMOTION'
}

export type Administrator = Node & {
  __typename?: 'Administrator';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type AdministratorFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  emailAddress?: InputMaybe<StringOperators>;
  firstName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  lastName?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type AdministratorList = PaginatedList & {
  __typename?: 'AdministratorList';
  items: Array<Administrator>;
  totalItems: Scalars['Int'];
};

export type AdministratorListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<AdministratorFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<AdministratorSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type AdministratorPaymentInput = {
  metadata?: InputMaybe<Scalars['JSON']>;
  paymentMethod?: InputMaybe<Scalars['String']>;
};

export type AdministratorRefundInput = {
  paymentId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
};

export type AdministratorSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  emailAddress?: InputMaybe<SortOrder>;
  firstName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastName?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type Allocation = Node & StockMovement & {
  __typename?: 'Allocation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  orderLine: OrderLine;
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

/** Returned if an attempting to refund an OrderItem which has already been refunded */
export type AlreadyRefundedError = ErrorResult & {
  __typename?: 'AlreadyRefundedError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  refundId: Scalars['ID'];
};

export type Asset = Node & {
  __typename?: 'Asset';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  fileSize: Scalars['Int'];
  focalPoint?: Maybe<Coordinate>;
  height: Scalars['Int'];
  id: Scalars['ID'];
  mimeType: Scalars['String'];
  name: Scalars['String'];
  preview: Scalars['String'];
  source: Scalars['String'];
  tags: Array<Tag>;
  type: AssetType;
  updatedAt: Scalars['DateTime'];
  width: Scalars['Int'];
};

export type AssetFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  fileSize?: InputMaybe<NumberOperators>;
  height?: InputMaybe<NumberOperators>;
  id?: InputMaybe<IdOperators>;
  mimeType?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  preview?: InputMaybe<StringOperators>;
  source?: InputMaybe<StringOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  width?: InputMaybe<NumberOperators>;
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList';
  items: Array<Asset>;
  totalItems: Scalars['Int'];
};

export type AssetListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<AssetFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<AssetSortParameter>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  tagsOperator?: InputMaybe<LogicalOperator>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type AssetSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  fileSize?: InputMaybe<SortOrder>;
  height?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  mimeType?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  preview?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  width?: InputMaybe<SortOrder>;
};

export enum AssetType {
  BINARY = 'BINARY',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type AssignAssetsToChannelInput = {
  assetIds: Array<Scalars['ID']>;
  channelId: Scalars['ID'];
};

export type AssignProductVariantsToChannelInput = {
  channelId: Scalars['ID'];
  priceFactor?: InputMaybe<Scalars['Float']>;
  productVariantIds: Array<Scalars['ID']>;
};

export type AssignProductsToChannelInput = {
  channelId: Scalars['ID'];
  priceFactor?: InputMaybe<Scalars['Float']>;
  productIds: Array<Scalars['ID']>;
};

export type AssignPromotionsToChannelInput = {
  channelId: Scalars['ID'];
  promotionIds: Array<Scalars['ID']>;
};

export type AuthenticationInput = {
  native?: InputMaybe<NativeAuthInput>;
};

export type AuthenticationMethod = Node & {
  __typename?: 'AuthenticationMethod';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  strategy: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type AuthenticationResult = CurrentUser | InvalidCredentialsError;

export type BooleanCustomFieldConfig = CustomField & {
  __typename?: 'BooleanCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

/** Operators for filtering on a list of Boolean fields */
export type BooleanListOperators = {
  inList: Scalars['Boolean'];
};

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: InputMaybe<Scalars['Boolean']>;
};

/** Returned if an attempting to cancel lines from an Order which is still active */
export type CancelActiveOrderError = ErrorResult & {
  __typename?: 'CancelActiveOrderError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  orderState: Scalars['String'];
};

export type CancelOrderInput = {
  /** Specify whether the shipping charges should also be cancelled. Defaults to false */
  cancelShipping?: InputMaybe<Scalars['Boolean']>;
  /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
  lines?: InputMaybe<Array<OrderLineInput>>;
  /** The id of the order to be cancelled */
  orderId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
};

export type CancelOrderResult = CancelActiveOrderError | EmptyOrderLineSelectionError | MultipleOrderError | Order | OrderStateTransitionError | QuantityTooGreatError;

export type Cancellation = Node & StockMovement & {
  __typename?: 'Cancellation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  orderLine: OrderLine;
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type Channel = Node & {
  __typename?: 'Channel';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']>;
  defaultLanguageCode: LanguageCode;
  defaultShippingZone?: Maybe<Zone>;
  defaultTaxZone?: Maybe<Zone>;
  id: Scalars['ID'];
  pricesIncludeTax: Scalars['Boolean'];
  token: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

/**
 * Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`
 * of the GlobalSettings
 */
export type ChannelDefaultLanguageError = ErrorResult & {
  __typename?: 'ChannelDefaultLanguageError';
  channelCode: Scalars['String'];
  errorCode: ErrorCode;
  language: Scalars['String'];
  message: Scalars['String'];
};

export type Collection = Node & {
  __typename?: 'Collection';
  assets: Array<Asset>;
  breadcrumbs: Array<CollectionBreadcrumb>;
  children?: Maybe<Array<Collection>>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  featuredAsset?: Maybe<Asset>;
  filters: Array<ConfigurableOperation>;
  id: Scalars['ID'];
  isPrivate: Scalars['Boolean'];
  languageCode?: Maybe<LanguageCode>;
  name: Scalars['String'];
  parent?: Maybe<Collection>;
  position: Scalars['Int'];
  productVariants: ProductVariantList;
  slug: Scalars['String'];
  translations: Array<CollectionTranslation>;
  updatedAt: Scalars['DateTime'];
};


export type CollectionProductVariantsArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
};

export type CollectionBreadcrumb = {
  __typename?: 'CollectionBreadcrumb';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type CollectionFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  isPrivate?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  position?: InputMaybe<NumberOperators>;
  slug?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CollectionList = PaginatedList & {
  __typename?: 'CollectionList';
  items: Array<Collection>;
  totalItems: Scalars['Int'];
};

export type CollectionListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CollectionFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CollectionSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

/**
 * Which Collections are present in the products returned
 * by the search, and in what quantity.
 */
export type CollectionResult = {
  __typename?: 'CollectionResult';
  collection: Collection;
  count: Scalars['Int'];
};

export type CollectionSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  position?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CollectionTranslation = {
  __typename?: 'CollectionTranslation';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ConfigArg = {
  __typename?: 'ConfigArg';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type ConfigArgDefinition = {
  __typename?: 'ConfigArgDefinition';
  defaultValue?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  required: Scalars['Boolean'];
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type ConfigArgInput = {
  name: Scalars['String'];
  /** A JSON stringified representation of the actual value */
  value: Scalars['String'];
};

export type ConfigurableOperation = {
  __typename?: 'ConfigurableOperation';
  args: Array<ConfigArg>;
  code: Scalars['String'];
};

export type ConfigurableOperationDefinition = {
  __typename?: 'ConfigurableOperationDefinition';
  args: Array<ConfigArgDefinition>;
  code: Scalars['String'];
  description: Scalars['String'];
};

export type ConfigurableOperationInput = {
  arguments: Array<ConfigArgInput>;
  code: Scalars['String'];
};

export type Coordinate = {
  __typename?: 'Coordinate';
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type CoordinateInput = {
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type Country = Node & {
  __typename?: 'Country';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  translations: Array<CountryTranslation>;
  updatedAt: Scalars['DateTime'];
};

export type CountryFilterParameter = {
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CountryList = PaginatedList & {
  __typename?: 'CountryList';
  items: Array<Country>;
  totalItems: Scalars['Int'];
};

export type CountryListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CountryFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CountrySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type CountrySortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CountryTranslation = {
  __typename?: 'CountryTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type CountryTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type CreateAddressInput = {
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  countryCode: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  defaultBillingAddress?: InputMaybe<Scalars['Boolean']>;
  defaultShippingAddress?: InputMaybe<Scalars['Boolean']>;
  fullName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  streetLine1: Scalars['String'];
  streetLine2?: InputMaybe<Scalars['String']>;
};

export type CreateAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  roleIds: Array<Scalars['ID']>;
};

export type CreateAssetInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  file: Scalars['Upload'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateAssetResult = Asset | MimeTypeError;

export type CreateChannelInput = {
  code: Scalars['String'];
  currencyCode: CurrencyCode;
  customFields?: InputMaybe<Scalars['JSON']>;
  defaultLanguageCode: LanguageCode;
  defaultShippingZoneId: Scalars['ID'];
  defaultTaxZoneId: Scalars['ID'];
  pricesIncludeTax: Scalars['Boolean'];
  token: Scalars['String'];
};

export type CreateChannelResult = Channel | LanguageNotAvailableError;

export type CreateCollectionInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  filters: Array<ConfigurableOperationInput>;
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  parentId?: InputMaybe<Scalars['ID']>;
  translations: Array<CreateCollectionTranslationInput>;
};

export type CreateCollectionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  description: Scalars['String'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type CreateCountryInput = {
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled: Scalars['Boolean'];
  translations: Array<CountryTranslationInput>;
};

export type CreateCustomerGroupInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  customerIds?: InputMaybe<Array<Scalars['ID']>>;
  name: Scalars['String'];
};

export type CreateCustomerInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateCustomerResult = Customer | EmailAddressConflictError;

export type CreateFacetInput = {
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  isPrivate: Scalars['Boolean'];
  translations: Array<FacetTranslationInput>;
  values?: InputMaybe<Array<CreateFacetValueWithFacetInput>>;
};

export type CreateFacetValueInput = {
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  facetId: Scalars['ID'];
  translations: Array<FacetValueTranslationInput>;
};

export type CreateFacetValueWithFacetInput = {
  code: Scalars['String'];
  translations: Array<FacetValueTranslationInput>;
};

/** Returned if an error is thrown in a FulfillmentHandler's createFulfillment method */
export type CreateFulfillmentError = ErrorResult & {
  __typename?: 'CreateFulfillmentError';
  errorCode: ErrorCode;
  fulfillmentHandlerError: Scalars['String'];
  message: Scalars['String'];
};

export type CreateGroupOptionInput = {
  code: Scalars['String'];
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreatePaymentMethodInput = {
  checker?: InputMaybe<ConfigurableOperationInput>;
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  handler: ConfigurableOperationInput;
  name: Scalars['String'];
};

export type CreateProductInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  translations: Array<ProductTranslationInput>;
};

export type CreateProductOptionGroupInput = {
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  options: Array<CreateGroupOptionInput>;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductOptionInput = {
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  productOptionGroupId: Scalars['ID'];
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductVariantInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  optionIds?: InputMaybe<Array<Scalars['ID']>>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Int']>;
  productId: Scalars['ID'];
  sku: Scalars['String'];
  stockOnHand?: InputMaybe<Scalars['Int']>;
  taxCategoryId?: InputMaybe<Scalars['ID']>;
  trackInventory?: InputMaybe<GlobalFlag>;
  translations: Array<ProductVariantTranslationInput>;
  useGlobalOutOfStockThreshold?: InputMaybe<Scalars['Boolean']>;
};

export type CreateProductVariantOptionInput = {
  code: Scalars['String'];
  optionGroupId: Scalars['ID'];
  translations: Array<ProductOptionTranslationInput>;
};

export type CreatePromotionInput = {
  actions: Array<ConfigurableOperationInput>;
  conditions: Array<ConfigurableOperationInput>;
  couponCode?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled: Scalars['Boolean'];
  endsAt?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  perCustomerUsageLimit?: InputMaybe<Scalars['Int']>;
  startsAt?: InputMaybe<Scalars['DateTime']>;
};

export type CreatePromotionResult = MissingConditionsError | Promotion;

export type CreateRoleInput = {
  channelIds?: InputMaybe<Array<Scalars['ID']>>;
  code: Scalars['String'];
  description: Scalars['String'];
  permissions: Array<Permission>;
};

export type CreateShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  code: Scalars['String'];
  customFields?: InputMaybe<Scalars['JSON']>;
  fulfillmentHandler: Scalars['String'];
  translations: Array<ShippingMethodTranslationInput>;
};

export type CreateTagInput = {
  value: Scalars['String'];
};

export type CreateTaxCategoryInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type CreateTaxRateInput = {
  categoryId: Scalars['ID'];
  customFields?: InputMaybe<Scalars['JSON']>;
  customerGroupId?: InputMaybe<Scalars['ID']>;
  enabled: Scalars['Boolean'];
  name: Scalars['String'];
  value: Scalars['Float'];
  zoneId: Scalars['ID'];
};

export type CreateZoneInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  name: Scalars['String'];
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export enum CurrencyCode {
  /** United Arab Emirates dirham */
  AED = 'AED',
  /** Afghan afghani */
  AFN = 'AFN',
  /** Albanian lek */
  ALL = 'ALL',
  /** Armenian dram */
  AMD = 'AMD',
  /** Netherlands Antillean guilder */
  ANG = 'ANG',
  /** Angolan kwanza */
  AOA = 'AOA',
  /** Argentine peso */
  ARS = 'ARS',
  /** Australian dollar */
  AUD = 'AUD',
  /** Aruban florin */
  AWG = 'AWG',
  /** Azerbaijani manat */
  AZN = 'AZN',
  /** Bosnia and Herzegovina convertible mark */
  BAM = 'BAM',
  /** Barbados dollar */
  BBD = 'BBD',
  /** Bangladeshi taka */
  BDT = 'BDT',
  /** Bulgarian lev */
  BGN = 'BGN',
  /** Bahraini dinar */
  BHD = 'BHD',
  /** Burundian franc */
  BIF = 'BIF',
  /** Bermudian dollar */
  BMD = 'BMD',
  /** Brunei dollar */
  BND = 'BND',
  /** Boliviano */
  BOB = 'BOB',
  /** Brazilian real */
  BRL = 'BRL',
  /** Bahamian dollar */
  BSD = 'BSD',
  /** Bhutanese ngultrum */
  BTN = 'BTN',
  /** Botswana pula */
  BWP = 'BWP',
  /** Belarusian ruble */
  BYN = 'BYN',
  /** Belize dollar */
  BZD = 'BZD',
  /** Canadian dollar */
  CAD = 'CAD',
  /** Congolese franc */
  CDF = 'CDF',
  /** Swiss franc */
  CHF = 'CHF',
  /** Chilean peso */
  CLP = 'CLP',
  /** Renminbi (Chinese) yuan */
  CNY = 'CNY',
  /** Colombian peso */
  COP = 'COP',
  /** Costa Rican colon */
  CRC = 'CRC',
  /** Cuban convertible peso */
  CUC = 'CUC',
  /** Cuban peso */
  CUP = 'CUP',
  /** Cape Verde escudo */
  CVE = 'CVE',
  /** Czech koruna */
  CZK = 'CZK',
  /** Djiboutian franc */
  DJF = 'DJF',
  /** Danish krone */
  DKK = 'DKK',
  /** Dominican peso */
  DOP = 'DOP',
  /** Algerian dinar */
  DZD = 'DZD',
  /** Egyptian pound */
  EGP = 'EGP',
  /** Eritrean nakfa */
  ERN = 'ERN',
  /** Ethiopian birr */
  ETB = 'ETB',
  /** Euro */
  EUR = 'EUR',
  /** Fiji dollar */
  FJD = 'FJD',
  /** Falkland Islands pound */
  FKP = 'FKP',
  /** Pound sterling */
  GBP = 'GBP',
  /** Georgian lari */
  GEL = 'GEL',
  /** Ghanaian cedi */
  GHS = 'GHS',
  /** Gibraltar pound */
  GIP = 'GIP',
  /** Gambian dalasi */
  GMD = 'GMD',
  /** Guinean franc */
  GNF = 'GNF',
  /** Guatemalan quetzal */
  GTQ = 'GTQ',
  /** Guyanese dollar */
  GYD = 'GYD',
  /** Hong Kong dollar */
  HKD = 'HKD',
  /** Honduran lempira */
  HNL = 'HNL',
  /** Croatian kuna */
  HRK = 'HRK',
  /** Haitian gourde */
  HTG = 'HTG',
  /** Hungarian forint */
  HUF = 'HUF',
  /** Indonesian rupiah */
  IDR = 'IDR',
  /** Israeli new shekel */
  ILS = 'ILS',
  /** Indian rupee */
  INR = 'INR',
  /** Iraqi dinar */
  IQD = 'IQD',
  /** Iranian rial */
  IRR = 'IRR',
  /** Icelandic króna */
  ISK = 'ISK',
  /** Jamaican dollar */
  JMD = 'JMD',
  /** Jordanian dinar */
  JOD = 'JOD',
  /** Japanese yen */
  JPY = 'JPY',
  /** Kenyan shilling */
  KES = 'KES',
  /** Kyrgyzstani som */
  KGS = 'KGS',
  /** Cambodian riel */
  KHR = 'KHR',
  /** Comoro franc */
  KMF = 'KMF',
  /** North Korean won */
  KPW = 'KPW',
  /** South Korean won */
  KRW = 'KRW',
  /** Kuwaiti dinar */
  KWD = 'KWD',
  /** Cayman Islands dollar */
  KYD = 'KYD',
  /** Kazakhstani tenge */
  KZT = 'KZT',
  /** Lao kip */
  LAK = 'LAK',
  /** Lebanese pound */
  LBP = 'LBP',
  /** Sri Lankan rupee */
  LKR = 'LKR',
  /** Liberian dollar */
  LRD = 'LRD',
  /** Lesotho loti */
  LSL = 'LSL',
  /** Libyan dinar */
  LYD = 'LYD',
  /** Moroccan dirham */
  MAD = 'MAD',
  /** Moldovan leu */
  MDL = 'MDL',
  /** Malagasy ariary */
  MGA = 'MGA',
  /** Macedonian denar */
  MKD = 'MKD',
  /** Myanmar kyat */
  MMK = 'MMK',
  /** Mongolian tögrög */
  MNT = 'MNT',
  /** Macanese pataca */
  MOP = 'MOP',
  /** Mauritanian ouguiya */
  MRU = 'MRU',
  /** Mauritian rupee */
  MUR = 'MUR',
  /** Maldivian rufiyaa */
  MVR = 'MVR',
  /** Malawian kwacha */
  MWK = 'MWK',
  /** Mexican peso */
  MXN = 'MXN',
  /** Malaysian ringgit */
  MYR = 'MYR',
  /** Mozambican metical */
  MZN = 'MZN',
  /** Namibian dollar */
  NAD = 'NAD',
  /** Nigerian naira */
  NGN = 'NGN',
  /** Nicaraguan córdoba */
  NIO = 'NIO',
  /** Norwegian krone */
  NOK = 'NOK',
  /** Nepalese rupee */
  NPR = 'NPR',
  /** New Zealand dollar */
  NZD = 'NZD',
  /** Omani rial */
  OMR = 'OMR',
  /** Panamanian balboa */
  PAB = 'PAB',
  /** Peruvian sol */
  PEN = 'PEN',
  /** Papua New Guinean kina */
  PGK = 'PGK',
  /** Philippine peso */
  PHP = 'PHP',
  /** Pakistani rupee */
  PKR = 'PKR',
  /** Polish złoty */
  PLN = 'PLN',
  /** Paraguayan guaraní */
  PYG = 'PYG',
  /** Qatari riyal */
  QAR = 'QAR',
  /** Romanian leu */
  RON = 'RON',
  /** Serbian dinar */
  RSD = 'RSD',
  /** Russian ruble */
  RUB = 'RUB',
  /** Rwandan franc */
  RWF = 'RWF',
  /** Saudi riyal */
  SAR = 'SAR',
  /** Solomon Islands dollar */
  SBD = 'SBD',
  /** Seychelles rupee */
  SCR = 'SCR',
  /** Sudanese pound */
  SDG = 'SDG',
  /** Swedish krona/kronor */
  SEK = 'SEK',
  /** Singapore dollar */
  SGD = 'SGD',
  /** Saint Helena pound */
  SHP = 'SHP',
  /** Sierra Leonean leone */
  SLL = 'SLL',
  /** Somali shilling */
  SOS = 'SOS',
  /** Surinamese dollar */
  SRD = 'SRD',
  /** South Sudanese pound */
  SSP = 'SSP',
  /** São Tomé and Príncipe dobra */
  STN = 'STN',
  /** Salvadoran colón */
  SVC = 'SVC',
  /** Syrian pound */
  SYP = 'SYP',
  /** Swazi lilangeni */
  SZL = 'SZL',
  /** Thai baht */
  THB = 'THB',
  /** Tajikistani somoni */
  TJS = 'TJS',
  /** Turkmenistan manat */
  TMT = 'TMT',
  /** Tunisian dinar */
  TND = 'TND',
  /** Tongan paʻanga */
  TOP = 'TOP',
  /** Turkish lira */
  TRY = 'TRY',
  /** Trinidad and Tobago dollar */
  TTD = 'TTD',
  /** New Taiwan dollar */
  TWD = 'TWD',
  /** Tanzanian shilling */
  TZS = 'TZS',
  /** Ukrainian hryvnia */
  UAH = 'UAH',
  /** Ugandan shilling */
  UGX = 'UGX',
  /** United States dollar */
  USD = 'USD',
  /** Uruguayan peso */
  UYU = 'UYU',
  /** Uzbekistan som */
  UZS = 'UZS',
  /** Venezuelan bolívar soberano */
  VES = 'VES',
  /** Vietnamese đồng */
  VND = 'VND',
  /** Vanuatu vatu */
  VUV = 'VUV',
  /** Samoan tala */
  WST = 'WST',
  /** CFA franc BEAC */
  XAF = 'XAF',
  /** East Caribbean dollar */
  XCD = 'XCD',
  /** CFA franc BCEAO */
  XOF = 'XOF',
  /** CFP franc (franc Pacifique) */
  XPF = 'XPF',
  /** Yemeni rial */
  YER = 'YER',
  /** South African rand */
  ZAR = 'ZAR',
  /** Zambian kwacha */
  ZMW = 'ZMW',
  /** Zimbabwean dollar */
  ZWL = 'ZWL'
}

export type CurrentUser = {
  __typename?: 'CurrentUser';
  channels: Array<CurrentUserChannel>;
  id: Scalars['ID'];
  identifier: Scalars['String'];
};

export type CurrentUserChannel = {
  __typename?: 'CurrentUserChannel';
  code: Scalars['String'];
  id: Scalars['ID'];
  permissions: Array<Permission>;
  token: Scalars['String'];
};

export type CurrentUserChannelInput = {
  code: Scalars['String'];
  id: Scalars['ID'];
  permissions: Array<Permission>;
  token: Scalars['String'];
};

export type CustomField = {
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type CustomFieldConfig = BooleanCustomFieldConfig | DateTimeCustomFieldConfig | FloatCustomFieldConfig | IntCustomFieldConfig | LocaleStringCustomFieldConfig | RelationCustomFieldConfig | StringCustomFieldConfig | TextCustomFieldConfig;

export type CustomFields = {
  __typename?: 'CustomFields';
  Address: Array<CustomFieldConfig>;
  Administrator: Array<CustomFieldConfig>;
  Asset: Array<CustomFieldConfig>;
  Channel: Array<CustomFieldConfig>;
  Collection: Array<CustomFieldConfig>;
  Country: Array<CustomFieldConfig>;
  Customer: Array<CustomFieldConfig>;
  CustomerGroup: Array<CustomFieldConfig>;
  Facet: Array<CustomFieldConfig>;
  FacetValue: Array<CustomFieldConfig>;
  Fulfillment: Array<CustomFieldConfig>;
  GlobalSettings: Array<CustomFieldConfig>;
  Order: Array<CustomFieldConfig>;
  OrderLine: Array<CustomFieldConfig>;
  PaymentMethod: Array<CustomFieldConfig>;
  Product: Array<CustomFieldConfig>;
  ProductOption: Array<CustomFieldConfig>;
  ProductOptionGroup: Array<CustomFieldConfig>;
  ProductVariant: Array<CustomFieldConfig>;
  Promotion: Array<CustomFieldConfig>;
  ShippingMethod: Array<CustomFieldConfig>;
  TaxCategory: Array<CustomFieldConfig>;
  TaxRate: Array<CustomFieldConfig>;
  User: Array<CustomFieldConfig>;
  Zone: Array<CustomFieldConfig>;
};

export type Customer = Node & {
  __typename?: 'Customer';
  addresses?: Maybe<Array<Address>>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  groups: Array<CustomerGroup>;
  history: HistoryEntryList;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orders: OrderList;
  phoneNumber?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
};


export type CustomerHistoryArgs = {
  options?: InputMaybe<HistoryEntryListOptions>;
};


export type CustomerOrdersArgs = {
  options?: InputMaybe<OrderListOptions>;
};

export type CustomerFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  emailAddress?: InputMaybe<StringOperators>;
  firstName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  lastName?: InputMaybe<StringOperators>;
  phoneNumber?: InputMaybe<StringOperators>;
  postalCode?: InputMaybe<StringOperators>;
  title?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CustomerGroup = Node & {
  __typename?: 'CustomerGroup';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  customers: CustomerList;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};


export type CustomerGroupCustomersArgs = {
  options?: InputMaybe<CustomerListOptions>;
};

export type CustomerGroupFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CustomerGroupList = PaginatedList & {
  __typename?: 'CustomerGroupList';
  items: Array<CustomerGroup>;
  totalItems: Scalars['Int'];
};

export type CustomerGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CustomerGroupFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CustomerGroupSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type CustomerGroupSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CustomerList = PaginatedList & {
  __typename?: 'CustomerList';
  items: Array<Customer>;
  totalItems: Scalars['Int'];
};

export type CustomerListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CustomerFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CustomerSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type CustomerSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  emailAddress?: InputMaybe<SortOrder>;
  firstName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastName?: InputMaybe<SortOrder>;
  phoneNumber?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Operators for filtering on a list of Date fields */
export type DateListOperators = {
  inList: Scalars['DateTime'];
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: InputMaybe<Scalars['DateTime']>;
  before?: InputMaybe<Scalars['DateTime']>;
  between?: InputMaybe<DateRange>;
  eq?: InputMaybe<Scalars['DateTime']>;
};

export type DateRange = {
  end: Scalars['DateTime'];
  start: Scalars['DateTime'];
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
  __typename?: 'DateTimeCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  max?: Maybe<Scalars['String']>;
  min?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  step?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type DeleteAssetInput = {
  assetId: Scalars['ID'];
  deleteFromAllChannels?: InputMaybe<Scalars['Boolean']>;
  force?: InputMaybe<Scalars['Boolean']>;
};

export type DeleteAssetsInput = {
  assetIds: Array<Scalars['ID']>;
  deleteFromAllChannels?: InputMaybe<Scalars['Boolean']>;
  force?: InputMaybe<Scalars['Boolean']>;
};

export type DeletionResponse = {
  __typename?: 'DeletionResponse';
  message?: Maybe<Scalars['String']>;
  result: DeletionResult;
};

export enum DeletionResult {
  /** The entity was successfully deleted */
  DELETED = 'DELETED',
  /** Deletion did not take place, reason given in message */
  NOT_DELETED = 'NOT_DELETED'
}

export type Discount = {
  __typename?: 'Discount';
  adjustmentSource: Scalars['String'];
  amount: Scalars['Int'];
  amountWithTax: Scalars['Int'];
  description: Scalars['String'];
  type: AdjustmentType;
};

/** Returned when attempting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
  __typename?: 'EmailAddressConflictError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if no OrderLines have been specified for the operation */
export type EmptyOrderLineSelectionError = ErrorResult & {
  __typename?: 'EmptyOrderLineSelectionError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export enum ErrorCode {
  ALREADY_REFUNDED_ERROR = 'ALREADY_REFUNDED_ERROR',
  CANCEL_ACTIVE_ORDER_ERROR = 'CANCEL_ACTIVE_ORDER_ERROR',
  CHANNEL_DEFAULT_LANGUAGE_ERROR = 'CHANNEL_DEFAULT_LANGUAGE_ERROR',
  CREATE_FULFILLMENT_ERROR = 'CREATE_FULFILLMENT_ERROR',
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
  EMPTY_ORDER_LINE_SELECTION_ERROR = 'EMPTY_ORDER_LINE_SELECTION_ERROR',
  FULFILLMENT_STATE_TRANSITION_ERROR = 'FULFILLMENT_STATE_TRANSITION_ERROR',
  INSUFFICIENT_STOCK_ERROR = 'INSUFFICIENT_STOCK_ERROR',
  INSUFFICIENT_STOCK_ON_HAND_ERROR = 'INSUFFICIENT_STOCK_ON_HAND_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
  INVALID_FULFILLMENT_HANDLER_ERROR = 'INVALID_FULFILLMENT_HANDLER_ERROR',
  ITEMS_ALREADY_FULFILLED_ERROR = 'ITEMS_ALREADY_FULFILLED_ERROR',
  LANGUAGE_NOT_AVAILABLE_ERROR = 'LANGUAGE_NOT_AVAILABLE_ERROR',
  MANUAL_PAYMENT_STATE_ERROR = 'MANUAL_PAYMENT_STATE_ERROR',
  MIME_TYPE_ERROR = 'MIME_TYPE_ERROR',
  MISSING_CONDITIONS_ERROR = 'MISSING_CONDITIONS_ERROR',
  MULTIPLE_ORDER_ERROR = 'MULTIPLE_ORDER_ERROR',
  NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
  NEGATIVE_QUANTITY_ERROR = 'NEGATIVE_QUANTITY_ERROR',
  NOTHING_TO_REFUND_ERROR = 'NOTHING_TO_REFUND_ERROR',
  NO_CHANGES_SPECIFIED_ERROR = 'NO_CHANGES_SPECIFIED_ERROR',
  ORDER_LIMIT_ERROR = 'ORDER_LIMIT_ERROR',
  ORDER_MODIFICATION_STATE_ERROR = 'ORDER_MODIFICATION_STATE_ERROR',
  ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
  PAYMENT_METHOD_MISSING_ERROR = 'PAYMENT_METHOD_MISSING_ERROR',
  PAYMENT_ORDER_MISMATCH_ERROR = 'PAYMENT_ORDER_MISMATCH_ERROR',
  PAYMENT_STATE_TRANSITION_ERROR = 'PAYMENT_STATE_TRANSITION_ERROR',
  PRODUCT_OPTION_IN_USE_ERROR = 'PRODUCT_OPTION_IN_USE_ERROR',
  QUANTITY_TOO_GREAT_ERROR = 'QUANTITY_TOO_GREAT_ERROR',
  REFUND_ORDER_STATE_ERROR = 'REFUND_ORDER_STATE_ERROR',
  REFUND_PAYMENT_ID_MISSING_ERROR = 'REFUND_PAYMENT_ID_MISSING_ERROR',
  REFUND_STATE_TRANSITION_ERROR = 'REFUND_STATE_TRANSITION_ERROR',
  SETTLE_PAYMENT_ERROR = 'SETTLE_PAYMENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export type ErrorResult = {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Facet = Node & {
  __typename?: 'Facet';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  isPrivate: Scalars['Boolean'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  translations: Array<FacetTranslation>;
  updatedAt: Scalars['DateTime'];
  values: Array<FacetValue>;
};

export type FacetFilterParameter = {
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  isPrivate?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type FacetList = PaginatedList & {
  __typename?: 'FacetList';
  items: Array<Facet>;
  totalItems: Scalars['Int'];
};

export type FacetListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<FacetFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<FacetSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type FacetSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type FacetTranslation = {
  __typename?: 'FacetTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type FacetTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type FacetValue = Node & {
  __typename?: 'FacetValue';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  facet: Facet;
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  translations: Array<FacetValueTranslation>;
  updatedAt: Scalars['DateTime'];
};

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
  and?: InputMaybe<Scalars['ID']>;
  or?: InputMaybe<Array<Scalars['ID']>>;
};

/**
 * Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
  __typename?: 'FacetValueResult';
  count: Scalars['Int'];
  facetValue: FacetValue;
};

export type FacetValueTranslation = {
  __typename?: 'FacetValueTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type FacetValueTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type FloatCustomFieldConfig = CustomField & {
  __typename?: 'FloatCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  max?: Maybe<Scalars['Float']>;
  min?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  step?: Maybe<Scalars['Float']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type FulfillOrderInput = {
  handler: ConfigurableOperationInput;
  lines: Array<OrderLineInput>;
};

export type Fulfillment = Node & {
  __typename?: 'Fulfillment';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  method: Scalars['String'];
  nextStates: Array<Scalars['String']>;
  orderItems: Array<OrderItem>;
  state: Scalars['String'];
  trackingCode?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

/** Returned when there is an error in transitioning the Fulfillment state */
export type FulfillmentStateTransitionError = ErrorResult & {
  __typename?: 'FulfillmentStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String'];
  message: Scalars['String'];
  toState: Scalars['String'];
  transitionError: Scalars['String'];
};

export enum GlobalFlag {
  FALSE = 'FALSE',
  INHERIT = 'INHERIT',
  TRUE = 'TRUE'
}

export type GlobalSettings = {
  __typename?: 'GlobalSettings';
  availableLanguages: Array<LanguageCode>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  outOfStockThreshold: Scalars['Int'];
  serverConfig: ServerConfig;
  trackInventory: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type HistoryEntry = Node & {
  __typename?: 'HistoryEntry';
  administrator?: Maybe<Administrator>;
  createdAt: Scalars['DateTime'];
  data: Scalars['JSON'];
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  type: HistoryEntryType;
  updatedAt: Scalars['DateTime'];
};

export type HistoryEntryFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  isPublic?: InputMaybe<BooleanOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type HistoryEntryList = PaginatedList & {
  __typename?: 'HistoryEntryList';
  items: Array<HistoryEntry>;
  totalItems: Scalars['Int'];
};

export type HistoryEntryListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<HistoryEntryFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<HistoryEntrySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type HistoryEntrySortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum HistoryEntryType {
  CUSTOMER_ADDED_TO_GROUP = 'CUSTOMER_ADDED_TO_GROUP',
  CUSTOMER_ADDRESS_CREATED = 'CUSTOMER_ADDRESS_CREATED',
  CUSTOMER_ADDRESS_DELETED = 'CUSTOMER_ADDRESS_DELETED',
  CUSTOMER_ADDRESS_UPDATED = 'CUSTOMER_ADDRESS_UPDATED',
  CUSTOMER_DETAIL_UPDATED = 'CUSTOMER_DETAIL_UPDATED',
  CUSTOMER_EMAIL_UPDATE_REQUESTED = 'CUSTOMER_EMAIL_UPDATE_REQUESTED',
  CUSTOMER_EMAIL_UPDATE_VERIFIED = 'CUSTOMER_EMAIL_UPDATE_VERIFIED',
  CUSTOMER_NOTE = 'CUSTOMER_NOTE',
  CUSTOMER_PASSWORD_RESET_REQUESTED = 'CUSTOMER_PASSWORD_RESET_REQUESTED',
  CUSTOMER_PASSWORD_RESET_VERIFIED = 'CUSTOMER_PASSWORD_RESET_VERIFIED',
  CUSTOMER_PASSWORD_UPDATED = 'CUSTOMER_PASSWORD_UPDATED',
  CUSTOMER_REGISTERED = 'CUSTOMER_REGISTERED',
  CUSTOMER_REMOVED_FROM_GROUP = 'CUSTOMER_REMOVED_FROM_GROUP',
  CUSTOMER_VERIFIED = 'CUSTOMER_VERIFIED',
  ORDER_CANCELLATION = 'ORDER_CANCELLATION',
  ORDER_COUPON_APPLIED = 'ORDER_COUPON_APPLIED',
  ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED',
  ORDER_FULFILLMENT = 'ORDER_FULFILLMENT',
  ORDER_FULFILLMENT_TRANSITION = 'ORDER_FULFILLMENT_TRANSITION',
  ORDER_MODIFIED = 'ORDER_MODIFIED',
  ORDER_NOTE = 'ORDER_NOTE',
  ORDER_PAYMENT_TRANSITION = 'ORDER_PAYMENT_TRANSITION',
  ORDER_REFUND_TRANSITION = 'ORDER_REFUND_TRANSITION',
  ORDER_STATE_TRANSITION = 'ORDER_STATE_TRANSITION'
}

/** Operators for filtering on a list of ID fields */
export type IdListOperators = {
  inList: Scalars['ID'];
};

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  notEq?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
};

export type ImportInfo = {
  __typename?: 'ImportInfo';
  errors?: Maybe<Array<Scalars['String']>>;
  imported: Scalars['Int'];
  processed: Scalars['Int'];
};

/** Returned when attempting to add more items to the Order than are available */
export type InsufficientStockError = ErrorResult & {
  __typename?: 'InsufficientStockError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  order: Order;
  quantityAvailable: Scalars['Int'];
};

/**
 * Returned if attempting to create a Fulfillment when there is insufficient
 * stockOnHand of a ProductVariant to satisfy the requested quantity.
 */
export type InsufficientStockOnHandError = ErrorResult & {
  __typename?: 'InsufficientStockOnHandError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  productVariantId: Scalars['ID'];
  productVariantName: Scalars['String'];
  stockOnHand: Scalars['Int'];
};

export type IntCustomFieldConfig = CustomField & {
  __typename?: 'IntCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  max?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  step?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

/** Returned if the user authentication credentials are not valid */
export type InvalidCredentialsError = ErrorResult & {
  __typename?: 'InvalidCredentialsError';
  authenticationError: Scalars['String'];
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if the specified FulfillmentHandler code is not valid */
export type InvalidFulfillmentHandlerError = ErrorResult & {
  __typename?: 'InvalidFulfillmentHandlerError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned if the specified items are already part of a Fulfillment */
export type ItemsAlreadyFulfilledError = ErrorResult & {
  __typename?: 'ItemsAlreadyFulfilledError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Job = Node & {
  __typename?: 'Job';
  attempts: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  data?: Maybe<Scalars['JSON']>;
  duration: Scalars['Int'];
  error?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  isSettled: Scalars['Boolean'];
  progress: Scalars['Float'];
  queueName: Scalars['String'];
  result?: Maybe<Scalars['JSON']>;
  retries: Scalars['Int'];
  settledAt?: Maybe<Scalars['DateTime']>;
  startedAt?: Maybe<Scalars['DateTime']>;
  state: JobState;
};

export type JobBufferSize = {
  __typename?: 'JobBufferSize';
  bufferId: Scalars['String'];
  size: Scalars['Int'];
};

export type JobFilterParameter = {
  attempts?: InputMaybe<NumberOperators>;
  createdAt?: InputMaybe<DateOperators>;
  duration?: InputMaybe<NumberOperators>;
  id?: InputMaybe<IdOperators>;
  isSettled?: InputMaybe<BooleanOperators>;
  progress?: InputMaybe<NumberOperators>;
  queueName?: InputMaybe<StringOperators>;
  retries?: InputMaybe<NumberOperators>;
  settledAt?: InputMaybe<DateOperators>;
  startedAt?: InputMaybe<DateOperators>;
  state?: InputMaybe<StringOperators>;
};

export type JobList = PaginatedList & {
  __typename?: 'JobList';
  items: Array<Job>;
  totalItems: Scalars['Int'];
};

export type JobListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<JobFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<JobSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type JobQueue = {
  __typename?: 'JobQueue';
  name: Scalars['String'];
  running: Scalars['Boolean'];
};

export type JobSortParameter = {
  attempts?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  duration?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  progress?: InputMaybe<SortOrder>;
  queueName?: InputMaybe<SortOrder>;
  retries?: InputMaybe<SortOrder>;
  settledAt?: InputMaybe<SortOrder>;
  startedAt?: InputMaybe<SortOrder>;
};

/**
 * @description
 * The state of a Job in the JobQueue
 *
 * @docsCategory common
 */
export enum JobState {
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  RETRYING = 'RETRYING',
  RUNNING = 'RUNNING'
}

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export enum LanguageCode {
  /** Afrikaans */
  af = 'af',
  /** Akan */
  ak = 'ak',
  /** Amharic */
  am = 'am',
  /** Arabic */
  ar = 'ar',
  /** Assamese */
  as = 'as',
  /** Azerbaijani */
  az = 'az',
  /** Belarusian */
  be = 'be',
  /** Bulgarian */
  bg = 'bg',
  /** Bambara */
  bm = 'bm',
  /** Bangla */
  bn = 'bn',
  /** Tibetan */
  bo = 'bo',
  /** Breton */
  br = 'br',
  /** Bosnian */
  bs = 'bs',
  /** Catalan */
  ca = 'ca',
  /** Chechen */
  ce = 'ce',
  /** Corsican */
  co = 'co',
  /** Czech */
  cs = 'cs',
  /** Church Slavic */
  cu = 'cu',
  /** Welsh */
  cy = 'cy',
  /** Danish */
  da = 'da',
  /** German */
  de = 'de',
  /** Austrian German */
  de_AT = 'de_AT',
  /** Swiss High German */
  de_CH = 'de_CH',
  /** Dzongkha */
  dz = 'dz',
  /** Ewe */
  ee = 'ee',
  /** Greek */
  el = 'el',
  /** English */
  en = 'en',
  /** Australian English */
  en_AU = 'en_AU',
  /** Canadian English */
  en_CA = 'en_CA',
  /** British English */
  en_GB = 'en_GB',
  /** American English */
  en_US = 'en_US',
  /** Esperanto */
  eo = 'eo',
  /** Spanish */
  es = 'es',
  /** European Spanish */
  es_ES = 'es_ES',
  /** Mexican Spanish */
  es_MX = 'es_MX',
  /** Estonian */
  et = 'et',
  /** Basque */
  eu = 'eu',
  /** Persian */
  fa = 'fa',
  /** Dari */
  fa_AF = 'fa_AF',
  /** Fulah */
  ff = 'ff',
  /** Finnish */
  fi = 'fi',
  /** Faroese */
  fo = 'fo',
  /** French */
  fr = 'fr',
  /** Canadian French */
  fr_CA = 'fr_CA',
  /** Swiss French */
  fr_CH = 'fr_CH',
  /** Western Frisian */
  fy = 'fy',
  /** Irish */
  ga = 'ga',
  /** Scottish Gaelic */
  gd = 'gd',
  /** Galician */
  gl = 'gl',
  /** Gujarati */
  gu = 'gu',
  /** Manx */
  gv = 'gv',
  /** Hausa */
  ha = 'ha',
  /** Hebrew */
  he = 'he',
  /** Hindi */
  hi = 'hi',
  /** Croatian */
  hr = 'hr',
  /** Haitian Creole */
  ht = 'ht',
  /** Hungarian */
  hu = 'hu',
  /** Armenian */
  hy = 'hy',
  /** Interlingua */
  ia = 'ia',
  /** Indonesian */
  id = 'id',
  /** Igbo */
  ig = 'ig',
  /** Sichuan Yi */
  ii = 'ii',
  /** Icelandic */
  is = 'is',
  /** Italian */
  it = 'it',
  /** Japanese */
  ja = 'ja',
  /** Javanese */
  jv = 'jv',
  /** Georgian */
  ka = 'ka',
  /** Kikuyu */
  ki = 'ki',
  /** Kazakh */
  kk = 'kk',
  /** Kalaallisut */
  kl = 'kl',
  /** Khmer */
  km = 'km',
  /** Kannada */
  kn = 'kn',
  /** Korean */
  ko = 'ko',
  /** Kashmiri */
  ks = 'ks',
  /** Kurdish */
  ku = 'ku',
  /** Cornish */
  kw = 'kw',
  /** Kyrgyz */
  ky = 'ky',
  /** Latin */
  la = 'la',
  /** Luxembourgish */
  lb = 'lb',
  /** Ganda */
  lg = 'lg',
  /** Lingala */
  ln = 'ln',
  /** Lao */
  lo = 'lo',
  /** Lithuanian */
  lt = 'lt',
  /** Luba-Katanga */
  lu = 'lu',
  /** Latvian */
  lv = 'lv',
  /** Malagasy */
  mg = 'mg',
  /** Maori */
  mi = 'mi',
  /** Macedonian */
  mk = 'mk',
  /** Malayalam */
  ml = 'ml',
  /** Mongolian */
  mn = 'mn',
  /** Marathi */
  mr = 'mr',
  /** Malay */
  ms = 'ms',
  /** Maltese */
  mt = 'mt',
  /** Burmese */
  my = 'my',
  /** Norwegian Bokmål */
  nb = 'nb',
  /** North Ndebele */
  nd = 'nd',
  /** Nepali */
  ne = 'ne',
  /** Dutch */
  nl = 'nl',
  /** Flemish */
  nl_BE = 'nl_BE',
  /** Norwegian Nynorsk */
  nn = 'nn',
  /** Nyanja */
  ny = 'ny',
  /** Oromo */
  om = 'om',
  /** Odia */
  or = 'or',
  /** Ossetic */
  os = 'os',
  /** Punjabi */
  pa = 'pa',
  /** Polish */
  pl = 'pl',
  /** Pashto */
  ps = 'ps',
  /** Portuguese */
  pt = 'pt',
  /** Brazilian Portuguese */
  pt_BR = 'pt_BR',
  /** European Portuguese */
  pt_PT = 'pt_PT',
  /** Quechua */
  qu = 'qu',
  /** Romansh */
  rm = 'rm',
  /** Rundi */
  rn = 'rn',
  /** Romanian */
  ro = 'ro',
  /** Moldavian */
  ro_MD = 'ro_MD',
  /** Russian */
  ru = 'ru',
  /** Kinyarwanda */
  rw = 'rw',
  /** Sanskrit */
  sa = 'sa',
  /** Sindhi */
  sd = 'sd',
  /** Northern Sami */
  se = 'se',
  /** Sango */
  sg = 'sg',
  /** Sinhala */
  si = 'si',
  /** Slovak */
  sk = 'sk',
  /** Slovenian */
  sl = 'sl',
  /** Samoan */
  sm = 'sm',
  /** Shona */
  sn = 'sn',
  /** Somali */
  so = 'so',
  /** Albanian */
  sq = 'sq',
  /** Serbian */
  sr = 'sr',
  /** Southern Sotho */
  st = 'st',
  /** Sundanese */
  su = 'su',
  /** Swedish */
  sv = 'sv',
  /** Swahili */
  sw = 'sw',
  /** Congo Swahili */
  sw_CD = 'sw_CD',
  /** Tamil */
  ta = 'ta',
  /** Telugu */
  te = 'te',
  /** Tajik */
  tg = 'tg',
  /** Thai */
  th = 'th',
  /** Tigrinya */
  ti = 'ti',
  /** Turkmen */
  tk = 'tk',
  /** Tongan */
  to = 'to',
  /** Turkish */
  tr = 'tr',
  /** Tatar */
  tt = 'tt',
  /** Uyghur */
  ug = 'ug',
  /** Ukrainian */
  uk = 'uk',
  /** Urdu */
  ur = 'ur',
  /** Uzbek */
  uz = 'uz',
  /** Vietnamese */
  vi = 'vi',
  /** Volapük */
  vo = 'vo',
  /** Wolof */
  wo = 'wo',
  /** Xhosa */
  xh = 'xh',
  /** Yiddish */
  yi = 'yi',
  /** Yoruba */
  yo = 'yo',
  /** Chinese */
  zh = 'zh',
  /** Simplified Chinese */
  zh_Hans = 'zh_Hans',
  /** Traditional Chinese */
  zh_Hant = 'zh_Hant',
  /** Zulu */
  zu = 'zu'
}

/** Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings */
export type LanguageNotAvailableError = ErrorResult & {
  __typename?: 'LanguageNotAvailableError';
  errorCode: ErrorCode;
  languageCode: Scalars['String'];
  message: Scalars['String'];
};

export type LocaleStringCustomFieldConfig = CustomField & {
  __typename?: 'LocaleStringCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  length?: Maybe<Scalars['Int']>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  pattern?: Maybe<Scalars['String']>;
  readonly?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type LocalizedString = {
  __typename?: 'LocalizedString';
  languageCode: LanguageCode;
  value: Scalars['String'];
};

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

export type ManualPaymentInput = {
  metadata?: InputMaybe<Scalars['JSON']>;
  method: Scalars['String'];
  orderId: Scalars['ID'];
  transactionId?: InputMaybe<Scalars['String']>;
};

/**
 * Returned when a call to addManualPaymentToOrder is made but the Order
 * is not in the required state.
 */
export type ManualPaymentStateError = ErrorResult & {
  __typename?: 'ManualPaymentStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type MimeTypeError = ErrorResult & {
  __typename?: 'MimeTypeError';
  errorCode: ErrorCode;
  fileName: Scalars['String'];
  message: Scalars['String'];
  mimeType: Scalars['String'];
};

/** Returned if a PromotionCondition has neither a couponCode nor any conditions set */
export type MissingConditionsError = ErrorResult & {
  __typename?: 'MissingConditionsError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type ModifyOrderInput = {
  addItems?: InputMaybe<Array<AddItemInput>>;
  adjustOrderLines?: InputMaybe<Array<AdjustOrderLineInput>>;
  dryRun: Scalars['Boolean'];
  note?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<ModifyOrderOptions>;
  orderId: Scalars['ID'];
  refund?: InputMaybe<AdministratorRefundInput>;
  surcharges?: InputMaybe<Array<SurchargeInput>>;
  updateBillingAddress?: InputMaybe<UpdateOrderAddressInput>;
  updateShippingAddress?: InputMaybe<UpdateOrderAddressInput>;
};

export type ModifyOrderOptions = {
  freezePromotions?: InputMaybe<Scalars['Boolean']>;
  recalculateShipping?: InputMaybe<Scalars['Boolean']>;
};

export type ModifyOrderResult = InsufficientStockError | NegativeQuantityError | NoChangesSpecifiedError | Order | OrderLimitError | OrderModificationStateError | PaymentMethodMissingError | RefundPaymentIdMissingError;

export type MoveCollectionInput = {
  collectionId: Scalars['ID'];
  index: Scalars['Int'];
  parentId: Scalars['ID'];
};

/** Returned if an operation has specified OrderLines from multiple Orders */
export type MultipleOrderError = ErrorResult & {
  __typename?: 'MultipleOrderError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup;
  addFulfillmentToOrder: AddFulfillmentToOrderResult;
  /**
   * Used to manually create a new Payment against an Order.
   * This can be used by an Administrator when an Order is in the ArrangingPayment state.
   *
   * It is also used when a completed Order
   * has been modified (using `modifyOrder`) and the price has increased. The extra payment
   * can then be manually arranged by the administrator, and the details used to create a new
   * Payment.
   */
  addManualPaymentToOrder: AddManualPaymentToOrderResult;
  /** Add members to a Zone */
  addMembersToZone: Zone;
  addNoteToCustomer: Customer;
  addNoteToOrder: Order;
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product;
  /** Assign assets to channel */
  assignAssetsToChannel: Array<Asset>;
  /** Assigns ProductVariants to the specified Channel */
  assignProductVariantsToChannel: Array<ProductVariant>;
  /** Assigns all ProductVariants of Product to the specified Channel */
  assignProductsToChannel: Array<Product>;
  /** Assigns Promotions to the specified Channel */
  assignPromotionsToChannel: Array<Promotion>;
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator;
  /** Authenticates the user using a named authentication strategy */
  authenticate: AuthenticationResult;
  cancelJob: Job;
  cancelOrder: CancelOrderResult;
  /** Create a new Administrator */
  createAdministrator: Administrator;
  /** Create a new Asset */
  createAssets: Array<CreateAssetResult>;
  /** Create a new Channel */
  createChannel: CreateChannelResult;
  /** Create a new Collection */
  createCollection: Collection;
  /** Create a new Country */
  createCountry: Country;
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: CreateCustomerResult;
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address;
  /** Create a new CustomerGroup */
  createCustomerGroup: CustomerGroup;
  /** Create a new Facet */
  createFacet: Facet;
  /** Create one or more FacetValues */
  createFacetValues: Array<FacetValue>;
  /** Create existing PaymentMethod */
  createPaymentMethod: PaymentMethod;
  /** Create a new Product */
  createProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  createProductOption: ProductOption;
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup;
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  createProductVariants: Array<Maybe<ProductVariant>>;
  createPromotion: CreatePromotionResult;
  /** Create a new Role */
  createRole: Role;
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod;
  /** Create a new Tag */
  createTag: Tag;
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory;
  /** Create a new TaxRate */
  createTaxRate: TaxRate;
  /** Create a new Zone */
  createZone: Zone;
  /** Delete an Administrator */
  deleteAdministrator: DeletionResponse;
  /** Delete an Asset */
  deleteAsset: DeletionResponse;
  /** Delete multiple Assets */
  deleteAssets: DeletionResponse;
  /** Delete a Channel */
  deleteChannel: DeletionResponse;
  /** Delete a Collection and all of its descendants */
  deleteCollection: DeletionResponse;
  /** Delete a Country */
  deleteCountry: DeletionResponse;
  /** Delete a Customer */
  deleteCustomer: DeletionResponse;
  /** Update an existing Address */
  deleteCustomerAddress: Success;
  /** Delete a CustomerGroup */
  deleteCustomerGroup: DeletionResponse;
  deleteCustomerNote: DeletionResponse;
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse;
  /** Delete one or more FacetValues */
  deleteFacetValues: Array<DeletionResponse>;
  deleteOrderNote: DeletionResponse;
  /** Delete a PaymentMethod */
  deletePaymentMethod: DeletionResponse;
  /** Delete a Product */
  deleteProduct: DeletionResponse;
  /** Delete a ProductVariant */
  deleteProductVariant: DeletionResponse;
  deletePromotion: DeletionResponse;
  /** Delete an existing Role */
  deleteRole: DeletionResponse;
  /** Delete a ShippingMethod */
  deleteShippingMethod: DeletionResponse;
  /** Delete an existing Tag */
  deleteTag: DeletionResponse;
  /** Deletes a TaxCategory */
  deleteTaxCategory: DeletionResponse;
  /** Delete a TaxRate */
  deleteTaxRate: DeletionResponse;
  /** Delete a Zone */
  deleteZone: DeletionResponse;
  flushBufferedJobs: Success;
  importProducts?: Maybe<ImportInfo>;
  /** Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})` */
  login: NativeAuthenticationResult;
  logout: Success;
  /**
   * Allows an Order to be modified after it has been completed by the Customer. The Order must first
   * be in the `Modifying` state.
   */
  modifyOrder: ModifyOrderResult;
  /** Move a Collection to a different parent or index */
  moveCollection: Collection;
  refundOrder: RefundOrderResult;
  reindex: Job;
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup;
  /** Remove members from a Zone */
  removeMembersFromZone: Zone;
  /** Remove an OptionGroup from a Product */
  removeOptionGroupFromProduct: RemoveOptionGroupFromProductResult;
  /** Removes ProductVariants from the specified Channel */
  removeProductVariantsFromChannel: Array<ProductVariant>;
  /** Removes all ProductVariants of Product from the specified Channel */
  removeProductsFromChannel: Array<Product>;
  /** Removes Promotions from the specified Channel */
  removePromotionsFromChannel: Array<Promotion>;
  /** Remove all settled jobs in the given queues older than the given date. Returns the number of jobs deleted. */
  removeSettledJobs: Scalars['Int'];
  requestCompleted: Scalars['Int'];
  requestStarted: Scalars['Int'];
  runPendingSearchIndexUpdates: Success;
  setActiveChannel: UserStatus;
  setAsLoggedIn: UserStatus;
  setAsLoggedOut: UserStatus;
  setContentLanguage: LanguageCode;
  setDisplayUiExtensionPoints: Scalars['Boolean'];
  setOrderCustomFields?: Maybe<Order>;
  setUiLanguage: LanguageCode;
  setUiLocale?: Maybe<Scalars['String']>;
  setUiTheme: Scalars['String'];
  settlePayment: SettlePaymentResult;
  settleRefund: SettleRefundResult;
  transitionFulfillmentToState: TransitionFulfillmentToStateResult;
  transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
  transitionPaymentToState: TransitionPaymentToStateResult;
  /** Update the active (currently logged-in) Administrator */
  updateActiveAdministrator: Administrator;
  /** Update an existing Administrator */
  updateAdministrator: Administrator;
  /** Update an existing Asset */
  updateAsset: Asset;
  /** Update an existing Channel */
  updateChannel: UpdateChannelResult;
  /** Update an existing Collection */
  updateCollection: Collection;
  /** Update an existing Country */
  updateCountry: Country;
  /** Update an existing Customer */
  updateCustomer: UpdateCustomerResult;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /** Update an existing CustomerGroup */
  updateCustomerGroup: CustomerGroup;
  updateCustomerNote: HistoryEntry;
  /** Update an existing Facet */
  updateFacet: Facet;
  /** Update one or more FacetValues */
  updateFacetValues: Array<FacetValue>;
  updateGlobalSettings: UpdateGlobalSettingsResult;
  updateOrderNote: HistoryEntry;
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod;
  /** Update an existing Product */
  updateProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  updateProductOption: ProductOption;
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup;
  /** Update existing ProductVariants */
  updateProductVariants: Array<Maybe<ProductVariant>>;
  updatePromotion: UpdatePromotionResult;
  /** Update an existing Role */
  updateRole: Role;
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod;
  /** Update an existing Tag */
  updateTag: Tag;
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory;
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate;
  updateUserChannels: UserStatus;
  /** Update an existing Zone */
  updateZone: Zone;
};


export type MutationAddCustomersToGroupArgs = {
  customerGroupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
};


export type MutationAddFulfillmentToOrderArgs = {
  input: FulfillOrderInput;
};


export type MutationAddManualPaymentToOrderArgs = {
  input: ManualPaymentInput;
};


export type MutationAddMembersToZoneArgs = {
  memberIds: Array<Scalars['ID']>;
  zoneId: Scalars['ID'];
};


export type MutationAddNoteToCustomerArgs = {
  input: AddNoteToCustomerInput;
};


export type MutationAddNoteToOrderArgs = {
  input: AddNoteToOrderInput;
};


export type MutationAddOptionGroupToProductArgs = {
  optionGroupId: Scalars['ID'];
  productId: Scalars['ID'];
};


export type MutationAssignAssetsToChannelArgs = {
  input: AssignAssetsToChannelInput;
};


export type MutationAssignProductVariantsToChannelArgs = {
  input: AssignProductVariantsToChannelInput;
};


export type MutationAssignProductsToChannelArgs = {
  input: AssignProductsToChannelInput;
};


export type MutationAssignPromotionsToChannelArgs = {
  input: AssignPromotionsToChannelInput;
};


export type MutationAssignRoleToAdministratorArgs = {
  administratorId: Scalars['ID'];
  roleId: Scalars['ID'];
};


export type MutationAuthenticateArgs = {
  input: AuthenticationInput;
  rememberMe?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCancelJobArgs = {
  jobId: Scalars['ID'];
};


export type MutationCancelOrderArgs = {
  input: CancelOrderInput;
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput;
};


export type MutationCreateAssetsArgs = {
  input: Array<CreateAssetInput>;
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
  password?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCustomerAddressArgs = {
  customerId: Scalars['ID'];
  input: CreateAddressInput;
};


export type MutationCreateCustomerGroupArgs = {
  input: CreateCustomerGroupInput;
};


export type MutationCreateFacetArgs = {
  input: CreateFacetInput;
};


export type MutationCreateFacetValuesArgs = {
  input: Array<CreateFacetValueInput>;
};


export type MutationCreatePaymentMethodArgs = {
  input: CreatePaymentMethodInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductOptionArgs = {
  input: CreateProductOptionInput;
};


export type MutationCreateProductOptionGroupArgs = {
  input: CreateProductOptionGroupInput;
};


export type MutationCreateProductVariantsArgs = {
  input: Array<CreateProductVariantInput>;
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateShippingMethodArgs = {
  input: CreateShippingMethodInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTaxCategoryArgs = {
  input: CreateTaxCategoryInput;
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateZoneArgs = {
  input: CreateZoneInput;
};


export type MutationDeleteAdministratorArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};


export type MutationDeleteAssetsArgs = {
  input: DeleteAssetsInput;
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerNoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFacetArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type MutationDeleteFacetValuesArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteOrderNoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePaymentMethodArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteShippingMethodArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaxCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteZoneArgs = {
  id: Scalars['ID'];
};


export type MutationFlushBufferedJobsArgs = {
  bufferIds?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationImportProductsArgs = {
  csvFile: Scalars['Upload'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  rememberMe?: InputMaybe<Scalars['Boolean']>;
  username: Scalars['String'];
};


export type MutationModifyOrderArgs = {
  input: ModifyOrderInput;
};


export type MutationMoveCollectionArgs = {
  input: MoveCollectionInput;
};


export type MutationRefundOrderArgs = {
  input: RefundOrderInput;
};


export type MutationRemoveCustomersFromGroupArgs = {
  customerGroupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']>;
};


export type MutationRemoveMembersFromZoneArgs = {
  memberIds: Array<Scalars['ID']>;
  zoneId: Scalars['ID'];
};


export type MutationRemoveOptionGroupFromProductArgs = {
  optionGroupId: Scalars['ID'];
  productId: Scalars['ID'];
};


export type MutationRemoveProductVariantsFromChannelArgs = {
  input: RemoveProductVariantsFromChannelInput;
};


export type MutationRemoveProductsFromChannelArgs = {
  input: RemoveProductsFromChannelInput;
};


export type MutationRemovePromotionsFromChannelArgs = {
  input: RemovePromotionsFromChannelInput;
};


export type MutationRemoveSettledJobsArgs = {
  olderThan?: InputMaybe<Scalars['DateTime']>;
  queueNames?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationSetActiveChannelArgs = {
  channelId: Scalars['ID'];
};


export type MutationSetAsLoggedInArgs = {
  input: UserStatusInput;
};


export type MutationSetContentLanguageArgs = {
  languageCode: LanguageCode;
};


export type MutationSetDisplayUiExtensionPointsArgs = {
  display: Scalars['Boolean'];
};


export type MutationSetOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
};


export type MutationSetUiLanguageArgs = {
  languageCode: LanguageCode;
};


export type MutationSetUiLocaleArgs = {
  locale?: InputMaybe<Scalars['String']>;
};


export type MutationSetUiThemeArgs = {
  theme: Scalars['String'];
};


export type MutationSettlePaymentArgs = {
  id: Scalars['ID'];
};


export type MutationSettleRefundArgs = {
  input: SettleRefundInput;
};


export type MutationTransitionFulfillmentToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationTransitionOrderToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationTransitionPaymentToStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationUpdateActiveAdministratorArgs = {
  input: UpdateActiveAdministratorInput;
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput;
};


export type MutationUpdateAssetArgs = {
  input: UpdateAssetInput;
};


export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateCustomerGroupArgs = {
  input: UpdateCustomerGroupInput;
};


export type MutationUpdateCustomerNoteArgs = {
  input: UpdateCustomerNoteInput;
};


export type MutationUpdateFacetArgs = {
  input: UpdateFacetInput;
};


export type MutationUpdateFacetValuesArgs = {
  input: Array<UpdateFacetValueInput>;
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput;
};


export type MutationUpdateOrderNoteArgs = {
  input: UpdateOrderNoteInput;
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateProductOptionArgs = {
  input: UpdateProductOptionInput;
};


export type MutationUpdateProductOptionGroupArgs = {
  input: UpdateProductOptionGroupInput;
};


export type MutationUpdateProductVariantsArgs = {
  input: Array<UpdateProductVariantInput>;
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateShippingMethodArgs = {
  input: UpdateShippingMethodInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateTaxCategoryArgs = {
  input: UpdateTaxCategoryInput;
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput;
};


export type MutationUpdateUserChannelsArgs = {
  channels: Array<CurrentUserChannelInput>;
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneInput;
};

export type NativeAuthInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

/** Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured. */
export type NativeAuthStrategyError = ErrorResult & {
  __typename?: 'NativeAuthStrategyError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type NativeAuthenticationResult = CurrentUser | InvalidCredentialsError | NativeAuthStrategyError;

/** Returned when attempting to set a negative OrderLine quantity. */
export type NegativeQuantityError = ErrorResult & {
  __typename?: 'NegativeQuantityError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type NetworkStatus = {
  __typename?: 'NetworkStatus';
  inFlightRequests: Scalars['Int'];
};

/** Returned when a call to modifyOrder fails to specify any changes */
export type NoChangesSpecifiedError = ErrorResult & {
  __typename?: 'NoChangesSpecifiedError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Node = {
  id: Scalars['ID'];
};

/** Returned if an attempting to refund an Order but neither items nor shipping refund was specified */
export type NothingToRefundError = ErrorResult & {
  __typename?: 'NothingToRefundError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Operators for filtering on a list of Number fields */
export type NumberListOperators = {
  inList: Scalars['Float'];
};

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
  between?: InputMaybe<NumberRange>;
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
};

export type NumberRange = {
  end: Scalars['Float'];
  start: Scalars['Float'];
};

export type Order = Node & {
  __typename?: 'Order';
  /** An order is active as long as the payment process has not been completed */
  active: Scalars['Boolean'];
  billingAddress?: Maybe<OrderAddress>;
  /** A unique code for the Order */
  code: Scalars['String'];
  /** An array of all coupon codes applied to the Order */
  couponCodes: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']>;
  customer?: Maybe<Customer>;
  discounts: Array<Discount>;
  fulfillments?: Maybe<Array<Fulfillment>>;
  history: HistoryEntryList;
  id: Scalars['ID'];
  lines: Array<OrderLine>;
  modifications: Array<OrderModification>;
  nextStates: Array<Scalars['String']>;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: Maybe<Scalars['DateTime']>;
  payments?: Maybe<Array<Payment>>;
  /** Promotions applied to the order. Only gets populated after the payment process has completed. */
  promotions: Array<Promotion>;
  shipping: Scalars['Int'];
  shippingAddress?: Maybe<OrderAddress>;
  shippingLines: Array<ShippingLine>;
  shippingWithTax: Scalars['Int'];
  state: Scalars['String'];
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the OrderItems.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal: Scalars['Int'];
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax: Scalars['Int'];
  /**
   * Surcharges are arbitrary modifications to the Order total which are neither
   * ProductVariants nor discounts resulting from applied Promotions. For example,
   * one-off discounts based on customer interaction, or surcharges based on payment
   * methods.
   */
  surcharges: Array<Surcharge>;
  /** A summary of the taxes being applied to this Order */
  taxSummary: Array<OrderTaxSummary>;
  /** Equal to subTotal plus shipping */
  total: Scalars['Int'];
  totalQuantity: Scalars['Int'];
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};


export type OrderHistoryArgs = {
  options?: InputMaybe<HistoryEntryListOptions>;
};

export type OrderAddress = {
  __typename?: 'OrderAddress';
  city?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['JSON']>;
  fullName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  streetLine1?: Maybe<Scalars['String']>;
  streetLine2?: Maybe<Scalars['String']>;
};

export type OrderFilterParameter = {
  active?: InputMaybe<BooleanOperators>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  customerLastName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  orderPlacedAt?: InputMaybe<DateOperators>;
  shipping?: InputMaybe<NumberOperators>;
  shippingWithTax?: InputMaybe<NumberOperators>;
  state?: InputMaybe<StringOperators>;
  subTotal?: InputMaybe<NumberOperators>;
  subTotalWithTax?: InputMaybe<NumberOperators>;
  total?: InputMaybe<NumberOperators>;
  totalQuantity?: InputMaybe<NumberOperators>;
  totalWithTax?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type OrderItem = Node & {
  __typename?: 'OrderItem';
  adjustments: Array<Adjustment>;
  cancelled: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Int'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Int'];
  fulfillment?: Maybe<Fulfillment>;
  id: Scalars['ID'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Int'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Int'];
  refundId?: Maybe<Scalars['ID']>;
  taxLines: Array<TaxLine>;
  taxRate: Scalars['Float'];
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Int'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Int'];
  unitTax: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

/** Returned when the maximum order size limit has been reached. */
export type OrderLimitError = ErrorResult & {
  __typename?: 'OrderLimitError';
  errorCode: ErrorCode;
  maxItems: Scalars['Int'];
  message: Scalars['String'];
};

export type OrderLine = Node & {
  __typename?: 'OrderLine';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  /** The price of the line including discounts, excluding tax */
  discountedLinePrice: Scalars['Int'];
  /** The price of the line including discounts and tax */
  discountedLinePriceWithTax: Scalars['Int'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Int'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Int'];
  discounts: Array<Discount>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID'];
  items: Array<OrderItem>;
  /** The total price of the line excluding tax and discounts. */
  linePrice: Scalars['Int'];
  /** The total price of the line including tax but excluding discounts. */
  linePriceWithTax: Scalars['Int'];
  /** The total tax on this line */
  lineTax: Scalars['Int'];
  order: Order;
  productVariant: ProductVariant;
  /**
   * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
   * and refund calculations.
   */
  proratedLinePrice: Scalars['Int'];
  /** The proratedLinePrice including tax */
  proratedLinePriceWithTax: Scalars['Int'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Int'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Int'];
  quantity: Scalars['Int'];
  taxLines: Array<TaxLine>;
  taxRate: Scalars['Float'];
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Int'];
  /** Non-zero if the unitPrice has changed since it was initially added to Order */
  unitPriceChangeSinceAdded: Scalars['Int'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Int'];
  /** Non-zero if the unitPriceWithTax has changed since it was initially added to Order */
  unitPriceWithTaxChangeSinceAdded: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type OrderLineInput = {
  orderLineId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type OrderList = PaginatedList & {
  __typename?: 'OrderList';
  items: Array<Order>;
  totalItems: Scalars['Int'];
};

export type OrderListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<OrderFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<OrderSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type OrderModification = Node & {
  __typename?: 'OrderModification';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isSettled: Scalars['Boolean'];
  note: Scalars['String'];
  orderItems?: Maybe<Array<OrderItem>>;
  payment?: Maybe<Payment>;
  priceChange: Scalars['Int'];
  refund?: Maybe<Refund>;
  surcharges?: Maybe<Array<Surcharge>>;
  updatedAt: Scalars['DateTime'];
};

/** Returned when attempting to modify the contents of an Order that is not in the `Modifying` state. */
export type OrderModificationStateError = ErrorResult & {
  __typename?: 'OrderModificationStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type OrderProcessState = {
  __typename?: 'OrderProcessState';
  name: Scalars['String'];
  to: Array<Scalars['String']>;
};

export type OrderSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  customerLastName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderPlacedAt?: InputMaybe<SortOrder>;
  shipping?: InputMaybe<SortOrder>;
  shippingWithTax?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  subTotal?: InputMaybe<SortOrder>;
  subTotalWithTax?: InputMaybe<SortOrder>;
  total?: InputMaybe<SortOrder>;
  totalQuantity?: InputMaybe<SortOrder>;
  totalWithTax?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Returned if there is an error in transitioning the Order state */
export type OrderStateTransitionError = ErrorResult & {
  __typename?: 'OrderStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String'];
  message: Scalars['String'];
  toState: Scalars['String'];
  transitionError: Scalars['String'];
};

/**
 * A summary of the taxes being applied to this order, grouped
 * by taxRate.
 */
export type OrderTaxSummary = {
  __typename?: 'OrderTaxSummary';
  /** A description of this tax */
  description: Scalars['String'];
  /** The total net price or OrderItems to which this taxRate applies */
  taxBase: Scalars['Int'];
  /** The taxRate as a percentage */
  taxRate: Scalars['Float'];
  /** The total tax being applied to the Order at this taxRate */
  taxTotal: Scalars['Int'];
};

export type PaginatedList = {
  items: Array<Node>;
  totalItems: Scalars['Int'];
};

export type Payment = Node & {
  __typename?: 'Payment';
  amount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  errorMessage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  method: Scalars['String'];
  nextStates: Array<Scalars['String']>;
  refunds: Array<Refund>;
  state: Scalars['String'];
  transactionId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type PaymentMethod = Node & {
  __typename?: 'PaymentMethod';
  checker?: Maybe<ConfigurableOperation>;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  handler: ConfigurableOperation;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PaymentMethodFilterParameter = {
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type PaymentMethodList = PaginatedList & {
  __typename?: 'PaymentMethodList';
  items: Array<PaymentMethod>;
  totalItems: Scalars['Int'];
};

export type PaymentMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<PaymentMethodFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<PaymentMethodSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

/**
 * Returned when a call to modifyOrder fails to include a paymentMethod even
 * though the price has increased as a result of the changes.
 */
export type PaymentMethodMissingError = ErrorResult & {
  __typename?: 'PaymentMethodMissingError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type PaymentMethodQuote = {
  __typename?: 'PaymentMethodQuote';
  code: Scalars['String'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  eligibilityMessage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isEligible: Scalars['Boolean'];
  name: Scalars['String'];
};

export type PaymentMethodSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Returned if an attempting to refund a Payment against OrderLines from a different Order */
export type PaymentOrderMismatchError = ErrorResult & {
  __typename?: 'PaymentOrderMismatchError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when there is an error in transitioning the Payment state */
export type PaymentStateTransitionError = ErrorResult & {
  __typename?: 'PaymentStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String'];
  message: Scalars['String'];
  toState: Scalars['String'];
  transitionError: Scalars['String'];
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * @docsCategory common
 */
export enum Permission {
  /** Authenticated means simply that the user is logged in */
  Authenticated = 'Authenticated',
  /** Grants permission to create Administrator */
  CreateAdministrator = 'CreateAdministrator',
  /** Grants permission to create Asset */
  CreateAsset = 'CreateAsset',
  /** Grants permission to create Products, Facets, Assets, Collections */
  CreateCatalog = 'CreateCatalog',
  /** Grants permission to create Channel */
  CreateChannel = 'CreateChannel',
  /** Grants permission to create Collection */
  CreateCollection = 'CreateCollection',
  /** Grants permission to create Country */
  CreateCountry = 'CreateCountry',
  /** Grants permission to create Customer */
  CreateCustomer = 'CreateCustomer',
  /** Grants permission to create CustomerGroup */
  CreateCustomerGroup = 'CreateCustomerGroup',
  /** Grants permission to create Facet */
  CreateFacet = 'CreateFacet',
  /** Grants permission to create Order */
  CreateOrder = 'CreateOrder',
  /** Grants permission to create PaymentMethod */
  CreatePaymentMethod = 'CreatePaymentMethod',
  /** Grants permission to create Product */
  CreateProduct = 'CreateProduct',
  /** Grants permission to create Promotion */
  CreatePromotion = 'CreatePromotion',
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  CreateSettings = 'CreateSettings',
  /** Grants permission to create ShippingMethod */
  CreateShippingMethod = 'CreateShippingMethod',
  /** Grants permission to create System */
  CreateSystem = 'CreateSystem',
  /** Grants permission to create Tag */
  CreateTag = 'CreateTag',
  /** Grants permission to create TaxCategory */
  CreateTaxCategory = 'CreateTaxCategory',
  /** Grants permission to create TaxRate */
  CreateTaxRate = 'CreateTaxRate',
  /** Grants permission to create Zone */
  CreateZone = 'CreateZone',
  /** Grants permission to delete Administrator */
  DeleteAdministrator = 'DeleteAdministrator',
  /** Grants permission to delete Asset */
  DeleteAsset = 'DeleteAsset',
  /** Grants permission to delete Products, Facets, Assets, Collections */
  DeleteCatalog = 'DeleteCatalog',
  /** Grants permission to delete Channel */
  DeleteChannel = 'DeleteChannel',
  /** Grants permission to delete Collection */
  DeleteCollection = 'DeleteCollection',
  /** Grants permission to delete Country */
  DeleteCountry = 'DeleteCountry',
  /** Grants permission to delete Customer */
  DeleteCustomer = 'DeleteCustomer',
  /** Grants permission to delete CustomerGroup */
  DeleteCustomerGroup = 'DeleteCustomerGroup',
  /** Grants permission to delete Facet */
  DeleteFacet = 'DeleteFacet',
  /** Grants permission to delete Order */
  DeleteOrder = 'DeleteOrder',
  /** Grants permission to delete PaymentMethod */
  DeletePaymentMethod = 'DeletePaymentMethod',
  /** Grants permission to delete Product */
  DeleteProduct = 'DeleteProduct',
  /** Grants permission to delete Promotion */
  DeletePromotion = 'DeletePromotion',
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  DeleteSettings = 'DeleteSettings',
  /** Grants permission to delete ShippingMethod */
  DeleteShippingMethod = 'DeleteShippingMethod',
  /** Grants permission to delete System */
  DeleteSystem = 'DeleteSystem',
  /** Grants permission to delete Tag */
  DeleteTag = 'DeleteTag',
  /** Grants permission to delete TaxCategory */
  DeleteTaxCategory = 'DeleteTaxCategory',
  /** Grants permission to delete TaxRate */
  DeleteTaxRate = 'DeleteTaxRate',
  /** Grants permission to delete Zone */
  DeleteZone = 'DeleteZone',
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  Placeholder = 'Placeholder',
  /** Public means any unauthenticated user may perform the operation */
  Public = 'Public',
  /** Grants permission to read Administrator */
  ReadAdministrator = 'ReadAdministrator',
  /** Grants permission to read Asset */
  ReadAsset = 'ReadAsset',
  /** Grants permission to read Products, Facets, Assets, Collections */
  ReadCatalog = 'ReadCatalog',
  /** Grants permission to read Channel */
  ReadChannel = 'ReadChannel',
  /** Grants permission to read Collection */
  ReadCollection = 'ReadCollection',
  /** Grants permission to read Country */
  ReadCountry = 'ReadCountry',
  /** Grants permission to read Customer */
  ReadCustomer = 'ReadCustomer',
  /** Grants permission to read CustomerGroup */
  ReadCustomerGroup = 'ReadCustomerGroup',
  /** Grants permission to read Facet */
  ReadFacet = 'ReadFacet',
  /** Grants permission to read Order */
  ReadOrder = 'ReadOrder',
  /** Grants permission to read PaymentMethod */
  ReadPaymentMethod = 'ReadPaymentMethod',
  /** Grants permission to read Product */
  ReadProduct = 'ReadProduct',
  /** Grants permission to read Promotion */
  ReadPromotion = 'ReadPromotion',
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  ReadSettings = 'ReadSettings',
  /** Grants permission to read ShippingMethod */
  ReadShippingMethod = 'ReadShippingMethod',
  /** Grants permission to read System */
  ReadSystem = 'ReadSystem',
  /** Grants permission to read Tag */
  ReadTag = 'ReadTag',
  /** Grants permission to read TaxCategory */
  ReadTaxCategory = 'ReadTaxCategory',
  /** Grants permission to read TaxRate */
  ReadTaxRate = 'ReadTaxRate',
  /** Grants permission to read Zone */
  ReadZone = 'ReadZone',
  /** SuperAdmin has unrestricted access to all operations */
  SuperAdmin = 'SuperAdmin',
  /** Grants permission to update Administrator */
  UpdateAdministrator = 'UpdateAdministrator',
  /** Grants permission to update Asset */
  UpdateAsset = 'UpdateAsset',
  /** Grants permission to update Products, Facets, Assets, Collections */
  UpdateCatalog = 'UpdateCatalog',
  /** Grants permission to update Channel */
  UpdateChannel = 'UpdateChannel',
  /** Grants permission to update Collection */
  UpdateCollection = 'UpdateCollection',
  /** Grants permission to update Country */
  UpdateCountry = 'UpdateCountry',
  /** Grants permission to update Customer */
  UpdateCustomer = 'UpdateCustomer',
  /** Grants permission to update CustomerGroup */
  UpdateCustomerGroup = 'UpdateCustomerGroup',
  /** Grants permission to update Facet */
  UpdateFacet = 'UpdateFacet',
  /** Grants permission to update GlobalSettings */
  UpdateGlobalSettings = 'UpdateGlobalSettings',
  /** Grants permission to update Order */
  UpdateOrder = 'UpdateOrder',
  /** Grants permission to update PaymentMethod */
  UpdatePaymentMethod = 'UpdatePaymentMethod',
  /** Grants permission to update Product */
  UpdateProduct = 'UpdateProduct',
  /** Grants permission to update Promotion */
  UpdatePromotion = 'UpdatePromotion',
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  UpdateSettings = 'UpdateSettings',
  /** Grants permission to update ShippingMethod */
  UpdateShippingMethod = 'UpdateShippingMethod',
  /** Grants permission to update System */
  UpdateSystem = 'UpdateSystem',
  /** Grants permission to update Tag */
  UpdateTag = 'UpdateTag',
  /** Grants permission to update TaxCategory */
  UpdateTaxCategory = 'UpdateTaxCategory',
  /** Grants permission to update TaxRate */
  UpdateTaxRate = 'UpdateTaxRate',
  /** Grants permission to update Zone */
  UpdateZone = 'UpdateZone'
}

export type PermissionDefinition = {
  __typename?: 'PermissionDefinition';
  assignable: Scalars['Boolean'];
  description: Scalars['String'];
  name: Scalars['String'];
};

/** The price range where the result has more than one price */
export type PriceRange = {
  __typename?: 'PriceRange';
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export type Product = Node & {
  __typename?: 'Product';
  assets: Array<Asset>;
  channels: Array<Channel>;
  collections: Array<Collection>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  optionGroups: Array<ProductOptionGroup>;
  slug: Scalars['String'];
  translations: Array<ProductTranslation>;
  updatedAt: Scalars['DateTime'];
  /** Returns a paginated, sortable, filterable list of ProductVariants */
  variantList: ProductVariantList;
  /** Returns all ProductVariants */
  variants: Array<ProductVariant>;
};


export type ProductVariantListArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
};

export type ProductFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  slug?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProductList = PaginatedList & {
  __typename?: 'ProductList';
  items: Array<Product>;
  totalItems: Scalars['Int'];
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type ProductOption = Node & {
  __typename?: 'ProductOption';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  group: ProductOptionGroup;
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  translations: Array<ProductOptionTranslation>;
  updatedAt: Scalars['DateTime'];
};

export type ProductOptionGroup = Node & {
  __typename?: 'ProductOptionGroup';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  options: Array<ProductOption>;
  translations: Array<ProductOptionGroupTranslation>;
  updatedAt: Scalars['DateTime'];
};

export type ProductOptionGroupTranslation = {
  __typename?: 'ProductOptionGroupTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ProductOptionGroupTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type ProductOptionInUseError = ErrorResult & {
  __typename?: 'ProductOptionInUseError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  optionGroupCode: Scalars['String'];
  productVariantCount: Scalars['Int'];
};

export type ProductOptionTranslation = {
  __typename?: 'ProductOptionTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ProductOptionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type ProductSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductTranslation = {
  __typename?: 'ProductTranslation';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ProductTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type ProductVariant = Node & {
  __typename?: 'ProductVariant';
  assets: Array<Asset>;
  channels: Array<Channel>;
  createdAt: Scalars['DateTime'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']>;
  enabled: Scalars['Boolean'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  options: Array<ProductOption>;
  outOfStockThreshold: Scalars['Int'];
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  product: Product;
  productId: Scalars['ID'];
  sku: Scalars['String'];
  stockAllocated: Scalars['Int'];
  stockLevel: Scalars['String'];
  stockMovements: StockMovementList;
  stockOnHand: Scalars['Int'];
  taxCategory: TaxCategory;
  taxRateApplied: TaxRate;
  trackInventory: GlobalFlag;
  translations: Array<ProductVariantTranslation>;
  updatedAt: Scalars['DateTime'];
  useGlobalOutOfStockThreshold: Scalars['Boolean'];
};


export type ProductVariantStockMovementsArgs = {
  options?: InputMaybe<StockMovementListOptions>;
};

export type ProductVariantFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  outOfStockThreshold?: InputMaybe<NumberOperators>;
  price?: InputMaybe<NumberOperators>;
  priceWithTax?: InputMaybe<NumberOperators>;
  productId?: InputMaybe<IdOperators>;
  sku?: InputMaybe<StringOperators>;
  stockAllocated?: InputMaybe<NumberOperators>;
  stockLevel?: InputMaybe<StringOperators>;
  stockOnHand?: InputMaybe<NumberOperators>;
  trackInventory?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  useGlobalOutOfStockThreshold?: InputMaybe<BooleanOperators>;
};

export type ProductVariantList = PaginatedList & {
  __typename?: 'ProductVariantList';
  items: Array<ProductVariant>;
  totalItems: Scalars['Int'];
};

export type ProductVariantListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductVariantFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductVariantSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type ProductVariantSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  outOfStockThreshold?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  priceWithTax?: InputMaybe<SortOrder>;
  productId?: InputMaybe<SortOrder>;
  sku?: InputMaybe<SortOrder>;
  stockAllocated?: InputMaybe<SortOrder>;
  stockLevel?: InputMaybe<SortOrder>;
  stockOnHand?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductVariantTranslation = {
  __typename?: 'ProductVariantTranslation';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ProductVariantTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

export type Promotion = Node & {
  __typename?: 'Promotion';
  actions: Array<ConfigurableOperation>;
  conditions: Array<ConfigurableOperation>;
  couponCode?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  enabled: Scalars['Boolean'];
  endsAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  perCustomerUsageLimit?: Maybe<Scalars['Int']>;
  startsAt?: Maybe<Scalars['DateTime']>;
  updatedAt: Scalars['DateTime'];
};

export type PromotionFilterParameter = {
  couponCode?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  endsAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  perCustomerUsageLimit?: InputMaybe<NumberOperators>;
  startsAt?: InputMaybe<DateOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type PromotionList = PaginatedList & {
  __typename?: 'PromotionList';
  items: Array<Promotion>;
  totalItems: Scalars['Int'];
};

export type PromotionListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<PromotionFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<PromotionSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type PromotionSortParameter = {
  couponCode?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  endsAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  perCustomerUsageLimit?: InputMaybe<SortOrder>;
  startsAt?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Returned if the specified quantity of an OrderLine is greater than the number of items in that line */
export type QuantityTooGreatError = ErrorResult & {
  __typename?: 'QuantityTooGreatError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  activeAdministrator?: Maybe<Administrator>;
  activeChannel: Channel;
  administrator?: Maybe<Administrator>;
  administrators: AdministratorList;
  /** Get a single Asset by id */
  asset?: Maybe<Asset>;
  /** Get a list of Assets */
  assets: AssetList;
  channel?: Maybe<Channel>;
  channels: Array<Channel>;
  /** Get a Collection either by id or slug. If neither id nor slug is specified, an error will result. */
  collection?: Maybe<Collection>;
  collectionFilters: Array<ConfigurableOperationDefinition>;
  collections: CollectionList;
  countries: CountryList;
  country?: Maybe<Country>;
  customer?: Maybe<Customer>;
  customerGroup?: Maybe<CustomerGroup>;
  customerGroups: CustomerGroupList;
  customers: CustomerList;
  facet?: Maybe<Facet>;
  facets: FacetList;
  fulfillmentHandlers: Array<ConfigurableOperationDefinition>;
  globalSettings: GlobalSettings;
  job?: Maybe<Job>;
  jobBufferSize: Array<JobBufferSize>;
  jobQueues: Array<JobQueue>;
  jobs: JobList;
  jobsById: Array<Job>;
  me?: Maybe<CurrentUser>;
  networkStatus: NetworkStatus;
  order?: Maybe<Order>;
  orders: OrderList;
  paymentMethod?: Maybe<PaymentMethod>;
  paymentMethodEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  paymentMethodHandlers: Array<ConfigurableOperationDefinition>;
  paymentMethods: PaymentMethodList;
  pendingSearchIndexUpdates: Scalars['Int'];
  /** Get a Product either by id or slug. If neither id nor slug is specified, an error will result. */
  product?: Maybe<Product>;
  productOptionGroup?: Maybe<ProductOptionGroup>;
  productOptionGroups: Array<ProductOptionGroup>;
  /** Get a ProductVariant by id */
  productVariant?: Maybe<ProductVariant>;
  /** List ProductVariants either all or for the specific product. */
  productVariants: ProductVariantList;
  /** List Products */
  products: ProductList;
  promotion?: Maybe<Promotion>;
  promotionActions: Array<ConfigurableOperationDefinition>;
  promotionConditions: Array<ConfigurableOperationDefinition>;
  promotions: PromotionList;
  role?: Maybe<Role>;
  roles: RoleList;
  search: SearchResponse;
  shippingCalculators: Array<ConfigurableOperationDefinition>;
  shippingEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethods: ShippingMethodList;
  tag: Tag;
  tags: TagList;
  taxCategories: Array<TaxCategory>;
  taxCategory?: Maybe<TaxCategory>;
  taxRate?: Maybe<TaxRate>;
  taxRates: TaxRateList;
  testEligibleShippingMethods: Array<ShippingMethodQuote>;
  testShippingMethod: TestShippingMethodResult;
  uiState: UiState;
  userStatus: UserStatus;
  zone?: Maybe<Zone>;
  zones: Array<Zone>;
};


export type QueryAdministratorArgs = {
  id: Scalars['ID'];
};


export type QueryAdministratorsArgs = {
  options?: InputMaybe<AdministratorListOptions>;
};


export type QueryAssetArgs = {
  id: Scalars['ID'];
};


export type QueryAssetsArgs = {
  options?: InputMaybe<AssetListOptions>;
};


export type QueryChannelArgs = {
  id: Scalars['ID'];
};


export type QueryCollectionArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
  options?: InputMaybe<CollectionListOptions>;
};


export type QueryCountriesArgs = {
  options?: InputMaybe<CountryListOptions>;
};


export type QueryCountryArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerGroupArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerGroupsArgs = {
  options?: InputMaybe<CustomerGroupListOptions>;
};


export type QueryCustomersArgs = {
  options?: InputMaybe<CustomerListOptions>;
};


export type QueryFacetArgs = {
  id: Scalars['ID'];
};


export type QueryFacetsArgs = {
  options?: InputMaybe<FacetListOptions>;
};


export type QueryJobArgs = {
  jobId: Scalars['ID'];
};


export type QueryJobBufferSizeArgs = {
  bufferIds?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryJobsArgs = {
  options?: InputMaybe<JobListOptions>;
};


export type QueryJobsByIdArgs = {
  jobIds: Array<Scalars['ID']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  options?: InputMaybe<OrderListOptions>;
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentMethodsArgs = {
  options?: InputMaybe<PaymentMethodListOptions>;
};


export type QueryProductArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryProductOptionGroupArgs = {
  id: Scalars['ID'];
};


export type QueryProductOptionGroupsArgs = {
  filterTerm?: InputMaybe<Scalars['String']>;
};


export type QueryProductVariantArgs = {
  id: Scalars['ID'];
};


export type QueryProductVariantsArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
  productId?: InputMaybe<Scalars['ID']>;
};


export type QueryProductsArgs = {
  options?: InputMaybe<ProductListOptions>;
};


export type QueryPromotionArgs = {
  id: Scalars['ID'];
};


export type QueryPromotionsArgs = {
  options?: InputMaybe<PromotionListOptions>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
};


export type QueryRolesArgs = {
  options?: InputMaybe<RoleListOptions>;
};


export type QuerySearchArgs = {
  input: SearchInput;
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID'];
};


export type QueryShippingMethodsArgs = {
  options?: InputMaybe<ShippingMethodListOptions>;
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QueryTagsArgs = {
  options?: InputMaybe<TagListOptions>;
};


export type QueryTaxCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryTaxRateArgs = {
  id: Scalars['ID'];
};


export type QueryTaxRatesArgs = {
  options?: InputMaybe<TaxRateListOptions>;
};


export type QueryTestEligibleShippingMethodsArgs = {
  input: TestEligibleShippingMethodsInput;
};


export type QueryTestShippingMethodArgs = {
  input: TestShippingMethodInput;
};


export type QueryZoneArgs = {
  id: Scalars['ID'];
};

export type Refund = Node & {
  __typename?: 'Refund';
  adjustment: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  items: Scalars['Int'];
  metadata?: Maybe<Scalars['JSON']>;
  method?: Maybe<Scalars['String']>;
  orderItems: Array<OrderItem>;
  paymentId: Scalars['ID'];
  reason?: Maybe<Scalars['String']>;
  shipping: Scalars['Int'];
  state: Scalars['String'];
  total: Scalars['Int'];
  transactionId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type RefundOrderInput = {
  adjustment: Scalars['Int'];
  lines: Array<OrderLineInput>;
  paymentId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
  shipping: Scalars['Int'];
};

export type RefundOrderResult = AlreadyRefundedError | MultipleOrderError | NothingToRefundError | OrderStateTransitionError | PaymentOrderMismatchError | QuantityTooGreatError | Refund | RefundOrderStateError | RefundStateTransitionError;

/** Returned if an attempting to refund an Order which is not in the expected state */
export type RefundOrderStateError = ErrorResult & {
  __typename?: 'RefundOrderStateError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  orderState: Scalars['String'];
};

/**
 * Returned when a call to modifyOrder fails to include a refundPaymentId even
 * though the price has decreased as a result of the changes.
 */
export type RefundPaymentIdMissingError = ErrorResult & {
  __typename?: 'RefundPaymentIdMissingError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

/** Returned when there is an error in transitioning the Refund state */
export type RefundStateTransitionError = ErrorResult & {
  __typename?: 'RefundStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String'];
  message: Scalars['String'];
  toState: Scalars['String'];
  transitionError: Scalars['String'];
};

export type RelationCustomFieldConfig = CustomField & {
  __typename?: 'RelationCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  entity: Scalars['String'];
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  scalarFields: Array<Scalars['String']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type Release = Node & StockMovement & {
  __typename?: 'Release';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  orderItem: OrderItem;
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type RemoveOptionGroupFromProductResult = Product | ProductOptionInUseError;

export type RemoveProductVariantsFromChannelInput = {
  channelId: Scalars['ID'];
  productVariantIds: Array<Scalars['ID']>;
};

export type RemoveProductsFromChannelInput = {
  channelId: Scalars['ID'];
  productIds: Array<Scalars['ID']>;
};

export type RemovePromotionsFromChannelInput = {
  channelId: Scalars['ID'];
  promotionIds: Array<Scalars['ID']>;
};

export type Return = Node & StockMovement & {
  __typename?: 'Return';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  orderItem: OrderItem;
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type Role = Node & {
  __typename?: 'Role';
  channels: Array<Channel>;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  permissions: Array<Permission>;
  updatedAt: Scalars['DateTime'];
};

export type RoleFilterParameter = {
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList';
  items: Array<Role>;
  totalItems: Scalars['Int'];
};

export type RoleListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<RoleFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<RoleSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type RoleSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type Sale = Node & StockMovement & {
  __typename?: 'Sale';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  orderItem: OrderItem;
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type SearchInput = {
  collectionId?: InputMaybe<Scalars['ID']>;
  collectionSlug?: InputMaybe<Scalars['String']>;
  facetValueFilters?: InputMaybe<Array<FacetValueFilterInput>>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']>>;
  facetValueOperator?: InputMaybe<LogicalOperator>;
  groupByProduct?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SearchResultSortParameter>;
  take?: InputMaybe<Scalars['Int']>;
  term?: InputMaybe<Scalars['String']>;
};

export type SearchReindexResponse = {
  __typename?: 'SearchReindexResponse';
  success: Scalars['Boolean'];
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  collections: Array<CollectionResult>;
  facetValues: Array<FacetValueResult>;
  items: Array<SearchResult>;
  totalItems: Scalars['Int'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  /** An array of ids of the Channels in which this result appears */
  channelIds: Array<Scalars['ID']>;
  /** An array of ids of the Collections in which this result appears */
  collectionIds: Array<Scalars['ID']>;
  currencyCode: CurrencyCode;
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  facetIds: Array<Scalars['ID']>;
  facetValueIds: Array<Scalars['ID']>;
  price: SearchResultPrice;
  priceWithTax: SearchResultPrice;
  productAsset?: Maybe<SearchResultAsset>;
  productId: Scalars['ID'];
  productName: Scalars['String'];
  productVariantAsset?: Maybe<SearchResultAsset>;
  productVariantId: Scalars['ID'];
  productVariantName: Scalars['String'];
  /** A relevance score for the result. Differs between database implementations */
  score: Scalars['Float'];
  sku: Scalars['String'];
  slug: Scalars['String'];
};

export type SearchResultAsset = {
  __typename?: 'SearchResultAsset';
  focalPoint?: Maybe<Coordinate>;
  id: Scalars['ID'];
  preview: Scalars['String'];
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
  name?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
};

export type ServerConfig = {
  __typename?: 'ServerConfig';
  customFieldConfig: CustomFields;
  orderProcess: Array<OrderProcessState>;
  permissions: Array<PermissionDefinition>;
  permittedAssetTypes: Array<Scalars['String']>;
};

/** Returned if the Payment settlement fails */
export type SettlePaymentError = ErrorResult & {
  __typename?: 'SettlePaymentError';
  errorCode: ErrorCode;
  message: Scalars['String'];
  paymentErrorMessage: Scalars['String'];
};

export type SettlePaymentResult = OrderStateTransitionError | Payment | PaymentStateTransitionError | SettlePaymentError;

export type SettleRefundInput = {
  id: Scalars['ID'];
  transactionId: Scalars['String'];
};

export type SettleRefundResult = Refund | RefundStateTransitionError;

export type ShippingLine = {
  __typename?: 'ShippingLine';
  discountedPrice: Scalars['Int'];
  discountedPriceWithTax: Scalars['Int'];
  discounts: Array<Discount>;
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  shippingMethod: ShippingMethod;
};

export type ShippingMethod = Node & {
  __typename?: 'ShippingMethod';
  calculator: ConfigurableOperation;
  checker: ConfigurableOperation;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  fulfillmentHandlerCode: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  translations: Array<ShippingMethodTranslation>;
  updatedAt: Scalars['DateTime'];
};

export type ShippingMethodFilterParameter = {
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  fulfillmentHandlerCode?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ShippingMethodList = PaginatedList & {
  __typename?: 'ShippingMethodList';
  items: Array<ShippingMethod>;
  totalItems: Scalars['Int'];
};

export type ShippingMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ShippingMethodFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ShippingMethodSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type ShippingMethodQuote = {
  __typename?: 'ShippingMethodQuote';
  code: Scalars['String'];
  customFields?: Maybe<Scalars['JSON']>;
  description: Scalars['String'];
  id: Scalars['ID'];
  /** Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult */
  metadata?: Maybe<Scalars['JSON']>;
  name: Scalars['String'];
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
};

export type ShippingMethodSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  fulfillmentHandlerCode?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ShippingMethodTranslation = {
  __typename?: 'ShippingMethodTranslation';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  languageCode: LanguageCode;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ShippingMethodTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
};

/** The price value where the result has a single price */
export type SinglePrice = {
  __typename?: 'SinglePrice';
  value: Scalars['Int'];
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StockAdjustment = Node & StockMovement & {
  __typename?: 'StockAdjustment';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type StockMovement = {
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  productVariant: ProductVariant;
  quantity: Scalars['Int'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime'];
};

export type StockMovementItem = Allocation | Cancellation | Release | Return | Sale | StockAdjustment;

export type StockMovementList = {
  __typename?: 'StockMovementList';
  items: Array<StockMovementItem>;
  totalItems: Scalars['Int'];
};

export type StockMovementListOptions = {
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<StockMovementType>;
};

export enum StockMovementType {
  ADJUSTMENT = 'ADJUSTMENT',
  ALLOCATION = 'ALLOCATION',
  CANCELLATION = 'CANCELLATION',
  RELEASE = 'RELEASE',
  RETURN = 'RETURN',
  SALE = 'SALE'
}

export type StringCustomFieldConfig = CustomField & {
  __typename?: 'StringCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  length?: Maybe<Scalars['Int']>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Array<StringFieldOption>>;
  pattern?: Maybe<Scalars['String']>;
  readonly?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type StringFieldOption = {
  __typename?: 'StringFieldOption';
  label?: Maybe<Array<LocalizedString>>;
  value: Scalars['String'];
};

/** Operators for filtering on a list of String fields */
export type StringListOperators = {
  inList: Scalars['String'];
};

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  notContains?: InputMaybe<Scalars['String']>;
  notEq?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
  regex?: InputMaybe<Scalars['String']>;
};

/** Indicates that an operation succeeded, where we do not want to return any more specific information. */
export type Success = {
  __typename?: 'Success';
  success: Scalars['Boolean'];
};

export type Surcharge = Node & {
  __typename?: 'Surcharge';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
  sku?: Maybe<Scalars['String']>;
  taxLines: Array<TaxLine>;
  taxRate: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
};

export type SurchargeInput = {
  description: Scalars['String'];
  price: Scalars['Int'];
  priceIncludesTax: Scalars['Boolean'];
  sku?: InputMaybe<Scalars['String']>;
  taxDescription?: InputMaybe<Scalars['String']>;
  taxRate?: InputMaybe<Scalars['Float']>;
};

export type Tag = Node & {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  value: Scalars['String'];
};

export type TagFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  value?: InputMaybe<StringOperators>;
};

export type TagList = PaginatedList & {
  __typename?: 'TagList';
  items: Array<Tag>;
  totalItems: Scalars['Int'];
};

export type TagListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<TagFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<TagSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type TagSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
};

export type TaxCategory = Node & {
  __typename?: 'TaxCategory';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  isDefault: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TaxLine = {
  __typename?: 'TaxLine';
  description: Scalars['String'];
  taxRate: Scalars['Float'];
};

export type TaxRate = Node & {
  __typename?: 'TaxRate';
  category: TaxCategory;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  customerGroup?: Maybe<CustomerGroup>;
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  value: Scalars['Float'];
  zone: Zone;
};

export type TaxRateFilterParameter = {
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  value?: InputMaybe<NumberOperators>;
};

export type TaxRateList = PaginatedList & {
  __typename?: 'TaxRateList';
  items: Array<TaxRate>;
  totalItems: Scalars['Int'];
};

export type TaxRateListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<TaxRateFilterParameter>;
  /** Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<TaxRateSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']>;
};

export type TaxRateSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
};

export type TestEligibleShippingMethodsInput = {
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodOrderLineInput = {
  productVariantId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type TestShippingMethodQuote = {
  __typename?: 'TestShippingMethodQuote';
  metadata?: Maybe<Scalars['JSON']>;
  price: Scalars['Int'];
  priceWithTax: Scalars['Int'];
};

export type TestShippingMethodResult = {
  __typename?: 'TestShippingMethodResult';
  eligible: Scalars['Boolean'];
  quote?: Maybe<TestShippingMethodQuote>;
};

export type TextCustomFieldConfig = CustomField & {
  __typename?: 'TextCustomFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean'];
  name: Scalars['String'];
  nullable?: Maybe<Scalars['Boolean']>;
  readonly?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  ui?: Maybe<Scalars['JSON']>;
};

export type TransitionFulfillmentToStateResult = Fulfillment | FulfillmentStateTransitionError;

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type TransitionPaymentToStateResult = Payment | PaymentStateTransitionError;

export type UiState = {
  __typename?: 'UiState';
  contentLanguage: LanguageCode;
  displayUiExtensionPoints: Scalars['Boolean'];
  language: LanguageCode;
  locale?: Maybe<Scalars['String']>;
  theme: Scalars['String'];
};

export type UpdateActiveAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type UpdateAddressInput = {
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  defaultBillingAddress?: InputMaybe<Scalars['Boolean']>;
  defaultShippingAddress?: InputMaybe<Scalars['Boolean']>;
  fullName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  streetLine1?: InputMaybe<Scalars['String']>;
  streetLine2?: InputMaybe<Scalars['String']>;
};

export type UpdateAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  roleIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateAssetInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  focalPoint?: InputMaybe<CoordinateInput>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateChannelInput = {
  code?: InputMaybe<Scalars['String']>;
  currencyCode?: InputMaybe<CurrencyCode>;
  customFields?: InputMaybe<Scalars['JSON']>;
  defaultLanguageCode?: InputMaybe<LanguageCode>;
  defaultShippingZoneId?: InputMaybe<Scalars['ID']>;
  defaultTaxZoneId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  pricesIncludeTax?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<Scalars['String']>;
};

export type UpdateChannelResult = Channel | LanguageNotAvailableError;

export type UpdateCollectionInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  filters?: InputMaybe<Array<ConfigurableOperationInput>>;
  id: Scalars['ID'];
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  parentId?: InputMaybe<Scalars['ID']>;
  translations?: InputMaybe<Array<UpdateCollectionTranslationInput>>;
};

export type UpdateCollectionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type UpdateCountryInput = {
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  translations?: InputMaybe<Array<CountryTranslationInput>>;
};

export type UpdateCustomerGroupInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateCustomerInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateCustomerNoteInput = {
  note: Scalars['String'];
  noteId: Scalars['ID'];
};

export type UpdateCustomerResult = Customer | EmailAddressConflictError;

export type UpdateFacetInput = {
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  translations?: InputMaybe<Array<FacetTranslationInput>>;
};

export type UpdateFacetValueInput = {
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  translations?: InputMaybe<Array<FacetValueTranslationInput>>;
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: InputMaybe<Array<LanguageCode>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']>;
  trackInventory?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateGlobalSettingsResult = ChannelDefaultLanguageError | GlobalSettings;

export type UpdateOrderAddressInput = {
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  streetLine1?: InputMaybe<Scalars['String']>;
  streetLine2?: InputMaybe<Scalars['String']>;
};

export type UpdateOrderInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
};

export type UpdateOrderNoteInput = {
  isPublic?: InputMaybe<Scalars['Boolean']>;
  note?: InputMaybe<Scalars['String']>;
  noteId: Scalars['ID'];
};

export type UpdatePaymentMethodInput = {
  checker?: InputMaybe<ConfigurableOperationInput>;
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  handler?: InputMaybe<ConfigurableOperationInput>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateProductInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  translations?: InputMaybe<Array<ProductTranslationInput>>;
};

export type UpdateProductOptionGroupInput = {
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  translations?: InputMaybe<Array<ProductOptionGroupTranslationInput>>;
};

export type UpdateProductOptionInput = {
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  translations?: InputMaybe<Array<ProductOptionGroupTranslationInput>>;
};

export type UpdateProductVariantInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']>>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  outOfStockThreshold?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  stockOnHand?: InputMaybe<Scalars['Int']>;
  taxCategoryId?: InputMaybe<Scalars['ID']>;
  trackInventory?: InputMaybe<GlobalFlag>;
  translations?: InputMaybe<Array<ProductVariantTranslationInput>>;
  useGlobalOutOfStockThreshold?: InputMaybe<Scalars['Boolean']>;
};

export type UpdatePromotionInput = {
  actions?: InputMaybe<Array<ConfigurableOperationInput>>;
  conditions?: InputMaybe<Array<ConfigurableOperationInput>>;
  couponCode?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  endsAt?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  perCustomerUsageLimit?: InputMaybe<Scalars['Int']>;
  startsAt?: InputMaybe<Scalars['DateTime']>;
};

export type UpdatePromotionResult = MissingConditionsError | Promotion;

export type UpdateRoleInput = {
  channelIds?: InputMaybe<Array<Scalars['ID']>>;
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  permissions?: InputMaybe<Array<Permission>>;
};

export type UpdateShippingMethodInput = {
  calculator?: InputMaybe<ConfigurableOperationInput>;
  checker?: InputMaybe<ConfigurableOperationInput>;
  code?: InputMaybe<Scalars['String']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  fulfillmentHandler?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  translations: Array<ShippingMethodTranslationInput>;
};

export type UpdateTagInput = {
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['String']>;
};

export type UpdateTaxCategoryInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTaxRateInput = {
  categoryId?: InputMaybe<Scalars['ID']>;
  customFields?: InputMaybe<Scalars['JSON']>;
  customerGroupId?: InputMaybe<Scalars['ID']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Float']>;
  zoneId?: InputMaybe<Scalars['ID']>;
};

export type UpdateZoneInput = {
  customFields?: InputMaybe<Scalars['JSON']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type User = Node & {
  __typename?: 'User';
  authenticationMethods: Array<AuthenticationMethod>;
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  identifier: Scalars['String'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime'];
  verified: Scalars['Boolean'];
};

export type UserStatus = {
  __typename?: 'UserStatus';
  activeChannelId?: Maybe<Scalars['ID']>;
  channels: Array<CurrentUserChannel>;
  isLoggedIn: Scalars['Boolean'];
  loginTime: Scalars['String'];
  permissions: Array<Permission>;
  username: Scalars['String'];
};

export type UserStatusInput = {
  activeChannelId: Scalars['ID'];
  channels: Array<CurrentUserChannelInput>;
  loginTime: Scalars['String'];
  username: Scalars['String'];
};

export type Zone = Node & {
  __typename?: 'Zone';
  createdAt: Scalars['DateTime'];
  customFields?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  members: Array<Country>;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type RoleFragment = { __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> };

export type AdministratorFragment = { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } };

export type GetAdministratorsQueryVariables = Exact<{
  options?: InputMaybe<AdministratorListOptions>;
}>;


export type GetAdministratorsQuery = { administrators: { __typename?: 'AdministratorList', totalItems: number, items: Array<{ __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } }> } };

export type GetActiveAdministratorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveAdministratorQuery = { activeAdministrator?: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } | null };

export type GetAdministratorQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdministratorQuery = { administrator?: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } | null };

export type CreateAdministratorMutationVariables = Exact<{
  input: CreateAdministratorInput;
}>;


export type CreateAdministratorMutation = { createAdministrator: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } };

export type UpdateAdministratorMutationVariables = Exact<{
  input: UpdateAdministratorInput;
}>;


export type UpdateAdministratorMutation = { updateAdministrator: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } };

export type UpdateActiveAdministratorMutationVariables = Exact<{
  input: UpdateActiveAdministratorInput;
}>;


export type UpdateActiveAdministratorMutation = { updateActiveAdministrator: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } };

export type DeleteAdministratorMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAdministratorMutation = { deleteAdministrator: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetRolesQueryVariables = Exact<{
  options?: InputMaybe<RoleListOptions>;
}>;


export type GetRolesQuery = { roles: { __typename?: 'RoleList', totalItems: number, items: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } };

export type GetRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRoleQuery = { role?: { __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> } | null };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: { __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> } };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: { __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteRoleMutation = { deleteRole: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type AssignRoleToAdministratorMutationVariables = Exact<{
  administratorId: Scalars['ID'];
  roleId: Scalars['ID'];
}>;


export type AssignRoleToAdministratorMutation = { assignRoleToAdministrator: { __typename?: 'Administrator', id: string, createdAt: any, updatedAt: any, firstName: string, lastName: string, emailAddress: string, user: { __typename?: 'User', id: string, identifier: string, lastLogin?: any | null, roles: Array<{ __typename?: 'Role', id: string, createdAt: any, updatedAt: any, code: string, description: string, permissions: Array<Permission>, channels: Array<{ __typename?: 'Channel', id: string, code: string, token: string }> }> } } };

export type CurrentUserFragment = { __typename?: 'CurrentUser', id: string, identifier: string, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> };

export type AttemptLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type AttemptLoginMutation = { login: { __typename?: 'CurrentUser', id: string, identifier: string, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } | { __typename?: 'InvalidCredentialsError', errorCode: ErrorCode, message: string } | { __typename?: 'NativeAuthStrategyError', errorCode: ErrorCode, message: string } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { logout: { __typename?: 'Success', success: boolean } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { me?: { __typename?: 'CurrentUser', id: string, identifier: string, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } | null };

export type RequestStartedMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestStartedMutation = { requestStarted: number };

export type RequestCompletedMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestCompletedMutation = { requestCompleted: number };

export type UserStatusFragment = { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> };

export type SetAsLoggedInMutationVariables = Exact<{
  input: UserStatusInput;
}>;


export type SetAsLoggedInMutation = { setAsLoggedIn: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } };

export type SetAsLoggedOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SetAsLoggedOutMutation = { setAsLoggedOut: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } };

export type SetUiLanguageMutationVariables = Exact<{
  languageCode: LanguageCode;
  locale?: InputMaybe<Scalars['String']>;
}>;


export type SetUiLanguageMutation = { setUiLanguage: LanguageCode, setUiLocale?: string | null };

export type SetUiLocaleMutationVariables = Exact<{
  locale?: InputMaybe<Scalars['String']>;
}>;


export type SetUiLocaleMutation = { setUiLocale?: string | null };

export type SetDisplayUiExtensionPointsMutationVariables = Exact<{
  display: Scalars['Boolean'];
}>;


export type SetDisplayUiExtensionPointsMutation = { setDisplayUiExtensionPoints: boolean };

export type SetContentLanguageMutationVariables = Exact<{
  languageCode: LanguageCode;
}>;


export type SetContentLanguageMutation = { setContentLanguage: LanguageCode };

export type SetUiThemeMutationVariables = Exact<{
  theme: Scalars['String'];
}>;


export type SetUiThemeMutation = { setUiTheme: string };

export type GetNetworkStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNetworkStatusQuery = { networkStatus: { __typename?: 'NetworkStatus', inFlightRequests: number } };

export type GetUserStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatusQuery = { userStatus: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } };

export type GetUiStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUiStateQuery = { uiState: { __typename?: 'UiState', language: LanguageCode, locale?: string | null, contentLanguage: LanguageCode, theme: string, displayUiExtensionPoints: boolean } };

export type GetClientStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientStateQuery = { networkStatus: { __typename?: 'NetworkStatus', inFlightRequests: number }, userStatus: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> }, uiState: { __typename?: 'UiState', language: LanguageCode, locale?: string | null, contentLanguage: LanguageCode, theme: string, displayUiExtensionPoints: boolean } };

export type SetActiveChannelMutationVariables = Exact<{
  channelId: Scalars['ID'];
}>;


export type SetActiveChannelMutation = { setActiveChannel: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } };

export type UpdateUserChannelsMutationVariables = Exact<{
  channels: Array<CurrentUserChannelInput> | CurrentUserChannelInput;
}>;


export type UpdateUserChannelsMutation = { updateUserChannels: { __typename?: 'UserStatus', username: string, isLoggedIn: boolean, loginTime: string, activeChannelId?: string | null, permissions: Array<Permission>, channels: Array<{ __typename?: 'CurrentUserChannel', id: string, code: string, token: string, permissions: Array<Permission> }> } };

export type GetCollectionFiltersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionFiltersQuery = { collectionFilters: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }> };

export type CollectionFragment = { __typename?: 'Collection', id: string, createdAt: any, updatedAt: any, name: string, slug: string, description: string, isPrivate: boolean, languageCode?: LanguageCode | null, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, filters: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, translations: Array<{ __typename?: 'CollectionTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent?: { __typename?: 'Collection', id: string, name: string } | null, children?: Array<{ __typename?: 'Collection', id: string, name: string }> | null };

export type GetCollectionListQueryVariables = Exact<{
  options?: InputMaybe<CollectionListOptions>;
}>;


export type GetCollectionListQuery = { collections: { __typename?: 'CollectionList', totalItems: number, items: Array<{ __typename?: 'Collection', id: string, name: string, slug: string, description: string, isPrivate: boolean, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, parent?: { __typename?: 'Collection', id: string } | null }> } };

export type GetCollectionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCollectionQuery = { collection?: { __typename?: 'Collection', id: string, createdAt: any, updatedAt: any, name: string, slug: string, description: string, isPrivate: boolean, languageCode?: LanguageCode | null, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, filters: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, translations: Array<{ __typename?: 'CollectionTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent?: { __typename?: 'Collection', id: string, name: string } | null, children?: Array<{ __typename?: 'Collection', id: string, name: string }> | null } | null };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { createCollection: { __typename?: 'Collection', id: string, createdAt: any, updatedAt: any, name: string, slug: string, description: string, isPrivate: boolean, languageCode?: LanguageCode | null, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, filters: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, translations: Array<{ __typename?: 'CollectionTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent?: { __typename?: 'Collection', id: string, name: string } | null, children?: Array<{ __typename?: 'Collection', id: string, name: string }> | null } };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { updateCollection: { __typename?: 'Collection', id: string, createdAt: any, updatedAt: any, name: string, slug: string, description: string, isPrivate: boolean, languageCode?: LanguageCode | null, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, filters: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, translations: Array<{ __typename?: 'CollectionTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent?: { __typename?: 'Collection', id: string, name: string } | null, children?: Array<{ __typename?: 'Collection', id: string, name: string }> | null } };

export type MoveCollectionMutationVariables = Exact<{
  input: MoveCollectionInput;
}>;


export type MoveCollectionMutation = { moveCollection: { __typename?: 'Collection', id: string, createdAt: any, updatedAt: any, name: string, slug: string, description: string, isPrivate: boolean, languageCode?: LanguageCode | null, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, filters: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, translations: Array<{ __typename?: 'CollectionTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent?: { __typename?: 'Collection', id: string, name: string } | null, children?: Array<{ __typename?: 'Collection', id: string, name: string }> | null } };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCollectionMutation = { deleteCollection: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetCollectionContentsQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: InputMaybe<ProductVariantListOptions>;
}>;


export type GetCollectionContentsQuery = { collection?: { __typename?: 'Collection', id: string, name: string, productVariants: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, productId: string, name: string }> } } | null };

export type AddressFragment = { __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } };

export type CustomerFragment = { __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, title?: string | null, firstName: string, lastName: string, phoneNumber?: string | null, emailAddress: string, user?: { __typename?: 'User', id: string, identifier: string, verified: boolean, lastLogin?: any | null } | null, addresses?: Array<{ __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } }> | null };

export type CustomerGroupFragment = { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string };

export type GetCustomerListQueryVariables = Exact<{
  options?: InputMaybe<CustomerListOptions>;
}>;


export type GetCustomerListQuery = { customers: { __typename?: 'CustomerList', totalItems: number, items: Array<{ __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, title?: string | null, firstName: string, lastName: string, emailAddress: string, user?: { __typename?: 'User', id: string, verified: boolean } | null }> } };

export type GetCustomerQueryVariables = Exact<{
  id: Scalars['ID'];
  orderListOptions?: InputMaybe<OrderListOptions>;
}>;


export type GetCustomerQuery = { customer?: { __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, title?: string | null, firstName: string, lastName: string, phoneNumber?: string | null, emailAddress: string, groups: Array<{ __typename?: 'CustomerGroup', id: string, name: string }>, orders: { __typename?: 'OrderList', totalItems: number, items: Array<{ __typename?: 'Order', id: string, code: string, state: string, totalWithTax: number, currencyCode: CurrencyCode, updatedAt: any }> }, user?: { __typename?: 'User', id: string, identifier: string, verified: boolean, lastLogin?: any | null } | null, addresses?: Array<{ __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } }> | null } | null };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
  password?: InputMaybe<Scalars['String']>;
}>;


export type CreateCustomerMutation = { createCustomer: { __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, title?: string | null, firstName: string, lastName: string, phoneNumber?: string | null, emailAddress: string, user?: { __typename?: 'User', id: string, identifier: string, verified: boolean, lastLogin?: any | null } | null, addresses?: Array<{ __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } }> | null } | { __typename?: 'EmailAddressConflictError', errorCode: ErrorCode, message: string } };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer: { __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, title?: string | null, firstName: string, lastName: string, phoneNumber?: string | null, emailAddress: string, user?: { __typename?: 'User', id: string, identifier: string, verified: boolean, lastLogin?: any | null } | null, addresses?: Array<{ __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } }> | null } | { __typename?: 'EmailAddressConflictError', errorCode: ErrorCode, message: string } };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerMutation = { deleteCustomer: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type CreateCustomerAddressMutationVariables = Exact<{
  customerId: Scalars['ID'];
  input: CreateAddressInput;
}>;


export type CreateCustomerAddressMutation = { createCustomerAddress: { __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } } };

export type UpdateCustomerAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateCustomerAddressMutation = { updateCustomerAddress: { __typename?: 'Address', id: string, createdAt: any, updatedAt: any, fullName?: string | null, company?: string | null, streetLine1: string, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, phoneNumber?: string | null, defaultShippingAddress?: boolean | null, defaultBillingAddress?: boolean | null, country: { __typename?: 'Country', id: string, code: string, name: string } } };

export type CreateCustomerGroupMutationVariables = Exact<{
  input: CreateCustomerGroupInput;
}>;


export type CreateCustomerGroupMutation = { createCustomerGroup: { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string } };

export type UpdateCustomerGroupMutationVariables = Exact<{
  input: UpdateCustomerGroupInput;
}>;


export type UpdateCustomerGroupMutation = { updateCustomerGroup: { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string } };

export type DeleteCustomerGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerGroupMutation = { deleteCustomerGroup: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetCustomerGroupsQueryVariables = Exact<{
  options?: InputMaybe<CustomerGroupListOptions>;
}>;


export type GetCustomerGroupsQuery = { customerGroups: { __typename?: 'CustomerGroupList', totalItems: number, items: Array<{ __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string }> } };

export type GetCustomerGroupWithCustomersQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: InputMaybe<CustomerListOptions>;
}>;


export type GetCustomerGroupWithCustomersQuery = { customerGroup?: { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string, customers: { __typename?: 'CustomerList', totalItems: number, items: Array<{ __typename?: 'Customer', id: string, createdAt: any, updatedAt: any, emailAddress: string, firstName: string, lastName: string }> } } | null };

export type AddCustomersToGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AddCustomersToGroupMutation = { addCustomersToGroup: { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string } };

export type RemoveCustomersFromGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  customerIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type RemoveCustomersFromGroupMutation = { removeCustomersFromGroup: { __typename?: 'CustomerGroup', id: string, createdAt: any, updatedAt: any, name: string } };

export type GetCustomerHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: InputMaybe<HistoryEntryListOptions>;
}>;


export type GetCustomerHistoryQuery = { customer?: { __typename?: 'Customer', id: string, history: { __typename?: 'HistoryEntryList', totalItems: number, items: Array<{ __typename?: 'HistoryEntry', id: string, type: HistoryEntryType, createdAt: any, isPublic: boolean, data: any, administrator?: { __typename?: 'Administrator', id: string, firstName: string, lastName: string } | null }> } } | null };

export type AddNoteToCustomerMutationVariables = Exact<{
  input: AddNoteToCustomerInput;
}>;


export type AddNoteToCustomerMutation = { addNoteToCustomer: { __typename?: 'Customer', id: string } };

export type UpdateCustomerNoteMutationVariables = Exact<{
  input: UpdateCustomerNoteInput;
}>;


export type UpdateCustomerNoteMutation = { updateCustomerNote: { __typename?: 'HistoryEntry', id: string, data: any, isPublic: boolean } };

export type DeleteCustomerNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCustomerNoteMutation = { deleteCustomerNote: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type FacetValueFragment = { __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } };

export type FacetWithValuesFragment = { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ __typename?: 'FacetTranslation', id: string, languageCode: LanguageCode, name: string }>, values: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> };

export type CreateFacetMutationVariables = Exact<{
  input: CreateFacetInput;
}>;


export type CreateFacetMutation = { createFacet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ __typename?: 'FacetTranslation', id: string, languageCode: LanguageCode, name: string }>, values: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> } };

export type UpdateFacetMutationVariables = Exact<{
  input: UpdateFacetInput;
}>;


export type UpdateFacetMutation = { updateFacet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ __typename?: 'FacetTranslation', id: string, languageCode: LanguageCode, name: string }>, values: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> } };

export type DeleteFacetMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeleteFacetMutation = { deleteFacet: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type CreateFacetValuesMutationVariables = Exact<{
  input: Array<CreateFacetValueInput> | CreateFacetValueInput;
}>;


export type CreateFacetValuesMutation = { createFacetValues: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> };

export type UpdateFacetValuesMutationVariables = Exact<{
  input: Array<UpdateFacetValueInput> | UpdateFacetValueInput;
}>;


export type UpdateFacetValuesMutation = { updateFacetValues: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> };

export type DeleteFacetValuesMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
  force?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeleteFacetValuesMutation = { deleteFacetValues: Array<{ __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null }> };

export type GetFacetListQueryVariables = Exact<{
  options?: InputMaybe<FacetListOptions>;
}>;


export type GetFacetListQuery = { facets: { __typename?: 'FacetList', totalItems: number, items: Array<{ __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ __typename?: 'FacetTranslation', id: string, languageCode: LanguageCode, name: string }>, values: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> }> } };

export type GetFacetWithValuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFacetWithValuesQuery = { facet?: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ __typename?: 'FacetTranslation', id: string, languageCode: LanguageCode, name: string }>, values: Array<{ __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'FacetValueTranslation', id: string, languageCode: LanguageCode, name: string }>, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } }> } | null };

export type DiscountFragment = { __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType };

export type RefundFragment = { __typename?: 'Refund', id: string, state: string, items: number, shipping: number, adjustment: number, transactionId?: string | null, paymentId: string };

export type OrderAddressFragment = { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null };

export type OrderFragment = { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, orderPlacedAt?: any | null, code: string, state: string, nextStates: Array<string>, total: number, currencyCode: CurrencyCode, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', name: string } }> };

export type FulfillmentFragment = { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> };

export type OrderLineFragment = { __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> };

export type OrderDetailFragment = { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, code: string, state: string, nextStates: Array<string>, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, lines: Array<{ __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> }>, surcharges: Array<{ __typename?: 'Surcharge', id: string, sku?: string | null, description: string, price: number, priceWithTax: number, taxRate: number }>, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, promotions: Array<{ __typename?: 'Promotion', id: string, couponCode?: string | null }>, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', id: string, code: string, name: string, fulfillmentHandlerCode: string, description: string } }>, taxSummary: Array<{ __typename?: 'OrderTaxSummary', description: string, taxBase: number, taxRate: number, taxTotal: number }>, shippingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, billingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, payments?: Array<{ __typename?: 'Payment', id: string, createdAt: any, transactionId?: string | null, amount: number, method: string, state: string, nextStates: Array<string>, errorMessage?: string | null, metadata?: any | null, refunds: Array<{ __typename?: 'Refund', id: string, createdAt: any, state: string, items: number, adjustment: number, total: number, paymentId: string, reason?: string | null, transactionId?: string | null, method?: string | null, metadata?: any | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> }> | null, fulfillments?: Array<{ __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> | null, modifications: Array<{ __typename?: 'OrderModification', id: string, createdAt: any, isSettled: boolean, priceChange: number, note: string, payment?: { __typename?: 'Payment', id: string, amount: number } | null, orderItems?: Array<{ __typename?: 'OrderItem', id: string }> | null, refund?: { __typename?: 'Refund', id: string, paymentId: string, total: number } | null, surcharges?: Array<{ __typename?: 'Surcharge', id: string }> | null }> };

export type GetOrderListQueryVariables = Exact<{
  options?: InputMaybe<OrderListOptions>;
}>;


export type GetOrderListQuery = { orders: { __typename?: 'OrderList', totalItems: number, items: Array<{ __typename?: 'Order', id: string, createdAt: any, updatedAt: any, orderPlacedAt?: any | null, code: string, state: string, nextStates: Array<string>, total: number, currencyCode: CurrencyCode, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', name: string } }> }> } };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderQuery = { order?: { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, code: string, state: string, nextStates: Array<string>, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, lines: Array<{ __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> }>, surcharges: Array<{ __typename?: 'Surcharge', id: string, sku?: string | null, description: string, price: number, priceWithTax: number, taxRate: number }>, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, promotions: Array<{ __typename?: 'Promotion', id: string, couponCode?: string | null }>, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', id: string, code: string, name: string, fulfillmentHandlerCode: string, description: string } }>, taxSummary: Array<{ __typename?: 'OrderTaxSummary', description: string, taxBase: number, taxRate: number, taxTotal: number }>, shippingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, billingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, payments?: Array<{ __typename?: 'Payment', id: string, createdAt: any, transactionId?: string | null, amount: number, method: string, state: string, nextStates: Array<string>, errorMessage?: string | null, metadata?: any | null, refunds: Array<{ __typename?: 'Refund', id: string, createdAt: any, state: string, items: number, adjustment: number, total: number, paymentId: string, reason?: string | null, transactionId?: string | null, method?: string | null, metadata?: any | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> }> | null, fulfillments?: Array<{ __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> | null, modifications: Array<{ __typename?: 'OrderModification', id: string, createdAt: any, isSettled: boolean, priceChange: number, note: string, payment?: { __typename?: 'Payment', id: string, amount: number } | null, orderItems?: Array<{ __typename?: 'OrderItem', id: string }> | null, refund?: { __typename?: 'Refund', id: string, paymentId: string, total: number } | null, surcharges?: Array<{ __typename?: 'Surcharge', id: string }> | null }> } | null };

export type SettlePaymentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SettlePaymentMutation = { settlePayment: { __typename?: 'OrderStateTransitionError', transitionError: string, errorCode: ErrorCode, message: string } | { __typename?: 'Payment', id: string, transactionId?: string | null, amount: number, method: string, state: string, metadata?: any | null } | { __typename?: 'PaymentStateTransitionError', transitionError: string, errorCode: ErrorCode, message: string } | { __typename?: 'SettlePaymentError', paymentErrorMessage: string, errorCode: ErrorCode, message: string } };

export type TransitionPaymentToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionPaymentToStateMutation = { transitionPaymentToState: { __typename?: 'Payment', id: string, transactionId?: string | null, amount: number, method: string, state: string, metadata?: any | null } | { __typename?: 'PaymentStateTransitionError', transitionError: string, errorCode: ErrorCode, message: string } };

export type CreateFulfillmentMutationVariables = Exact<{
  input: FulfillOrderInput;
}>;


export type CreateFulfillmentMutation = { addFulfillmentToOrder: { __typename?: 'CreateFulfillmentError', errorCode: ErrorCode, message: string, fulfillmentHandlerError: string } | { __typename?: 'EmptyOrderLineSelectionError', errorCode: ErrorCode, message: string } | { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | { __typename?: 'FulfillmentStateTransitionError', errorCode: ErrorCode, message: string, transitionError: string } | { __typename?: 'InsufficientStockOnHandError', errorCode: ErrorCode, message: string } | { __typename?: 'InvalidFulfillmentHandlerError', errorCode: ErrorCode, message: string } | { __typename?: 'ItemsAlreadyFulfilledError', errorCode: ErrorCode, message: string } };

export type CancelOrderMutationVariables = Exact<{
  input: CancelOrderInput;
}>;


export type CancelOrderMutation = { cancelOrder: { __typename?: 'CancelActiveOrderError', errorCode: ErrorCode, message: string } | { __typename?: 'EmptyOrderLineSelectionError', errorCode: ErrorCode, message: string } | { __typename?: 'MultipleOrderError', errorCode: ErrorCode, message: string } | { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, code: string, state: string, nextStates: Array<string>, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, lines: Array<{ __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> }>, surcharges: Array<{ __typename?: 'Surcharge', id: string, sku?: string | null, description: string, price: number, priceWithTax: number, taxRate: number }>, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, promotions: Array<{ __typename?: 'Promotion', id: string, couponCode?: string | null }>, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', id: string, code: string, name: string, fulfillmentHandlerCode: string, description: string } }>, taxSummary: Array<{ __typename?: 'OrderTaxSummary', description: string, taxBase: number, taxRate: number, taxTotal: number }>, shippingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, billingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, payments?: Array<{ __typename?: 'Payment', id: string, createdAt: any, transactionId?: string | null, amount: number, method: string, state: string, nextStates: Array<string>, errorMessage?: string | null, metadata?: any | null, refunds: Array<{ __typename?: 'Refund', id: string, createdAt: any, state: string, items: number, adjustment: number, total: number, paymentId: string, reason?: string | null, transactionId?: string | null, method?: string | null, metadata?: any | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> }> | null, fulfillments?: Array<{ __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> | null, modifications: Array<{ __typename?: 'OrderModification', id: string, createdAt: any, isSettled: boolean, priceChange: number, note: string, payment?: { __typename?: 'Payment', id: string, amount: number } | null, orderItems?: Array<{ __typename?: 'OrderItem', id: string }> | null, refund?: { __typename?: 'Refund', id: string, paymentId: string, total: number } | null, surcharges?: Array<{ __typename?: 'Surcharge', id: string }> | null }> } | { __typename?: 'OrderStateTransitionError', errorCode: ErrorCode, message: string } | { __typename?: 'QuantityTooGreatError', errorCode: ErrorCode, message: string } };

export type RefundOrderMutationVariables = Exact<{
  input: RefundOrderInput;
}>;


export type RefundOrderMutation = { refundOrder: { __typename?: 'AlreadyRefundedError', errorCode: ErrorCode, message: string } | { __typename?: 'MultipleOrderError', errorCode: ErrorCode, message: string } | { __typename?: 'NothingToRefundError', errorCode: ErrorCode, message: string } | { __typename?: 'OrderStateTransitionError', errorCode: ErrorCode, message: string } | { __typename?: 'PaymentOrderMismatchError', errorCode: ErrorCode, message: string } | { __typename?: 'QuantityTooGreatError', errorCode: ErrorCode, message: string } | { __typename?: 'Refund', id: string, state: string, items: number, shipping: number, adjustment: number, transactionId?: string | null, paymentId: string } | { __typename?: 'RefundOrderStateError', errorCode: ErrorCode, message: string } | { __typename?: 'RefundStateTransitionError', errorCode: ErrorCode, message: string } };

export type SettleRefundMutationVariables = Exact<{
  input: SettleRefundInput;
}>;


export type SettleRefundMutation = { settleRefund: { __typename?: 'Refund', id: string, state: string, items: number, shipping: number, adjustment: number, transactionId?: string | null, paymentId: string } | { __typename?: 'RefundStateTransitionError', errorCode: ErrorCode, message: string } };

export type GetOrderHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  options?: InputMaybe<HistoryEntryListOptions>;
}>;


export type GetOrderHistoryQuery = { order?: { __typename?: 'Order', id: string, history: { __typename?: 'HistoryEntryList', totalItems: number, items: Array<{ __typename?: 'HistoryEntry', id: string, type: HistoryEntryType, createdAt: any, isPublic: boolean, data: any, administrator?: { __typename?: 'Administrator', id: string, firstName: string, lastName: string } | null }> } } | null };

export type AddNoteToOrderMutationVariables = Exact<{
  input: AddNoteToOrderInput;
}>;


export type AddNoteToOrderMutation = { addNoteToOrder: { __typename?: 'Order', id: string } };

export type UpdateOrderNoteMutationVariables = Exact<{
  input: UpdateOrderNoteInput;
}>;


export type UpdateOrderNoteMutation = { updateOrderNote: { __typename?: 'HistoryEntry', id: string, data: any, isPublic: boolean } };

export type DeleteOrderNoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteOrderNoteMutation = { deleteOrderNote: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type TransitionOrderToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionOrderToStateMutation = { transitionOrderToState?: { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, orderPlacedAt?: any | null, code: string, state: string, nextStates: Array<string>, total: number, currencyCode: CurrencyCode, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', name: string } }> } | { __typename?: 'OrderStateTransitionError', transitionError: string, errorCode: ErrorCode, message: string } | null };

export type UpdateOrderCustomFieldsMutationVariables = Exact<{
  input: UpdateOrderInput;
}>;


export type UpdateOrderCustomFieldsMutation = { setOrderCustomFields?: { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, orderPlacedAt?: any | null, code: string, state: string, nextStates: Array<string>, total: number, currencyCode: CurrencyCode, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', name: string } }> } | null };

export type TransitionFulfillmentToStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type TransitionFulfillmentToStateMutation = { transitionFulfillmentToState: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | { __typename?: 'FulfillmentStateTransitionError', transitionError: string, errorCode: ErrorCode, message: string } };

export type GetOrderSummaryQueryVariables = Exact<{
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}>;


export type GetOrderSummaryQuery = { orders: { __typename?: 'OrderList', totalItems: number, items: Array<{ __typename?: 'Order', id: string, total: number, currencyCode: CurrencyCode }> } };

export type ModifyOrderMutationVariables = Exact<{
  input: ModifyOrderInput;
}>;


export type ModifyOrderMutation = { modifyOrder: { __typename?: 'InsufficientStockError', errorCode: ErrorCode, message: string } | { __typename?: 'NegativeQuantityError', errorCode: ErrorCode, message: string } | { __typename?: 'NoChangesSpecifiedError', errorCode: ErrorCode, message: string } | { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, code: string, state: string, nextStates: Array<string>, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, lines: Array<{ __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> }>, surcharges: Array<{ __typename?: 'Surcharge', id: string, sku?: string | null, description: string, price: number, priceWithTax: number, taxRate: number }>, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, promotions: Array<{ __typename?: 'Promotion', id: string, couponCode?: string | null }>, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', id: string, code: string, name: string, fulfillmentHandlerCode: string, description: string } }>, taxSummary: Array<{ __typename?: 'OrderTaxSummary', description: string, taxBase: number, taxRate: number, taxTotal: number }>, shippingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, billingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, payments?: Array<{ __typename?: 'Payment', id: string, createdAt: any, transactionId?: string | null, amount: number, method: string, state: string, nextStates: Array<string>, errorMessage?: string | null, metadata?: any | null, refunds: Array<{ __typename?: 'Refund', id: string, createdAt: any, state: string, items: number, adjustment: number, total: number, paymentId: string, reason?: string | null, transactionId?: string | null, method?: string | null, metadata?: any | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> }> | null, fulfillments?: Array<{ __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> | null, modifications: Array<{ __typename?: 'OrderModification', id: string, createdAt: any, isSettled: boolean, priceChange: number, note: string, payment?: { __typename?: 'Payment', id: string, amount: number } | null, orderItems?: Array<{ __typename?: 'OrderItem', id: string }> | null, refund?: { __typename?: 'Refund', id: string, paymentId: string, total: number } | null, surcharges?: Array<{ __typename?: 'Surcharge', id: string }> | null }> } | { __typename?: 'OrderLimitError', errorCode: ErrorCode, message: string } | { __typename?: 'OrderModificationStateError', errorCode: ErrorCode, message: string } | { __typename?: 'PaymentMethodMissingError', errorCode: ErrorCode, message: string } | { __typename?: 'RefundPaymentIdMissingError', errorCode: ErrorCode, message: string } };

export type AddManualPaymentMutationVariables = Exact<{
  input: ManualPaymentInput;
}>;


export type AddManualPaymentMutation = { addManualPaymentToOrder: { __typename?: 'ManualPaymentStateError', errorCode: ErrorCode, message: string } | { __typename?: 'Order', id: string, createdAt: any, updatedAt: any, code: string, state: string, nextStates: Array<string>, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string } | null, lines: Array<{ __typename?: 'OrderLine', id: string, unitPrice: number, unitPriceWithTax: number, proratedUnitPrice: number, proratedUnitPriceWithTax: number, quantity: number, linePrice: number, lineTax: number, linePriceWithTax: number, discountedLinePrice: number, discountedLinePriceWithTax: number, featuredAsset?: { __typename?: 'Asset', preview: string } | null, productVariant: { __typename?: 'ProductVariant', id: string, name: string, sku: string, trackInventory: GlobalFlag, stockOnHand: number }, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, items: Array<{ __typename?: 'OrderItem', id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, refundId?: string | null, cancelled: boolean, fulfillment?: { __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> } | null }> }>, surcharges: Array<{ __typename?: 'Surcharge', id: string, sku?: string | null, description: string, price: number, priceWithTax: number, taxRate: number }>, discounts: Array<{ __typename?: 'Discount', adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, promotions: Array<{ __typename?: 'Promotion', id: string, couponCode?: string | null }>, shippingLines: Array<{ __typename?: 'ShippingLine', shippingMethod: { __typename?: 'ShippingMethod', id: string, code: string, name: string, fulfillmentHandlerCode: string, description: string } }>, taxSummary: Array<{ __typename?: 'OrderTaxSummary', description: string, taxBase: number, taxRate: number, taxTotal: number }>, shippingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, billingAddress?: { __typename?: 'OrderAddress', fullName?: string | null, company?: string | null, streetLine1?: string | null, streetLine2?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, country?: string | null, countryCode?: string | null, phoneNumber?: string | null } | null, payments?: Array<{ __typename?: 'Payment', id: string, createdAt: any, transactionId?: string | null, amount: number, method: string, state: string, nextStates: Array<string>, errorMessage?: string | null, metadata?: any | null, refunds: Array<{ __typename?: 'Refund', id: string, createdAt: any, state: string, items: number, adjustment: number, total: number, paymentId: string, reason?: string | null, transactionId?: string | null, method?: string | null, metadata?: any | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> }> | null, fulfillments?: Array<{ __typename?: 'Fulfillment', id: string, state: string, nextStates: Array<string>, createdAt: any, updatedAt: any, method: string, trackingCode?: string | null, orderItems: Array<{ __typename?: 'OrderItem', id: string }> }> | null, modifications: Array<{ __typename?: 'OrderModification', id: string, createdAt: any, isSettled: boolean, priceChange: number, note: string, payment?: { __typename?: 'Payment', id: string, amount: number } | null, orderItems?: Array<{ __typename?: 'OrderItem', id: string }> | null, refund?: { __typename?: 'Refund', id: string, paymentId: string, total: number } | null, surcharges?: Array<{ __typename?: 'Surcharge', id: string }> | null }> } };

export type AssetFragment = { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null };

export type TagFragment = { __typename?: 'Tag', id: string, value: string };

export type ProductOptionGroupFragment = { __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> };

export type ProductOptionFragment = { __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> };

export type ProductVariantFragment = { __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> };

export type ProductDetailFragment = { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> };

export type ProductOptionGroupWithOptionsFragment = { __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, name: string }>, options: Array<{ __typename?: 'ProductOption', id: string, languageCode: LanguageCode, name: string, code: string, translations: Array<{ __typename?: 'ProductOptionTranslation', name: string }> }> };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
  variantListOptions?: InputMaybe<ProductVariantListOptions>;
}>;


export type UpdateProductMutation = { updateProduct: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, variantList: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> }, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
  variantListOptions?: InputMaybe<ProductVariantListOptions>;
}>;


export type CreateProductMutation = { createProduct: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, variantList: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> }, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductMutation = { deleteProduct: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type CreateProductVariantsMutationVariables = Exact<{
  input: Array<CreateProductVariantInput> | CreateProductVariantInput;
}>;


export type CreateProductVariantsMutation = { createProductVariants: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> } | null> };

export type UpdateProductVariantsMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput> | UpdateProductVariantInput;
}>;


export type UpdateProductVariantsMutation = { updateProductVariants: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> } | null> };

export type CreateProductOptionGroupMutationVariables = Exact<{
  input: CreateProductOptionGroupInput;
}>;


export type CreateProductOptionGroupMutation = { createProductOptionGroup: { __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, name: string }>, options: Array<{ __typename?: 'ProductOption', id: string, languageCode: LanguageCode, name: string, code: string, translations: Array<{ __typename?: 'ProductOptionTranslation', name: string }> }> } };

export type GetProductOptionGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductOptionGroupQuery = { productOptionGroup?: { __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, name: string }>, options: Array<{ __typename?: 'ProductOption', id: string, languageCode: LanguageCode, name: string, code: string, translations: Array<{ __typename?: 'ProductOptionTranslation', name: string }> }> } | null };

export type AddOptionToGroupMutationVariables = Exact<{
  input: CreateProductOptionInput;
}>;


export type AddOptionToGroupMutation = { createProductOption: { __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, name: string, code: string, groupId: string } };

export type AddOptionGroupToProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type AddOptionGroupToProductMutation = { addOptionGroupToProduct: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string }> }> } };

export type RemoveOptionGroupFromProductMutationVariables = Exact<{
  productId: Scalars['ID'];
  optionGroupId: Scalars['ID'];
}>;


export type RemoveOptionGroupFromProductMutation = { removeOptionGroupFromProduct: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string }> }> } | { __typename?: 'ProductOptionInUseError', errorCode: ErrorCode, message: string } };

export type GetProductWithVariantsQueryVariables = Exact<{
  id: Scalars['ID'];
  variantListOptions?: InputMaybe<ProductVariantListOptions>;
}>;


export type GetProductWithVariantsQuery = { product?: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, variantList: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> }, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductTranslation', id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> } | null };

export type GetProductSimpleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductSimpleQuery = { product?: { __typename?: 'Product', id: string, name: string, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null } | null };

export type GetProductListQueryVariables = Exact<{
  options?: InputMaybe<ProductListOptions>;
}>;


export type GetProductListQuery = { products: { __typename?: 'ProductList', totalItems: number, items: Array<{ __typename?: 'Product', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, preview: string } | null }> } };

export type GetProductOptionGroupsQueryVariables = Exact<{
  filterTerm?: InputMaybe<Scalars['String']>;
}>;


export type GetProductOptionGroupsQuery = { productOptionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, languageCode: LanguageCode, code: string, name: string }> }> };

export type GetAssetListQueryVariables = Exact<{
  options?: InputMaybe<AssetListOptions>;
}>;


export type GetAssetListQuery = { assets: { __typename?: 'AssetList', totalItems: number, items: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }> } };

export type GetAssetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAssetQuery = { asset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null };

export type CreateAssetsMutationVariables = Exact<{
  input: Array<CreateAssetInput> | CreateAssetInput;
}>;


export type CreateAssetsMutation = { createAssets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | { __typename?: 'MimeTypeError', message: string }> };

export type UpdateAssetMutationVariables = Exact<{
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, tags: Array<{ __typename?: 'Tag', id: string, value: string }>, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } };

export type DeleteAssetsMutationVariables = Exact<{
  input: DeleteAssetsInput;
}>;


export type DeleteAssetsMutation = { deleteAssets: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type SearchProductsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsQuery = { search: { __typename?: 'SearchResponse', totalItems: number, items: Array<{ __typename?: 'SearchResult', enabled: boolean, productId: string, productName: string, productVariantId: string, productVariantName: string, sku: string, channelIds: Array<string>, productAsset?: { __typename?: 'SearchResultAsset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, productVariantAsset?: { __typename?: 'SearchResultAsset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null }>, facetValues: Array<{ __typename?: 'FacetValueResult', count: number, facetValue: { __typename?: 'FacetValue', id: string, createdAt: any, updatedAt: any, name: string, facet: { __typename?: 'Facet', id: string, createdAt: any, updatedAt: any, name: string } } }> } };

export type ProductSelectorSearchQueryVariables = Exact<{
  term: Scalars['String'];
  take: Scalars['Int'];
}>;


export type ProductSelectorSearchQuery = { search: { __typename?: 'SearchResponse', items: Array<{ __typename?: 'SearchResult', productVariantId: string, productVariantName: string, sku: string, productAsset?: { __typename?: 'SearchResultAsset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, price: { __typename?: 'PriceRange' } | { __typename?: 'SinglePrice', value: number }, priceWithTax: { __typename?: 'PriceRange' } | { __typename?: 'SinglePrice', value: number } }> } };

export type UpdateProductOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateProductOptionGroupMutation = { updateProductOptionGroup: { __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateProductOptionMutationVariables = Exact<{
  input: UpdateProductOptionInput;
}>;


export type UpdateProductOptionMutation = { updateProductOption: { __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteProductVariantMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProductVariantMutation = { deleteProductVariant: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetProductVariantOptionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductVariantOptionsQuery = { product?: { __typename?: 'Product', id: string, createdAt: any, updatedAt: any, name: string, optionGroups: Array<{ __typename?: 'ProductOptionGroup', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, translations: Array<{ __typename?: 'ProductOptionGroupTranslation', id: string, languageCode: LanguageCode, name: string }> }>, variants: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, name: string, sku: string, price: number, stockOnHand: number, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, name: string, code: string, groupId: string }> }> } | null };

export type AssignProductsToChannelMutationVariables = Exact<{
  input: AssignProductsToChannelInput;
}>;


export type AssignProductsToChannelMutation = { assignProductsToChannel: Array<{ __typename?: 'Product', id: string, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> };

export type AssignVariantsToChannelMutationVariables = Exact<{
  input: AssignProductVariantsToChannelInput;
}>;


export type AssignVariantsToChannelMutation = { assignProductVariantsToChannel: Array<{ __typename?: 'ProductVariant', id: string, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> };

export type RemoveProductsFromChannelMutationVariables = Exact<{
  input: RemoveProductsFromChannelInput;
}>;


export type RemoveProductsFromChannelMutation = { removeProductsFromChannel: Array<{ __typename?: 'Product', id: string, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> };

export type RemoveVariantsFromChannelMutationVariables = Exact<{
  input: RemoveProductVariantsFromChannelInput;
}>;


export type RemoveVariantsFromChannelMutation = { removeProductVariantsFromChannel: Array<{ __typename?: 'ProductVariant', id: string, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> };

export type GetProductVariantQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductVariantQuery = { productVariant?: { __typename?: 'ProductVariant', id: string, name: string, sku: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, product: { __typename?: 'Product', id: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null } } | null };

export type GetProductVariantListSimpleQueryVariables = Exact<{
  options: ProductVariantListOptions;
  productId?: InputMaybe<Scalars['ID']>;
}>;


export type GetProductVariantListSimpleQuery = { productVariants: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, name: string, sku: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, product: { __typename?: 'Product', id: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null } }> } };

export type GetProductVariantListQueryVariables = Exact<{
  options: ProductVariantListOptions;
  productId?: InputMaybe<Scalars['ID']>;
}>;


export type GetProductVariantListQuery = { productVariants: { __typename?: 'ProductVariantList', totalItems: number, items: Array<{ __typename?: 'ProductVariant', id: string, createdAt: any, updatedAt: any, enabled: boolean, languageCode: LanguageCode, name: string, price: number, currencyCode: CurrencyCode, priceWithTax: number, stockOnHand: number, stockAllocated: number, trackInventory: GlobalFlag, outOfStockThreshold: number, useGlobalOutOfStockThreshold: boolean, sku: string, taxRateApplied: { __typename?: 'TaxRate', id: string, name: string, value: number }, taxCategory: { __typename?: 'TaxCategory', id: string, name: string }, options: Array<{ __typename?: 'ProductOption', id: string, createdAt: any, updatedAt: any, code: string, languageCode: LanguageCode, name: string, groupId: string, translations: Array<{ __typename?: 'ProductOptionTranslation', id: string, languageCode: LanguageCode, name: string }> }>, facetValues: Array<{ __typename?: 'FacetValue', id: string, code: string, name: string, facet: { __typename?: 'Facet', id: string, name: string } }>, featuredAsset?: { __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null } | null, assets: Array<{ __typename?: 'Asset', id: string, createdAt: any, updatedAt: any, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, width: number, height: number, focalPoint?: { __typename?: 'Coordinate', x: number, y: number } | null }>, translations: Array<{ __typename?: 'ProductVariantTranslation', id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ __typename?: 'Channel', id: string, code: string }> }> } };

export type GetTagListQueryVariables = Exact<{
  options?: InputMaybe<TagListOptions>;
}>;


export type GetTagListQuery = { tags: { __typename?: 'TagList', totalItems: number, items: Array<{ __typename?: 'Tag', id: string, value: string }> } };

export type GetTagQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTagQuery = { tag: { __typename?: 'Tag', id: string, value: string } };

export type CreateTagMutationVariables = Exact<{
  input: CreateTagInput;
}>;


export type CreateTagMutation = { createTag: { __typename?: 'Tag', id: string, value: string } };

export type UpdateTagMutationVariables = Exact<{
  input: UpdateTagInput;
}>;


export type UpdateTagMutation = { updateTag: { __typename?: 'Tag', id: string, value: string } };

export type DeleteTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTagMutation = { deleteTag: { __typename?: 'DeletionResponse', message?: string | null, result: DeletionResult } };

export type PromotionFragment = { __typename?: 'Promotion', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, couponCode?: string | null, perCustomerUsageLimit?: number | null, startsAt?: any | null, endsAt?: any | null, conditions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, actions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }> };

export type GetPromotionListQueryVariables = Exact<{
  options?: InputMaybe<PromotionListOptions>;
}>;


export type GetPromotionListQuery = { promotions: { __typename?: 'PromotionList', totalItems: number, items: Array<{ __typename?: 'Promotion', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, couponCode?: string | null, perCustomerUsageLimit?: number | null, startsAt?: any | null, endsAt?: any | null, conditions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, actions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }> }> } };

export type GetPromotionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPromotionQuery = { promotion?: { __typename?: 'Promotion', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, couponCode?: string | null, perCustomerUsageLimit?: number | null, startsAt?: any | null, endsAt?: any | null, conditions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, actions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }> } | null };

export type GetAdjustmentOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdjustmentOperationsQuery = { promotionConditions: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }>, promotionActions: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }> };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { createPromotion: { __typename?: 'MissingConditionsError', errorCode: ErrorCode, message: string } | { __typename?: 'Promotion', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, couponCode?: string | null, perCustomerUsageLimit?: number | null, startsAt?: any | null, endsAt?: any | null, conditions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, actions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }> } };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { updatePromotion: { __typename?: 'MissingConditionsError' } | { __typename?: 'Promotion', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, couponCode?: string | null, perCustomerUsageLimit?: number | null, startsAt?: any | null, endsAt?: any | null, conditions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }>, actions: Array<{ __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }> } };

export type DeletePromotionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePromotionMutation = { deletePromotion: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type CountryFragment = { __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> };

export type GetCountryListQueryVariables = Exact<{
  options?: InputMaybe<CountryListOptions>;
}>;


export type GetCountryListQuery = { countries: { __typename?: 'CountryList', totalItems: number, items: Array<{ __typename?: 'Country', id: string, code: string, name: string, enabled: boolean }> } };

export type GetAvailableCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableCountriesQuery = { countries: { __typename?: 'CountryList', items: Array<{ __typename?: 'Country', id: string, code: string, name: string, enabled: boolean }> } };

export type GetCountryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCountryQuery = { country?: { __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput;
}>;


export type CreateCountryMutation = { createCountry: { __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateCountryMutationVariables = Exact<{
  input: UpdateCountryInput;
}>;


export type UpdateCountryMutation = { updateCountry: { __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteCountryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCountryMutation = { deleteCountry: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type ZoneFragment = { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> };

export type GetZonesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetZonesQuery = { zones: Array<{ __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', createdAt: any, updatedAt: any, id: string, name: string, code: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> }> };

export type GetZoneQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetZoneQuery = { zone?: { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> } | null };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type DeleteZoneMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteZoneMutation = { deleteZone: { __typename?: 'DeletionResponse', message?: string | null, result: DeletionResult } };

export type AddMembersToZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AddMembersToZoneMutation = { addMembersToZone: { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type RemoveMembersFromZoneMutationVariables = Exact<{
  zoneId: Scalars['ID'];
  memberIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type RemoveMembersFromZoneMutation = { removeMembersFromZone: { __typename?: 'Zone', id: string, createdAt: any, updatedAt: any, name: string, members: Array<{ __typename?: 'Country', id: string, createdAt: any, updatedAt: any, code: string, name: string, enabled: boolean, translations: Array<{ __typename?: 'CountryTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type TaxCategoryFragment = { __typename?: 'TaxCategory', id: string, createdAt: any, updatedAt: any, name: string, isDefault: boolean };

export type GetTaxCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxCategoriesQuery = { taxCategories: Array<{ __typename?: 'TaxCategory', id: string, createdAt: any, updatedAt: any, name: string, isDefault: boolean }> };

export type GetTaxCategoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxCategoryQuery = { taxCategory?: { __typename?: 'TaxCategory', id: string, createdAt: any, updatedAt: any, name: string, isDefault: boolean } | null };

export type CreateTaxCategoryMutationVariables = Exact<{
  input: CreateTaxCategoryInput;
}>;


export type CreateTaxCategoryMutation = { createTaxCategory: { __typename?: 'TaxCategory', id: string, createdAt: any, updatedAt: any, name: string, isDefault: boolean } };

export type UpdateTaxCategoryMutationVariables = Exact<{
  input: UpdateTaxCategoryInput;
}>;


export type UpdateTaxCategoryMutation = { updateTaxCategory: { __typename?: 'TaxCategory', id: string, createdAt: any, updatedAt: any, name: string, isDefault: boolean } };

export type DeleteTaxCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxCategoryMutation = { deleteTaxCategory: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type TaxRateFragment = { __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string }, customerGroup?: { __typename?: 'CustomerGroup', id: string, name: string } | null };

export type GetTaxRateListQueryVariables = Exact<{
  options?: InputMaybe<TaxRateListOptions>;
}>;


export type GetTaxRateListQuery = { taxRates: { __typename?: 'TaxRateList', totalItems: number, items: Array<{ __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string }, customerGroup?: { __typename?: 'CustomerGroup', id: string, name: string } | null }> } };

export type GetTaxRateListSimpleQueryVariables = Exact<{
  options?: InputMaybe<TaxRateListOptions>;
}>;


export type GetTaxRateListSimpleQuery = { taxRates: { __typename?: 'TaxRateList', totalItems: number, items: Array<{ __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string } }> } };

export type GetTaxRateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaxRateQuery = { taxRate?: { __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string }, customerGroup?: { __typename?: 'CustomerGroup', id: string, name: string } | null } | null };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { createTaxRate: { __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string }, customerGroup?: { __typename?: 'CustomerGroup', id: string, name: string } | null } };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { updateTaxRate: { __typename?: 'TaxRate', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, value: number, category: { __typename?: 'TaxCategory', id: string, name: string }, zone: { __typename?: 'Zone', id: string, name: string }, customerGroup?: { __typename?: 'CustomerGroup', id: string, name: string } | null } };

export type DeleteTaxRateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTaxRateMutation = { deleteTaxRate: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type ChannelFragment = { __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { channels: Array<{ __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null }> };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetChannelQuery = { channel?: { __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null } | null };

export type GetActiveChannelQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveChannelQuery = { activeChannel: { __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null } };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel: { __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null } | { __typename?: 'LanguageNotAvailableError', errorCode: ErrorCode, message: string } };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { updateChannel: { __typename?: 'Channel', id: string, createdAt: any, updatedAt: any, code: string, token: string, pricesIncludeTax: boolean, currencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, defaultShippingZone?: { __typename?: 'Zone', id: string, name: string } | null, defaultTaxZone?: { __typename?: 'Zone', id: string, name: string } | null } | { __typename?: 'LanguageNotAvailableError', errorCode: ErrorCode, message: string } };

export type DeleteChannelMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteChannelMutation = { deleteChannel: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type PaymentMethodFragment = { __typename?: 'PaymentMethod', id: string, createdAt: any, updatedAt: any, name: string, code: string, description: string, enabled: boolean, checker?: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } | null, handler: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } };

export type GetPaymentMethodListQueryVariables = Exact<{
  options: PaymentMethodListOptions;
}>;


export type GetPaymentMethodListQuery = { paymentMethods: { __typename?: 'PaymentMethodList', totalItems: number, items: Array<{ __typename?: 'PaymentMethod', id: string, createdAt: any, updatedAt: any, name: string, code: string, description: string, enabled: boolean, checker?: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } | null, handler: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } }> } };

export type GetPaymentMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodOperationsQuery = { paymentMethodEligibilityCheckers: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }>, paymentMethodHandlers: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }> };

export type GetPaymentMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPaymentMethodQuery = { paymentMethod?: { __typename?: 'PaymentMethod', id: string, createdAt: any, updatedAt: any, name: string, code: string, description: string, enabled: boolean, checker?: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } | null, handler: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } } | null };

export type CreatePaymentMethodMutationVariables = Exact<{
  input: CreatePaymentMethodInput;
}>;


export type CreatePaymentMethodMutation = { createPaymentMethod: { __typename?: 'PaymentMethod', id: string, createdAt: any, updatedAt: any, name: string, code: string, description: string, enabled: boolean, checker?: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } | null, handler: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } } };

export type UpdatePaymentMethodMutationVariables = Exact<{
  input: UpdatePaymentMethodInput;
}>;


export type UpdatePaymentMethodMutation = { updatePaymentMethod: { __typename?: 'PaymentMethod', id: string, createdAt: any, updatedAt: any, name: string, code: string, description: string, enabled: boolean, checker?: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } | null, handler: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> } } };

export type DeletePaymentMethodMutationVariables = Exact<{
  id: Scalars['ID'];
  force?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeletePaymentMethodMutation = { deletePaymentMethod: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GlobalSettingsFragment = { __typename?: 'GlobalSettings', id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { __typename?: 'ServerConfig', permissions: Array<{ __typename?: 'PermissionDefinition', name: string, description: string, assignable: boolean }>, orderProcess: Array<{ __typename?: 'OrderProcessState', name: string }> } };

export type GetGlobalSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalSettingsQuery = { globalSettings: { __typename?: 'GlobalSettings', id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { __typename?: 'ServerConfig', permissions: Array<{ __typename?: 'PermissionDefinition', name: string, description: string, assignable: boolean }>, orderProcess: Array<{ __typename?: 'OrderProcessState', name: string }> } } };

export type UpdateGlobalSettingsMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalSettingsMutation = { updateGlobalSettings: { __typename?: 'ChannelDefaultLanguageError', errorCode: ErrorCode, message: string } | { __typename?: 'GlobalSettings', id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { __typename?: 'ServerConfig', permissions: Array<{ __typename?: 'PermissionDefinition', name: string, description: string, assignable: boolean }>, orderProcess: Array<{ __typename?: 'OrderProcessState', name: string }> } } };

type CustomFieldConfig_BooleanCustomFieldConfig_Fragment = { __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_DateTimeCustomFieldConfig_Fragment = { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_FloatCustomFieldConfig_Fragment = { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_IntCustomFieldConfig_Fragment = { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_LocaleStringCustomFieldConfig_Fragment = { __typename?: 'LocaleStringCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_RelationCustomFieldConfig_Fragment = { __typename?: 'RelationCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_StringCustomFieldConfig_Fragment = { __typename?: 'StringCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFieldConfig_TextCustomFieldConfig_Fragment = { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type CustomFieldConfigFragment = CustomFieldConfig_BooleanCustomFieldConfig_Fragment | CustomFieldConfig_DateTimeCustomFieldConfig_Fragment | CustomFieldConfig_FloatCustomFieldConfig_Fragment | CustomFieldConfig_IntCustomFieldConfig_Fragment | CustomFieldConfig_LocaleStringCustomFieldConfig_Fragment | CustomFieldConfig_RelationCustomFieldConfig_Fragment | CustomFieldConfig_StringCustomFieldConfig_Fragment | CustomFieldConfig_TextCustomFieldConfig_Fragment;

export type StringCustomFieldFragment = { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type LocaleStringCustomFieldFragment = { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type TextCustomFieldFragment = { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type BooleanCustomFieldFragment = { __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type IntCustomFieldFragment = { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type FloatCustomFieldFragment = { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type DateTimeCustomFieldFragment = { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type RelationCustomFieldFragment = { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_BooleanCustomFieldConfig_Fragment = { __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_DateTimeCustomFieldConfig_Fragment = { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_FloatCustomFieldConfig_Fragment = { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_IntCustomFieldConfig_Fragment = { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_LocaleStringCustomFieldConfig_Fragment = { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_RelationCustomFieldConfig_Fragment = { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_StringCustomFieldConfig_Fragment = { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

type CustomFields_TextCustomFieldConfig_Fragment = { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null };

export type CustomFieldsFragment = CustomFields_BooleanCustomFieldConfig_Fragment | CustomFields_DateTimeCustomFieldConfig_Fragment | CustomFields_FloatCustomFieldConfig_Fragment | CustomFields_IntCustomFieldConfig_Fragment | CustomFields_LocaleStringCustomFieldConfig_Fragment | CustomFields_RelationCustomFieldConfig_Fragment | CustomFields_StringCustomFieldConfig_Fragment | CustomFields_TextCustomFieldConfig_Fragment;

export type GetServerConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServerConfigQuery = { globalSettings: { __typename?: 'GlobalSettings', id: string, serverConfig: { __typename?: 'ServerConfig', permittedAssetTypes: Array<string>, orderProcess: Array<{ __typename?: 'OrderProcessState', name: string, to: Array<string> }>, permissions: Array<{ __typename?: 'PermissionDefinition', name: string, description: string, assignable: boolean }>, customFieldConfig: { __typename?: 'CustomFields', Address: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Administrator: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Asset: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Channel: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Collection: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Country: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Customer: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, CustomerGroup: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Facet: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, FacetValue: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Fulfillment: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, GlobalSettings: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Order: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, OrderLine: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, PaymentMethod: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Product: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, ProductOption: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, ProductOptionGroup: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, ProductVariant: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Promotion: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, ShippingMethod: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, TaxCategory: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, TaxRate: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, User: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }>, Zone: Array<{ __typename?: 'BooleanCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'DateTimeCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, datetimeMin?: string | null, datetimeMax?: string | null, datetimeStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'FloatCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, floatMin?: number | null, floatMax?: number | null, floatStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'IntCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, intMin?: number | null, intMax?: number | null, intStep?: number | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'LocaleStringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'RelationCustomFieldConfig', entity: string, scalarFields: Array<string>, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'StringCustomFieldConfig', pattern?: string | null, name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, options?: Array<{ __typename?: 'StringFieldOption', value: string, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null } | { __typename?: 'TextCustomFieldConfig', name: string, type: string, list: boolean, readonly?: boolean | null, nullable?: boolean | null, ui?: any | null, description?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null, label?: Array<{ __typename?: 'LocalizedString', languageCode: LanguageCode, value: string }> | null }> } } } };

export type JobInfoFragment = { __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number };

export type GetJobInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetJobInfoQuery = { job?: { __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number } | null };

export type GetAllJobsQueryVariables = Exact<{
  options?: InputMaybe<JobListOptions>;
}>;


export type GetAllJobsQuery = { jobs: { __typename?: 'JobList', totalItems: number, items: Array<{ __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number }> } };

export type GetJobsByIdQueryVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetJobsByIdQuery = { jobsById: Array<{ __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number }> };

export type GetJobQueueListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobQueueListQuery = { jobQueues: Array<{ __typename?: 'JobQueue', name: string, running: boolean }> };

export type CancelJobMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CancelJobMutation = { cancelJob: { __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number } };

export type ReindexMutationVariables = Exact<{ [key: string]: never; }>;


export type ReindexMutation = { reindex: { __typename?: 'Job', id: string, createdAt: any, startedAt?: any | null, settledAt?: any | null, queueName: string, state: JobState, isSettled: boolean, progress: number, duration: number, data?: any | null, result?: any | null, error?: any | null, retries: number, attempts: number } };

export type GetPendingSearchIndexUpdatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingSearchIndexUpdatesQuery = { pendingSearchIndexUpdates: number };

export type RunPendingSearchIndexUpdatesMutationVariables = Exact<{ [key: string]: never; }>;


export type RunPendingSearchIndexUpdatesMutation = { runPendingSearchIndexUpdates: { __typename?: 'Success', success: boolean } };

export type ConfigurableOperationFragment = { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> };

export type ConfigurableOperationDefFragment = { __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> };

type ErrorResult_AlreadyRefundedError_Fragment = { __typename?: 'AlreadyRefundedError', errorCode: ErrorCode, message: string };

type ErrorResult_CancelActiveOrderError_Fragment = { __typename?: 'CancelActiveOrderError', errorCode: ErrorCode, message: string };

type ErrorResult_ChannelDefaultLanguageError_Fragment = { __typename?: 'ChannelDefaultLanguageError', errorCode: ErrorCode, message: string };

type ErrorResult_CreateFulfillmentError_Fragment = { __typename?: 'CreateFulfillmentError', errorCode: ErrorCode, message: string };

type ErrorResult_EmailAddressConflictError_Fragment = { __typename?: 'EmailAddressConflictError', errorCode: ErrorCode, message: string };

type ErrorResult_EmptyOrderLineSelectionError_Fragment = { __typename?: 'EmptyOrderLineSelectionError', errorCode: ErrorCode, message: string };

type ErrorResult_FulfillmentStateTransitionError_Fragment = { __typename?: 'FulfillmentStateTransitionError', errorCode: ErrorCode, message: string };

type ErrorResult_InsufficientStockError_Fragment = { __typename?: 'InsufficientStockError', errorCode: ErrorCode, message: string };

type ErrorResult_InsufficientStockOnHandError_Fragment = { __typename?: 'InsufficientStockOnHandError', errorCode: ErrorCode, message: string };

type ErrorResult_InvalidCredentialsError_Fragment = { __typename?: 'InvalidCredentialsError', errorCode: ErrorCode, message: string };

type ErrorResult_InvalidFulfillmentHandlerError_Fragment = { __typename?: 'InvalidFulfillmentHandlerError', errorCode: ErrorCode, message: string };

type ErrorResult_ItemsAlreadyFulfilledError_Fragment = { __typename?: 'ItemsAlreadyFulfilledError', errorCode: ErrorCode, message: string };

type ErrorResult_LanguageNotAvailableError_Fragment = { __typename?: 'LanguageNotAvailableError', errorCode: ErrorCode, message: string };

type ErrorResult_ManualPaymentStateError_Fragment = { __typename?: 'ManualPaymentStateError', errorCode: ErrorCode, message: string };

type ErrorResult_MimeTypeError_Fragment = { __typename?: 'MimeTypeError', errorCode: ErrorCode, message: string };

type ErrorResult_MissingConditionsError_Fragment = { __typename?: 'MissingConditionsError', errorCode: ErrorCode, message: string };

type ErrorResult_MultipleOrderError_Fragment = { __typename?: 'MultipleOrderError', errorCode: ErrorCode, message: string };

type ErrorResult_NativeAuthStrategyError_Fragment = { __typename?: 'NativeAuthStrategyError', errorCode: ErrorCode, message: string };

type ErrorResult_NegativeQuantityError_Fragment = { __typename?: 'NegativeQuantityError', errorCode: ErrorCode, message: string };

type ErrorResult_NoChangesSpecifiedError_Fragment = { __typename?: 'NoChangesSpecifiedError', errorCode: ErrorCode, message: string };

type ErrorResult_NothingToRefundError_Fragment = { __typename?: 'NothingToRefundError', errorCode: ErrorCode, message: string };

type ErrorResult_OrderLimitError_Fragment = { __typename?: 'OrderLimitError', errorCode: ErrorCode, message: string };

type ErrorResult_OrderModificationStateError_Fragment = { __typename?: 'OrderModificationStateError', errorCode: ErrorCode, message: string };

type ErrorResult_OrderStateTransitionError_Fragment = { __typename?: 'OrderStateTransitionError', errorCode: ErrorCode, message: string };

type ErrorResult_PaymentMethodMissingError_Fragment = { __typename?: 'PaymentMethodMissingError', errorCode: ErrorCode, message: string };

type ErrorResult_PaymentOrderMismatchError_Fragment = { __typename?: 'PaymentOrderMismatchError', errorCode: ErrorCode, message: string };

type ErrorResult_PaymentStateTransitionError_Fragment = { __typename?: 'PaymentStateTransitionError', errorCode: ErrorCode, message: string };

type ErrorResult_ProductOptionInUseError_Fragment = { __typename?: 'ProductOptionInUseError', errorCode: ErrorCode, message: string };

type ErrorResult_QuantityTooGreatError_Fragment = { __typename?: 'QuantityTooGreatError', errorCode: ErrorCode, message: string };

type ErrorResult_RefundOrderStateError_Fragment = { __typename?: 'RefundOrderStateError', errorCode: ErrorCode, message: string };

type ErrorResult_RefundPaymentIdMissingError_Fragment = { __typename?: 'RefundPaymentIdMissingError', errorCode: ErrorCode, message: string };

type ErrorResult_RefundStateTransitionError_Fragment = { __typename?: 'RefundStateTransitionError', errorCode: ErrorCode, message: string };

type ErrorResult_SettlePaymentError_Fragment = { __typename?: 'SettlePaymentError', errorCode: ErrorCode, message: string };

export type ErrorResultFragment = ErrorResult_AlreadyRefundedError_Fragment | ErrorResult_CancelActiveOrderError_Fragment | ErrorResult_ChannelDefaultLanguageError_Fragment | ErrorResult_CreateFulfillmentError_Fragment | ErrorResult_EmailAddressConflictError_Fragment | ErrorResult_EmptyOrderLineSelectionError_Fragment | ErrorResult_FulfillmentStateTransitionError_Fragment | ErrorResult_InsufficientStockError_Fragment | ErrorResult_InsufficientStockOnHandError_Fragment | ErrorResult_InvalidCredentialsError_Fragment | ErrorResult_InvalidFulfillmentHandlerError_Fragment | ErrorResult_ItemsAlreadyFulfilledError_Fragment | ErrorResult_LanguageNotAvailableError_Fragment | ErrorResult_ManualPaymentStateError_Fragment | ErrorResult_MimeTypeError_Fragment | ErrorResult_MissingConditionsError_Fragment | ErrorResult_MultipleOrderError_Fragment | ErrorResult_NativeAuthStrategyError_Fragment | ErrorResult_NegativeQuantityError_Fragment | ErrorResult_NoChangesSpecifiedError_Fragment | ErrorResult_NothingToRefundError_Fragment | ErrorResult_OrderLimitError_Fragment | ErrorResult_OrderModificationStateError_Fragment | ErrorResult_OrderStateTransitionError_Fragment | ErrorResult_PaymentMethodMissingError_Fragment | ErrorResult_PaymentOrderMismatchError_Fragment | ErrorResult_PaymentStateTransitionError_Fragment | ErrorResult_ProductOptionInUseError_Fragment | ErrorResult_QuantityTooGreatError_Fragment | ErrorResult_RefundOrderStateError_Fragment | ErrorResult_RefundPaymentIdMissingError_Fragment | ErrorResult_RefundStateTransitionError_Fragment | ErrorResult_SettlePaymentError_Fragment;

export type ShippingMethodFragment = { __typename?: 'ShippingMethod', id: string, createdAt: any, updatedAt: any, code: string, name: string, description: string, fulfillmentHandlerCode: string, checker: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, calculator: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, translations: Array<{ __typename?: 'ShippingMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }> };

export type GetShippingMethodListQueryVariables = Exact<{
  options?: InputMaybe<ShippingMethodListOptions>;
}>;


export type GetShippingMethodListQuery = { shippingMethods: { __typename?: 'ShippingMethodList', totalItems: number, items: Array<{ __typename?: 'ShippingMethod', id: string, createdAt: any, updatedAt: any, code: string, name: string, description: string, fulfillmentHandlerCode: string, checker: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, calculator: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, translations: Array<{ __typename?: 'ShippingMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }> }> } };

export type GetShippingMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetShippingMethodQuery = { shippingMethod?: { __typename?: 'ShippingMethod', id: string, createdAt: any, updatedAt: any, code: string, name: string, description: string, fulfillmentHandlerCode: string, checker: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, calculator: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, translations: Array<{ __typename?: 'ShippingMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type GetShippingMethodOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodOperationsQuery = { shippingEligibilityCheckers: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }>, shippingCalculators: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }>, fulfillmentHandlers: Array<{ __typename?: 'ConfigurableOperationDefinition', code: string, description: string, args: Array<{ __typename?: 'ConfigArgDefinition', name: string, type: string, required: boolean, defaultValue?: any | null, list: boolean, ui?: any | null, label?: string | null }> }> };

export type CreateShippingMethodMutationVariables = Exact<{
  input: CreateShippingMethodInput;
}>;


export type CreateShippingMethodMutation = { createShippingMethod: { __typename?: 'ShippingMethod', id: string, createdAt: any, updatedAt: any, code: string, name: string, description: string, fulfillmentHandlerCode: string, checker: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, calculator: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, translations: Array<{ __typename?: 'ShippingMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }> } };

export type UpdateShippingMethodMutationVariables = Exact<{
  input: UpdateShippingMethodInput;
}>;


export type UpdateShippingMethodMutation = { updateShippingMethod: { __typename?: 'ShippingMethod', id: string, createdAt: any, updatedAt: any, code: string, name: string, description: string, fulfillmentHandlerCode: string, checker: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, calculator: { __typename?: 'ConfigurableOperation', code: string, args: Array<{ __typename?: 'ConfigArg', name: string, value: string }> }, translations: Array<{ __typename?: 'ShippingMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }> } };

export type DeleteShippingMethodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteShippingMethodMutation = { deleteShippingMethod: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type TestShippingMethodQueryVariables = Exact<{
  input: TestShippingMethodInput;
}>;


export type TestShippingMethodQuery = { testShippingMethod: { __typename?: 'TestShippingMethodResult', eligible: boolean, quote?: { __typename?: 'TestShippingMethodQuote', price: number, priceWithTax: number, metadata?: any | null } | null } };

export type TestEligibleShippingMethodsQueryVariables = Exact<{
  input: TestEligibleShippingMethodsInput;
}>;


export type TestEligibleShippingMethodsQuery = { testEligibleShippingMethods: Array<{ __typename?: 'ShippingMethodQuote', id: string, name: string, code: string, description: string, price: number, priceWithTax: number, metadata?: any | null }> };
