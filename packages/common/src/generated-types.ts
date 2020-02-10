// tslint:disable
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
 */
  DateTime: any,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};

export type AddNoteToOrderInput = {
  id: Scalars['ID'],
  note: Scalars['String'],
  isPublic: Scalars['Boolean'],
};

export type Address = Node & {
  __typename?: 'Address',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1: Scalars['String'],
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  country: Country,
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Adjustment = {
  __typename?: 'Adjustment',
  adjustmentSource: Scalars['String'],
  type: AdjustmentType,
  description: Scalars['String'],
  amount: Scalars['Int'],
};

export enum AdjustmentType {
  TAX = 'TAX',
  PROMOTION = 'PROMOTION',
  SHIPPING = 'SHIPPING',
  REFUND = 'REFUND',
  TAX_REFUND = 'TAX_REFUND',
  PROMOTION_REFUND = 'PROMOTION_REFUND',
  SHIPPING_REFUND = 'SHIPPING_REFUND'
}

export type Administrator = Node & {
  __typename?: 'Administrator',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  emailAddress: Scalars['String'],
  user: User,
};

export type AdministratorFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  firstName?: Maybe<StringOperators>,
  lastName?: Maybe<StringOperators>,
  emailAddress?: Maybe<StringOperators>,
};

export type AdministratorList = PaginatedList & {
  __typename?: 'AdministratorList',
  items: Array<Administrator>,
  totalItems: Scalars['Int'],
};

export type AdministratorListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<AdministratorSortParameter>,
  filter?: Maybe<AdministratorFilterParameter>,
};

export type AdministratorSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  firstName?: Maybe<SortOrder>,
  lastName?: Maybe<SortOrder>,
  emailAddress?: Maybe<SortOrder>,
};

export type Asset = Node & {
  __typename?: 'Asset',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  type: AssetType,
  fileSize: Scalars['Int'],
  mimeType: Scalars['String'],
  width: Scalars['Int'],
  height: Scalars['Int'],
  source: Scalars['String'],
  preview: Scalars['String'],
  focalPoint?: Maybe<Coordinate>,
};

export type AssetFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  type?: Maybe<StringOperators>,
  fileSize?: Maybe<NumberOperators>,
  mimeType?: Maybe<StringOperators>,
  width?: Maybe<NumberOperators>,
  height?: Maybe<NumberOperators>,
  source?: Maybe<StringOperators>,
  preview?: Maybe<StringOperators>,
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList',
  items: Array<Asset>,
  totalItems: Scalars['Int'],
};

export type AssetListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<AssetSortParameter>,
  filter?: Maybe<AssetFilterParameter>,
};

export type AssetSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  fileSize?: Maybe<SortOrder>,
  mimeType?: Maybe<SortOrder>,
  width?: Maybe<SortOrder>,
  height?: Maybe<SortOrder>,
  source?: Maybe<SortOrder>,
  preview?: Maybe<SortOrder>,
};

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  BINARY = 'BINARY'
}

export type AssignProductsToChannelInput = {
  productIds: Array<Scalars['ID']>,
  channelId: Scalars['ID'],
  priceFactor?: Maybe<Scalars['Float']>,
};

export type BooleanCustomFieldConfig = CustomField & {
  __typename?: 'BooleanCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
};

export type BooleanOperators = {
  eq?: Maybe<Scalars['Boolean']>,
};

export type Cancellation = Node & StockMovement & {
  __typename?: 'Cancellation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderLine: OrderLine,
};

export type CancelOrderInput = {
  /** The id of the order to be cancelled */
  orderId: Scalars['ID'],
  /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
  lines?: Maybe<Array<OrderLineInput>>,
  reason?: Maybe<Scalars['String']>,
};

export type Channel = Node & {
  __typename?: 'Channel',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  token: Scalars['String'],
  defaultTaxZone?: Maybe<Zone>,
  defaultShippingZone?: Maybe<Zone>,
  defaultLanguageCode: LanguageCode,
  currencyCode: CurrencyCode,
  pricesIncludeTax: Scalars['Boolean'],
};

export type Collection = Node & {
  __typename?: 'Collection',
  isPrivate: Scalars['Boolean'],
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode?: Maybe<LanguageCode>,
  name: Scalars['String'],
  breadcrumbs: Array<CollectionBreadcrumb>,
  position: Scalars['Int'],
  description: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  parent?: Maybe<Collection>,
  children?: Maybe<Array<Collection>>,
  filters: Array<ConfigurableOperation>,
  translations: Array<CollectionTranslation>,
  productVariants: ProductVariantList,
  customFields?: Maybe<Scalars['JSON']>,
};


export type CollectionProductVariantsArgs = {
  options?: Maybe<ProductVariantListOptions>
};

export type CollectionBreadcrumb = {
  __typename?: 'CollectionBreadcrumb',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CollectionFilterParameter = {
  isPrivate?: Maybe<BooleanOperators>,
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  position?: Maybe<NumberOperators>,
  description?: Maybe<StringOperators>,
};

export type CollectionList = PaginatedList & {
  __typename?: 'CollectionList',
  items: Array<Collection>,
  totalItems: Scalars['Int'],
};

export type CollectionListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CollectionSortParameter>,
  filter?: Maybe<CollectionFilterParameter>,
};

export type CollectionSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  position?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type CollectionTranslation = {
  __typename?: 'CollectionTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  description: Scalars['String'],
};

export type CollectionTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ConfigArg = {
  __typename?: 'ConfigArg',
  name: Scalars['String'],
  type: Scalars['String'],
  value: Scalars['String'],
};

export type ConfigArgDefinition = {
  __typename?: 'ConfigArgDefinition',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  config?: Maybe<Scalars['JSON']>,
};

export type ConfigArgInput = {
  name: Scalars['String'],
  type: Scalars['String'],
  value: Scalars['String'],
};

export type ConfigurableOperation = {
  __typename?: 'ConfigurableOperation',
  code: Scalars['String'],
  args: Array<ConfigArg>,
};

export type ConfigurableOperationDefinition = {
  __typename?: 'ConfigurableOperationDefinition',
  code: Scalars['String'],
  args: Array<ConfigArgDefinition>,
  description: Scalars['String'],
};

export type ConfigurableOperationInput = {
  code: Scalars['String'],
  arguments: Array<ConfigArgInput>,
};

export type Coordinate = {
  __typename?: 'Coordinate',
  x: Scalars['Float'],
  y: Scalars['Float'],
};

export type CoordinateInput = {
  x: Scalars['Float'],
  y: Scalars['Float'],
};

export type Country = Node & {
  __typename?: 'Country',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  code: Scalars['String'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  translations: Array<CountryTranslation>,
};

export type CountryFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  code?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type CountryList = PaginatedList & {
  __typename?: 'CountryList',
  items: Array<Country>,
  totalItems: Scalars['Int'],
};

export type CountryListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CountrySortParameter>,
  filter?: Maybe<CountryFilterParameter>,
};

export type CountrySortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
};

export type CountryTranslation = {
  __typename?: 'CountryTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type CountryTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
};

