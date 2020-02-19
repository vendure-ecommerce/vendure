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

export type CurrentUserChannelInput = {
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
  requestStarted: Scalars['Int'],
  requestCompleted: Scalars['Int'],
  setAsLoggedIn: UserStatus,
  setAsLoggedOut: UserStatus,
  setUiLanguage?: Maybe<LanguageCode>,
  setActiveChannel: UserStatus,
  updateUserChannels: UserStatus,
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


export type MutationSetAsLoggedInArgs = {
  input: UserStatusInput
};


export type MutationSetUiLanguageArgs = {
  languageCode?: Maybe<LanguageCode>
};


export type MutationSetActiveChannelArgs = {
  channelId: Scalars['ID']
};


export type MutationUpdateUserChannelsArgs = {
  channels: Array<CurrentUserChannelInput>
};

export type NetworkStatus = {
  __typename?: 'NetworkStatus',
  inFlightRequests: Scalars['Int'],
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
  networkStatus: NetworkStatus,
  userStatus: UserStatus,
  uiState: UiState,
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

export type UiState = {
  __typename?: 'UiState',
  language: LanguageCode,
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

export type UserStatus = {
  __typename?: 'UserStatus',
  username: Scalars['String'],
  isLoggedIn: Scalars['Boolean'],
  loginTime: Scalars['String'],
  permissions: Array<Permission>,
  activeChannelId?: Maybe<Scalars['ID']>,
  channels: Array<CurrentUserChannel>,
};

export type UserStatusInput = {
  username: Scalars['String'],
  loginTime: Scalars['String'],
  activeChannelId: Scalars['ID'],
  channels: Array<CurrentUserChannelInput>,
};

export type Zone = Node & {
  __typename?: 'Zone',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  members: Array<Country>,
};
export type RoleFragment = ({ __typename?: 'Role' } & Pick<Role, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'description' | 'permissions'> & { channels: Array<({ __typename?: 'Channel' } & Pick<Channel, 'id' | 'code' | 'token'>)> });

export type AdministratorFragment = ({ __typename?: 'Administrator' } & Pick<Administrator, 'id' | 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'emailAddress'> & { user: ({ __typename?: 'User' } & Pick<User, 'id' | 'identifier' | 'lastLogin'> & { roles: Array<({ __typename?: 'Role' } & RoleFragment)> }) });

export type GetAdministratorsQueryVariables = {
  options?: Maybe<AdministratorListOptions>
};


export type GetAdministratorsQuery = ({ __typename?: 'Query' } & { administrators: ({ __typename?: 'AdministratorList' } & Pick<AdministratorList, 'totalItems'> & { items: Array<({ __typename?: 'Administrator' } & AdministratorFragment)> }) });

export type GetAdministratorQueryVariables = {
  id: Scalars['ID']
};


export type GetAdministratorQuery = ({ __typename?: 'Query' } & { administrator: Maybe<({ __typename?: 'Administrator' } & AdministratorFragment)> });

export type CreateAdministratorMutationVariables = {
  input: CreateAdministratorInput
};


export type CreateAdministratorMutation = ({ __typename?: 'Mutation' } & { createAdministrator: ({ __typename?: 'Administrator' } & AdministratorFragment) });

export type UpdateAdministratorMutationVariables = {
  input: UpdateAdministratorInput
};


export type UpdateAdministratorMutation = ({ __typename?: 'Mutation' } & { updateAdministrator: ({ __typename?: 'Administrator' } & AdministratorFragment) });

export type GetRolesQueryVariables = {
  options?: Maybe<RoleListOptions>
};


export type GetRolesQuery = ({ __typename?: 'Query' } & { roles: ({ __typename?: 'RoleList' } & Pick<RoleList, 'totalItems'> & { items: Array<({ __typename?: 'Role' } & RoleFragment)> }) });

export type GetRoleQueryVariables = {
  id: Scalars['ID']
};


export type GetRoleQuery = ({ __typename?: 'Query' } & { role: Maybe<({ __typename?: 'Role' } & RoleFragment)> });

export type CreateRoleMutationVariables = {
  input: CreateRoleInput
};


export type CreateRoleMutation = ({ __typename?: 'Mutation' } & { createRole: ({ __typename?: 'Role' } & RoleFragment) });

export type UpdateRoleMutationVariables = {
  input: UpdateRoleInput
};


export type UpdateRoleMutation = ({ __typename?: 'Mutation' } & { updateRole: ({ __typename?: 'Role' } & RoleFragment) });

export type DeleteRoleMutationVariables = {
  id: Scalars['ID']
};


export type DeleteRoleMutation = ({ __typename?: 'Mutation' } & { deleteRole: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type AssignRoleToAdministratorMutationVariables = {
  administratorId: Scalars['ID'],
  roleId: Scalars['ID']
};


export type AssignRoleToAdministratorMutation = ({ __typename?: 'Mutation' } & { assignRoleToAdministrator: ({ __typename?: 'Administrator' } & AdministratorFragment) });

export type CurrentUserFragment = ({ __typename?: 'CurrentUser' } & Pick<CurrentUser, 'id' | 'identifier'> & { channels: Array<({ __typename?: 'CurrentUserChannel' } & Pick<CurrentUserChannel, 'id' | 'code' | 'token' | 'permissions'>)> });

export type AttemptLoginMutationVariables = {
  username: Scalars['String'],
  password: Scalars['String'],
  rememberMe: Scalars['Boolean']
};


export type AttemptLoginMutation = ({ __typename?: 'Mutation' } & { login: ({ __typename?: 'LoginResult' } & { user: ({ __typename?: 'CurrentUser' } & CurrentUserFragment) }) });

export type LogOutMutationVariables = {};


export type LogOutMutation = ({ __typename?: 'Mutation' } & Pick<Mutation, 'logout'>);

export type GetCurrentUserQueryVariables = {};


export type GetCurrentUserQuery = ({ __typename?: 'Query' } & { me: Maybe<({ __typename?: 'CurrentUser' } & CurrentUserFragment)> });

export type RequestStartedMutationVariables = {};


export type RequestStartedMutation = ({ __typename?: 'Mutation' } & Pick<Mutation, 'requestStarted'>);

export type RequestCompletedMutationVariables = {};


export type RequestCompletedMutation = ({ __typename?: 'Mutation' } & Pick<Mutation, 'requestCompleted'>);

export type UserStatusFragment = ({ __typename?: 'UserStatus' } & Pick<UserStatus, 'username' | 'isLoggedIn' | 'loginTime' | 'activeChannelId' | 'permissions'> & { channels: Array<({ __typename?: 'CurrentUserChannel' } & Pick<CurrentUserChannel, 'id' | 'code' | 'token' | 'permissions'>)> });

export type SetAsLoggedInMutationVariables = {
  input: UserStatusInput
};


export type SetAsLoggedInMutation = ({ __typename?: 'Mutation' } & { setAsLoggedIn: ({ __typename?: 'UserStatus' } & UserStatusFragment) });

export type SetAsLoggedOutMutationVariables = {};


export type SetAsLoggedOutMutation = ({ __typename?: 'Mutation' } & { setAsLoggedOut: ({ __typename?: 'UserStatus' } & UserStatusFragment) });

export type SetUiLanguageMutationVariables = {
  languageCode: LanguageCode
};


export type SetUiLanguageMutation = ({ __typename?: 'Mutation' } & Pick<Mutation, 'setUiLanguage'>);

export type GetNetworkStatusQueryVariables = {};


export type GetNetworkStatusQuery = ({ __typename?: 'Query' } & { networkStatus: ({ __typename?: 'NetworkStatus' } & Pick<NetworkStatus, 'inFlightRequests'>) });

export type GetUserStatusQueryVariables = {};


export type GetUserStatusQuery = ({ __typename?: 'Query' } & { userStatus: ({ __typename?: 'UserStatus' } & UserStatusFragment) });

export type GetUiStateQueryVariables = {};


export type GetUiStateQuery = ({ __typename?: 'Query' } & { uiState: ({ __typename?: 'UiState' } & Pick<UiState, 'language'>) });

export type SetActiveChannelMutationVariables = {
  channelId: Scalars['ID']
};


export type SetActiveChannelMutation = ({ __typename?: 'Mutation' } & { setActiveChannel: ({ __typename?: 'UserStatus' } & UserStatusFragment) });

export type UpdateUserChannelsMutationVariables = {
  channels: Array<CurrentUserChannelInput>
};


export type UpdateUserChannelsMutation = ({ __typename?: 'Mutation' } & { updateUserChannels: ({ __typename?: 'UserStatus' } & UserStatusFragment) });

export type GetCollectionFiltersQueryVariables = {};


export type GetCollectionFiltersQuery = ({ __typename?: 'Query' } & { collectionFilters: Array<({ __typename?: 'ConfigurableOperationDefinition' } & ConfigurableOperationDefFragment)> });

export type CollectionFragment = ({ __typename?: 'Collection' } & Pick<Collection, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'description' | 'isPrivate' | 'languageCode'> & { featuredAsset: Maybe<({ __typename?: 'Asset' } & AssetFragment)>, assets: Array<({ __typename?: 'Asset' } & AssetFragment)>, filters: Array<({ __typename?: 'ConfigurableOperation' } & ConfigurableOperationFragment)>, translations: Array<({ __typename?: 'CollectionTranslation' } & Pick<CollectionTranslation, 'id' | 'languageCode' | 'name' | 'description'>)>, parent: Maybe<({ __typename?: 'Collection' } & Pick<Collection, 'id' | 'name'>)>, children: Maybe<Array<({ __typename?: 'Collection' } & Pick<Collection, 'id' | 'name'>)>> });

export type GetCollectionListQueryVariables = {
  options?: Maybe<CollectionListOptions>
};


export type GetCollectionListQuery = ({ __typename?: 'Query' } & { collections: ({ __typename?: 'CollectionList' } & Pick<CollectionList, 'totalItems'> & { items: Array<({ __typename?: 'Collection' } & Pick<Collection, 'id' | 'name' | 'description' | 'isPrivate'> & { featuredAsset: Maybe<({ __typename?: 'Asset' } & AssetFragment)>, parent: Maybe<({ __typename?: 'Collection' } & Pick<Collection, 'id'>)> })> }) });

export type GetCollectionQueryVariables = {
  id: Scalars['ID']
};


export type GetCollectionQuery = ({ __typename?: 'Query' } & { collection: Maybe<({ __typename?: 'Collection' } & CollectionFragment)> });

export type CreateCollectionMutationVariables = {
  input: CreateCollectionInput
};


export type CreateCollectionMutation = ({ __typename?: 'Mutation' } & { createCollection: ({ __typename?: 'Collection' } & CollectionFragment) });

export type UpdateCollectionMutationVariables = {
  input: UpdateCollectionInput
};


export type UpdateCollectionMutation = ({ __typename?: 'Mutation' } & { updateCollection: ({ __typename?: 'Collection' } & CollectionFragment) });

export type MoveCollectionMutationVariables = {
  input: MoveCollectionInput
};


export type MoveCollectionMutation = ({ __typename?: 'Mutation' } & { moveCollection: ({ __typename?: 'Collection' } & CollectionFragment) });

export type DeleteCollectionMutationVariables = {
  id: Scalars['ID']
};


export type DeleteCollectionMutation = ({ __typename?: 'Mutation' } & { deleteCollection: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type GetCollectionContentsQueryVariables = {
  id: Scalars['ID'],
  options?: Maybe<ProductVariantListOptions>
};


export type GetCollectionContentsQuery = ({ __typename?: 'Query' } & { collection: Maybe<({ __typename?: 'Collection' } & Pick<Collection, 'id' | 'name'> & { productVariants: ({ __typename?: 'ProductVariantList' } & Pick<ProductVariantList, 'totalItems'> & { items: Array<({ __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id' | 'productId' | 'name'>)> }) })> });

export type AddressFragment = ({ __typename?: 'Address' } & Pick<Address, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'phoneNumber' | 'defaultShippingAddress' | 'defaultBillingAddress'> & { country: ({ __typename?: 'Country' } & Pick<Country, 'id' | 'code' | 'name'>) });

export type CustomerFragment = ({ __typename?: 'Customer' } & Pick<Customer, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'firstName' | 'lastName' | 'phoneNumber' | 'emailAddress'> & { user: Maybe<({ __typename?: 'User' } & Pick<User, 'id' | 'identifier' | 'verified' | 'lastLogin'>)>, addresses: Maybe<Array<({ __typename?: 'Address' } & AddressFragment)>> });

export type GetCustomerListQueryVariables = {
  options?: Maybe<CustomerListOptions>
};


export type GetCustomerListQuery = ({ __typename?: 'Query' } & { customers: ({ __typename?: 'CustomerList' } & Pick<CustomerList, 'totalItems'> & { items: Array<({ __typename?: 'Customer' } & Pick<Customer, 'id' | 'title' | 'firstName' | 'lastName' | 'emailAddress'> & { user: Maybe<({ __typename?: 'User' } & Pick<User, 'id' | 'verified'>)> })> }) });

export type GetCustomerQueryVariables = {
  id: Scalars['ID'],
  orderListOptions?: Maybe<OrderListOptions>
};


export type GetCustomerQuery = ({ __typename?: 'Query' } & { customer: Maybe<({ __typename?: 'Customer' } & { orders: ({ __typename?: 'OrderList' } & Pick<OrderList, 'totalItems'> & { items: Array<({ __typename?: 'Order' } & Pick<Order, 'id' | 'code' | 'state' | 'total' | 'currencyCode' | 'updatedAt'>)> }) } & CustomerFragment)> });

export type CreateCustomerMutationVariables = {
  input: CreateCustomerInput,
  password?: Maybe<Scalars['String']>
};


export type CreateCustomerMutation = ({ __typename?: 'Mutation' } & { createCustomer: ({ __typename?: 'Customer' } & CustomerFragment) });

export type UpdateCustomerMutationVariables = {
  input: UpdateCustomerInput
};


export type UpdateCustomerMutation = ({ __typename?: 'Mutation' } & { updateCustomer: ({ __typename?: 'Customer' } & CustomerFragment) });

export type CreateCustomerAddressMutationVariables = {
  customerId: Scalars['ID'],
  input: CreateAddressInput
};


export type CreateCustomerAddressMutation = ({ __typename?: 'Mutation' } & { createCustomerAddress: ({ __typename?: 'Address' } & AddressFragment) });

export type UpdateCustomerAddressMutationVariables = {
  input: UpdateAddressInput
};


export type UpdateCustomerAddressMutation = ({ __typename?: 'Mutation' } & { updateCustomerAddress: ({ __typename?: 'Address' } & AddressFragment) });

export type FacetValueFragment = ({ __typename?: 'FacetValue' } & Pick<FacetValue, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'> & { translations: Array<({ __typename?: 'FacetValueTranslation' } & Pick<FacetValueTranslation, 'id' | 'languageCode' | 'name'>)>, facet: ({ __typename?: 'Facet' } & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'name'>) });

export type FacetWithValuesFragment = ({ __typename?: 'Facet' } & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'isPrivate' | 'code' | 'name'> & { translations: Array<({ __typename?: 'FacetTranslation' } & Pick<FacetTranslation, 'id' | 'languageCode' | 'name'>)>, values: Array<({ __typename?: 'FacetValue' } & FacetValueFragment)> });

export type CreateFacetMutationVariables = {
  input: CreateFacetInput
};


export type CreateFacetMutation = ({ __typename?: 'Mutation' } & { createFacet: ({ __typename?: 'Facet' } & FacetWithValuesFragment) });

export type UpdateFacetMutationVariables = {
  input: UpdateFacetInput
};


export type UpdateFacetMutation = ({ __typename?: 'Mutation' } & { updateFacet: ({ __typename?: 'Facet' } & FacetWithValuesFragment) });

export type DeleteFacetMutationVariables = {
  id: Scalars['ID'],
  force?: Maybe<Scalars['Boolean']>
};


export type DeleteFacetMutation = ({ __typename?: 'Mutation' } & { deleteFacet: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type CreateFacetValuesMutationVariables = {
  input: Array<CreateFacetValueInput>
};


export type CreateFacetValuesMutation = ({ __typename?: 'Mutation' } & { createFacetValues: Array<({ __typename?: 'FacetValue' } & FacetValueFragment)> });

export type UpdateFacetValuesMutationVariables = {
  input: Array<UpdateFacetValueInput>
};


export type UpdateFacetValuesMutation = ({ __typename?: 'Mutation' } & { updateFacetValues: Array<({ __typename?: 'FacetValue' } & FacetValueFragment)> });

export type DeleteFacetValuesMutationVariables = {
  ids: Array<Scalars['ID']>,
  force?: Maybe<Scalars['Boolean']>
};


export type DeleteFacetValuesMutation = ({ __typename?: 'Mutation' } & { deleteFacetValues: Array<({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>)> });

export type GetFacetListQueryVariables = {
  options?: Maybe<FacetListOptions>
};


export type GetFacetListQuery = ({ __typename?: 'Query' } & { facets: ({ __typename?: 'FacetList' } & Pick<FacetList, 'totalItems'> & { items: Array<({ __typename?: 'Facet' } & FacetWithValuesFragment)> }) });

export type GetFacetWithValuesQueryVariables = {
  id: Scalars['ID']
};


export type GetFacetWithValuesQuery = ({ __typename?: 'Query' } & { facet: Maybe<({ __typename?: 'Facet' } & FacetWithValuesFragment)> });

export type AdjustmentFragment = ({ __typename?: 'Adjustment' } & Pick<Adjustment, 'adjustmentSource' | 'amount' | 'description' | 'type'>);

export type RefundFragment = ({ __typename?: 'Refund' } & Pick<Refund, 'id' | 'state' | 'items' | 'shipping' | 'adjustment' | 'transactionId' | 'paymentId'>);

export type ShippingAddressFragment = ({ __typename?: 'OrderAddress' } & Pick<OrderAddress, 'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber'>);

export type OrderFragment = ({ __typename?: 'Order' } & Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'state' | 'total' | 'currencyCode'> & { customer: Maybe<({ __typename?: 'Customer' } & Pick<Customer, 'id' | 'firstName' | 'lastName'>)> });

export type FulfillmentFragment = ({ __typename?: 'Fulfillment' } & Pick<Fulfillment, 'id' | 'createdAt' | 'updatedAt' | 'method' | 'trackingCode'>);

export type OrderLineFragment = ({ __typename?: 'OrderLine' } & Pick<OrderLine, 'id' | 'unitPrice' | 'unitPriceWithTax' | 'quantity' | 'totalPrice'> & { featuredAsset: Maybe<({ __typename?: 'Asset' } & Pick<Asset, 'preview'>)>, productVariant: ({ __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id' | 'name' | 'sku'>), adjustments: Array<({ __typename?: 'Adjustment' } & AdjustmentFragment)>, items: Array<({ __typename?: 'OrderItem' } & Pick<OrderItem, 'id' | 'unitPrice' | 'unitPriceIncludesTax' | 'unitPriceWithTax' | 'taxRate' | 'refundId' | 'cancelled'> & { fulfillment: Maybe<({ __typename?: 'Fulfillment' } & FulfillmentFragment)> })> });

export type OrderDetailFragment = ({ __typename?: 'Order' } & Pick<Order, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'state' | 'active' | 'subTotal' | 'subTotalBeforeTax' | 'totalBeforeTax' | 'currencyCode' | 'shipping' | 'shippingWithTax' | 'total'> & { customer: Maybe<({ __typename?: 'Customer' } & Pick<Customer, 'id' | 'firstName' | 'lastName'>)>, lines: Array<({ __typename?: 'OrderLine' } & OrderLineFragment)>, adjustments: Array<({ __typename?: 'Adjustment' } & AdjustmentFragment)>, promotions: Array<({ __typename?: 'Promotion' } & Pick<Promotion, 'id' | 'couponCode'>)>, shippingMethod: Maybe<({ __typename?: 'ShippingMethod' } & Pick<ShippingMethod, 'id' | 'code' | 'description'>)>, shippingAddress: Maybe<({ __typename?: 'OrderAddress' } & ShippingAddressFragment)>, payments: Maybe<Array<({ __typename?: 'Payment' } & Pick<Payment, 'id' | 'createdAt' | 'transactionId' | 'amount' | 'method' | 'state' | 'metadata'> & { refunds: Array<({ __typename?: 'Refund' } & Pick<Refund, 'id' | 'createdAt' | 'state' | 'items' | 'adjustment' | 'total' | 'paymentId' | 'reason' | 'transactionId' | 'method' | 'metadata'> & { orderItems: Array<({ __typename?: 'OrderItem' } & Pick<OrderItem, 'id'>)> })> })>>, fulfillments: Maybe<Array<({ __typename?: 'Fulfillment' } & FulfillmentFragment)>> });

export type GetOrderListQueryVariables = {
  options?: Maybe<OrderListOptions>
};


export type GetOrderListQuery = ({ __typename?: 'Query' } & { orders: ({ __typename?: 'OrderList' } & Pick<OrderList, 'totalItems'> & { items: Array<({ __typename?: 'Order' } & OrderFragment)> }) });

export type GetOrderQueryVariables = {
  id: Scalars['ID']
};


export type GetOrderQuery = ({ __typename?: 'Query' } & { order: Maybe<({ __typename?: 'Order' } & OrderDetailFragment)> });

export type SettlePaymentMutationVariables = {
  id: Scalars['ID']
};


export type SettlePaymentMutation = ({ __typename?: 'Mutation' } & { settlePayment: ({ __typename?: 'Payment' } & Pick<Payment, 'id' | 'transactionId' | 'amount' | 'method' | 'state' | 'metadata'>) });

export type CreateFulfillmentMutationVariables = {
  input: FulfillOrderInput
};


export type CreateFulfillmentMutation = ({ __typename?: 'Mutation' } & { fulfillOrder: ({ __typename?: 'Fulfillment' } & FulfillmentFragment) });

export type CancelOrderMutationVariables = {
  input: CancelOrderInput
};


export type CancelOrderMutation = ({ __typename?: 'Mutation' } & { cancelOrder: ({ __typename?: 'Order' } & OrderDetailFragment) });

export type RefundOrderMutationVariables = {
  input: RefundOrderInput
};


export type RefundOrderMutation = ({ __typename?: 'Mutation' } & { refundOrder: ({ __typename?: 'Refund' } & RefundFragment) });

export type SettleRefundMutationVariables = {
  input: SettleRefundInput
};


export type SettleRefundMutation = ({ __typename?: 'Mutation' } & { settleRefund: ({ __typename?: 'Refund' } & RefundFragment) });

export type GetOrderHistoryQueryVariables = {
  id: Scalars['ID'],
  options?: Maybe<HistoryEntryListOptions>
};


export type GetOrderHistoryQuery = ({ __typename?: 'Query' } & { order: Maybe<({ __typename?: 'Order' } & Pick<Order, 'id'> & { history: ({ __typename?: 'HistoryEntryList' } & Pick<HistoryEntryList, 'totalItems'> & { items: Array<({ __typename?: 'HistoryEntry' } & Pick<HistoryEntry, 'id' | 'type' | 'createdAt' | 'isPublic' | 'data'> & { administrator: Maybe<({ __typename?: 'Administrator' } & Pick<Administrator, 'id' | 'firstName' | 'lastName'>)> })> }) })> });

export type AddNoteToOrderMutationVariables = {
  input: AddNoteToOrderInput
};


export type AddNoteToOrderMutation = ({ __typename?: 'Mutation' } & { addNoteToOrder: ({ __typename?: 'Order' } & Pick<Order, 'id'>) });

export type AssetFragment = ({ __typename?: 'Asset' } & Pick<Asset, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'fileSize' | 'mimeType' | 'type' | 'preview' | 'source' | 'width' | 'height'> & { focalPoint: Maybe<({ __typename?: 'Coordinate' } & Pick<Coordinate, 'x' | 'y'>)> });

export type ProductVariantFragment = ({ __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'price' | 'currencyCode' | 'priceIncludesTax' | 'priceWithTax' | 'stockOnHand' | 'trackInventory' | 'sku'> & { taxRateApplied: ({ __typename?: 'TaxRate' } & Pick<TaxRate, 'id' | 'name' | 'value'>), taxCategory: ({ __typename?: 'TaxCategory' } & Pick<TaxCategory, 'id' | 'name'>), options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'code' | 'languageCode' | 'name' | 'groupId'> & { translations: Array<({ __typename?: 'ProductOptionTranslation' } & Pick<ProductOptionTranslation, 'id' | 'languageCode' | 'name'>)> })>, facetValues: Array<({ __typename?: 'FacetValue' } & Pick<FacetValue, 'id' | 'code' | 'name'> & { facet: ({ __typename?: 'Facet' } & Pick<Facet, 'id' | 'name'>) })>, featuredAsset: Maybe<({ __typename?: 'Asset' } & AssetFragment)>, assets: Array<({ __typename?: 'Asset' } & AssetFragment)>, translations: Array<({ __typename?: 'ProductVariantTranslation' } & Pick<ProductVariantTranslation, 'id' | 'languageCode' | 'name'>)> });

export type ProductWithVariantsFragment = ({ __typename?: 'Product' } & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'slug' | 'description'> & { featuredAsset: Maybe<({ __typename?: 'Asset' } & AssetFragment)>, assets: Array<({ __typename?: 'Asset' } & AssetFragment)>, translations: Array<({ __typename?: 'ProductTranslation' } & Pick<ProductTranslation, 'id' | 'languageCode' | 'name' | 'slug' | 'description'>)>, optionGroups: Array<({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'languageCode' | 'code' | 'name'>)>, variants: Array<({ __typename?: 'ProductVariant' } & ProductVariantFragment)>, facetValues: Array<({ __typename?: 'FacetValue' } & Pick<FacetValue, 'id' | 'code' | 'name'> & { facet: ({ __typename?: 'Facet' } & Pick<Facet, 'id' | 'name'>) })>, channels: Array<({ __typename?: 'Channel' } & Pick<Channel, 'id' | 'code'>)> });

export type ProductOptionGroupFragment = ({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'> & { translations: Array<({ __typename?: 'ProductOptionGroupTranslation' } & Pick<ProductOptionGroupTranslation, 'id' | 'name'>)>, options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'languageCode' | 'name' | 'code'> & { translations: Array<({ __typename?: 'ProductOptionTranslation' } & Pick<ProductOptionTranslation, 'name'>)> })> });

export type UpdateProductMutationVariables = {
  input: UpdateProductInput
};


export type UpdateProductMutation = ({ __typename?: 'Mutation' } & { updateProduct: ({ __typename?: 'Product' } & ProductWithVariantsFragment) });

export type CreateProductMutationVariables = {
  input: CreateProductInput
};


export type CreateProductMutation = ({ __typename?: 'Mutation' } & { createProduct: ({ __typename?: 'Product' } & ProductWithVariantsFragment) });

export type DeleteProductMutationVariables = {
  id: Scalars['ID']
};


export type DeleteProductMutation = ({ __typename?: 'Mutation' } & { deleteProduct: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type CreateProductVariantsMutationVariables = {
  input: Array<CreateProductVariantInput>
};


export type CreateProductVariantsMutation = ({ __typename?: 'Mutation' } & { createProductVariants: Array<Maybe<({ __typename?: 'ProductVariant' } & ProductVariantFragment)>> });

export type UpdateProductVariantsMutationVariables = {
  input: Array<UpdateProductVariantInput>
};


export type UpdateProductVariantsMutation = ({ __typename?: 'Mutation' } & { updateProductVariants: Array<Maybe<({ __typename?: 'ProductVariant' } & ProductVariantFragment)>> });

export type CreateProductOptionGroupMutationVariables = {
  input: CreateProductOptionGroupInput
};


export type CreateProductOptionGroupMutation = ({ __typename?: 'Mutation' } & { createProductOptionGroup: ({ __typename?: 'ProductOptionGroup' } & ProductOptionGroupFragment) });

export type GetProductOptionGroupQueryVariables = {
  id: Scalars['ID']
};


export type GetProductOptionGroupQuery = ({ __typename?: 'Query' } & { productOptionGroup: Maybe<({ __typename?: 'ProductOptionGroup' } & ProductOptionGroupFragment)> });

export type AddOptionToGroupMutationVariables = {
  input: CreateProductOptionInput
};


export type AddOptionToGroupMutation = ({ __typename?: 'Mutation' } & { createProductOption: ({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code' | 'groupId'>) });

export type AddOptionGroupToProductMutationVariables = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type AddOptionGroupToProductMutation = ({ __typename?: 'Mutation' } & { addOptionGroupToProduct: ({ __typename?: 'Product' } & Pick<Product, 'id' | 'createdAt' | 'updatedAt'> & { optionGroups: Array<({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'code'> & { options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'code'>)> })> }) });

export type RemoveOptionGroupFromProductMutationVariables = {
  productId: Scalars['ID'],
  optionGroupId: Scalars['ID']
};


export type RemoveOptionGroupFromProductMutation = ({ __typename?: 'Mutation' } & { removeOptionGroupFromProduct: ({ __typename?: 'Product' } & Pick<Product, 'id' | 'createdAt' | 'updatedAt'> & { optionGroups: Array<({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'code'> & { options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'code'>)> })> }) });

export type GetProductWithVariantsQueryVariables = {
  id: Scalars['ID']
};


export type GetProductWithVariantsQuery = ({ __typename?: 'Query' } & { product: Maybe<({ __typename?: 'Product' } & ProductWithVariantsFragment)> });

export type GetProductListQueryVariables = {
  options?: Maybe<ProductListOptions>
};


export type GetProductListQuery = ({ __typename?: 'Query' } & { products: ({ __typename?: 'ProductList' } & Pick<ProductList, 'totalItems'> & { items: Array<({ __typename?: 'Product' } & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'languageCode' | 'name' | 'slug'> & { featuredAsset: Maybe<({ __typename?: 'Asset' } & Pick<Asset, 'id' | 'createdAt' | 'updatedAt' | 'preview'>)> })> }) });

export type GetProductOptionGroupsQueryVariables = {
  filterTerm?: Maybe<Scalars['String']>
};


export type GetProductOptionGroupsQuery = ({ __typename?: 'Query' } & { productOptionGroups: Array<({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'> & { options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'languageCode' | 'code' | 'name'>)> })> });

export type GetAssetListQueryVariables = {
  options?: Maybe<AssetListOptions>
};


export type GetAssetListQuery = ({ __typename?: 'Query' } & { assets: ({ __typename?: 'AssetList' } & Pick<AssetList, 'totalItems'> & { items: Array<({ __typename?: 'Asset' } & AssetFragment)> }) });

export type GetAssetQueryVariables = {
  id: Scalars['ID']
};


export type GetAssetQuery = ({ __typename?: 'Query' } & { asset: Maybe<({ __typename?: 'Asset' } & AssetFragment)> });

export type CreateAssetsMutationVariables = {
  input: Array<CreateAssetInput>
};


export type CreateAssetsMutation = ({ __typename?: 'Mutation' } & { createAssets: Array<({ __typename?: 'Asset' } & AssetFragment)> });

export type UpdateAssetMutationVariables = {
  input: UpdateAssetInput
};


export type UpdateAssetMutation = ({ __typename?: 'Mutation' } & { updateAsset: ({ __typename?: 'Asset' } & AssetFragment) });

export type SearchProductsQueryVariables = {
  input: SearchInput
};


export type SearchProductsQuery = ({ __typename?: 'Query' } & { search: ({ __typename?: 'SearchResponse' } & Pick<SearchResponse, 'totalItems'> & { items: Array<({ __typename?: 'SearchResult' } & Pick<SearchResult, 'enabled' | 'productId' | 'productName' | 'productVariantId' | 'productVariantName' | 'sku' | 'channelIds'> & { productAsset: Maybe<({ __typename?: 'SearchResultAsset' } & Pick<SearchResultAsset, 'id' | 'preview'> & { focalPoint: Maybe<({ __typename?: 'Coordinate' } & Pick<Coordinate, 'x' | 'y'>)> })>, productVariantAsset: Maybe<({ __typename?: 'SearchResultAsset' } & Pick<SearchResultAsset, 'id' | 'preview'> & { focalPoint: Maybe<({ __typename?: 'Coordinate' } & Pick<Coordinate, 'x' | 'y'>)> })> })>, facetValues: Array<({ __typename?: 'FacetValueResult' } & Pick<FacetValueResult, 'count'> & { facetValue: ({ __typename?: 'FacetValue' } & Pick<FacetValue, 'id' | 'createdAt' | 'updatedAt' | 'name'> & { facet: ({ __typename?: 'Facet' } & Pick<Facet, 'id' | 'createdAt' | 'updatedAt' | 'name'>) }) })> }) });

export type UpdateProductOptionMutationVariables = {
  input: UpdateProductOptionInput
};


export type UpdateProductOptionMutation = ({ __typename?: 'Mutation' } & { updateProductOption: ({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'name'>) });

export type DeleteProductVariantMutationVariables = {
  id: Scalars['ID']
};


export type DeleteProductVariantMutation = ({ __typename?: 'Mutation' } & { deleteProductVariant: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type GetProductVariantOptionsQueryVariables = {
  id: Scalars['ID']
};


export type GetProductVariantOptionsQuery = ({ __typename?: 'Query' } & { product: Maybe<({ __typename?: 'Product' } & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'name'> & { optionGroups: Array<({ __typename?: 'ProductOptionGroup' } & Pick<ProductOptionGroup, 'id' | 'name' | 'code'> & { options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code'>)> })>, variants: Array<({ __typename?: 'ProductVariant' } & Pick<ProductVariant, 'id' | 'createdAt' | 'updatedAt' | 'enabled' | 'name' | 'sku' | 'price' | 'stockOnHand' | 'enabled'> & { options: Array<({ __typename?: 'ProductOption' } & Pick<ProductOption, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'code' | 'groupId'>)> })> })> });

export type AssignProductsToChannelMutationVariables = {
  input: AssignProductsToChannelInput
};


export type AssignProductsToChannelMutation = ({ __typename?: 'Mutation' } & { assignProductsToChannel: Array<({ __typename?: 'Product' } & Pick<Product, 'id'> & { channels: Array<({ __typename?: 'Channel' } & Pick<Channel, 'id' | 'code'>)> })> });

export type RemoveProductsFromChannelMutationVariables = {
  input: RemoveProductsFromChannelInput
};


export type RemoveProductsFromChannelMutation = ({ __typename?: 'Mutation' } & { removeProductsFromChannel: Array<({ __typename?: 'Product' } & Pick<Product, 'id'> & { channels: Array<({ __typename?: 'Channel' } & Pick<Channel, 'id' | 'code'>)> })> });

export type PromotionFragment = ({ __typename?: 'Promotion' } & Pick<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'enabled' | 'couponCode' | 'perCustomerUsageLimit' | 'startsAt' | 'endsAt'> & { conditions: Array<({ __typename?: 'ConfigurableOperation' } & ConfigurableOperationFragment)>, actions: Array<({ __typename?: 'ConfigurableOperation' } & ConfigurableOperationFragment)> });

export type GetPromotionListQueryVariables = {
  options?: Maybe<PromotionListOptions>
};


export type GetPromotionListQuery = ({ __typename?: 'Query' } & { promotions: ({ __typename?: 'PromotionList' } & Pick<PromotionList, 'totalItems'> & { items: Array<({ __typename?: 'Promotion' } & PromotionFragment)> }) });

export type GetPromotionQueryVariables = {
  id: Scalars['ID']
};


export type GetPromotionQuery = ({ __typename?: 'Query' } & { promotion: Maybe<({ __typename?: 'Promotion' } & PromotionFragment)> });

export type GetAdjustmentOperationsQueryVariables = {};


export type GetAdjustmentOperationsQuery = ({ __typename?: 'Query' } & { promotionConditions: Array<({ __typename?: 'ConfigurableOperationDefinition' } & ConfigurableOperationDefFragment)>, promotionActions: Array<({ __typename?: 'ConfigurableOperationDefinition' } & ConfigurableOperationDefFragment)> });

export type CreatePromotionMutationVariables = {
  input: CreatePromotionInput
};


export type CreatePromotionMutation = ({ __typename?: 'Mutation' } & { createPromotion: ({ __typename?: 'Promotion' } & PromotionFragment) });

export type UpdatePromotionMutationVariables = {
  input: UpdatePromotionInput
};


export type UpdatePromotionMutation = ({ __typename?: 'Mutation' } & { updatePromotion: ({ __typename?: 'Promotion' } & PromotionFragment) });

export type DeletePromotionMutationVariables = {
  id: Scalars['ID']
};


export type DeletePromotionMutation = ({ __typename?: 'Mutation' } & { deletePromotion: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type CountryFragment = ({ __typename?: 'Country' } & Pick<Country, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'name' | 'enabled'> & { translations: Array<({ __typename?: 'CountryTranslation' } & Pick<CountryTranslation, 'id' | 'languageCode' | 'name'>)> });

export type GetCountryListQueryVariables = {
  options?: Maybe<CountryListOptions>
};


export type GetCountryListQuery = ({ __typename?: 'Query' } & { countries: ({ __typename?: 'CountryList' } & Pick<CountryList, 'totalItems'> & { items: Array<({ __typename?: 'Country' } & Pick<Country, 'id' | 'code' | 'name' | 'enabled'>)> }) });

export type GetAvailableCountriesQueryVariables = {};


export type GetAvailableCountriesQuery = ({ __typename?: 'Query' } & { countries: ({ __typename?: 'CountryList' } & { items: Array<({ __typename?: 'Country' } & Pick<Country, 'id' | 'code' | 'name' | 'enabled'>)> }) });

export type GetCountryQueryVariables = {
  id: Scalars['ID']
};


export type GetCountryQuery = ({ __typename?: 'Query' } & { country: Maybe<({ __typename?: 'Country' } & CountryFragment)> });

export type CreateCountryMutationVariables = {
  input: CreateCountryInput
};


export type CreateCountryMutation = ({ __typename?: 'Mutation' } & { createCountry: ({ __typename?: 'Country' } & CountryFragment) });

export type UpdateCountryMutationVariables = {
  input: UpdateCountryInput
};


export type UpdateCountryMutation = ({ __typename?: 'Mutation' } & { updateCountry: ({ __typename?: 'Country' } & CountryFragment) });

export type DeleteCountryMutationVariables = {
  id: Scalars['ID']
};


export type DeleteCountryMutation = ({ __typename?: 'Mutation' } & { deleteCountry: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type ZoneFragment = ({ __typename?: 'Zone' } & Pick<Zone, 'id' | 'name'> & { members: Array<({ __typename?: 'Country' } & CountryFragment)> });

export type GetZonesQueryVariables = {};


export type GetZonesQuery = ({ __typename?: 'Query' } & { zones: Array<({ __typename?: 'Zone' } & Pick<Zone, 'id' | 'name'> & { members: Array<({ __typename?: 'Country' } & Pick<Country, 'id' | 'name' | 'code'>)> })> });

export type GetZoneQueryVariables = {
  id: Scalars['ID']
};


export type GetZoneQuery = ({ __typename?: 'Query' } & { zone: Maybe<({ __typename?: 'Zone' } & ZoneFragment)> });

export type CreateZoneMutationVariables = {
  input: CreateZoneInput
};


export type CreateZoneMutation = ({ __typename?: 'Mutation' } & { createZone: ({ __typename?: 'Zone' } & ZoneFragment) });

export type UpdateZoneMutationVariables = {
  input: UpdateZoneInput
};


export type UpdateZoneMutation = ({ __typename?: 'Mutation' } & { updateZone: ({ __typename?: 'Zone' } & ZoneFragment) });

export type AddMembersToZoneMutationVariables = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};


export type AddMembersToZoneMutation = ({ __typename?: 'Mutation' } & { addMembersToZone: ({ __typename?: 'Zone' } & ZoneFragment) });

export type RemoveMembersFromZoneMutationVariables = {
  zoneId: Scalars['ID'],
  memberIds: Array<Scalars['ID']>
};


export type RemoveMembersFromZoneMutation = ({ __typename?: 'Mutation' } & { removeMembersFromZone: ({ __typename?: 'Zone' } & ZoneFragment) });

export type TaxCategoryFragment = ({ __typename?: 'TaxCategory' } & Pick<TaxCategory, 'id' | 'createdAt' | 'updatedAt' | 'name'>);

export type GetTaxCategoriesQueryVariables = {};


export type GetTaxCategoriesQuery = ({ __typename?: 'Query' } & { taxCategories: Array<({ __typename?: 'TaxCategory' } & TaxCategoryFragment)> });

export type GetTaxCategoryQueryVariables = {
  id: Scalars['ID']
};


export type GetTaxCategoryQuery = ({ __typename?: 'Query' } & { taxCategory: Maybe<({ __typename?: 'TaxCategory' } & TaxCategoryFragment)> });

export type CreateTaxCategoryMutationVariables = {
  input: CreateTaxCategoryInput
};


export type CreateTaxCategoryMutation = ({ __typename?: 'Mutation' } & { createTaxCategory: ({ __typename?: 'TaxCategory' } & TaxCategoryFragment) });

export type UpdateTaxCategoryMutationVariables = {
  input: UpdateTaxCategoryInput
};


export type UpdateTaxCategoryMutation = ({ __typename?: 'Mutation' } & { updateTaxCategory: ({ __typename?: 'TaxCategory' } & TaxCategoryFragment) });

export type DeleteTaxCategoryMutationVariables = {
  id: Scalars['ID']
};


export type DeleteTaxCategoryMutation = ({ __typename?: 'Mutation' } & { deleteTaxCategory: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type TaxRateFragment = ({ __typename?: 'TaxRate' } & Pick<TaxRate, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'enabled' | 'value'> & { category: ({ __typename?: 'TaxCategory' } & Pick<TaxCategory, 'id' | 'name'>), zone: ({ __typename?: 'Zone' } & Pick<Zone, 'id' | 'name'>), customerGroup: Maybe<({ __typename?: 'CustomerGroup' } & Pick<CustomerGroup, 'id' | 'name'>)> });

export type GetTaxRateListQueryVariables = {
  options?: Maybe<TaxRateListOptions>
};


export type GetTaxRateListQuery = ({ __typename?: 'Query' } & { taxRates: ({ __typename?: 'TaxRateList' } & Pick<TaxRateList, 'totalItems'> & { items: Array<({ __typename?: 'TaxRate' } & TaxRateFragment)> }) });

export type GetTaxRateQueryVariables = {
  id: Scalars['ID']
};


export type GetTaxRateQuery = ({ __typename?: 'Query' } & { taxRate: Maybe<({ __typename?: 'TaxRate' } & TaxRateFragment)> });

export type CreateTaxRateMutationVariables = {
  input: CreateTaxRateInput
};


export type CreateTaxRateMutation = ({ __typename?: 'Mutation' } & { createTaxRate: ({ __typename?: 'TaxRate' } & TaxRateFragment) });

export type UpdateTaxRateMutationVariables = {
  input: UpdateTaxRateInput
};


export type UpdateTaxRateMutation = ({ __typename?: 'Mutation' } & { updateTaxRate: ({ __typename?: 'TaxRate' } & TaxRateFragment) });

export type DeleteTaxRateMutationVariables = {
  id: Scalars['ID']
};


export type DeleteTaxRateMutation = ({ __typename?: 'Mutation' } & { deleteTaxRate: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type ChannelFragment = ({ __typename?: 'Channel' } & Pick<Channel, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'token' | 'pricesIncludeTax' | 'currencyCode' | 'defaultLanguageCode'> & { defaultShippingZone: Maybe<({ __typename?: 'Zone' } & Pick<Zone, 'id' | 'name'>)>, defaultTaxZone: Maybe<({ __typename?: 'Zone' } & Pick<Zone, 'id' | 'name'>)> });

export type GetChannelsQueryVariables = {};


export type GetChannelsQuery = ({ __typename?: 'Query' } & { channels: Array<({ __typename?: 'Channel' } & ChannelFragment)> });

export type GetChannelQueryVariables = {
  id: Scalars['ID']
};


export type GetChannelQuery = ({ __typename?: 'Query' } & { channel: Maybe<({ __typename?: 'Channel' } & ChannelFragment)> });

export type GetActiveChannelQueryVariables = {};


export type GetActiveChannelQuery = ({ __typename?: 'Query' } & { activeChannel: ({ __typename?: 'Channel' } & ChannelFragment) });

export type CreateChannelMutationVariables = {
  input: CreateChannelInput
};


export type CreateChannelMutation = ({ __typename?: 'Mutation' } & { createChannel: ({ __typename?: 'Channel' } & ChannelFragment) });

export type UpdateChannelMutationVariables = {
  input: UpdateChannelInput
};


export type UpdateChannelMutation = ({ __typename?: 'Mutation' } & { updateChannel: ({ __typename?: 'Channel' } & ChannelFragment) });

export type DeleteChannelMutationVariables = {
  id: Scalars['ID']
};


export type DeleteChannelMutation = ({ __typename?: 'Mutation' } & { deleteChannel: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type PaymentMethodFragment = ({ __typename?: 'PaymentMethod' } & Pick<PaymentMethod, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'enabled'> & { configArgs: Array<({ __typename?: 'ConfigArg' } & Pick<ConfigArg, 'name' | 'type' | 'value'>)> });

export type GetPaymentMethodListQueryVariables = {
  options: PaymentMethodListOptions
};


export type GetPaymentMethodListQuery = ({ __typename?: 'Query' } & { paymentMethods: ({ __typename?: 'PaymentMethodList' } & Pick<PaymentMethodList, 'totalItems'> & { items: Array<({ __typename?: 'PaymentMethod' } & PaymentMethodFragment)> }) });

export type GetPaymentMethodQueryVariables = {
  id: Scalars['ID']
};


export type GetPaymentMethodQuery = ({ __typename?: 'Query' } & { paymentMethod: Maybe<({ __typename?: 'PaymentMethod' } & PaymentMethodFragment)> });

export type UpdatePaymentMethodMutationVariables = {
  input: UpdatePaymentMethodInput
};


export type UpdatePaymentMethodMutation = ({ __typename?: 'Mutation' } & { updatePaymentMethod: ({ __typename?: 'PaymentMethod' } & PaymentMethodFragment) });

export type GlobalSettingsFragment = ({ __typename?: 'GlobalSettings' } & Pick<GlobalSettings, 'availableLanguages' | 'trackInventory'>);

export type GetGlobalSettingsQueryVariables = {};


export type GetGlobalSettingsQuery = ({ __typename?: 'Query' } & { globalSettings: ({ __typename?: 'GlobalSettings' } & GlobalSettingsFragment) });

export type UpdateGlobalSettingsMutationVariables = {
  input: UpdateGlobalSettingsInput
};


export type UpdateGlobalSettingsMutation = ({ __typename?: 'Mutation' } & { updateGlobalSettings: ({ __typename?: 'GlobalSettings' } & GlobalSettingsFragment) });

export type CustomFieldConfigFragment = ({ __typename?: 'StringCustomFieldConfig' | 'LocaleStringCustomFieldConfig' | 'IntCustomFieldConfig' | 'FloatCustomFieldConfig' | 'BooleanCustomFieldConfig' | 'DateTimeCustomFieldConfig' } & Pick<CustomField, 'name' | 'type' | 'readonly'> & { description: Maybe<Array<({ __typename?: 'LocalizedString' } & Pick<LocalizedString, 'languageCode' | 'value'>)>>, label: Maybe<Array<({ __typename?: 'LocalizedString' } & Pick<LocalizedString, 'languageCode' | 'value'>)>> });

export type StringCustomFieldFragment = ({ __typename?: 'StringCustomFieldConfig' } & Pick<StringCustomFieldConfig, 'pattern'> & { options: Maybe<Array<({ __typename?: 'StringFieldOption' } & Pick<StringFieldOption, 'value'> & { label: Maybe<Array<({ __typename?: 'LocalizedString' } & Pick<LocalizedString, 'languageCode' | 'value'>)>> })>> } & CustomFieldConfigFragment);

export type LocaleStringCustomFieldFragment = ({ __typename?: 'LocaleStringCustomFieldConfig' } & Pick<LocaleStringCustomFieldConfig, 'pattern'> & CustomFieldConfigFragment);

export type BooleanCustomFieldFragment = ({ __typename?: 'BooleanCustomFieldConfig' } & CustomFieldConfigFragment);

export type IntCustomFieldFragment = ({ __typename?: 'IntCustomFieldConfig' } & { intMin: IntCustomFieldConfig['min'], intMax: IntCustomFieldConfig['max'], intStep: IntCustomFieldConfig['step'] } & CustomFieldConfigFragment);

export type FloatCustomFieldFragment = ({ __typename?: 'FloatCustomFieldConfig' } & { floatMin: FloatCustomFieldConfig['min'], floatMax: FloatCustomFieldConfig['max'], floatStep: FloatCustomFieldConfig['step'] } & CustomFieldConfigFragment);

export type DateTimeCustomFieldFragment = ({ __typename?: 'DateTimeCustomFieldConfig' } & { datetimeMin: DateTimeCustomFieldConfig['min'], datetimeMax: DateTimeCustomFieldConfig['max'], datetimeStep: DateTimeCustomFieldConfig['step'] } & CustomFieldConfigFragment);

export type CustomFieldsFragment = ({ __typename?: 'StringCustomFieldConfig' | 'LocaleStringCustomFieldConfig' | 'IntCustomFieldConfig' | 'FloatCustomFieldConfig' | 'BooleanCustomFieldConfig' | 'DateTimeCustomFieldConfig' } & (({ __typename?: 'StringCustomFieldConfig' } & StringCustomFieldFragment) | ({ __typename?: 'LocaleStringCustomFieldConfig' } & LocaleStringCustomFieldFragment) | ({ __typename?: 'BooleanCustomFieldConfig' } & BooleanCustomFieldFragment) | ({ __typename?: 'IntCustomFieldConfig' } & IntCustomFieldFragment) | ({ __typename?: 'FloatCustomFieldConfig' } & FloatCustomFieldFragment) | ({ __typename?: 'DateTimeCustomFieldConfig' } & DateTimeCustomFieldFragment)));

export type GetServerConfigQueryVariables = {};


export type GetServerConfigQuery = ({ __typename?: 'Query' } & { globalSettings: ({ __typename?: 'GlobalSettings' } & { serverConfig: ({ __typename?: 'ServerConfig' } & { customFieldConfig: ({ __typename?: 'CustomFields' } & { Address: Array<CustomFieldsFragment>, Collection: Array<CustomFieldsFragment>, Customer: Array<CustomFieldsFragment>, Facet: Array<CustomFieldsFragment>, FacetValue: Array<CustomFieldsFragment>, GlobalSettings: Array<CustomFieldsFragment>, Order: Array<CustomFieldsFragment>, OrderLine: Array<CustomFieldsFragment>, Product: Array<CustomFieldsFragment>, ProductOption: Array<CustomFieldsFragment>, ProductOptionGroup: Array<CustomFieldsFragment>, ProductVariant: Array<CustomFieldsFragment>, User: Array<CustomFieldsFragment> }) }) }) });

export type JobInfoFragment = ({ __typename?: 'JobInfo' } & Pick<JobInfo, 'id' | 'name' | 'state' | 'progress' | 'duration' | 'result'>);

export type GetJobInfoQueryVariables = {
  id: Scalars['String']
};


export type GetJobInfoQuery = ({ __typename?: 'Query' } & { job: Maybe<({ __typename?: 'JobInfo' } & JobInfoFragment)> });

export type GetAllJobsQueryVariables = {
  input?: Maybe<JobListInput>
};


export type GetAllJobsQuery = ({ __typename?: 'Query' } & { jobs: Array<({ __typename?: 'JobInfo' } & JobInfoFragment)> });

export type ReindexMutationVariables = {};


export type ReindexMutation = ({ __typename?: 'Mutation' } & { reindex: ({ __typename?: 'JobInfo' } & JobInfoFragment) });

export type SearchForTestOrderQueryVariables = {
  term: Scalars['String'],
  take: Scalars['Int']
};


export type SearchForTestOrderQuery = ({ __typename?: 'Query' } & { search: ({ __typename?: 'SearchResponse' } & { items: Array<({ __typename?: 'SearchResult' } & Pick<SearchResult, 'productVariantId' | 'productVariantName' | 'productPreview' | 'sku'> & { price: ({ __typename?: 'SinglePrice' } & Pick<SinglePrice, 'value'>), priceWithTax: ({ __typename?: 'SinglePrice' } & Pick<SinglePrice, 'value'>) })> }) });

export type ConfigurableOperationFragment = ({ __typename?: 'ConfigurableOperation' } & Pick<ConfigurableOperation, 'code'> & { args: Array<({ __typename?: 'ConfigArg' } & Pick<ConfigArg, 'name' | 'type' | 'value'>)> });

export type ConfigurableOperationDefFragment = ({ __typename?: 'ConfigurableOperationDefinition' } & Pick<ConfigurableOperationDefinition, 'code' | 'description'> & { args: Array<({ __typename?: 'ConfigArgDefinition' } & Pick<ConfigArgDefinition, 'name' | 'type' | 'config'>)> });

export type ShippingMethodFragment = ({ __typename?: 'ShippingMethod' } & Pick<ShippingMethod, 'id' | 'createdAt' | 'updatedAt' | 'code' | 'description'> & { checker: ({ __typename?: 'ConfigurableOperation' } & ConfigurableOperationFragment), calculator: ({ __typename?: 'ConfigurableOperation' } & ConfigurableOperationFragment) });

export type GetShippingMethodListQueryVariables = {
  options?: Maybe<ShippingMethodListOptions>
};


export type GetShippingMethodListQuery = ({ __typename?: 'Query' } & { shippingMethods: ({ __typename?: 'ShippingMethodList' } & Pick<ShippingMethodList, 'totalItems'> & { items: Array<({ __typename?: 'ShippingMethod' } & ShippingMethodFragment)> }) });

export type GetShippingMethodQueryVariables = {
  id: Scalars['ID']
};


export type GetShippingMethodQuery = ({ __typename?: 'Query' } & { shippingMethod: Maybe<({ __typename?: 'ShippingMethod' } & ShippingMethodFragment)> });

export type GetShippingMethodOperationsQueryVariables = {};


export type GetShippingMethodOperationsQuery = ({ __typename?: 'Query' } & { shippingEligibilityCheckers: Array<({ __typename?: 'ConfigurableOperationDefinition' } & ConfigurableOperationDefFragment)>, shippingCalculators: Array<({ __typename?: 'ConfigurableOperationDefinition' } & ConfigurableOperationDefFragment)> });

export type CreateShippingMethodMutationVariables = {
  input: CreateShippingMethodInput
};


export type CreateShippingMethodMutation = ({ __typename?: 'Mutation' } & { createShippingMethod: ({ __typename?: 'ShippingMethod' } & ShippingMethodFragment) });

export type UpdateShippingMethodMutationVariables = {
  input: UpdateShippingMethodInput
};


export type UpdateShippingMethodMutation = ({ __typename?: 'Mutation' } & { updateShippingMethod: ({ __typename?: 'ShippingMethod' } & ShippingMethodFragment) });

export type DeleteShippingMethodMutationVariables = {
  id: Scalars['ID']
};


export type DeleteShippingMethodMutation = ({ __typename?: 'Mutation' } & { deleteShippingMethod: ({ __typename?: 'DeletionResponse' } & Pick<DeletionResponse, 'result' | 'message'>) });

export type TestShippingMethodQueryVariables = {
  input: TestShippingMethodInput
};


export type TestShippingMethodQuery = ({ __typename?: 'Query' } & { testShippingMethod: ({ __typename?: 'TestShippingMethodResult' } & Pick<TestShippingMethodResult, 'eligible'> & { quote: Maybe<({ __typename?: 'TestShippingMethodQuote' } & Pick<TestShippingMethodQuote, 'price' | 'priceWithTax' | 'metadata'>)> }) });

export type TestEligibleShippingMethodsQueryVariables = {
  input: TestEligibleShippingMethodsInput
};


export type TestEligibleShippingMethodsQuery = ({ __typename?: 'Query' } & { testEligibleShippingMethods: Array<({ __typename?: 'ShippingMethodQuote' } & Pick<ShippingMethodQuote, 'id' | 'description' | 'price' | 'priceWithTax' | 'metadata'>)> });
type DiscriminateUnion<T, U> = T extends U ? T : never;

type RequireField<T, TNames extends string> = T & { [P in TNames]: (T & { [name: string]: never })[P] };

export namespace Role {
  export type Fragment = RoleFragment;
  export type Channels = (NonNullable<RoleFragment['channels'][0]>);
}

export namespace Administrator {
  export type Fragment = AdministratorFragment;
  export type User = AdministratorFragment['user'];
  export type Roles = RoleFragment;
}

export namespace GetAdministrators {
  export type Variables = GetAdministratorsQueryVariables;
  export type Query = GetAdministratorsQuery;
  export type Administrators = GetAdministratorsQuery['administrators'];
  export type Items = AdministratorFragment;
}

export namespace GetAdministrator {
  export type Variables = GetAdministratorQueryVariables;
  export type Query = GetAdministratorQuery;
  export type Administrator = AdministratorFragment;
}

export namespace CreateAdministrator {
  export type Variables = CreateAdministratorMutationVariables;
  export type Mutation = CreateAdministratorMutation;
  export type CreateAdministrator = AdministratorFragment;
}

export namespace UpdateAdministrator {
  export type Variables = UpdateAdministratorMutationVariables;
  export type Mutation = UpdateAdministratorMutation;
  export type UpdateAdministrator = AdministratorFragment;
}

export namespace GetRoles {
  export type Variables = GetRolesQueryVariables;
  export type Query = GetRolesQuery;
  export type Roles = GetRolesQuery['roles'];
  export type Items = RoleFragment;
}

export namespace GetRole {
  export type Variables = GetRoleQueryVariables;
  export type Query = GetRoleQuery;
  export type Role = RoleFragment;
}

export namespace CreateRole {
  export type Variables = CreateRoleMutationVariables;
  export type Mutation = CreateRoleMutation;
  export type CreateRole = RoleFragment;
}

export namespace UpdateRole {
  export type Variables = UpdateRoleMutationVariables;
  export type Mutation = UpdateRoleMutation;
  export type UpdateRole = RoleFragment;
}

export namespace DeleteRole {
  export type Variables = DeleteRoleMutationVariables;
  export type Mutation = DeleteRoleMutation;
  export type DeleteRole = DeleteRoleMutation['deleteRole'];
}

export namespace AssignRoleToAdministrator {
  export type Variables = AssignRoleToAdministratorMutationVariables;
  export type Mutation = AssignRoleToAdministratorMutation;
  export type AssignRoleToAdministrator = AdministratorFragment;
}

export namespace CurrentUser {
  export type Fragment = CurrentUserFragment;
  export type Channels = (NonNullable<CurrentUserFragment['channels'][0]>);
}

export namespace AttemptLogin {
  export type Variables = AttemptLoginMutationVariables;
  export type Mutation = AttemptLoginMutation;
  export type Login = AttemptLoginMutation['login'];
  export type User = CurrentUserFragment;
}

export namespace LogOut {
  export type Variables = LogOutMutationVariables;
  export type Mutation = LogOutMutation;
}

export namespace GetCurrentUser {
  export type Variables = GetCurrentUserQueryVariables;
  export type Query = GetCurrentUserQuery;
  export type Me = CurrentUserFragment;
}

export namespace RequestStarted {
  export type Variables = RequestStartedMutationVariables;
  export type Mutation = RequestStartedMutation;
}

export namespace RequestCompleted {
  export type Variables = RequestCompletedMutationVariables;
  export type Mutation = RequestCompletedMutation;
}

export namespace UserStatus {
  export type Fragment = UserStatusFragment;
  export type Channels = (NonNullable<UserStatusFragment['channels'][0]>);
}

export namespace SetAsLoggedIn {
  export type Variables = SetAsLoggedInMutationVariables;
  export type Mutation = SetAsLoggedInMutation;
  export type SetAsLoggedIn = UserStatusFragment;
}

export namespace SetAsLoggedOut {
  export type Variables = SetAsLoggedOutMutationVariables;
  export type Mutation = SetAsLoggedOutMutation;
  export type SetAsLoggedOut = UserStatusFragment;
}

export namespace SetUiLanguage {
  export type Variables = SetUiLanguageMutationVariables;
  export type Mutation = SetUiLanguageMutation;
}

export namespace GetNetworkStatus {
  export type Variables = GetNetworkStatusQueryVariables;
  export type Query = GetNetworkStatusQuery;
  export type NetworkStatus = GetNetworkStatusQuery['networkStatus'];
}

export namespace GetUserStatus {
  export type Variables = GetUserStatusQueryVariables;
  export type Query = GetUserStatusQuery;
  export type UserStatus = UserStatusFragment;
}

export namespace GetUiState {
  export type Variables = GetUiStateQueryVariables;
  export type Query = GetUiStateQuery;
  export type UiState = GetUiStateQuery['uiState'];
}

export namespace SetActiveChannel {
  export type Variables = SetActiveChannelMutationVariables;
  export type Mutation = SetActiveChannelMutation;
  export type SetActiveChannel = UserStatusFragment;
}

export namespace UpdateUserChannels {
  export type Variables = UpdateUserChannelsMutationVariables;
  export type Mutation = UpdateUserChannelsMutation;
  export type UpdateUserChannels = UserStatusFragment;
}

export namespace GetCollectionFilters {
  export type Variables = GetCollectionFiltersQueryVariables;
  export type Query = GetCollectionFiltersQuery;
  export type CollectionFilters = ConfigurableOperationDefFragment;
}

export namespace Collection {
  export type Fragment = CollectionFragment;
  export type FeaturedAsset = AssetFragment;
  export type Assets = AssetFragment;
  export type Filters = ConfigurableOperationFragment;
  export type Translations = (NonNullable<CollectionFragment['translations'][0]>);
  export type Parent = (NonNullable<CollectionFragment['parent']>);
  export type Children = (NonNullable<(NonNullable<CollectionFragment['children']>)[0]>);
}

export namespace GetCollectionList {
  export type Variables = GetCollectionListQueryVariables;
  export type Query = GetCollectionListQuery;
  export type Collections = GetCollectionListQuery['collections'];
  export type Items = (NonNullable<GetCollectionListQuery['collections']['items'][0]>);
  export type FeaturedAsset = AssetFragment;
  export type Parent = (NonNullable<(NonNullable<GetCollectionListQuery['collections']['items'][0]>)['parent']>);
}

export namespace GetCollection {
  export type Variables = GetCollectionQueryVariables;
  export type Query = GetCollectionQuery;
  export type Collection = CollectionFragment;
}

export namespace CreateCollection {
  export type Variables = CreateCollectionMutationVariables;
  export type Mutation = CreateCollectionMutation;
  export type CreateCollection = CollectionFragment;
}

export namespace UpdateCollection {
  export type Variables = UpdateCollectionMutationVariables;
  export type Mutation = UpdateCollectionMutation;
  export type UpdateCollection = CollectionFragment;
}

export namespace MoveCollection {
  export type Variables = MoveCollectionMutationVariables;
  export type Mutation = MoveCollectionMutation;
  export type MoveCollection = CollectionFragment;
}

export namespace DeleteCollection {
  export type Variables = DeleteCollectionMutationVariables;
  export type Mutation = DeleteCollectionMutation;
  export type DeleteCollection = DeleteCollectionMutation['deleteCollection'];
}

export namespace GetCollectionContents {
  export type Variables = GetCollectionContentsQueryVariables;
  export type Query = GetCollectionContentsQuery;
  export type Collection = (NonNullable<GetCollectionContentsQuery['collection']>);
  export type ProductVariants = (NonNullable<GetCollectionContentsQuery['collection']>)['productVariants'];
  export type Items = (NonNullable<(NonNullable<GetCollectionContentsQuery['collection']>)['productVariants']['items'][0]>);
}

export namespace Address {
  export type Fragment = AddressFragment;
  export type Country = AddressFragment['country'];
}

export namespace Customer {
  export type Fragment = CustomerFragment;
  export type User = (NonNullable<CustomerFragment['user']>);
  export type Addresses = AddressFragment;
}

export namespace GetCustomerList {
  export type Variables = GetCustomerListQueryVariables;
  export type Query = GetCustomerListQuery;
  export type Customers = GetCustomerListQuery['customers'];
  export type Items = (NonNullable<GetCustomerListQuery['customers']['items'][0]>);
  export type User = (NonNullable<(NonNullable<GetCustomerListQuery['customers']['items'][0]>)['user']>);
}

export namespace GetCustomer {
  export type Variables = GetCustomerQueryVariables;
  export type Query = GetCustomerQuery;
  export type Customer = CustomerFragment;
  export type Orders = (NonNullable<GetCustomerQuery['customer']>)['orders'];
  export type Items = (NonNullable<(NonNullable<GetCustomerQuery['customer']>)['orders']['items'][0]>);
}

export namespace CreateCustomer {
  export type Variables = CreateCustomerMutationVariables;
  export type Mutation = CreateCustomerMutation;
  export type CreateCustomer = CustomerFragment;
}

export namespace UpdateCustomer {
  export type Variables = UpdateCustomerMutationVariables;
  export type Mutation = UpdateCustomerMutation;
  export type UpdateCustomer = CustomerFragment;
}

export namespace CreateCustomerAddress {
  export type Variables = CreateCustomerAddressMutationVariables;
  export type Mutation = CreateCustomerAddressMutation;
  export type CreateCustomerAddress = AddressFragment;
}

export namespace UpdateCustomerAddress {
  export type Variables = UpdateCustomerAddressMutationVariables;
  export type Mutation = UpdateCustomerAddressMutation;
  export type UpdateCustomerAddress = AddressFragment;
}

export namespace FacetValue {
  export type Fragment = FacetValueFragment;
  export type Translations = (NonNullable<FacetValueFragment['translations'][0]>);
  export type Facet = FacetValueFragment['facet'];
}

export namespace FacetWithValues {
  export type Fragment = FacetWithValuesFragment;
  export type Translations = (NonNullable<FacetWithValuesFragment['translations'][0]>);
  export type Values = FacetValueFragment;
}

export namespace CreateFacet {
  export type Variables = CreateFacetMutationVariables;
  export type Mutation = CreateFacetMutation;
  export type CreateFacet = FacetWithValuesFragment;
}

export namespace UpdateFacet {
  export type Variables = UpdateFacetMutationVariables;
  export type Mutation = UpdateFacetMutation;
  export type UpdateFacet = FacetWithValuesFragment;
}

export namespace DeleteFacet {
  export type Variables = DeleteFacetMutationVariables;
  export type Mutation = DeleteFacetMutation;
  export type DeleteFacet = DeleteFacetMutation['deleteFacet'];
}

export namespace CreateFacetValues {
  export type Variables = CreateFacetValuesMutationVariables;
  export type Mutation = CreateFacetValuesMutation;
  export type CreateFacetValues = FacetValueFragment;
}

export namespace UpdateFacetValues {
  export type Variables = UpdateFacetValuesMutationVariables;
  export type Mutation = UpdateFacetValuesMutation;
  export type UpdateFacetValues = FacetValueFragment;
}

export namespace DeleteFacetValues {
  export type Variables = DeleteFacetValuesMutationVariables;
  export type Mutation = DeleteFacetValuesMutation;
  export type DeleteFacetValues = (NonNullable<DeleteFacetValuesMutation['deleteFacetValues'][0]>);
}

export namespace GetFacetList {
  export type Variables = GetFacetListQueryVariables;
  export type Query = GetFacetListQuery;
  export type Facets = GetFacetListQuery['facets'];
  export type Items = FacetWithValuesFragment;
}

export namespace GetFacetWithValues {
  export type Variables = GetFacetWithValuesQueryVariables;
  export type Query = GetFacetWithValuesQuery;
  export type Facet = FacetWithValuesFragment;
}

export namespace Adjustment {
  export type Fragment = AdjustmentFragment;
}

export namespace Refund {
  export type Fragment = RefundFragment;
}

export namespace ShippingAddress {
  export type Fragment = ShippingAddressFragment;
}

export namespace Order {
  export type Fragment = OrderFragment;
  export type Customer = (NonNullable<OrderFragment['customer']>);
}

export namespace Fulfillment {
  export type Fragment = FulfillmentFragment;
}

export namespace OrderLine {
  export type Fragment = OrderLineFragment;
  export type FeaturedAsset = (NonNullable<OrderLineFragment['featuredAsset']>);
  export type ProductVariant = OrderLineFragment['productVariant'];
  export type Adjustments = AdjustmentFragment;
  export type Items = (NonNullable<OrderLineFragment['items'][0]>);
  export type Fulfillment = FulfillmentFragment;
}

export namespace OrderDetail {
  export type Fragment = OrderDetailFragment;
  export type Customer = (NonNullable<OrderDetailFragment['customer']>);
  export type Lines = OrderLineFragment;
  export type Adjustments = AdjustmentFragment;
  export type Promotions = (NonNullable<OrderDetailFragment['promotions'][0]>);
  export type ShippingMethod = (NonNullable<OrderDetailFragment['shippingMethod']>);
  export type ShippingAddress = ShippingAddressFragment;
  export type Payments = (NonNullable<(NonNullable<OrderDetailFragment['payments']>)[0]>);
  export type Refunds = (NonNullable<(NonNullable<(NonNullable<OrderDetailFragment['payments']>)[0]>)['refunds'][0]>);
  export type OrderItems = (NonNullable<(NonNullable<(NonNullable<(NonNullable<OrderDetailFragment['payments']>)[0]>)['refunds'][0]>)['orderItems'][0]>);
  export type Fulfillments = FulfillmentFragment;
}

export namespace GetOrderList {
  export type Variables = GetOrderListQueryVariables;
  export type Query = GetOrderListQuery;
  export type Orders = GetOrderListQuery['orders'];
  export type Items = OrderFragment;
}

export namespace GetOrder {
  export type Variables = GetOrderQueryVariables;
  export type Query = GetOrderQuery;
  export type Order = OrderDetailFragment;
}

export namespace SettlePayment {
  export type Variables = SettlePaymentMutationVariables;
  export type Mutation = SettlePaymentMutation;
  export type SettlePayment = SettlePaymentMutation['settlePayment'];
}

export namespace CreateFulfillment {
  export type Variables = CreateFulfillmentMutationVariables;
  export type Mutation = CreateFulfillmentMutation;
  export type FulfillOrder = FulfillmentFragment;
}

export namespace CancelOrder {
  export type Variables = CancelOrderMutationVariables;
  export type Mutation = CancelOrderMutation;
  export type CancelOrder = OrderDetailFragment;
}

export namespace RefundOrder {
  export type Variables = RefundOrderMutationVariables;
  export type Mutation = RefundOrderMutation;
  export type RefundOrder = RefundFragment;
}

export namespace SettleRefund {
  export type Variables = SettleRefundMutationVariables;
  export type Mutation = SettleRefundMutation;
  export type SettleRefund = RefundFragment;
}

export namespace GetOrderHistory {
  export type Variables = GetOrderHistoryQueryVariables;
  export type Query = GetOrderHistoryQuery;
  export type Order = (NonNullable<GetOrderHistoryQuery['order']>);
  export type History = (NonNullable<GetOrderHistoryQuery['order']>)['history'];
  export type Items = (NonNullable<(NonNullable<GetOrderHistoryQuery['order']>)['history']['items'][0]>);
  export type Administrator = (NonNullable<(NonNullable<(NonNullable<GetOrderHistoryQuery['order']>)['history']['items'][0]>)['administrator']>);
}

export namespace AddNoteToOrder {
  export type Variables = AddNoteToOrderMutationVariables;
  export type Mutation = AddNoteToOrderMutation;
  export type AddNoteToOrder = AddNoteToOrderMutation['addNoteToOrder'];
}

export namespace Asset {
  export type Fragment = AssetFragment;
  export type FocalPoint = (NonNullable<AssetFragment['focalPoint']>);
}

export namespace ProductVariant {
  export type Fragment = ProductVariantFragment;
  export type TaxRateApplied = ProductVariantFragment['taxRateApplied'];
  export type TaxCategory = ProductVariantFragment['taxCategory'];
  export type Options = (NonNullable<ProductVariantFragment['options'][0]>);
  export type Translations = (NonNullable<(NonNullable<ProductVariantFragment['options'][0]>)['translations'][0]>);
  export type FacetValues = (NonNullable<ProductVariantFragment['facetValues'][0]>);
  export type Facet = (NonNullable<ProductVariantFragment['facetValues'][0]>)['facet'];
  export type FeaturedAsset = AssetFragment;
  export type Assets = AssetFragment;
  export type _Translations = (NonNullable<ProductVariantFragment['translations'][0]>);
}

export namespace ProductWithVariants {
  export type Fragment = ProductWithVariantsFragment;
  export type FeaturedAsset = AssetFragment;
  export type Assets = AssetFragment;
  export type Translations = (NonNullable<ProductWithVariantsFragment['translations'][0]>);
  export type OptionGroups = (NonNullable<ProductWithVariantsFragment['optionGroups'][0]>);
  export type Variants = ProductVariantFragment;
  export type FacetValues = (NonNullable<ProductWithVariantsFragment['facetValues'][0]>);
  export type Facet = (NonNullable<ProductWithVariantsFragment['facetValues'][0]>)['facet'];
  export type Channels = (NonNullable<ProductWithVariantsFragment['channels'][0]>);
}

export namespace ProductOptionGroup {
  export type Fragment = ProductOptionGroupFragment;
  export type Translations = (NonNullable<ProductOptionGroupFragment['translations'][0]>);
  export type Options = (NonNullable<ProductOptionGroupFragment['options'][0]>);
  export type _Translations = (NonNullable<(NonNullable<ProductOptionGroupFragment['options'][0]>)['translations'][0]>);
}

export namespace UpdateProduct {
  export type Variables = UpdateProductMutationVariables;
  export type Mutation = UpdateProductMutation;
  export type UpdateProduct = ProductWithVariantsFragment;
}

export namespace CreateProduct {
  export type Variables = CreateProductMutationVariables;
  export type Mutation = CreateProductMutation;
  export type CreateProduct = ProductWithVariantsFragment;
}

export namespace DeleteProduct {
  export type Variables = DeleteProductMutationVariables;
  export type Mutation = DeleteProductMutation;
  export type DeleteProduct = DeleteProductMutation['deleteProduct'];
}

export namespace CreateProductVariants {
  export type Variables = CreateProductVariantsMutationVariables;
  export type Mutation = CreateProductVariantsMutation;
  export type CreateProductVariants = ProductVariantFragment;
}

export namespace UpdateProductVariants {
  export type Variables = UpdateProductVariantsMutationVariables;
  export type Mutation = UpdateProductVariantsMutation;
  export type UpdateProductVariants = ProductVariantFragment;
}

export namespace CreateProductOptionGroup {
  export type Variables = CreateProductOptionGroupMutationVariables;
  export type Mutation = CreateProductOptionGroupMutation;
  export type CreateProductOptionGroup = ProductOptionGroupFragment;
}

export namespace GetProductOptionGroup {
  export type Variables = GetProductOptionGroupQueryVariables;
  export type Query = GetProductOptionGroupQuery;
  export type ProductOptionGroup = ProductOptionGroupFragment;
}

export namespace AddOptionToGroup {
  export type Variables = AddOptionToGroupMutationVariables;
  export type Mutation = AddOptionToGroupMutation;
  export type CreateProductOption = AddOptionToGroupMutation['createProductOption'];
}

export namespace AddOptionGroupToProduct {
  export type Variables = AddOptionGroupToProductMutationVariables;
  export type Mutation = AddOptionGroupToProductMutation;
  export type AddOptionGroupToProduct = AddOptionGroupToProductMutation['addOptionGroupToProduct'];
  export type OptionGroups = (NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']['optionGroups'][0]>);
  export type Options = (NonNullable<(NonNullable<AddOptionGroupToProductMutation['addOptionGroupToProduct']['optionGroups'][0]>)['options'][0]>);
}

export namespace RemoveOptionGroupFromProduct {
  export type Variables = RemoveOptionGroupFromProductMutationVariables;
  export type Mutation = RemoveOptionGroupFromProductMutation;
  export type RemoveOptionGroupFromProduct = RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct'];
  export type OptionGroups = (NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']['optionGroups'][0]>);
  export type Options = (NonNullable<(NonNullable<RemoveOptionGroupFromProductMutation['removeOptionGroupFromProduct']['optionGroups'][0]>)['options'][0]>);
}

export namespace GetProductWithVariants {
  export type Variables = GetProductWithVariantsQueryVariables;
  export type Query = GetProductWithVariantsQuery;
  export type Product = ProductWithVariantsFragment;
}

export namespace GetProductList {
  export type Variables = GetProductListQueryVariables;
  export type Query = GetProductListQuery;
  export type Products = GetProductListQuery['products'];
  export type Items = (NonNullable<GetProductListQuery['products']['items'][0]>);
  export type FeaturedAsset = (NonNullable<(NonNullable<GetProductListQuery['products']['items'][0]>)['featuredAsset']>);
}

export namespace GetProductOptionGroups {
  export type Variables = GetProductOptionGroupsQueryVariables;
  export type Query = GetProductOptionGroupsQuery;
  export type ProductOptionGroups = (NonNullable<GetProductOptionGroupsQuery['productOptionGroups'][0]>);
  export type Options = (NonNullable<(NonNullable<GetProductOptionGroupsQuery['productOptionGroups'][0]>)['options'][0]>);
}

export namespace GetAssetList {
  export type Variables = GetAssetListQueryVariables;
  export type Query = GetAssetListQuery;
  export type Assets = GetAssetListQuery['assets'];
  export type Items = AssetFragment;
}

export namespace GetAsset {
  export type Variables = GetAssetQueryVariables;
  export type Query = GetAssetQuery;
  export type Asset = AssetFragment;
}

export namespace CreateAssets {
  export type Variables = CreateAssetsMutationVariables;
  export type Mutation = CreateAssetsMutation;
  export type CreateAssets = AssetFragment;
}

export namespace UpdateAsset {
  export type Variables = UpdateAssetMutationVariables;
  export type Mutation = UpdateAssetMutation;
  export type UpdateAsset = AssetFragment;
}

export namespace SearchProducts {
  export type Variables = SearchProductsQueryVariables;
  export type Query = SearchProductsQuery;
  export type Search = SearchProductsQuery['search'];
  export type Items = (NonNullable<SearchProductsQuery['search']['items'][0]>);
  export type ProductAsset = (NonNullable<(NonNullable<SearchProductsQuery['search']['items'][0]>)['productAsset']>);
  export type FocalPoint = (NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']['items'][0]>)['productAsset']>)['focalPoint']>);
  export type ProductVariantAsset = (NonNullable<(NonNullable<SearchProductsQuery['search']['items'][0]>)['productVariantAsset']>);
  export type _FocalPoint = (NonNullable<(NonNullable<(NonNullable<SearchProductsQuery['search']['items'][0]>)['productVariantAsset']>)['focalPoint']>);
  export type FacetValues = (NonNullable<SearchProductsQuery['search']['facetValues'][0]>);
  export type FacetValue = (NonNullable<SearchProductsQuery['search']['facetValues'][0]>)['facetValue'];
  export type Facet = (NonNullable<SearchProductsQuery['search']['facetValues'][0]>)['facetValue']['facet'];
}

export namespace UpdateProductOption {
  export type Variables = UpdateProductOptionMutationVariables;
  export type Mutation = UpdateProductOptionMutation;
  export type UpdateProductOption = UpdateProductOptionMutation['updateProductOption'];
}

export namespace DeleteProductVariant {
  export type Variables = DeleteProductVariantMutationVariables;
  export type Mutation = DeleteProductVariantMutation;
  export type DeleteProductVariant = DeleteProductVariantMutation['deleteProductVariant'];
}

export namespace GetProductVariantOptions {
  export type Variables = GetProductVariantOptionsQueryVariables;
  export type Query = GetProductVariantOptionsQuery;
  export type Product = (NonNullable<GetProductVariantOptionsQuery['product']>);
  export type OptionGroups = (NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['optionGroups'][0]>);
  export type Options = (NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['optionGroups'][0]>)['options'][0]>);
  export type Variants = (NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['variants'][0]>);
  export type _Options = (NonNullable<(NonNullable<(NonNullable<GetProductVariantOptionsQuery['product']>)['variants'][0]>)['options'][0]>);
}

export namespace AssignProductsToChannel {
  export type Variables = AssignProductsToChannelMutationVariables;
  export type Mutation = AssignProductsToChannelMutation;
  export type AssignProductsToChannel = (NonNullable<AssignProductsToChannelMutation['assignProductsToChannel'][0]>);
  export type Channels = (NonNullable<(NonNullable<AssignProductsToChannelMutation['assignProductsToChannel'][0]>)['channels'][0]>);
}

export namespace RemoveProductsFromChannel {
  export type Variables = RemoveProductsFromChannelMutationVariables;
  export type Mutation = RemoveProductsFromChannelMutation;
  export type RemoveProductsFromChannel = (NonNullable<RemoveProductsFromChannelMutation['removeProductsFromChannel'][0]>);
  export type Channels = (NonNullable<(NonNullable<RemoveProductsFromChannelMutation['removeProductsFromChannel'][0]>)['channels'][0]>);
}

export namespace Promotion {
  export type Fragment = PromotionFragment;
  export type Conditions = ConfigurableOperationFragment;
  export type Actions = ConfigurableOperationFragment;
}

export namespace GetPromotionList {
  export type Variables = GetPromotionListQueryVariables;
  export type Query = GetPromotionListQuery;
  export type Promotions = GetPromotionListQuery['promotions'];
  export type Items = PromotionFragment;
}

export namespace GetPromotion {
  export type Variables = GetPromotionQueryVariables;
  export type Query = GetPromotionQuery;
  export type Promotion = PromotionFragment;
}

export namespace GetAdjustmentOperations {
  export type Variables = GetAdjustmentOperationsQueryVariables;
  export type Query = GetAdjustmentOperationsQuery;
  export type PromotionConditions = ConfigurableOperationDefFragment;
  export type PromotionActions = ConfigurableOperationDefFragment;
}

export namespace CreatePromotion {
  export type Variables = CreatePromotionMutationVariables;
  export type Mutation = CreatePromotionMutation;
  export type CreatePromotion = PromotionFragment;
}

export namespace UpdatePromotion {
  export type Variables = UpdatePromotionMutationVariables;
  export type Mutation = UpdatePromotionMutation;
  export type UpdatePromotion = PromotionFragment;
}

export namespace DeletePromotion {
  export type Variables = DeletePromotionMutationVariables;
  export type Mutation = DeletePromotionMutation;
  export type DeletePromotion = DeletePromotionMutation['deletePromotion'];
}

export namespace Country {
  export type Fragment = CountryFragment;
  export type Translations = (NonNullable<CountryFragment['translations'][0]>);
}

export namespace GetCountryList {
  export type Variables = GetCountryListQueryVariables;
  export type Query = GetCountryListQuery;
  export type Countries = GetCountryListQuery['countries'];
  export type Items = (NonNullable<GetCountryListQuery['countries']['items'][0]>);
}

export namespace GetAvailableCountries {
  export type Variables = GetAvailableCountriesQueryVariables;
  export type Query = GetAvailableCountriesQuery;
  export type Countries = GetAvailableCountriesQuery['countries'];
  export type Items = (NonNullable<GetAvailableCountriesQuery['countries']['items'][0]>);
}

export namespace GetCountry {
  export type Variables = GetCountryQueryVariables;
  export type Query = GetCountryQuery;
  export type Country = CountryFragment;
}

export namespace CreateCountry {
  export type Variables = CreateCountryMutationVariables;
  export type Mutation = CreateCountryMutation;
  export type CreateCountry = CountryFragment;
}

export namespace UpdateCountry {
  export type Variables = UpdateCountryMutationVariables;
  export type Mutation = UpdateCountryMutation;
  export type UpdateCountry = CountryFragment;
}

export namespace DeleteCountry {
  export type Variables = DeleteCountryMutationVariables;
  export type Mutation = DeleteCountryMutation;
  export type DeleteCountry = DeleteCountryMutation['deleteCountry'];
}

export namespace Zone {
  export type Fragment = ZoneFragment;
  export type Members = CountryFragment;
}

export namespace GetZones {
  export type Variables = GetZonesQueryVariables;
  export type Query = GetZonesQuery;
  export type Zones = (NonNullable<GetZonesQuery['zones'][0]>);
  export type Members = (NonNullable<(NonNullable<GetZonesQuery['zones'][0]>)['members'][0]>);
}

export namespace GetZone {
  export type Variables = GetZoneQueryVariables;
  export type Query = GetZoneQuery;
  export type Zone = ZoneFragment;
}

export namespace CreateZone {
  export type Variables = CreateZoneMutationVariables;
  export type Mutation = CreateZoneMutation;
  export type CreateZone = ZoneFragment;
}

export namespace UpdateZone {
  export type Variables = UpdateZoneMutationVariables;
  export type Mutation = UpdateZoneMutation;
  export type UpdateZone = ZoneFragment;
}

export namespace AddMembersToZone {
  export type Variables = AddMembersToZoneMutationVariables;
  export type Mutation = AddMembersToZoneMutation;
  export type AddMembersToZone = ZoneFragment;
}

export namespace RemoveMembersFromZone {
  export type Variables = RemoveMembersFromZoneMutationVariables;
  export type Mutation = RemoveMembersFromZoneMutation;
  export type RemoveMembersFromZone = ZoneFragment;
}

export namespace TaxCategory {
  export type Fragment = TaxCategoryFragment;
}

export namespace GetTaxCategories {
  export type Variables = GetTaxCategoriesQueryVariables;
  export type Query = GetTaxCategoriesQuery;
  export type TaxCategories = TaxCategoryFragment;
}

export namespace GetTaxCategory {
  export type Variables = GetTaxCategoryQueryVariables;
  export type Query = GetTaxCategoryQuery;
  export type TaxCategory = TaxCategoryFragment;
}

export namespace CreateTaxCategory {
  export type Variables = CreateTaxCategoryMutationVariables;
  export type Mutation = CreateTaxCategoryMutation;
  export type CreateTaxCategory = TaxCategoryFragment;
}

export namespace UpdateTaxCategory {
  export type Variables = UpdateTaxCategoryMutationVariables;
  export type Mutation = UpdateTaxCategoryMutation;
  export type UpdateTaxCategory = TaxCategoryFragment;
}

export namespace DeleteTaxCategory {
  export type Variables = DeleteTaxCategoryMutationVariables;
  export type Mutation = DeleteTaxCategoryMutation;
  export type DeleteTaxCategory = DeleteTaxCategoryMutation['deleteTaxCategory'];
}

export namespace TaxRate {
  export type Fragment = TaxRateFragment;
  export type Category = TaxRateFragment['category'];
  export type Zone = TaxRateFragment['zone'];
  export type CustomerGroup = (NonNullable<TaxRateFragment['customerGroup']>);
}

export namespace GetTaxRateList {
  export type Variables = GetTaxRateListQueryVariables;
  export type Query = GetTaxRateListQuery;
  export type TaxRates = GetTaxRateListQuery['taxRates'];
  export type Items = TaxRateFragment;
}

export namespace GetTaxRate {
  export type Variables = GetTaxRateQueryVariables;
  export type Query = GetTaxRateQuery;
  export type TaxRate = TaxRateFragment;
}

export namespace CreateTaxRate {
  export type Variables = CreateTaxRateMutationVariables;
  export type Mutation = CreateTaxRateMutation;
  export type CreateTaxRate = TaxRateFragment;
}

export namespace UpdateTaxRate {
  export type Variables = UpdateTaxRateMutationVariables;
  export type Mutation = UpdateTaxRateMutation;
  export type UpdateTaxRate = TaxRateFragment;
}

export namespace DeleteTaxRate {
  export type Variables = DeleteTaxRateMutationVariables;
  export type Mutation = DeleteTaxRateMutation;
  export type DeleteTaxRate = DeleteTaxRateMutation['deleteTaxRate'];
}

export namespace Channel {
  export type Fragment = ChannelFragment;
  export type DefaultShippingZone = (NonNullable<ChannelFragment['defaultShippingZone']>);
  export type DefaultTaxZone = (NonNullable<ChannelFragment['defaultTaxZone']>);
}

export namespace GetChannels {
  export type Variables = GetChannelsQueryVariables;
  export type Query = GetChannelsQuery;
  export type Channels = ChannelFragment;
}

export namespace GetChannel {
  export type Variables = GetChannelQueryVariables;
  export type Query = GetChannelQuery;
  export type Channel = ChannelFragment;
}

export namespace GetActiveChannel {
  export type Variables = GetActiveChannelQueryVariables;
  export type Query = GetActiveChannelQuery;
  export type ActiveChannel = ChannelFragment;
}

export namespace CreateChannel {
  export type Variables = CreateChannelMutationVariables;
  export type Mutation = CreateChannelMutation;
  export type CreateChannel = ChannelFragment;
}

export namespace UpdateChannel {
  export type Variables = UpdateChannelMutationVariables;
  export type Mutation = UpdateChannelMutation;
  export type UpdateChannel = ChannelFragment;
}

export namespace DeleteChannel {
  export type Variables = DeleteChannelMutationVariables;
  export type Mutation = DeleteChannelMutation;
  export type DeleteChannel = DeleteChannelMutation['deleteChannel'];
}

export namespace PaymentMethod {
  export type Fragment = PaymentMethodFragment;
  export type ConfigArgs = (NonNullable<PaymentMethodFragment['configArgs'][0]>);
}

export namespace GetPaymentMethodList {
  export type Variables = GetPaymentMethodListQueryVariables;
  export type Query = GetPaymentMethodListQuery;
  export type PaymentMethods = GetPaymentMethodListQuery['paymentMethods'];
  export type Items = PaymentMethodFragment;
}

export namespace GetPaymentMethod {
  export type Variables = GetPaymentMethodQueryVariables;
  export type Query = GetPaymentMethodQuery;
  export type PaymentMethod = PaymentMethodFragment;
}

export namespace UpdatePaymentMethod {
  export type Variables = UpdatePaymentMethodMutationVariables;
  export type Mutation = UpdatePaymentMethodMutation;
  export type UpdatePaymentMethod = PaymentMethodFragment;
}

export namespace GlobalSettings {
  export type Fragment = GlobalSettingsFragment;
}

export namespace GetGlobalSettings {
  export type Variables = GetGlobalSettingsQueryVariables;
  export type Query = GetGlobalSettingsQuery;
  export type GlobalSettings = GlobalSettingsFragment;
}

export namespace UpdateGlobalSettings {
  export type Variables = UpdateGlobalSettingsMutationVariables;
  export type Mutation = UpdateGlobalSettingsMutation;
  export type UpdateGlobalSettings = GlobalSettingsFragment;
}

export namespace CustomFieldConfig {
  export type Fragment = CustomFieldConfigFragment;
  export type Description = (NonNullable<(NonNullable<CustomFieldConfigFragment['description']>)[0]>);
  export type Label = (NonNullable<(NonNullable<CustomFieldConfigFragment['label']>)[0]>);
}

export namespace StringCustomField {
  export type Fragment = CustomFieldConfigFragment;
  export type Options = (NonNullable<(NonNullable<StringCustomFieldFragment['options']>)[0]>);
  export type Label = (NonNullable<(NonNullable<(NonNullable<(NonNullable<StringCustomFieldFragment['options']>)[0]>)['label']>)[0]>);
}

export namespace LocaleStringCustomField {
  export type Fragment = CustomFieldConfigFragment;
}

export namespace BooleanCustomField {
  export type Fragment = CustomFieldConfigFragment;
}

export namespace IntCustomField {
  export type Fragment = CustomFieldConfigFragment;
}

export namespace FloatCustomField {
  export type Fragment = CustomFieldConfigFragment;
}

export namespace DateTimeCustomField {
  export type Fragment = CustomFieldConfigFragment;
}

export namespace CustomFields {
  export type Fragment = CustomFieldsFragment;
  export type StringCustomFieldConfigInlineFragment = StringCustomFieldFragment;
  export type LocaleStringCustomFieldConfigInlineFragment = LocaleStringCustomFieldFragment;
  export type BooleanCustomFieldConfigInlineFragment = BooleanCustomFieldFragment;
  export type IntCustomFieldConfigInlineFragment = IntCustomFieldFragment;
  export type FloatCustomFieldConfigInlineFragment = FloatCustomFieldFragment;
  export type DateTimeCustomFieldConfigInlineFragment = DateTimeCustomFieldFragment;
}

export namespace GetServerConfig {
  export type Variables = GetServerConfigQueryVariables;
  export type Query = GetServerConfigQuery;
  export type GlobalSettings = GetServerConfigQuery['globalSettings'];
  export type ServerConfig = GetServerConfigQuery['globalSettings']['serverConfig'];
  export type CustomFieldConfig = GetServerConfigQuery['globalSettings']['serverConfig']['customFieldConfig'];
  export type Address = CustomFieldsFragment;
  export type Collection = CustomFieldsFragment;
  export type Customer = CustomFieldsFragment;
  export type Facet = CustomFieldsFragment;
  export type FacetValue = CustomFieldsFragment;
  export type _GlobalSettings = CustomFieldsFragment;
  export type Order = CustomFieldsFragment;
  export type OrderLine = CustomFieldsFragment;
  export type Product = CustomFieldsFragment;
  export type ProductOption = CustomFieldsFragment;
  export type ProductOptionGroup = CustomFieldsFragment;
  export type ProductVariant = CustomFieldsFragment;
  export type User = CustomFieldsFragment;
}

export namespace JobInfo {
  export type Fragment = JobInfoFragment;
}

export namespace GetJobInfo {
  export type Variables = GetJobInfoQueryVariables;
  export type Query = GetJobInfoQuery;
  export type Job = JobInfoFragment;
}

export namespace GetAllJobs {
  export type Variables = GetAllJobsQueryVariables;
  export type Query = GetAllJobsQuery;
  export type Jobs = JobInfoFragment;
}

export namespace Reindex {
  export type Variables = ReindexMutationVariables;
  export type Mutation = ReindexMutation;
  export type Reindex = JobInfoFragment;
}

export namespace SearchForTestOrder {
  export type Variables = SearchForTestOrderQueryVariables;
  export type Query = SearchForTestOrderQuery;
  export type Search = SearchForTestOrderQuery['search'];
  export type Items = (NonNullable<SearchForTestOrderQuery['search']['items'][0]>);
  export type Price = (NonNullable<SearchForTestOrderQuery['search']['items'][0]>)['price'];
  export type SinglePriceInlineFragment = (DiscriminateUnion<RequireField<(NonNullable<SearchForTestOrderQuery['search']['items'][0]>)['price'], '__typename'>, { __typename: 'SinglePrice' }>);
  export type PriceWithTax = (NonNullable<SearchForTestOrderQuery['search']['items'][0]>)['priceWithTax'];
  export type _SinglePriceInlineFragment = (DiscriminateUnion<RequireField<(NonNullable<SearchForTestOrderQuery['search']['items'][0]>)['priceWithTax'], '__typename'>, { __typename: 'SinglePrice' }>);
}

export namespace ConfigurableOperation {
  export type Fragment = ConfigurableOperationFragment;
  export type Args = (NonNullable<ConfigurableOperationFragment['args'][0]>);
}

export namespace ConfigurableOperationDef {
  export type Fragment = ConfigurableOperationDefFragment;
  export type Args = (NonNullable<ConfigurableOperationDefFragment['args'][0]>);
}

export namespace ShippingMethod {
  export type Fragment = ShippingMethodFragment;
  export type Checker = ConfigurableOperationFragment;
  export type Calculator = ConfigurableOperationFragment;
}

export namespace GetShippingMethodList {
  export type Variables = GetShippingMethodListQueryVariables;
  export type Query = GetShippingMethodListQuery;
  export type ShippingMethods = GetShippingMethodListQuery['shippingMethods'];
  export type Items = ShippingMethodFragment;
}

export namespace GetShippingMethod {
  export type Variables = GetShippingMethodQueryVariables;
  export type Query = GetShippingMethodQuery;
  export type ShippingMethod = ShippingMethodFragment;
}

export namespace GetShippingMethodOperations {
  export type Variables = GetShippingMethodOperationsQueryVariables;
  export type Query = GetShippingMethodOperationsQuery;
  export type ShippingEligibilityCheckers = ConfigurableOperationDefFragment;
  export type ShippingCalculators = ConfigurableOperationDefFragment;
}

export namespace CreateShippingMethod {
  export type Variables = CreateShippingMethodMutationVariables;
  export type Mutation = CreateShippingMethodMutation;
  export type CreateShippingMethod = ShippingMethodFragment;
}

export namespace UpdateShippingMethod {
  export type Variables = UpdateShippingMethodMutationVariables;
  export type Mutation = UpdateShippingMethodMutation;
  export type UpdateShippingMethod = ShippingMethodFragment;
}

export namespace DeleteShippingMethod {
  export type Variables = DeleteShippingMethodMutationVariables;
  export type Mutation = DeleteShippingMethodMutation;
  export type DeleteShippingMethod = DeleteShippingMethodMutation['deleteShippingMethod'];
}

export namespace TestShippingMethod {
  export type Variables = TestShippingMethodQueryVariables;
  export type Query = TestShippingMethodQuery;
  export type TestShippingMethod = TestShippingMethodQuery['testShippingMethod'];
  export type Quote = (NonNullable<TestShippingMethodQuery['testShippingMethod']['quote']>);
}

export namespace TestEligibleShippingMethods {
  export type Variables = TestEligibleShippingMethodsQueryVariables;
  export type Query = TestEligibleShippingMethodsQuery;
  export type TestEligibleShippingMethods = (NonNullable<TestEligibleShippingMethodsQuery['testEligibleShippingMethods'][0]>);
}