export type CreateAddressInput = {
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1: Scalars['String'],
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  countryCode: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateAdministratorInput = {
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  emailAddress: Scalars['String'],
  password: Scalars['String'],
  roleIds: Array<Scalars['ID']>,
};

export type CreateAssetInput = {
  file: Scalars['Upload'],
};

export type CreateChannelInput = {
  code: Scalars['String'],
  token: Scalars['String'],
  defaultLanguageCode: LanguageCode,
  pricesIncludeTax: Scalars['Boolean'],
  currencyCode: CurrencyCode,
  defaultTaxZoneId: Scalars['ID'],
  defaultShippingZoneId: Scalars['ID'],
};

export type CreateCollectionInput = {
  isPrivate?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  parentId?: Maybe<Scalars['ID']>,
  filters: Array<ConfigurableOperationInput>,
  translations: Array<CollectionTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateCountryInput = {
  code: Scalars['String'],
  translations: Array<CountryTranslationInput>,
  enabled: Scalars['Boolean'],
};

export type CreateCustomerGroupInput = {
  name: Scalars['String'],
  customerIds?: Maybe<Array<Scalars['ID']>>,
};

export type CreateCustomerInput = {
  title?: Maybe<Scalars['String']>,
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress: Scalars['String'],
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetInput = {
  code: Scalars['String'],
  isPrivate: Scalars['Boolean'],
  translations: Array<FacetTranslationInput>,
  values?: Maybe<Array<CreateFacetValueWithFacetInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetValueInput = {
  facetId: Scalars['ID'],
  code: Scalars['String'],
  translations: Array<FacetValueTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateFacetValueWithFacetInput = {
  code: Scalars['String'],
  translations: Array<FacetValueTranslationInput>,
};

export type CreateGroupOptionInput = {
  code: Scalars['String'],
  translations: Array<ProductOptionGroupTranslationInput>,
};

export type CreateProductInput = {
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  translations: Array<ProductTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductOptionGroupInput = {
  code: Scalars['String'],
  translations: Array<ProductOptionGroupTranslationInput>,
  options: Array<CreateGroupOptionInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductOptionInput = {
  productOptionGroupId: Scalars['ID'],
  code: Scalars['String'],
  translations: Array<ProductOptionGroupTranslationInput>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductVariantInput = {
  productId: Scalars['ID'],
  translations: Array<ProductVariantTranslationInput>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  sku: Scalars['String'],
  price?: Maybe<Scalars['Int']>,
  taxCategoryId?: Maybe<Scalars['ID']>,
  optionIds?: Maybe<Array<Scalars['ID']>>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  stockOnHand?: Maybe<Scalars['Int']>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type CreateProductVariantOptionInput = {
  optionGroupId: Scalars['ID'],
  code: Scalars['String'],
  translations: Array<ProductOptionTranslationInput>,
};

export type CreatePromotionInput = {
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  startsAt?: Maybe<Scalars['DateTime']>,
  endsAt?: Maybe<Scalars['DateTime']>,
  couponCode?: Maybe<Scalars['String']>,
  perCustomerUsageLimit?: Maybe<Scalars['Int']>,
  conditions: Array<ConfigurableOperationInput>,
  actions: Array<ConfigurableOperationInput>,
};

export type CreateRoleInput = {
  code: Scalars['String'],
  description: Scalars['String'],
  permissions: Array<Permission>,
  channelIds?: Maybe<Array<Scalars['ID']>>,
};

export type CreateShippingMethodInput = {
  code: Scalars['String'],
  description: Scalars['String'],
  checker: ConfigurableOperationInput,
  calculator: ConfigurableOperationInput,
};

export type CreateTaxCategoryInput = {
  name: Scalars['String'],
};

export type CreateTaxRateInput = {
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  value: Scalars['Float'],
  categoryId: Scalars['ID'],
  zoneId: Scalars['ID'],
  customerGroupId?: Maybe<Scalars['ID']>,
};

export type CreateZoneInput = {
  name: Scalars['String'],
  memberIds?: Maybe<Array<Scalars['ID']>>,
};

/** @description
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
  CHE = 'CHE',
  /** Swiss franc */
  CHW = 'CHW',
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
  __typename?: 'CurrentUser',
  id: Scalars['ID'],
  identifier: Scalars['String'],
  channels: Array<CurrentUserChannel>,
};

export type CurrentUserChannel = {
  __typename?: 'CurrentUserChannel',
  id: Scalars['ID'],
  token: Scalars['String'],
  code: Scalars['String'],
  permissions: Array<Permission>,
};

export type Customer = Node & {
  __typename?: 'Customer',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  title?: Maybe<Scalars['String']>,
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress: Scalars['String'],
  addresses?: Maybe<Array<Address>>,
  orders: OrderList,
  user?: Maybe<User>,
  customFields?: Maybe<Scalars['JSON']>,
};


export type CustomerOrdersArgs = {
  options?: Maybe<OrderListOptions>
};

export type CustomerFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  title?: Maybe<StringOperators>,
  firstName?: Maybe<StringOperators>,
  lastName?: Maybe<StringOperators>,
  phoneNumber?: Maybe<StringOperators>,
  emailAddress?: Maybe<StringOperators>,
};

export type CustomerGroup = Node & {
  __typename?: 'CustomerGroup',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
};

export type CustomerList = PaginatedList & {
  __typename?: 'CustomerList',
  items: Array<Customer>,
  totalItems: Scalars['Int'],
};

export type CustomerListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<CustomerSortParameter>,
  filter?: Maybe<CustomerFilterParameter>,
};

export type CustomerSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  title?: Maybe<SortOrder>,
  firstName?: Maybe<SortOrder>,
  lastName?: Maybe<SortOrder>,
  phoneNumber?: Maybe<SortOrder>,
  emailAddress?: Maybe<SortOrder>,
};

export type CustomField = {
  __typename?: 'CustomField',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
};

export type CustomFieldConfig = StringCustomFieldConfig | LocaleStringCustomFieldConfig | IntCustomFieldConfig | FloatCustomFieldConfig | BooleanCustomFieldConfig | DateTimeCustomFieldConfig;

export type CustomFields = {
  __typename?: 'CustomFields',
  Address: Array<CustomFieldConfig>,
  Collection: Array<CustomFieldConfig>,
  Customer: Array<CustomFieldConfig>,
  Facet: Array<CustomFieldConfig>,
  FacetValue: Array<CustomFieldConfig>,
  GlobalSettings: Array<CustomFieldConfig>,
  Order: Array<CustomFieldConfig>,
  OrderLine: Array<CustomFieldConfig>,
  Product: Array<CustomFieldConfig>,
  ProductOption: Array<CustomFieldConfig>,
  ProductOptionGroup: Array<CustomFieldConfig>,
  ProductVariant: Array<CustomFieldConfig>,
  User: Array<CustomFieldConfig>,
};

export type DateOperators = {
  eq?: Maybe<Scalars['DateTime']>,
  before?: Maybe<Scalars['DateTime']>,
  after?: Maybe<Scalars['DateTime']>,
  between?: Maybe<DateRange>,
};

export type DateRange = {
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
};


/** Expects the same validation formats as the <input type="datetime-local"> HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
  __typename?: 'DateTimeCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
  min?: Maybe<Scalars['String']>,
  max?: Maybe<Scalars['String']>,
  step?: Maybe<Scalars['Int']>,
};

export type DeletionResponse = {
  __typename?: 'DeletionResponse',
  result: DeletionResult,
  message?: Maybe<Scalars['String']>,
};

export enum DeletionResult {
  /** The entity was successfully deleted */
  DELETED = 'DELETED',
  /** Deletion did not take place, reason given in message */
  NOT_DELETED = 'NOT_DELETED'
}

export type Facet = Node & {
  __typename?: 'Facet',
  isPrivate: Scalars['Boolean'],
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  code: Scalars['String'],
  values: Array<FacetValue>,
  translations: Array<FacetTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type FacetFilterParameter = {
  isPrivate?: Maybe<BooleanOperators>,
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  code?: Maybe<StringOperators>,
};

export type FacetList = PaginatedList & {
  __typename?: 'FacetList',
  items: Array<Facet>,
  totalItems: Scalars['Int'],
};

export type FacetListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<FacetSortParameter>,
  filter?: Maybe<FacetFilterParameter>,
};

export type FacetSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
};

export type FacetTranslation = {
  __typename?: 'FacetTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type FacetTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type FacetValue = Node & {
  __typename?: 'FacetValue',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  facet: Facet,
  name: Scalars['String'],
  code: Scalars['String'],
  translations: Array<FacetValueTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

/** Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
  __typename?: 'FacetValueResult',
  facetValue: FacetValue,
  count: Scalars['Int'],
};

export type FacetValueTranslation = {
  __typename?: 'FacetValueTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type FacetValueTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type FloatCustomFieldConfig = CustomField & {
  __typename?: 'FloatCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
  min?: Maybe<Scalars['Float']>,
  max?: Maybe<Scalars['Float']>,
  step?: Maybe<Scalars['Float']>,
};

export type Fulfillment = Node & {
  __typename?: 'Fulfillment',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  orderItems: Array<OrderItem>,
  method: Scalars['String'],
  trackingCode?: Maybe<Scalars['String']>,
};

export type FulfillOrderInput = {
  lines: Array<OrderLineInput>,
  method: Scalars['String'],
  trackingCode?: Maybe<Scalars['String']>,
};

export type GlobalSettings = {
  __typename?: 'GlobalSettings',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  availableLanguages: Array<LanguageCode>,
  trackInventory: Scalars['Boolean'],
  serverConfig: ServerConfig,
  customFields?: Maybe<Scalars['JSON']>,
};

export type HistoryEntry = Node & {
  __typename?: 'HistoryEntry',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  isPublic: Scalars['Boolean'],
  type: HistoryEntryType,
  administrator?: Maybe<Administrator>,
  data: Scalars['JSON'],
};

export type HistoryEntryFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  isPublic?: Maybe<BooleanOperators>,
  type?: Maybe<StringOperators>,
};

export type HistoryEntryList = PaginatedList & {
  __typename?: 'HistoryEntryList',
  items: Array<HistoryEntry>,
  totalItems: Scalars['Int'],
};

export type HistoryEntryListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<HistoryEntrySortParameter>,
  filter?: Maybe<HistoryEntryFilterParameter>,
};

export type HistoryEntrySortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
};

export enum HistoryEntryType {
  ORDER_STATE_TRANSITION = 'ORDER_STATE_TRANSITION',
  ORDER_PAYMENT_TRANSITION = 'ORDER_PAYMENT_TRANSITION',
  ORDER_FULLFILLMENT = 'ORDER_FULLFILLMENT',
  ORDER_CANCELLATION = 'ORDER_CANCELLATION',
  ORDER_REFUND_TRANSITION = 'ORDER_REFUND_TRANSITION',
  ORDER_NOTE = 'ORDER_NOTE',
  ORDER_COUPON_APPLIED = 'ORDER_COUPON_APPLIED',
  ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED'
}

export type ImportInfo = {
  __typename?: 'ImportInfo',
  errors?: Maybe<Array<Scalars['String']>>,
  processed: Scalars['Int'],
  imported: Scalars['Int'],
};

export type IntCustomFieldConfig = CustomField & {
  __typename?: 'IntCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
  min?: Maybe<Scalars['Int']>,
  max?: Maybe<Scalars['Int']>,
  step?: Maybe<Scalars['Int']>,
};

export type JobInfo = {
  __typename?: 'JobInfo',
  id: Scalars['String'],
  name: Scalars['String'],
  state: JobState,
  progress: Scalars['Float'],
  metadata?: Maybe<Scalars['JSON']>,
  result?: Maybe<Scalars['JSON']>,
  started?: Maybe<Scalars['DateTime']>,
  ended?: Maybe<Scalars['DateTime']>,
  duration?: Maybe<Scalars['Int']>,
};

export type JobListInput = {
  state?: Maybe<JobState>,
  ids?: Maybe<Array<Scalars['String']>>,
};

export enum JobState {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}


/** @description
 * ISO 639-1 language code
 * 
 * @docsCategory common
 */
export enum LanguageCode {
  /** Afar */
  aa = 'aa',
  /** Abkhazian */
  ab = 'ab',
  /** Afrikaans */
  af = 'af',
  /** Akan */
  ak = 'ak',
  /** Albanian */
  sq = 'sq',
  /** Amharic */
  am = 'am',
  /** Arabic */
  ar = 'ar',
  /** Aragonese */
  an = 'an',
  /** Armenian */
  hy = 'hy',
  /** Assamese */
  as = 'as',
  /** Avaric */
  av = 'av',
  /** Avestan */
  ae = 'ae',
  /** Aymara */
  ay = 'ay',
  /** Azerbaijani */
  az = 'az',
  /** Bashkir */
  ba = 'ba',
  /** Bambara */
  bm = 'bm',
  /** Basque */
  eu = 'eu',
  /** Belarusian */
  be = 'be',
  /** Bengali */
  bn = 'bn',
  /** Bihari languages */
  bh = 'bh',
  /** Bislama */
  bi = 'bi',
  /** Bosnian */
  bs = 'bs',
  /** Breton */
  br = 'br',
  /** Bulgarian */
  bg = 'bg',
  /** Burmese */
  my = 'my',
  /** Catalan; Valencian */
  ca = 'ca',
  /** Chamorro */
  ch = 'ch',
  /** Chechen */
  ce = 'ce',
  /** Chinese */
  zh = 'zh',
  /** Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic */
  cu = 'cu',
  /** Chuvash */
  cv = 'cv',
  /** Cornish */
  kw = 'kw',
  /** Corsican */
  co = 'co',
  /** Cree */
  cr = 'cr',
  /** Czech */
  cs = 'cs',
  /** Danish */
  da = 'da',
  /** Divehi; Dhivehi; Maldivian */
  dv = 'dv',
  /** Dutch; Flemish */
  nl = 'nl',
  /** Dzongkha */
  dz = 'dz',
  /** English */
  en = 'en',
  /** Esperanto */
  eo = 'eo',
  /** Estonian */
  et = 'et',
  /** Ewe */
  ee = 'ee',
  /** Faroese */
  fo = 'fo',
  /** Fijian */
  fj = 'fj',
  /** Finnish */
  fi = 'fi',
  /** French */
  fr = 'fr',
  /** Western Frisian */
  fy = 'fy',
  /** Fulah */
  ff = 'ff',
  /** Georgian */
  ka = 'ka',
  /** German */
  de = 'de',
  /** Gaelic; Scottish Gaelic */
  gd = 'gd',
  /** Irish */
  ga = 'ga',
  /** Galician */
  gl = 'gl',
  /** Manx */
  gv = 'gv',
  /** Greek, Modern (1453-) */
  el = 'el',
  /** Guarani */
  gn = 'gn',
  /** Gujarati */
  gu = 'gu',
  /** Haitian; Haitian Creole */
  ht = 'ht',
  /** Hausa */
  ha = 'ha',
  /** Hebrew */
  he = 'he',
  /** Herero */
  hz = 'hz',
  /** Hindi */
  hi = 'hi',
  /** Hiri Motu */
  ho = 'ho',
  /** Croatian */
  hr = 'hr',
  /** Hungarian */
  hu = 'hu',
  /** Igbo */
  ig = 'ig',
  /** Icelandic */
  is = 'is',
  /** Ido */
  io = 'io',
  /** Sichuan Yi; Nuosu */
  ii = 'ii',
  /** Inuktitut */
  iu = 'iu',
  /** Interlingue; Occidental */
  ie = 'ie',
  /** Interlingua (International Auxiliary Language Association) */
  ia = 'ia',
  /** Indonesian */
  id = 'id',
  /** Inupiaq */
  ik = 'ik',
  /** Italian */
  it = 'it',
  /** Javanese */
  jv = 'jv',
  /** Japanese */
  ja = 'ja',
  /** Kalaallisut; Greenlandic */
  kl = 'kl',
  /** Kannada */
  kn = 'kn',
  /** Kashmiri */
  ks = 'ks',
  /** Kanuri */
  kr = 'kr',
  /** Kazakh */
  kk = 'kk',
  /** Central Khmer */
  km = 'km',
  /** Kikuyu; Gikuyu */
  ki = 'ki',
  /** Kinyarwanda */
  rw = 'rw',
  /** Kirghiz; Kyrgyz */
  ky = 'ky',
  /** Komi */
  kv = 'kv',
  /** Kongo */
  kg = 'kg',
  /** Korean */
  ko = 'ko',
  /** Kuanyama; Kwanyama */
  kj = 'kj',
  /** Kurdish */
  ku = 'ku',
  /** Lao */
  lo = 'lo',
  /** Latin */
  la = 'la',
  /** Latvian */
  lv = 'lv',
  /** Limburgan; Limburger; Limburgish */
  li = 'li',
  /** Lingala */
  ln = 'ln',
  /** Lithuanian */
  lt = 'lt',
  /** Luxembourgish; Letzeburgesch */
  lb = 'lb',
  /** Luba-Katanga */
  lu = 'lu',
  /** Ganda */
  lg = 'lg',
  /** Macedonian */
  mk = 'mk',
  /** Marshallese */
  mh = 'mh',
  /** Malayalam */
  ml = 'ml',
  /** Maori */
  mi = 'mi',
  /** Marathi */
  mr = 'mr',
  /** Malay */
  ms = 'ms',
  /** Malagasy */
  mg = 'mg',
  /** Maltese */
  mt = 'mt',
  /** Mongolian */
  mn = 'mn',
  /** Nauru */
  na = 'na',
  /** Navajo; Navaho */
  nv = 'nv',
  /** Ndebele, South; South Ndebele */
  nr = 'nr',
  /** Ndebele, North; North Ndebele */
  nd = 'nd',
  /** Ndonga */
  ng = 'ng',
  /** Nepali */
  ne = 'ne',
  /** Norwegian Nynorsk; Nynorsk, Norwegian */
  nn = 'nn',
  /** Bokmål, Norwegian; Norwegian Bokmål */
  nb = 'nb',
  /** Norwegian */
  no = 'no',
  /** Chichewa; Chewa; Nyanja */
  ny = 'ny',
  /** Occitan (post 1500); Provençal */
  oc = 'oc',
  /** Ojibwa */
  oj = 'oj',
  /** Oriya */
  or = 'or',
  /** Oromo */
  om = 'om',
  /** Ossetian; Ossetic */
  os = 'os',
  /** Panjabi; Punjabi */
  pa = 'pa',
  /** Persian */
  fa = 'fa',
  /** Pali */
  pi = 'pi',
  /** Polish */
  pl = 'pl',
  /** Portuguese */
  pt = 'pt',
  /** Pushto; Pashto */
  ps = 'ps',
  /** Quechua */
  qu = 'qu',
  /** Romansh */
  rm = 'rm',
  /** Romanian; Moldavian; Moldovan */
  ro = 'ro',
  /** Rundi */
  rn = 'rn',
  /** Russian */
  ru = 'ru',
  /** Sango */
  sg = 'sg',
  /** Sanskrit */
  sa = 'sa',
  /** Sinhala; Sinhalese */
  si = 'si',
  /** Slovak */
  sk = 'sk',
  /** Slovenian */
  sl = 'sl',
  /** Northern Sami */
  se = 'se',
  /** Samoan */
  sm = 'sm',
  /** Shona */
  sn = 'sn',
  /** Sindhi */
  sd = 'sd',
  /** Somali */
  so = 'so',
  /** Sotho, Southern */
  st = 'st',
  /** Spanish; Castilian */
  es = 'es',
  /** Sardinian */
  sc = 'sc',
  /** Serbian */
  sr = 'sr',
  /** Swati */
  ss = 'ss',
  /** Sundanese */
  su = 'su',
  /** Swahili */
  sw = 'sw',
  /** Swedish */
  sv = 'sv',
  /** Tahitian */
  ty = 'ty',
  /** Tamil */
  ta = 'ta',
  /** Tatar */
  tt = 'tt',
  /** Telugu */
  te = 'te',
  /** Tajik */
  tg = 'tg',
  /** Tagalog */
  tl = 'tl',
  /** Thai */
  th = 'th',
  /** Tibetan */
  bo = 'bo',
  /** Tigrinya */
  ti = 'ti',
  /** Tonga (Tonga Islands) */
  to = 'to',
  /** Tswana */
  tn = 'tn',
  /** Tsonga */
  ts = 'ts',
  /** Turkmen */
  tk = 'tk',
  /** Turkish */
  tr = 'tr',
  /** Twi */
  tw = 'tw',
  /** Uighur; Uyghur */
  ug = 'ug',
  /** Ukrainian */
  uk = 'uk',
  /** Urdu */
  ur = 'ur',
  /** Uzbek */
  uz = 'uz',
  /** Venda */
  ve = 've',
  /** Vietnamese */
  vi = 'vi',
  /** Volapük */
  vo = 'vo',
  /** Welsh */
  cy = 'cy',
  /** Walloon */
  wa = 'wa',
  /** Wolof */
  wo = 'wo',
  /** Xhosa */
  xh = 'xh',
  /** Yiddish */
  yi = 'yi',
  /** Yoruba */
  yo = 'yo',
  /** Zhuang; Chuang */
  za = 'za',
  /** Zulu */
  zu = 'zu'
}

export type LocaleStringCustomFieldConfig = CustomField & {
  __typename?: 'LocaleStringCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
  pattern?: Maybe<Scalars['String']>,
};

export type LocalizedString = {
  __typename?: 'LocalizedString',
  languageCode: LanguageCode,
  value: Scalars['String'],
};

export type LoginResult = {
  __typename?: 'LoginResult',
  user: CurrentUser,
};

export type MoveCollectionInput = {
  collectionId: Scalars['ID'],
  parentId: Scalars['ID'],
  index: Scalars['Int'],
};

export type Mutation = {
  __typename?: 'Mutation',
  /** Create a new Administrator */
  createAdministrator: Administrator,
  /** Update an existing Administrator */
  updateAdministrator: Administrator,
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator,
  /** Create a new Asset */
  createAssets: Array<Asset>,
  /** Update an existing Asset */
  updateAsset: Asset,
  login: LoginResult,
  logout: Scalars['Boolean'],
  /** Create a new Channel */
  createChannel: Channel,
  /** Update an existing Channel */
  updateChannel: Channel,
  /** Delete a Channel */
  deleteChannel: DeletionResponse,
  /** Create a new Collection */
  createCollection: Collection,
  /** Update an existing Collection */
  updateCollection: Collection,
  /** Delete a Collection and all of its descendants */
  deleteCollection: DeletionResponse,
  /** Move a Collection to a different parent or index */
  moveCollection: Collection,
  /** Create a new Country */
  createCountry: Country,
  /** Update an existing Country */
  updateCountry: Country,
  /** Delete a Country */
  deleteCountry: DeletionResponse,
  /** Create a new CustomerGroup */
  createCustomerGroup: CustomerGroup,
  /** Update an existing CustomerGroup */
  updateCustomerGroup: CustomerGroup,
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup,
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup,
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: Customer,
  /** Update an existing Customer */
  updateCustomer: Customer,
  /** Delete a Customer */
  deleteCustomer: DeletionResponse,
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address,
  /** Update an existing Address */
  updateCustomerAddress: Address,
  /** Update an existing Address */
  deleteCustomerAddress: Scalars['Boolean'],
  /** Create a new Facet */
  createFacet: Facet,
  /** Update an existing Facet */
  updateFacet: Facet,
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse,
  /** Create one or more FacetValues */
  createFacetValues: Array<FacetValue>,
  /** Update one or more FacetValues */
  updateFacetValues: Array<FacetValue>,
  /** Delete one or more FacetValues */
  deleteFacetValues: Array<DeletionResponse>,
  updateGlobalSettings: GlobalSettings,
  importProducts?: Maybe<ImportInfo>,
  settlePayment: Payment,
  fulfillOrder: Fulfillment,
  cancelOrder: Order,
  refundOrder: Refund,
  settleRefund: Refund,
  addNoteToOrder: Order,
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod,
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup,
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup,
  /** Create a new ProductOption within a ProductOptionGroup */
  createProductOption: ProductOption,
  /** Create a new ProductOption within a ProductOptionGroup */
  updateProductOption: ProductOption,
  reindex: JobInfo,
  /** Create a new Product */
  createProduct: Product,
  /** Update an existing Product */
  updateProduct: Product,
  /** Delete a Product */
  deleteProduct: DeletionResponse,
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product,
  /** Remove an OptionGroup from a Product */
  removeOptionGroupFromProduct: Product,
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  createProductVariants: Array<Maybe<ProductVariant>>,
  /** Update existing ProductVariants */
  updateProductVariants: Array<Maybe<ProductVariant>>,
  /** Delete a ProductVariant */
  deleteProductVariant: DeletionResponse,
  /** Assigns Products to the specified Channel */
  assignProductsToChannel: Array<Product>,
  /** Removes Products from the specified Channel */
  removeProductsFromChannel: Array<Product>,
  createPromotion: Promotion,
  updatePromotion: Promotion,
  deletePromotion: DeletionResponse,
  /** Create a new Role */
  createRole: Role,
  /** Update an existing Role */
  updateRole: Role,
  /** Delete an existing Role */
  deleteRole: DeletionResponse,
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod,
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod,
  /** Delete a ShippingMethod */
  deleteShippingMethod: DeletionResponse,
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory,
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory,
  /** Deletes a TaxCategory */
  deleteTaxCategory: DeletionResponse,
  /** Create a new TaxRate */
  createTaxRate: TaxRate,
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate,
  /** Delete a TaxRate */
  deleteTaxRate: DeletionResponse,
  /** Create a new Zone */
  createZone: Zone,
  /** Update an existing Zone */
  updateZone: Zone,
  /** Delete a Zone */
  deleteZone: DeletionResponse,
  /** Add members to a Zone */
  addMembersToZone: Zone,
  /** Remove members from a Zone */
  removeMembersFromZone: Zone,
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput
};


export type MutationAssignRoleToAdministratorArgs = {
  administratorId: Scalars['ID'],
  roleId: Scalars['ID']
};


export type MutationCreateAssetsArgs = {
  input: Array<CreateAssetInput>
};


export type MutationUpdateAssetArgs = {
  input: UpdateAssetInput
};


export type MutationLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String'],
  rememberMe?: Maybe<Scalars['Boolean']>
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput
};


export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID']
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID']
};


export type MutationMoveCollectionArgs = {
  input: MoveCollectionInput
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID']
};


export type MutationCreateCustomerGroupArgs = {
  input: CreateCustomerGroupInput
};


export type MutationUpdateCustomerGroupArgs = {
  input: UpdateCustomerGroupInput
};


export type MutationAddCustomersToGroupArgs = {
  customerGroupId: Scalars['ID'],
  customerIds: Array<Scalars['ID']>
};


export type MutationRemoveCustomersFromGroupArgs = {
  customerGroupId: Scalars['ID'],
  customerIds: Array<Scalars['ID']>
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput,
  password?: Maybe<Scalars['String']>
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']
};


export type MutationCreateCustomerAddressArgs = {
  customerId: Scalars['ID'],
  input: CreateAddressInput
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID']
};


export type MutationCreateFacetArgs = {
  input: CreateFacetInput
};


export type MutationUpdateFacetArgs = {
  input: UpdateFacetInput
};


export type MutationDeleteFacetArgs = {
  id: Scalars['ID'],
  force?: Maybe<Scalars['Boolean']>
};


export type MutationCreateFacetValuesArgs = {
  input: Array<CreateFacetValueInput>
};


export type MutationUpdateFacetValuesArgs = {
  input: Array<UpdateFacetValueInput>
};


export type MutationDeleteFacetValuesArgs = {
  ids: Array<Scalars['ID']>,
  force?: Maybe<Scalars['Boolean']>
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput
};


export type MutationImportProductsArgs = {
  csvFile: Scalars['Upload']
};


export type MutationSettlePaymentArgs = {
  id: Scalars['ID']
};


export type MutationFulfillOrderArgs = {
  input: FulfillOrderInput
};


export type MutationCancelOrderArgs = {
  input: CancelOrderInput
};


export type MutationRefundOrderArgs = {
  input: RefundOrderInput
};


export type MutationSettleRefundArgs = {
  input: SettleRefundInput
};


export type MutationAddNoteToOrderArgs = {
  input: AddNoteToOrderInput
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput
};


export type MutationCreateProductOptionGroupArgs = {
  input: CreateProductOptionGroupInput
};


export type MutationUpdateProductOptionGroupArgs = {
  input: UpdateProductOptionGroupInput
};


export type MutationCreateProductOptionArgs = {
  input: CreateProductOptionInput
};


export type MutationUpdateProductOptionArgs = {
  input: UpdateProductOptionInput
};


export type MutationCreateProductArgs = {
  input: CreateProductInput
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']
};


export type MutationAddOptionGroupToProductArgs = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type MutationRemoveOptionGroupFromProductArgs = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type MutationCreateProductVariantsArgs = {
  input: Array<CreateProductVariantInput>
};


export type MutationUpdateProductVariantsArgs = {
  input: Array<UpdateProductVariantInput>
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID']
};


export type MutationAssignProductsToChannelArgs = {
  input: AssignProductsToChannelInput
};


export type MutationRemoveProductsFromChannelArgs = {
  input: RemoveProductsFromChannelInput
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID']
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']
};


export type MutationCreateShippingMethodArgs = {
  input: CreateShippingMethodInput
};


export type MutationUpdateShippingMethodArgs = {
  input: UpdateShippingMethodInput
};


export type MutationDeleteShippingMethodArgs = {
  id: Scalars['ID']
};


export type MutationCreateTaxCategoryArgs = {
  input: CreateTaxCategoryInput
};


export type MutationUpdateTaxCategoryArgs = {
  input: UpdateTaxCategoryInput
};


export type MutationDeleteTaxCategoryArgs = {
  id: Scalars['ID']
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID']
};


export type MutationCreateZoneArgs = {
  input: CreateZoneInput
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneInput
};


export type MutationDeleteZoneArgs = {
  id: Scalars['ID']
};


export type MutationAddMembersToZoneArgs = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};


export type MutationRemoveMembersFromZoneArgs = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};

export type Node = {
  __typename?: 'Node',
  id: Scalars['ID'],
};

export type NumberOperators = {
  eq?: Maybe<Scalars['Float']>,
  lt?: Maybe<Scalars['Float']>,
  lte?: Maybe<Scalars['Float']>,
  gt?: Maybe<Scalars['Float']>,
  gte?: Maybe<Scalars['Float']>,
  between?: Maybe<NumberRange>,
};

export type NumberRange = {
  start: Scalars['Float'],
  end: Scalars['Float'],
};

export type Order = Node & {
  __typename?: 'Order',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  /** A unique code for the Order */
  code: Scalars['String'],
  state: Scalars['String'],
  /** An order is active as long as the payment process has not been completed */
  active: Scalars['Boolean'],
  customer?: Maybe<Customer>,
  shippingAddress?: Maybe<OrderAddress>,
  billingAddress?: Maybe<OrderAddress>,
  lines: Array<OrderLine>,
  /** Order-level adjustments to the order total, such as discounts from promotions */
  adjustments: Array<Adjustment>,
  couponCodes: Array<Scalars['String']>,
  promotions: Array<Promotion>,
  payments?: Maybe<Array<Payment>>,
  fulfillments?: Maybe<Array<Fulfillment>>,
  subTotalBeforeTax: Scalars['Int'],
  /** The subTotal is the total of the OrderLines, before order-level promotions and shipping has been applied. */
  subTotal: Scalars['Int'],
  currencyCode: CurrencyCode,
  shipping: Scalars['Int'],
  shippingWithTax: Scalars['Int'],
  shippingMethod?: Maybe<ShippingMethod>,
  totalBeforeTax: Scalars['Int'],
  total: Scalars['Int'],
  history: HistoryEntryList,
  customFields?: Maybe<Scalars['JSON']>,
};


export type OrderHistoryArgs = {
  options?: Maybe<HistoryEntryListOptions>
};

export type OrderAddress = {
  __typename?: 'OrderAddress',
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1?: Maybe<Scalars['String']>,
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  country?: Maybe<Scalars['String']>,
  countryCode?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
};

export type OrderFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  state?: Maybe<StringOperators>,
  active?: Maybe<BooleanOperators>,
  subTotalBeforeTax?: Maybe<NumberOperators>,
  subTotal?: Maybe<NumberOperators>,
  currencyCode?: Maybe<StringOperators>,
  shipping?: Maybe<NumberOperators>,
  shippingWithTax?: Maybe<NumberOperators>,
  totalBeforeTax?: Maybe<NumberOperators>,
  total?: Maybe<NumberOperators>,
};

export type OrderItem = Node & {
  __typename?: 'OrderItem',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  cancelled: Scalars['Boolean'],
  unitPrice: Scalars['Int'],
  unitPriceWithTax: Scalars['Int'],
  unitPriceIncludesTax: Scalars['Boolean'],
  taxRate: Scalars['Float'],
  adjustments: Array<Adjustment>,
  fulfillment?: Maybe<Fulfillment>,
  refundId?: Maybe<Scalars['ID']>,
};

export type OrderLine = Node & {
  __typename?: 'OrderLine',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  featuredAsset?: Maybe<Asset>,
  unitPrice: Scalars['Int'],
  unitPriceWithTax: Scalars['Int'],
  quantity: Scalars['Int'],
  items: Array<OrderItem>,
  totalPrice: Scalars['Int'],
  adjustments: Array<Adjustment>,
  order: Order,
  customFields?: Maybe<Scalars['JSON']>,
};

export type OrderLineInput = {
  orderLineId: Scalars['ID'],
  quantity: Scalars['Int'],
};

export type OrderList = PaginatedList & {
  __typename?: 'OrderList',
  items: Array<Order>,
  totalItems: Scalars['Int'],
};

export type OrderListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<OrderSortParameter>,
  filter?: Maybe<OrderFilterParameter>,
};

export type OrderSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  state?: Maybe<SortOrder>,
  subTotalBeforeTax?: Maybe<SortOrder>,
  subTotal?: Maybe<SortOrder>,
  shipping?: Maybe<SortOrder>,
  shippingWithTax?: Maybe<SortOrder>,
  totalBeforeTax?: Maybe<SortOrder>,
  total?: Maybe<SortOrder>,
};

export type PaginatedList = {
  __typename?: 'PaginatedList',
  items: Array<Node>,
  totalItems: Scalars['Int'],
};

export type Payment = Node & {
  __typename?: 'Payment',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  method: Scalars['String'],
  amount: Scalars['Int'],
  state: Scalars['String'],
  transactionId?: Maybe<Scalars['String']>,
  errorMessage?: Maybe<Scalars['String']>,
  refunds: Array<Refund>,
  metadata?: Maybe<Scalars['JSON']>,
};

export type PaymentMethod = Node & {
  __typename?: 'PaymentMethod',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  enabled: Scalars['Boolean'],
  configArgs: Array<ConfigArg>,
};

export type PaymentMethodFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type PaymentMethodList = PaginatedList & {
  __typename?: 'PaymentMethodList',
  items: Array<PaymentMethod>,
  totalItems: Scalars['Int'],
};

export type PaymentMethodListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<PaymentMethodSortParameter>,
  filter?: Maybe<PaymentMethodFilterParameter>,
};

export type PaymentMethodSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
};

/** "
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 * 
 * @docsCategory common
 */
export enum Permission {
  /**  The Authenticated role means simply that the user is logged in  */
  Authenticated = 'Authenticated',
  /**  SuperAdmin can perform the most sensitive tasks */
  SuperAdmin = 'SuperAdmin',
  /**  Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  /**  Public means any unauthenticated user may perform the operation  */
  Public = 'Public',
  CreateCatalog = 'CreateCatalog',
  ReadCatalog = 'ReadCatalog',
  UpdateCatalog = 'UpdateCatalog',
  DeleteCatalog = 'DeleteCatalog',
  CreateCustomer = 'CreateCustomer',
  ReadCustomer = 'ReadCustomer',
  UpdateCustomer = 'UpdateCustomer',
  DeleteCustomer = 'DeleteCustomer',
  CreateAdministrator = 'CreateAdministrator',
  ReadAdministrator = 'ReadAdministrator',
  UpdateAdministrator = 'UpdateAdministrator',
  DeleteAdministrator = 'DeleteAdministrator',
  CreateOrder = 'CreateOrder',
  ReadOrder = 'ReadOrder',
  UpdateOrder = 'UpdateOrder',
  DeleteOrder = 'DeleteOrder',
  CreatePromotion = 'CreatePromotion',
  ReadPromotion = 'ReadPromotion',
  UpdatePromotion = 'UpdatePromotion',
  DeletePromotion = 'DeletePromotion',
  CreateSettings = 'CreateSettings',
  ReadSettings = 'ReadSettings',
  UpdateSettings = 'UpdateSettings',
  DeleteSettings = 'DeleteSettings'
}

/** The price range where the result has more than one price */
export type PriceRange = {
  __typename?: 'PriceRange',
  min: Scalars['Int'],
  max: Scalars['Int'],
};

export type Product = Node & {
  __typename?: 'Product',
  enabled: Scalars['Boolean'],
  channels: Array<Channel>,
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  slug: Scalars['String'],
  description: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  variants: Array<ProductVariant>,
  optionGroups: Array<ProductOptionGroup>,
  facetValues: Array<FacetValue>,
  translations: Array<ProductTranslation>,
  collections: Array<Collection>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductFilterParameter = {
  enabled?: Maybe<BooleanOperators>,
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  slug?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};

export type ProductList = PaginatedList & {
  __typename?: 'ProductList',
  items: Array<Product>,
  totalItems: Scalars['Int'],
};

export type ProductListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ProductSortParameter>,
  filter?: Maybe<ProductFilterParameter>,
};

export type ProductOption = Node & {
  __typename?: 'ProductOption',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  code: Scalars['String'],
  name: Scalars['String'],
  groupId: Scalars['ID'],
  translations: Array<ProductOptionTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionGroup = Node & {
  __typename?: 'ProductOptionGroup',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  code: Scalars['String'],
  name: Scalars['String'],
  options: Array<ProductOption>,
  translations: Array<ProductOptionGroupTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionGroupTranslation = {
  __typename?: 'ProductOptionGroupTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductOptionGroupTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductOptionTranslation = {
  __typename?: 'ProductOptionTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductOptionTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  slug?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type ProductTranslation = {
  __typename?: 'ProductTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
  slug: Scalars['String'],
  description: Scalars['String'],
};

export type ProductTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  slug?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type ProductVariant = Node & {
  __typename?: 'ProductVariant',
  enabled: Scalars['Boolean'],
  stockOnHand: Scalars['Int'],
  trackInventory: Scalars['Boolean'],
  stockMovements: StockMovementList,
  id: Scalars['ID'],
  productId: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  sku: Scalars['String'],
  name: Scalars['String'],
  featuredAsset?: Maybe<Asset>,
  assets: Array<Asset>,
  price: Scalars['Int'],
  currencyCode: CurrencyCode,
  priceIncludesTax: Scalars['Boolean'],
  priceWithTax: Scalars['Int'],
  taxRateApplied: TaxRate,
  taxCategory: TaxCategory,
  options: Array<ProductOption>,
  facetValues: Array<FacetValue>,
  translations: Array<ProductVariantTranslation>,
  customFields?: Maybe<Scalars['JSON']>,
};


export type ProductVariantStockMovementsArgs = {
  options?: Maybe<StockMovementListOptions>
};

export type ProductVariantFilterParameter = {
  enabled?: Maybe<BooleanOperators>,
  stockOnHand?: Maybe<NumberOperators>,
  trackInventory?: Maybe<BooleanOperators>,
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  sku?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  price?: Maybe<NumberOperators>,
  currencyCode?: Maybe<StringOperators>,
  priceIncludesTax?: Maybe<BooleanOperators>,
  priceWithTax?: Maybe<NumberOperators>,
};

export type ProductVariantList = PaginatedList & {
  __typename?: 'ProductVariantList',
  items: Array<ProductVariant>,
  totalItems: Scalars['Int'],
};

export type ProductVariantListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ProductVariantSortParameter>,
  filter?: Maybe<ProductVariantFilterParameter>,
};

export type ProductVariantSortParameter = {
  stockOnHand?: Maybe<SortOrder>,
  id?: Maybe<SortOrder>,
  productId?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  sku?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  price?: Maybe<SortOrder>,
  priceWithTax?: Maybe<SortOrder>,
};

export type ProductVariantTranslation = {
  __typename?: 'ProductVariantTranslation',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  languageCode: LanguageCode,
  name: Scalars['String'],
};

export type ProductVariantTranslationInput = {
  id?: Maybe<Scalars['ID']>,
  languageCode: LanguageCode,
  name?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Promotion = Node & {
  __typename?: 'Promotion',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  startsAt?: Maybe<Scalars['DateTime']>,
  endsAt?: Maybe<Scalars['DateTime']>,
  couponCode?: Maybe<Scalars['String']>,
  perCustomerUsageLimit?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  conditions: Array<ConfigurableOperation>,
  actions: Array<ConfigurableOperation>,
};

export type PromotionFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  startsAt?: Maybe<DateOperators>,
  endsAt?: Maybe<DateOperators>,
  couponCode?: Maybe<StringOperators>,
  perCustomerUsageLimit?: Maybe<NumberOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
};

export type PromotionList = PaginatedList & {
  __typename?: 'PromotionList',
  items: Array<Promotion>,
  totalItems: Scalars['Int'],
};

export type PromotionListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<PromotionSortParameter>,
  filter?: Maybe<PromotionFilterParameter>,
};

export type PromotionSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  startsAt?: Maybe<SortOrder>,
  endsAt?: Maybe<SortOrder>,
  couponCode?: Maybe<SortOrder>,
  perCustomerUsageLimit?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
};

export type Query = {
  __typename?: 'Query',
  administrators: AdministratorList,
  administrator?: Maybe<Administrator>,
  /** Get a list of Assets */
  assets: AssetList,
  /** Get a single Asset by id */
  asset?: Maybe<Asset>,
  me?: Maybe<CurrentUser>,
  channels: Array<Channel>,
  channel?: Maybe<Channel>,
  activeChannel: Channel,
  collections: CollectionList,
  collection?: Maybe<Collection>,
  collectionFilters: Array<ConfigurableOperationDefinition>,
  countries: CountryList,
  country?: Maybe<Country>,
  customerGroups: Array<CustomerGroup>,
  customerGroup?: Maybe<CustomerGroup>,
  customers: CustomerList,
  customer?: Maybe<Customer>,
  facets: FacetList,
  facet?: Maybe<Facet>,
  globalSettings: GlobalSettings,
  job?: Maybe<JobInfo>,
  jobs: Array<JobInfo>,
  order?: Maybe<Order>,
  orders: OrderList,
  paymentMethods: PaymentMethodList,
  paymentMethod?: Maybe<PaymentMethod>,
  productOptionGroups: Array<ProductOptionGroup>,
  productOptionGroup?: Maybe<ProductOptionGroup>,
  search: SearchResponse,
  products: ProductList,
  /** Get a Product either by id or slug. If neither id nor slug is speicified, an error will result. */
  product?: Maybe<Product>,
  promotion?: Maybe<Promotion>,
  promotions: PromotionList,
  promotionConditions: Array<ConfigurableOperationDefinition>,
  promotionActions: Array<ConfigurableOperationDefinition>,
  roles: RoleList,
  role?: Maybe<Role>,
  shippingMethods: ShippingMethodList,
  shippingMethod?: Maybe<ShippingMethod>,
  shippingEligibilityCheckers: Array<ConfigurableOperationDefinition>,
  shippingCalculators: Array<ConfigurableOperationDefinition>,
  testShippingMethod: TestShippingMethodResult,
  testEligibleShippingMethods: Array<ShippingMethodQuote>,
  taxCategories: Array<TaxCategory>,
  taxCategory?: Maybe<TaxCategory>,
  taxRates: TaxRateList,
  taxRate?: Maybe<TaxRate>,
  zones: Array<Zone>,
  zone?: Maybe<Zone>,
};


export type QueryAdministratorsArgs = {
  options?: Maybe<AdministratorListOptions>
};


export type QueryAdministratorArgs = {
  id: Scalars['ID']
};


export type QueryAssetsArgs = {
  options?: Maybe<AssetListOptions>
};


export type QueryAssetArgs = {
  id: Scalars['ID']
};


export type QueryChannelArgs = {
  id: Scalars['ID']
};


export type QueryCollectionsArgs = {
  options?: Maybe<CollectionListOptions>
};


export type QueryCollectionArgs = {
  id: Scalars['ID']
};


export type QueryCountriesArgs = {
  options?: Maybe<CountryListOptions>
};


export type QueryCountryArgs = {
  id: Scalars['ID']
};


export type QueryCustomerGroupArgs = {
  id: Scalars['ID']
};


export type QueryCustomersArgs = {
  options?: Maybe<CustomerListOptions>
};


export type QueryCustomerArgs = {
  id: Scalars['ID']
};


export type QueryFacetsArgs = {
  options?: Maybe<FacetListOptions>
};


export type QueryFacetArgs = {
  id: Scalars['ID']
};


export type QueryJobArgs = {
  jobId: Scalars['String']
};


export type QueryJobsArgs = {
  input?: Maybe<JobListInput>
};


export type QueryOrderArgs = {
  id: Scalars['ID']
};


export type QueryOrdersArgs = {
  options?: Maybe<OrderListOptions>
};


export type QueryPaymentMethodsArgs = {
  options?: Maybe<PaymentMethodListOptions>
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID']
};


export type QueryProductOptionGroupsArgs = {
  filterTerm?: Maybe<Scalars['String']>
};


export type QueryProductOptionGroupArgs = {
  id: Scalars['ID']
};


export type QuerySearchArgs = {
  input: SearchInput
};


export type QueryProductsArgs = {
  options?: Maybe<ProductListOptions>
};


export type QueryProductArgs = {
  id?: Maybe<Scalars['ID']>,
  slug?: Maybe<Scalars['String']>
};


export type QueryPromotionArgs = {
  id: Scalars['ID']
};


export type QueryPromotionsArgs = {
  options?: Maybe<PromotionListOptions>
};


export type QueryRolesArgs = {
  options?: Maybe<RoleListOptions>
};


export type QueryRoleArgs = {
  id: Scalars['ID']
};


export type QueryShippingMethodsArgs = {
  options?: Maybe<ShippingMethodListOptions>
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID']
};


export type QueryTestShippingMethodArgs = {
  input: TestShippingMethodInput
};


export type QueryTestEligibleShippingMethodsArgs = {
  input: TestEligibleShippingMethodsInput
};


export type QueryTaxCategoryArgs = {
  id: Scalars['ID']
};


export type QueryTaxRatesArgs = {
  options?: Maybe<TaxRateListOptions>
};


export type QueryTaxRateArgs = {
  id: Scalars['ID']
};


export type QueryZoneArgs = {
  id: Scalars['ID']
};

export type Refund = Node & {
  __typename?: 'Refund',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  items: Scalars['Int'],
  shipping: Scalars['Int'],
  adjustment: Scalars['Int'],
  total: Scalars['Int'],
  method?: Maybe<Scalars['String']>,
  state: Scalars['String'],
  transactionId?: Maybe<Scalars['String']>,
  reason?: Maybe<Scalars['String']>,
  orderItems: Array<OrderItem>,
  paymentId: Scalars['ID'],
  metadata?: Maybe<Scalars['JSON']>,
};

export type RefundOrderInput = {
  lines: Array<OrderLineInput>,
  shipping: Scalars['Int'],
  adjustment: Scalars['Int'],
  paymentId: Scalars['ID'],
  reason?: Maybe<Scalars['String']>,
};

export type RemoveProductsFromChannelInput = {
  productIds: Array<Scalars['ID']>,
  channelId: Scalars['ID'],
};

export type Return = Node & StockMovement & {
  __typename?: 'Return',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderItem: OrderItem,
};

export type Role = Node & {
  __typename?: 'Role',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  description: Scalars['String'],
  permissions: Array<Permission>,
  channels: Array<Channel>,
};

export type RoleFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList',
  items: Array<Role>,
  totalItems: Scalars['Int'],
};

export type RoleListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<RoleSortParameter>,
  filter?: Maybe<RoleFilterParameter>,
};

export type RoleSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

export type Sale = Node & StockMovement & {
  __typename?: 'Sale',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
  orderLine: OrderLine,
};

export type SearchInput = {
  term?: Maybe<Scalars['String']>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  collectionId?: Maybe<Scalars['ID']>,
  groupByProduct?: Maybe<Scalars['Boolean']>,
  take?: Maybe<Scalars['Int']>,
  skip?: Maybe<Scalars['Int']>,
  sort?: Maybe<SearchResultSortParameter>,
};

export type SearchReindexResponse = {
  __typename?: 'SearchReindexResponse',
  success: Scalars['Boolean'],
};

export type SearchResponse = {
  __typename?: 'SearchResponse',
  items: Array<SearchResult>,
  totalItems: Scalars['Int'],
  facetValues: Array<FacetValueResult>,
};

export type SearchResult = {
  __typename?: 'SearchResult',
  enabled: Scalars['Boolean'],
  /** An array of ids of the Collections in which this result appears */
  channelIds: Array<Scalars['ID']>,
  sku: Scalars['String'],
  slug: Scalars['String'],
  productId: Scalars['ID'],
  productName: Scalars['String'],
  productPreview: Scalars['String'],
  productAsset?: Maybe<SearchResultAsset>,
  productVariantId: Scalars['ID'],
  productVariantName: Scalars['String'],
  productVariantPreview: Scalars['String'],
  productVariantAsset?: Maybe<SearchResultAsset>,
  price: SearchResultPrice,
  priceWithTax: SearchResultPrice,
  currencyCode: CurrencyCode,
  description: Scalars['String'],
  facetIds: Array<Scalars['ID']>,
  facetValueIds: Array<Scalars['ID']>,
  /** An array of ids of the Collections in which this result appears */
  collectionIds: Array<Scalars['ID']>,
  /** A relevence score for the result. Differs between database implementations */
  score: Scalars['Float'],
};

export type SearchResultAsset = {
  __typename?: 'SearchResultAsset',
  id: Scalars['ID'],
  preview: Scalars['String'],
  focalPoint?: Maybe<Coordinate>,
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
  name?: Maybe<SortOrder>,
  price?: Maybe<SortOrder>,
};

export type ServerConfig = {
  __typename?: 'ServerConfig',
  customFieldConfig: CustomFields,
};

export type SettleRefundInput = {
  id: Scalars['ID'],
  transactionId: Scalars['String'],
};

export type ShippingMethod = Node & {
  __typename?: 'ShippingMethod',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  code: Scalars['String'],
  description: Scalars['String'],
  checker: ConfigurableOperation,
  calculator: ConfigurableOperation,
};

export type ShippingMethodFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  code?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};

export type ShippingMethodList = PaginatedList & {
  __typename?: 'ShippingMethodList',
  items: Array<ShippingMethod>,
  totalItems: Scalars['Int'],
};

export type ShippingMethodListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<ShippingMethodSortParameter>,
  filter?: Maybe<ShippingMethodFilterParameter>,
};

export type ShippingMethodQuote = {
  __typename?: 'ShippingMethodQuote',
  id: Scalars['ID'],
  price: Scalars['Int'],
  priceWithTax: Scalars['Int'],
  description: Scalars['String'],
  metadata?: Maybe<Scalars['JSON']>,
};

export type ShippingMethodSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  code?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
};

/** The price value where the result has a single price */
export type SinglePrice = {
  __typename?: 'SinglePrice',
  value: Scalars['Int'],
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StockAdjustment = Node & StockMovement & {
  __typename?: 'StockAdjustment',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
};

export type StockMovement = {
  __typename?: 'StockMovement',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  productVariant: ProductVariant,
  type: StockMovementType,
  quantity: Scalars['Int'],
};

export type StockMovementItem = StockAdjustment | Sale | Cancellation | Return;

export type StockMovementList = {
  __typename?: 'StockMovementList',
  items: Array<StockMovementItem>,
  totalItems: Scalars['Int'],
};

export type StockMovementListOptions = {
  type?: Maybe<StockMovementType>,
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
};

export enum StockMovementType {
  ADJUSTMENT = 'ADJUSTMENT',
  SALE = 'SALE',
  CANCELLATION = 'CANCELLATION',
  RETURN = 'RETURN'
}

export type StringCustomFieldConfig = CustomField & {
  __typename?: 'StringCustomFieldConfig',
  name: Scalars['String'],
  type: Scalars['String'],
  length?: Maybe<Scalars['Int']>,
  label?: Maybe<Array<LocalizedString>>,
  description?: Maybe<Array<LocalizedString>>,
  readonly?: Maybe<Scalars['Boolean']>,
  internal?: Maybe<Scalars['Boolean']>,
  pattern?: Maybe<Scalars['String']>,
  options?: Maybe<Array<StringFieldOption>>,
};

export type StringFieldOption = {
  __typename?: 'StringFieldOption',
  value: Scalars['String'],
  label?: Maybe<Array<LocalizedString>>,
};

export type StringOperators = {
  eq?: Maybe<Scalars['String']>,
  contains?: Maybe<Scalars['String']>,
};

export type TaxCategory = Node & {
  __typename?: 'TaxCategory',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
};

export type TaxRate = Node & {
  __typename?: 'TaxRate',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  enabled: Scalars['Boolean'],
  value: Scalars['Float'],
  category: TaxCategory,
  zone: Zone,
  customerGroup?: Maybe<CustomerGroup>,
};

export type TaxRateFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  enabled?: Maybe<BooleanOperators>,
  value?: Maybe<NumberOperators>,
};

export type TaxRateList = PaginatedList & {
  __typename?: 'TaxRateList',
  items: Array<TaxRate>,
  totalItems: Scalars['Int'],
};

export type TaxRateListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<TaxRateSortParameter>,
  filter?: Maybe<TaxRateFilterParameter>,
};

export type TaxRateSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  value?: Maybe<SortOrder>,
};

export type TestEligibleShippingMethodsInput = {
  shippingAddress: CreateAddressInput,
  lines: Array<TestShippingMethodOrderLineInput>,
};

export type TestShippingMethodInput = {
  checker: ConfigurableOperationInput,
  calculator: ConfigurableOperationInput,
  shippingAddress: CreateAddressInput,
  lines: Array<TestShippingMethodOrderLineInput>,
};

export type TestShippingMethodOrderLineInput = {
  productVariantId: Scalars['ID'],
  quantity: Scalars['Int'],
};

export type TestShippingMethodQuote = {
  __typename?: 'TestShippingMethodQuote',
  price: Scalars['Int'],
  priceWithTax: Scalars['Int'],
  description: Scalars['String'],
  metadata?: Maybe<Scalars['JSON']>,
};

export type TestShippingMethodResult = {
  __typename?: 'TestShippingMethodResult',
  eligible: Scalars['Boolean'],
  quote?: Maybe<TestShippingMethodQuote>,
};

export type UpdateAddressInput = {
  id: Scalars['ID'],
  fullName?: Maybe<Scalars['String']>,
  company?: Maybe<Scalars['String']>,
  streetLine1?: Maybe<Scalars['String']>,
  streetLine2?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  province?: Maybe<Scalars['String']>,
  postalCode?: Maybe<Scalars['String']>,
  countryCode?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
  defaultShippingAddress?: Maybe<Scalars['Boolean']>,
  defaultBillingAddress?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateAdministratorInput = {
  id: Scalars['ID'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  emailAddress?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  roleIds?: Maybe<Array<Scalars['ID']>>,
};

export type UpdateAssetInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  focalPoint?: Maybe<CoordinateInput>,
};

export type UpdateChannelInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  token?: Maybe<Scalars['String']>,
  defaultLanguageCode?: Maybe<LanguageCode>,
  pricesIncludeTax?: Maybe<Scalars['Boolean']>,
  currencyCode?: Maybe<CurrencyCode>,
  defaultTaxZoneId?: Maybe<Scalars['ID']>,
  defaultShippingZoneId?: Maybe<Scalars['ID']>,
};

export type UpdateCollectionInput = {
  id: Scalars['ID'],
  isPrivate?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  parentId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  filters?: Maybe<Array<ConfigurableOperationInput>>,
  translations?: Maybe<Array<CollectionTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateCountryInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<CountryTranslationInput>>,
  enabled?: Maybe<Scalars['Boolean']>,
};

export type UpdateCustomerGroupInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type UpdateCustomerInput = {
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  phoneNumber?: Maybe<Scalars['String']>,
  emailAddress?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateFacetInput = {
  id: Scalars['ID'],
  isPrivate?: Maybe<Scalars['Boolean']>,
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<FacetTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateFacetValueInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<FacetValueTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: Maybe<Array<LanguageCode>>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdatePaymentMethodInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  enabled?: Maybe<Scalars['Boolean']>,
  configArgs?: Maybe<Array<ConfigArgInput>>,
};

export type UpdateProductInput = {
  id: Scalars['ID'],
  enabled?: Maybe<Scalars['Boolean']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  translations?: Maybe<Array<ProductTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateProductOptionGroupInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<ProductOptionGroupTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateProductOptionInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  translations?: Maybe<Array<ProductOptionGroupTranslationInput>>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdateProductVariantInput = {
  id: Scalars['ID'],
  enabled?: Maybe<Scalars['Boolean']>,
  translations?: Maybe<Array<ProductVariantTranslationInput>>,
  facetValueIds?: Maybe<Array<Scalars['ID']>>,
  sku?: Maybe<Scalars['String']>,
  taxCategoryId?: Maybe<Scalars['ID']>,
  price?: Maybe<Scalars['Int']>,
  featuredAssetId?: Maybe<Scalars['ID']>,
  assetIds?: Maybe<Array<Scalars['ID']>>,
  stockOnHand?: Maybe<Scalars['Int']>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type UpdatePromotionInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  enabled?: Maybe<Scalars['Boolean']>,
  startsAt?: Maybe<Scalars['DateTime']>,
  endsAt?: Maybe<Scalars['DateTime']>,
  couponCode?: Maybe<Scalars['String']>,
  perCustomerUsageLimit?: Maybe<Scalars['Int']>,
  conditions?: Maybe<Array<ConfigurableOperationInput>>,
  actions?: Maybe<Array<ConfigurableOperationInput>>,
};

export type UpdateRoleInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Permission>>,
  channelIds?: Maybe<Array<Scalars['ID']>>,
};

export type UpdateShippingMethodInput = {
  id: Scalars['ID'],
  code?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  checker?: Maybe<ConfigurableOperationInput>,
  calculator?: Maybe<ConfigurableOperationInput>,
};

export type UpdateTaxCategoryInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type UpdateTaxRateInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['Float']>,
  enabled?: Maybe<Scalars['Boolean']>,
  categoryId?: Maybe<Scalars['ID']>,
  zoneId?: Maybe<Scalars['ID']>,
  customerGroupId?: Maybe<Scalars['ID']>,
};

export type UpdateZoneInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};


export type User = Node & {
  __typename?: 'User',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  identifier: Scalars['String'],
  verified: Scalars['Boolean'],
  roles: Array<Role>,
  lastLogin?: Maybe<Scalars['String']>,
  customFields?: Maybe<Scalars['JSON']>,
};

export type Zone = Node & {
  __typename?: 'Zone',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  members: Array<Country>,
};
